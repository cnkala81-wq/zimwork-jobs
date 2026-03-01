const fs = require('fs');

const companies = ['Econet Wireless', 'Zimplats', 'World Vision Zimbabwe', 'UNDP', 'Delta Corporation', 'Cassava Smartech', 'CBZ Holdings', 'FBC Bank', 'Plan International', 'GOAL Zimbabwe', 'Zimasco', 'Liquid Intelligent Technologies', 'Webdev Group', 'NetOne', 'TelOne', 'Save the Children', 'Oxfam', 'EcoCash Holdings', 'Stanbic Bank', 'Old Mutual Zimbabwe', 'NMB Bank', 'ZimSwitch', 'BancABC', 'Nedbank Zimbabwe', 'First Capital Bank', 'MSF Zimbabwe', 'UNESCO', 'WHO Zimbabwe', 'FAO Zimbabwe', 'Zimnat', 'Nyaradzo Group', 'Doves', 'Croco Motors', 'Toyota Zimbabwe', 'Zuva Petroleum', 'Puma Energy', 'TotalEnergies Zimbabwe', 'Seed Co', 'National Foods', 'Innscor Africa', 'Simbisa Brands', 'OK Zimbabwe', 'TM Pick n Pay', 'Meikles', 'Zimoco', 'CFAO Motors', 'Cairns Foods', 'Schweppes Zimbabwe', 'Dairibord', 'ZimTrade', 'ZESA Holdings', 'National Railways of Zimbabwe', 'CIMAS', 'PSMAS', 'Fastjet', 'Air Zimbabwe'];

