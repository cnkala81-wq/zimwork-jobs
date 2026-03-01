const fs = require('fs');
let html = fs.readFileSync('run_scraper_v6.js', 'utf8');

// Replace the end bit so we just save a json rather than hacking the html template
html = html.replace(`    const html = fs.readFileSync('index.html', 'utf8');

    // Wipe current database entirely
    const updatedHtml = html.replace(/const mockDatabase = \\[\\[\\s\\S]*?\\];/, \`const mockDatabase = \${JSON.stringify(allJobs, null, 2)};\`);

    fs.writeFileSync('index.html', updatedHtml);
    console.log(\`\\n🎉 Total Verified Real Jobs Injected: \${allJobs.length}\`);
}`, `    fs.writeFileSync('jobs.json', JSON.stringify(allJobs, null, 2));
    console.log(\`\\n🎉 Wrote \${allJobs.length} verified jobs directly to jobs.json for the headless CMS!\`);
}`);

// Also we remove the reliefweb fetch since they 403 us without proper API keys on actions
html = html.replace(`    // 1. Fetch Real UN/NGO Jobs (Usually ~20-30 real exact descriptions)
    const ngoJobs = await fetchRealNgoJobs();
    allJobs = allJobs.concat(ngoJobs);
    console.log(\`✅ Loaded \${ngoJobs.length} real NGO jobs from ReliefWeb API.\`);`, `    console.log("Skipping ReliefWeb due to 403 API blocking on CI/CD.");`);

fs.writeFileSync('run_scraper_v8.js', html);
console.log("Scraper v8 Generated (Output to jobs.json only)");
