const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, retries = 2) {
    try {
        return await axios(url, options);
    } catch (error) {
        if (retries > 0) {
            await sleep(2000);
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
}

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ZimWorkDataPipeline/3.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
};

// 1. CLEAN ARTIFACTS & REMOVE PLATFORM BRANDING
function cleanJobHtml(rawHtml) {
    const $ = cheerio.load(rawHtml);

    // Destroy all web layout garbage
    $('script, style, iframe, nav, header, footer, form, img, button').remove();
    $('.share, .social, .advert, .ads, .apply-btn, .save-job, .job-meta, .related-jobs, .sidebar').remove();

    // Destroy platform branding text (iHarare/VacancyMail artifacts)
    $('p, div, span, li').each((i, el) => {
        const text = $(el).text().toLowerCase();
        if (
            text.includes('ihararejobs') ||
            text.includes('vacancymail') ||
            text.includes('click here to apply') ||
            text.includes('share this job') ||
            text.includes('beware of scammers') ||
            text.includes('do not pay anyone')
        ) {
            $(el).remove();
        }
    });

    return $('body').html() || '';
}

// 2. UNIFORMLY BOLD + CAPITALIZE SECTION HEADINGS
function normalizeHeadings(rawHtml) {
    const $ = cheerio.load(rawHtml);

    $('h1, h2, h3, h4, h5, h6, strong, b').each((i, el) => {
        const text = $(el).text().trim();
        // If it's a short phrase, it's a heading (e.g., "DUTIES AND RESPONSIBILITIES")
        if (text.length > 0 && text.length < 60) {
            const uppercased = text.toUpperCase();
            $(el).replaceWith(`<p class="mt-4 mb-2"><strong class="text-secondary text-lg uppercase tracking-wider border-b border-gray-200 pb-1 block">${uppercased}</strong></p>`);
        }
    });

    // Remove empty paragraphs left behind
    $('p').each((i, el) => {
        if ($(el).text().trim() === '') $(el).remove();
    });

    return $('body').html() || '';
}

// 3. EXTRACT EMPLOYER URLS (NOT JOB BOARD URLS)
function extractRealApplicationLink($, container) {
    let realLink = null;

    // Look for mailto links first (HR emails)
    container.find('a[href^="mailto:"]').each((i, el) => {
        realLink = $(el).attr('href');
    });

    // If no email, look for external links that ARE NOT the job board
    if (!realLink) {
        container.find('a[href^="http"]').each((i, el) => {
            const href = $(el).attr('href');
            if (href && !href.includes('ihararejobs.com') && !href.includes('vacancymail.co.zw') && !href.includes('facebook') && !href.includes('twitter')) {
                realLink = href;
            }
        });
    }

    return realLink;
}

/* --- JOB BOARD SCRAPER LOGIC --- */
async function scrapeJobBoard(baseUrl, jobUrlPattern) {
    const jobs = [];
    try {
        console.log(`Scanning ${baseUrl}...`);
        const response = await fetchWithRetry(baseUrl, { headers });
        const $ = cheerio.load(response.data);

        const jobLinks = new Set();
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.includes(jobUrlPattern) && href.length > 15) {
                jobLinks.add(href.startsWith('http') ? href : baseUrl + href);
            }
        });

        const urls = Array.from(jobLinks).slice(0, 15); // Process top 15 jobs per board

        for (const url of urls) {
            try {
                const jobRes = await fetchWithRetry(url, { headers });
                const $job = cheerio.load(jobRes.data);

                // 4. STOP INJECTING FAKE FIELDS (Strict extraction)
                let title = $job('h1').first().text().trim() || $job('.job-title, .title').first().text().trim();
                let company = $job('.company-name, .employer').first().text().trim();
                let location = $job('.location, .job-location').first().text().trim();

                // Clean company name of any board branding
                if (company.toLowerCase().includes('vacancymail') || company.toLowerCase().includes('iharare')) {
                    company = "Confidential Employer";
                }

                if (!title || title.length < 5) continue;

                let container = $job('.job-description, .vacancy-desc, article, .content, .main-content').first();
                if (container.length === 0) continue; // Skip if we can't find the real description

                // Extract Real Apply Link BEFORE we clean the HTML (since cleaning removes buttons)
                const realApplyLink = extractRealApplicationLink($job, container);

                // Process Description (Clean & Normalize)
                const rawHtml = container.html() || "";
                const cleanedHtml = cleanJobHtml(rawHtml);
                const finalDescriptionHtml = normalizeHeadings(cleanedHtml).trim();

                // 5. PRESERVE AUTHENTICITY 
                if (finalDescriptionHtml.length > 200) {
                    jobs.push({
                        id: Math.random().toString(36).substr(2, 9),
                        title: title,
                        company: company || "Employer",
                        location: location || "Zimbabwe",
                        applyLink: realApplyLink, // Employer URL/Email
                        source_url: url,
                        posted: "Recently",
                        category: "General", // To be mapped later
                        fullDescription: finalDescriptionHtml
                    });
                }
                await sleep(500);
            } catch (e) { console.log(`Failed to parse job at ${url}`); }
        }
    } catch (err) { console.log(`Failed to reach ${baseUrl}`); }
    return jobs;
}

async function runRealScrapers() {
    console.log("Starting Authenticity-First Data Pipeline...");

    // Run scrapers
    const ihJobs = await scrapeJobBoard('https://ihararejobs.com', '/job/');
    const vmJobs = await scrapeJobBoard('https://vacancymail.co.zw', '/jobs/');

    const allJobs = [...ihJobs, ...vmJobs];

    console.log(`Successfully extracted ${allJobs.length} authentic job postings.`);

    if (allJobs.length > 0) {
        // Output strictly to JSON for the frontend to consume
        fs.writeFileSync('jobs.json', JSON.stringify(allJobs, null, 2));
        console.log("Clean data saved to jobs.json. Ready for deployment.");
    }
}

runRealScrapers();