const categoriesObj = {
    "NGO & Social Services": { logo: "fa-hands-helping", roles: ["Program Manager", "M&E Officer", "Field Officer", "Child Protection Coordinator", "Grants Manager", "Social Worker", "WASH Engineer"] },
    "ICT & Tech": { logo: "fa-laptop-code", roles: ["Software Engineer", "Systems Administrator", "Cybersecurity Analyst", "Data Scientist", "IT Helpdesk", "Cloud Architect", "Frontend Developer", "DevOps Engineer"] },
    "Engineering": { logo: "fa-cogs", roles: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Structural Engineer", "Automation Engineer", "Chemical Engineer"] },
    "Mining & Resources": { logo: "fa-hard-hat", roles: ["Mining Engineer", "Metallurgist", "Geologist", "Maintenance Planner", "Pit Superintendent", "Drill & Blast Engineer"] },
    "Media & PR": { logo: "fa-bullhorn", roles: ["Digital Communications Officer", "Public Relations Manager", "Content Creator", "Journalist", "Brand Manager", "Video Editor", "Copywriter"] },
    "Attachment & Interns": { logo: "fa-user-graduate", roles: ["Finance Attachment", "IT Intern", "Engineering Intern", "HR Attachment", "Marketing Intern", "Agriculture Intern"] },
    "Agriculture": { logo: "fa-tractor", roles: ["Agronomist", "Farm Manager", "Agricultural Economist", "Livestock Specialist", "Crop Scientist"] },
    "Finance & Banking": { logo: "fa-piggy-bank", roles: ["Accountant", "Financial Analyst", "Loan Officer", "Branch Manager", "Internal Auditor", "Credit Risk Analyst"] },
    "Retail & FMCG": { logo: "fa-shopping-cart", roles: ["Store Manager", "Merchandiser", "Retail Buyer", "Inventory Controller", "FMCG Sales Rep"] },
    "Healthcare & Medical": { logo: "fa-user-md", roles: ["Medical Officer", "Registered Nurse", "Pharmacist", "Lab Technician", "Physiotherapist", "Public Health Specialist"] },
    "Education & Teaching": { logo: "fa-chalkboard-teacher", roles: ["Lecturer", "High School Teacher", "Special Needs Educator", "School Administrator", "Curriculum Developer"] },
    "Hospitality & Tourism": { logo: "fa-hotel", roles: ["Hotel Manager", "Executive Chef", "Tour Guide", "Front Desk Receptionist", "Events Coordinator"] },
    "Logistics & Transport": { logo: "fa-truck", roles: ["Logistics Manager", "Fleet Supervisor", "Supply Chain Analyst", "Dispatcher", "Customs Clearing Clerk"] },
    "Legal & Compliance": { logo: "fa-balance-scale", roles: ["Legal Counsel", "Compliance Officer", "Paralegal", "Company Secretary", "Contracts Manager"] },
    "Sales & Marketing": { logo: "fa-chart-line", roles: ["Sales Manager", "Marketing Executive", "Business Development Manager", "Key Account Manager", "Digital Marketer"] },
    "Human Resources": { logo: "fa-users", roles: ["HR Manager", "Talent Acquisition Specialist", "Payroll Administrator", "Training Officer", "Employee Relations Specialist"] },
    "Administration": { logo: "fa-building", roles: ["Office Manager", "Executive Assistant", "Receptionist", "Data Entry Clerk", "Admin Officer"] },
    "Manufacturing & Production": { logo: "fa-industry", roles: ["Production Manager", "Quality Assurance Inspector", "Plant Operator", "Machine Setter", "Factory Supervisor"] }
};

const locations = ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Masvingo', 'Victoria Falls', 'Remote', 'Hybrid - Harare', 'Kwekwe', 'Kadoma', 'Chinhoyi'];
const types = ['Full Time', 'Contractor', 'Internship', 'Part Time'];
const models = ['On-site', 'Remote', 'Hybrid'];

const jobs = [];
const allCategories = Object.keys(categoriesObj);
let id = 1;

for (let i = 0; i < 150; i++) {
    const category = allCategories[Math.floor(Math.random() * allCategories.length)];
    const title = categoriesObj[category].roles[Math.floor(Math.random() * categoriesObj[category].roles.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    let type = types[Math.floor(Math.random() * 2)]; // Bias to Full Time / Contractor
    if (category === "Attachment & Interns") type = "Internship";
    let model = models[Math.floor(Math.random() * models.length)];
    if (location === 'Remote') model = 'Remote';

    const salaryRange = `$${Math.floor(Math.random() * 20 + 5)}00 - $${Math.floor(Math.random() * 20 + 25)}00 / ${Math.random() > 0.5 ? 'month' : 'year'}`;
    const salary = Math.random() > 0.4 ? 'TBA' : salaryRange;

    const posted = Math.random() > 0.2 ? `${Math.floor(Math.random() * 23) + 1} hours ago` : `${Math.floor(Math.random() * 3) + 1} days ago`;
    const logo = categoriesObj[category].logo;

    const impressions = Math.floor(Math.random() * 50000) + 1000;
    const views = Math.floor(impressions * (Math.random() * 0.15 + 0.01));

    const snippet = `${company} is currently seeking a highly motivated and experienced ${title} to join our growing team in ${location}. This is a fantastic opportunity...`;
    const fullDescription = `<strong>Job Overview:</strong><br><br>${company} is currently seeking a highly motivated <strong>${title}</strong>. You will play a crucial role in our ${category} operations.<br><br><strong>Key Responsibilities:</strong><br><ul class="list-disc pl-5 mt-2 space-y-1"><li>Manage daily operations related to ${title} duties.</li><li>Collaborate with cross-functional teams in ${location}.</li><li>Ensure strict compliance with industry standards and policies.</li><li>Prepare and present reports to senior management.</li></ul><br><strong>Requirements:</strong><br><ul class="list-disc pl-5 mt-2 space-y-1"><li>Degree or equivalent qualification in a relevant field.</li><li>Minimum 3 years of experience (or currently studying for Attachments).</li><li>Excellent communication and problem-solving skills.</li><li>Ability to thrive in a fast-paced environment.</li></ul>`;

    // Application Link Generation
    let applyLink = '';
    if (Math.random() > 0.5) {
        applyLink = `hr@${company.toLowerCase().replace(/\\s+/g, '')}.co.zw`;
    } else {
        applyLink = `https://${company.toLowerCase().replace(/\\s+/g, '')}.co.zw/careers/apply/${Math.floor(Math.random() * 10000)}`;
    }

    jobs.push({ id: id++, title, company, category, location, type, model, salary, posted, logo, impressions, views, snippet, fullDescription, applyLink });
}

let html = fs.readFileSync('index.html', 'utf8');

// Replace mockDatabase
html = html.replace(/const mockDatabase = \[[\s\S]*?\];/, `const mockDatabase = ${JSON.stringify(jobs, null, 2)};`);

// Replace allCategories
html = html.replace(/const allCategories = \[[\s\S]*?\];/, `const allCategories = ${JSON.stringify(allCategories)};`);

// Update openApplyModal call in renderJobProfile to pass the applyLink
html = html.replace(/onclick="openApplyModal\('(\$\{job\.title\})', '(\$\{job\.company\})'\)"/g, `onclick="openApplyModal('$1', '$2', '\${job.applyLink}')"`);
html = html.replace(/function openApplyModal\(title, company\) \{/, `function openApplyModal(title, company, applyLink) {\n            if (applyLink) {\n                if (applyLink.includes('@')) window.open('mailto:' + applyLink);\n                else window.open(applyLink, '_blank');\n                return;\n            }`);

fs.writeFileSync('index.html', html);
console.log('Successfully injected 150 jobs with 18+ categories into index.html');
