const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

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

async function validateUrl(url) {
    try {
        const response = await fetchWithRetry(url, { method: 'HEAD', timeout: 5000 }, 1);
        return response.status >= 200 && response.status < 400;
    } catch (e) {
        return false;
    }
}

// Site-Specific Scraper: ReliefWeb
async function scrapeReliefWeb() {
    const jobs = [];
    try {
        const response = await fetchWithRetry('https://api.reliefweb.int/v1/jobs', {
            params: {
                appname: 'zimwork',
                'query[value]': 'country.name:Zimbabwe',
                limit: 2,
                preset: 'latest',
                'fields[include][]': ['title', 'body-html', 'body', 'url', 'source', 'date', 'theme', 'experience']
            },
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ZimWork Scraper' }
        });

        if (response.data && response.data.data) {
            for (const item of response.data.data) {
                const fields = item.fields;

                const original_html = fields['body-html'] || "";
                const $ = cheerio.load(original_html);
                const original_text = $.text().trim();

                const jobData = {
                    title: fields.title || null,
                    company: fields.source && fields.source[0] ? fields.source[0].name : null,
                    location: "Zimbabwe",
                    salary: null,
                    employment_type: fields.experience && fields.experience[0] ? fields.experience[0].name : null,
                    closing_date: fields.date && fields.date.closing ? fields.date.closing : null,
                    job_category: fields.theme && fields.theme[0] ? fields.theme[0].name : null,
                    source_site: "ReliefWeb",
                    source_url: fields.url || null,
                    date_scraped: new Date().toISOString(),
                    original_html: original_html,
                    original_text: original_text
                };

                jobs.push(jobData);
                await sleep(1000); // polite delay
            }
        }
    } catch (error) {
        console.error("ReliefWeb scraper failed:", error.message);
    }
    return jobs;
}

async function runPipeline() {
    const allJobs = [];
    const seenUrls = new Set();

    // Configured Scrapers
    const scrapers = [scrapeReliefWeb];

    for (const scraper of scrapers) {
        const jobs = await scraper();

        for (const job of jobs) {
            // STEP 5: Duplicate Protection
            if (!job.source_url || seenUrls.has(job.source_url)) {
                continue;
            }

            // STEP 6: Data Integrity
            if (!job.title) continue;
            if (!job.original_text || job.original_text.length <= 200) continue;

            const isValid = await validateUrl(job.source_url);
            if (!isValid) continue;

            seenUrls.add(job.source_url);
            allJobs.push(job);
        }
    }

    // FINAL OUTPUT REQUIREMENT
    console.log(JSON.stringify(allJobs, null, 2));
}

runPipeline();
