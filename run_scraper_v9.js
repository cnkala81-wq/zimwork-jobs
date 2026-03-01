const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, retries = 1) {
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
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ZimWorkDataPipeline/2.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
};

function cleanJobHtml(rawHtml) {
    const $ = cheerio.load(rawHtml);

    $('script, style, iframe, nav, header, footer, form').remove();
    $('.share, .social, .advert, .ads, .apply-btn, .save-job, .job-meta').remove();

    $('a').each((i, el) => {
        const href = $(el).attr('href') || '';
        if (href.includes('ihararejobs.com') || href.includes('vacancymail.co.zw')) {
            $(el).contents().unwrap();
        }
    });

    return $('body').html() || '';
}

function normalizeHeadings(rawHtml) {
    const $ = cheerio.load(rawHtml);

    $('h1, h2, h3, h4, h5, h6, strong').each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 0 && text.length < 60) {
            const uppercased = text.toUpperCase();
            if (el.tagName === 'strong') {
                // Check if it's the only thing in a paragraph, if so, format whole p
                const parent = $(el).parent();
                if (parent[0] && parent[0].tagName === 'p' && parent.children().length === 1 && parent.text().trim() === text) {
                    parent.html(`<strong>${uppercased}</strong>`);
                    return;
                }
            }
            $(el).replaceWith(`<p><strong>${uppercased}</strong></p>`);
        }
    });

    return $('body').html() || '';
}


/* --- IHARARE JOBS SCRAPER --- */
async function scrapeIharareJobs() {
    const jobs = [];
    const baseUrl = 'https://ihararejobs.com';

    try {
        console.log("Fetching iHarareJobs index...");
        const response = await fetchWithRetry(baseUrl, { headers });
        const $ = cheerio.load(response.data);

        const jobLinks = new Set();
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.startsWith('/job/') && href.length > 10) {
                jobLinks.add(baseUrl + href);
            }
        });

        const urls = Array.from(jobLinks).slice(0, 10);
        console.log(`Found ${urls.length} target URLs on iHarare Jobs.`);

        for (const url of urls) {
            try {
                const jobRes = await fetchWithRetry(url, { headers });
                const $job = cheerio.load(jobRes.data);

                const title = $job('h1').first().text().trim() || $job('.job-title').text().trim();
                let company = $job('.company-name').text().trim() || "iHarare Jobs Employer";
                let location = $job('.location, .job-location').text().trim() || "Zimbabwe";

                if (!title) continue;

                let container = $job('.job-description, .job-details, article, .content').first();
                if (container.length === 0) container = $job('.col-md-8, .main-content'); // fallback
                if (container.length === 0) container = $job('body');

                const rawHtml = container.html() || "";
                const cleaned = cleanJobHtml(rawHtml);
                const original_html = normalizeHeadings(cleaned).trim();
                const original_text = container.text().trim().replace(/\s+/g, ' ');

                jobs.push({
                    title: title,
                    company: company,
                    location: location,
                    salary: null,
                    employment_type: null,
                    closing_date: null,
                    job_category: null,
                    source_url: url,
                    date_scraped: new Date().toISOString(),
                    original_html: original_html,
                    original_text: original_text
                });
                await sleep(500);
            } catch (e) { }
        }
    } catch (err) { }
    return jobs;
}

/* --- VACANCYMAIL SCRAPER --- */
async function scrapeVacancyMail() {
    const jobs = [];
    const baseUrl = 'https://vacancymail.co.zw';

    try {
        console.log("Fetching VacancyMail index...");
        const response = await fetchWithRetry(baseUrl, { headers });
        const $ = cheerio.load(response.data);

        const jobLinks = new Set();
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.startsWith('/jobs/') && href.length > 15) {
                jobLinks.add(baseUrl + href);
            }
        });

        const urls = Array.from(jobLinks).slice(0, 10);
        console.log(`Found ${urls.length} target URLs on VacancyMail.`);

        for (const url of urls) {
            try {
                const jobRes = await fetchWithRetry(url, { headers });
                const $job = cheerio.load(jobRes.data);

                const title = $job('h1').first().text().trim() || $job('.job-title').text().trim();
                let company = $job('.company-name').text().trim() || "VacancyMail Employer";
                let location = $job('.location, .job-location').text().trim() || "Zimbabwe";

                if (!title) continue;

                let container = $job('.job-description, .vacancy-desc, article, .content').first();
                if (container.length === 0) container = $job('.col-md-8, .main-content');
                if (container.length === 0) container = $job('body');

                const rawHtml = container.html() || "";
                const cleaned = cleanJobHtml(rawHtml);
                const original_html = normalizeHeadings(cleaned).trim();
                const original_text = container.text().trim().replace(/\s+/g, ' ');

                jobs.push({
                    title: title,
                    company: company,
                    location: location,
                    salary: null,
                    employment_type: null,
                    closing_date: null,
                    job_category: null,
                    source_url: url,
                    date_scraped: new Date().toISOString(),
                    original_html: original_html,
                    original_text: original_text
                });
                await sleep(500);
            } catch (e) { }
        }
    } catch (err) { }
    return jobs;
}


async function runRealScrapers() {
    console.log("Starting Live Scrape Pipeline...");
    const ihJobs = await scrapeIharareJobs();
    const vmJobs = await scrapeVacancyMail();

    const allJobs = [...ihJobs, ...vmJobs];

    console.log(`Scraped ${allJobs.length} live jobs. Validating...`);
    const validJobs = allJobs.filter(j => j.title && j.original_text.length > 150 && j.source_url);

    if (validJobs.length > 0) {
        fs.writeFileSync('jobs.json', JSON.stringify(validJobs, null, 2));
        console.log(`Successfully wrote ${validJobs.length} live jobs directly to jobs.json for the headless CMS!`);
    } else {
        console.log("No valid jobs extracted.");
    }
}

runRealScrapers();
