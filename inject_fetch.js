const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the static mockDatabase completely
html = html.replace(/const mockDatabase = \[[\s\S]*?\];/g, "let mockDatabase = [];\n        let allCategories = [];");

// 2. Remove the old allCategories declaration since we made it global now
html = html.replace(/const allCategories = \[[\s\S]*?\];/g, "");

// 3. Update initApp to fetch the json file
const newInitApp = `        async function initApp() {
            try {
                // Ensure no caching so we always get the latest job scrape
                const response = await fetch('jobs.json?t=' + new Date().getTime());
                if (!response.ok) throw new Error('JSON not found');
                const rawJobs = await response.json();
                
                // Map the JSON structure to the frontend expectations
                mockDatabase = rawJobs.map((job, index) => ({
                    id: index + 1,
                    title: job.title,
                    company: job.company || 'Confidential',
                    category: job.job_category || 'Other',
                    location: job.location || 'Zimbabwe',
                    type: job.employment_type || 'Full Time',
                    model: 'Hybrid', // Default mapping
                    salary: job.salary || 'TBA',
                    posted: new Date(job.date_scraped).toLocaleDateString(),
                    logo: 'fa-briefcase',
                    impressions: Math.floor(Math.random() * 5000) + 500,
                    views: Math.floor(Math.random() * 500) + 50,
                    snippet: job.original_text.substring(0, 150) + '...',
                    fullDescription: job.original_html,
                    applyLink: job.source_url
                }));
                
            } catch (error) {
                console.error("Failed to fetch jobs.json:", error);
                document.getElementById('jobCount').innerText = "Database offline";
            }
            
            allCategories = [...new Set(mockDatabase.map(j => j.category))];

            renderCategories();
            renderJobs(mockDatabase);
        }

        window.onload = initApp;`;

// Replace everything from function initApp() to window.onload = initApp;
html = html.replace(/function initApp\(\) \{[\s\S]*?window\.onload = initApp;/g, newInitApp);

fs.writeFileSync('index.html', html);
console.log("Static database replaced with dynamic JSON fetch block.");
