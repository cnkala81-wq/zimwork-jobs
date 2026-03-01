const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Capture and log console errors from the page
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('BROWSER ERROR:', msg.text());
        } else {
            console.log('BROWSER LOG:', msg.text());
        }
    });

    try {
        await page.goto('https://zimwork-jobs-2026.surge.sh', { waitUntil: 'networkidle0' });

        const count = await page.evaluate(() => {
            return document.querySelectorAll('#jobList > div').length;
        });

        console.log("Rendered Job Cards:", count);

        const jobText = await page.evaluate(() => {
            const el = document.getElementById('jobCount');
            return el ? el.innerText : "NOT FOUND";
        });
        console.log("Job Count Text:", jobText);

    } catch (e) {
        console.log("PUPPETEER ERROR:", e.message);
    }

    await browser.close();
})();
