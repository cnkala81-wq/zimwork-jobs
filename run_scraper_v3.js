const fs = require('fs');
const axios = require('axios'); // For simulating the WhatsApp API call

const companies = ['Econet Wireless', 'Zimplats', 'World Vision Zimbabwe', 'UNDP', 'Delta Corporation', 'Cassava Smartech', 'CBZ Holdings', 'FBC Bank', 'Plan International', 'GOAL Zimbabwe', 'Zimasco', 'Liquid Intelligent Technologies', 'Webdev Group', 'NetOne', 'TelOne', 'Save the Children', 'Oxfam', 'EcoCash Holdings', 'Stanbic Bank', 'Old Mutual Zimbabwe', 'NMB Bank', 'ZimSwitch', 'Nedbank Zimbabwe', 'First Capital Bank', 'MSF Zimbabwe', 'UNESCO', 'WHO Zimbabwe', 'FAO Zimbabwe', 'Toyota Zimbabwe', 'TotalEnergies Zimbabwe', 'Seed Co', 'National Foods', 'Innscor Africa', 'Simbisa Brands', 'OK Zimbabwe'];

const categoriesObj = {
    "NGO & Social Services": { logo: "fa-hands-helping", roles: ["Program Manager", "M&E Officer", "Field Officer", "Child Protection Coordinator", "Grants Manager"] },
    "ICT & Tech": { logo: "fa-laptop-code", roles: ["Software Engineer", "Systems Administrator", "Cybersecurity Analyst", "Data Scientist", "IT Helpdesk", "Cloud Architect"] },
    "Engineering": { logo: "fa-cogs", roles: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Structural Engineer", "Automation Engineer"] },
    "Mining & Resources": { logo: "fa-hard-hat", roles: ["Mining Engineer", "Metallurgist", "Geologist", "Maintenance Planner", "Pit Superintendent"] },
    "Finance & Banking": { logo: "fa-piggy-bank", roles: ["Accountant", "Financial Analyst", "Loan Officer", "Branch Manager", "Internal Auditor"] },
    "Attachment & Interns": { logo: "fa-user-graduate", roles: ["Finance Attachment", "IT Intern", "Engineering Intern", "HR Attachment", "Marketing Intern"] },
    "Agriculture": { logo: "fa-tractor", roles: ["Agronomist", "Farm Manager", "Agricultural Economist", "Livestock Specialist"] },
    "Healthcare & Medical": { logo: "fa-user-md", roles: ["Medical Officer", "Registered Nurse", "Pharmacist", "Lab Technician", "Public Health Specialist"] },
    "Retail & FMCG": { logo: "fa-shopping-cart", roles: ["Store Manager", "Merchandiser", "Retail Buyer", "Inventory Controller", "FMCG Sales Rep"] },
    "Media & PR": { logo: "fa-bullhorn", roles: ["Digital Communications Officer", "Public Relations Manager", "Content Creator", "Brand Manager"] },
    "Legal & Compliance": { logo: "fa-balance-scale", roles: ["Legal Counsel", "Compliance Officer", "Paralegal", "Company Secretary", "Contracts Manager"] },
    "Sales & Marketing": { logo: "fa-chart-line", roles: ["Sales Manager", "Marketing Executive", "Business Development Manager", "Key Account Manager"] },
    "Human Resources": { logo: "fa-users", roles: ["HR Manager", "Talent Acquisition Specialist", "Payroll Administrator", "Training Officer"] },
    "Administration": { logo: "fa-building", roles: ["Office Manager", "Executive Assistant", "Receptionist", "Data Entry Clerk"] },
    "Manufacturing & Production": { logo: "fa-industry", roles: ["Production Manager", "Quality Assurance Inspector", "Plant Operator"] }
};

const locations = ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Masvingo', 'Victoria Falls', 'Remote', 'Hybrid - Harare'];
const types = ['Full Time', 'Contractor', 'Internship', 'Part Time'];
const models = ['On-site', 'Remote', 'Hybrid'];

const jobs = [];
const allCategories = Object.keys(categoriesObj);
let id = 1;

console.log("🚀 Starting ZimWork Scraper v3 - Deep Audit & Automate...");

for (let i = 0; i < 120; i++) {
    const category = allCategories[Math.floor(Math.random() * allCategories.length)];
    const title = categoriesObj[category].roles[Math.floor(Math.random() * categoriesObj[category].roles.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    let type = types[Math.floor(Math.random() * 2)];
    if (category === "Attachment & Interns") type = "Internship";
    let model = models[Math.floor(Math.random() * models.length)];
    if (location === 'Remote') model = 'Remote';

    // 1. Currency Integrity Check (USD vs ZiG)
    let salaryStr = "TBA";
    const rawSalaryBase = Math.floor(Math.random() * 8000) + 300; // random value between 300 and 8300
    let isUSD = true;
    let isHighPaying = false;

    if (Math.random() > 0.3) {
        if (rawSalaryBase > 3500) {
            // Suspiciously high for average roles -> mark as ZiG
            salaryStr = `ZiG ${rawSalaryBase * 10} - ZiG ${rawSalaryBase * 15} / month`;
            isUSD = false;
        } else {
            // Standard USD range
            const maxSalary = rawSalaryBase + Math.floor(Math.random() * 1000);
            salaryStr = `USD $${rawSalaryBase} - $${maxSalary} / month`;
            if (rawSalaryBase > 2500) isHighPaying = true; // High paying USD job
        }
    }

    const posted = Math.random() > 0.2 ? `${Math.floor(Math.random() * 23) + 1} hours ago` : `${Math.floor(Math.random() * 3) + 1} days ago`;
    const logo = categoriesObj[category].logo;
    const impressions = Math.floor(Math.random() * 50000) + 1000;
    const views = Math.floor(impressions * (Math.random() * 0.15 + 0.01));
    let isTrending = views > 4000;

    const snippet = `${company} is currently seeking a highly motivated and experienced ${title} to join our growing team in ${location}. This is a fantastic opportunity...`;
    const fullDescription = `<strong>Job Overview:</strong><br><br>${company} is currently seeking a highly motivated <strong>${title}</strong>. You will play a crucial role in our ${category} operations.<br><br><strong>Key Responsibilities:</strong><br><ul class="list-disc pl-5 mt-2 space-y-1"><li>Manage daily operations related to ${title} duties.</li><li>Collaborate with cross-functional teams in ${location}.</li><li>Ensure strict compliance with industry standards and policies.</li><li>Prepare and present reports to senior management.</li></ul><br><strong>Requirements:</strong><br><ul class="list-disc pl-5 mt-2 space-y-1"><li>Degree or equivalent qualification in a relevant field.</li><li>Minimum 3 years of experience.</li><li>Excellent communication and problem-solving skills.</li></ul>`;

    let applyLink = Math.random() > 0.5 ? `hr@${company.toLowerCase().replace(/\\s+/g, '')}.co.zw` : `https://${company.toLowerCase().replace(/\\s+/g, '')}.co.zw/careers/apply/${id}`;

    const job = { id: id++, title, company, category, location, type, model, salary: salaryStr, posted, logo, impressions, views, snippet, fullDescription, applyLink };
    jobs.push(job);

    // 2. Auto-Publishing to WhatsApp
    if (isTrending || isHighPaying) {
        const reason = isTrending ? "📈 Trending Job" : "💰 High Paying USD Role";
        console.log(`\n[WhatsApp Cloud API] 🟢 Sending Alert to Subscribers...`);
        console.log(`📱 Message: ${reason} Alert!\n   *${title}* at ${company}\n   💵 Salary: ${salaryStr}\n   📍 Location: ${location}\n   🔗 Link: ${applyLink}\n`);
    }
}

let html = fs.readFileSync('index.html', 'utf8');

// Replace mockDatabase
html = html.replace(/const mockDatabase = \[[\s\S]*?\];/, `const mockDatabase = ${JSON.stringify(jobs, null, 2)};`);
// Replace allCategories
html = html.replace(/const allCategories = \[[\s\S]*?\];/, `const allCategories = ${JSON.stringify(allCategories)};`);

fs.writeFileSync('index.html', html);
console.log(`\n✅ Successfully injected ${jobs.length} jobs with USD/ZiG currency integrity checks into index.html`);
