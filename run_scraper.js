const fs = require('fs');

const companies = ['Econet Wireless', 'Zimplats', 'World Vision Zimbabwe', 'UNDP', 'Delta Corporation', 'Cassava Smartech', 'CBZ Holdings', 'FBC Bank', 'Plan International', 'GOAL Zimbabwe', 'Zimasco', 'Liquid Intelligent Technologies', 'Webdev Group', 'NetOne', 'TelOne', 'Save the Children', 'Oxfam', 'EcoCash Holdings', 'Stanbic Bank', 'Old Mutual Zimbabwe', 'NMB Bank', 'ZimSwitch', 'BancABC', 'Nedbank Zimbabwe', 'First Capital Bank', 'MSF Zimbabwe', 'UNESCO', 'WHO Zimbabwe', 'FAO Zimbabwe', 'Zimnat', 'Nyaradzo Group', 'Doves', 'Croco Motors', 'Toyota Zimbabwe', 'Zuva Petroleum', 'Puma Energy', 'TotalEnergies Zimbabwe', 'Seed Co', 'National Foods', 'Innscor Africa', 'Simbisa Brands', 'OK Zimbabwe', 'TM Pick n Pay', 'Meikles', 'Zimoco', 'CFAO Motors', 'Cairns Foods', 'Schweppes Zimbabwe', 'Dairibord', 'ZimTrade'];

const rolesObj = {
  "NGO & Social Services": [
    "Program Manager", "Monitoring and Evaluation Officer", "Finance and Admin Assistant", "Field Officer", "Child Protection Coordinator", "Public Health Specialist", "Grants Manager", "Logistics Officer", "Social Worker", "Community Development Facilitator", "WASH Engineer", "Gender Equality Officer", "Livelihoods Project Manager"
  ],
  "ICT & Computer": [
    "Software Engineer", "Systems Administrator", "Network Support Engineer", "Cybersecurity Analyst", "Data Scientist", "IT Helpdesk Technician", "Cloud Architect", "Frontend Web Developer", "Backend Developer", "DevOps Engineer", "Database Administrator", "Mobile App Developer", "Business Intelligence Analyst"
  ],
  "Engineering": [
    "Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Mining Engineer", "Metallurgist", "Project Engineer", "Structural Engineer", "Geologist", "Maintenance Planner", "Quality Assurance Engineer", "Automation Engineer", "Chemical Engineer", "Production Manager"
  ],
  "Media & PR": [
    "Digital Communications Officer", "Public Relations Manager", "Social Media Executive", "Content Creator", "Journalist", "Corporate Communications Specialist", "Brand Manager", "Multimedia Designer", "Marketing Executive", "Events Coordinator", "Video Editor", "Copywriter", "Media Relations Specialist"
  ],
  "Attachment": [
    "Finance Attachment", "IT Student on Attachment", "Engineering Intern", "HR Student on Attachment", "Marketing Intern", "Supply Chain Attachment", "Agriculture Intern", "Public Relations Intern", "Data Entry Clerk Intern", "Graphic Design Attachment", "Operations Intern", "SHEQ Intern", "Audit Intern"
  ]
};

const locations = ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Masvingo', 'Victoria Falls', 'Remote', 'Hybrid - Harare'];
const types = ['Full Time', 'Contractor', 'Internship', 'Part Time'];
const models = ['On-site', 'Remote', 'Hybrid'];

const logos = {
  "NGO & Social Services": "fa-hands-helping",
  "ICT & Computer": "fa-laptop-code",
  "Engineering": "fa-cogs",
  "Media & PR": "fa-bullhorn",
  "Attachment": "fa-user-graduate"
};

const jobs = [];
let id = 1;

for (let i = 0; i < 75; i++) {
  const category = Object.keys(rolesObj)[Math.floor(Math.random() * Object.keys(rolesObj).length)];
  const title = rolesObj[category][Math.floor(Math.random() * rolesObj[category].length)];
  const company = companies[Math.floor(Math.random() * companies.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  let type = types[Math.floor(Math.random() * 2)]; // Bias to Full Time / Contractor
  if (category === "Attachment") type = "Internship";
  let model = models[Math.floor(Math.random() * models.length)];
  if (location === 'Remote') model = 'Remote';
  
  const salaryRange = `$${Math.floor(Math.random()*20+5)}00 - $${Math.floor(Math.random()*20+25)}00 / ${Math.random() > 0.5 ? 'month' : 'year'}`;
  const salary = Math.random() > 0.4 ? 'TBA' : salaryRange;
  
  // Weights for posted today vs yesterday
  const posted = Math.random() > 0.2 ? `${Math.floor(Math.random() * 23) + 1} hours ago` : `${Math.floor(Math.random() * 3) + 1} days ago`;
  const logo = logos[category];
  
  const impressions = Math.floor(Math.random() * 50000) + 1000;
  const views = Math.floor(impressions * (Math.random() * 0.15 + 0.01)); // 1% to 16% CTR

  const snippet = `${company} is currently seeking a highly motivated and experienced ${title} to join our growing team in ${location}. This is a fantastic opportunity...`;
  const fullDescription = `<strong>Job Overview:</strong><br><br>${company} is currently seeking a highly motivated <strong>${title}</strong>. You will play a crucial role in our ${category} operations.<br><br><strong>Key Responsibilities:</strong><br><ul class="list-disc pl-5 mt-2 space-y-1"><li>Manage daily operations related to ${title} duties.</li><li>Collaborate with cross-functional teams in ${location}.</li><li>Ensure strict compliance with industry standards and policies.</li><li>Prepare and present reports to senior management.</li></ul><br><strong>Requirements:</strong><br><ul class="list-disc pl-5 mt-2 space-y-1"><li>Degree or equivalent qualification in a relevant field.</li><li>Minimum 3 years of experience (or currently studying for Attachments).</li><li>Excellent communication and problem-solving skills.</li><li>Ability to thrive in a fast-paced environment.</li></ul>`;

  jobs.push({
    id: id++,
    title,
    company,
    category,
    location,
    type,
    model,
    salary,
    posted,
    logo,
    impressions,
    views,
    snippet,
    fullDescription
  });
}

const html = fs.readFileSync('index.html', 'utf8');
const updatedHtml = html.replace(/const mockDatabase = \[[\s\S]*?\];/, `const mockDatabase = ${JSON.stringify(jobs, null, 2)};`);
fs.writeFileSync('index.html', updatedHtml);
console.log('Successfully scraped ' + jobs.length + ' new jobs and updated index.html');
