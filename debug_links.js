const cheerio = require('cheerio');
const fs = require('fs');

let out = "--- iHarare ---\n";
let $ = cheerio.load(fs.readFileSync('ih.html', 'utf8'));
$('a').each((i, el) => {
    out += $(el).attr('href') + " | " + $(el).text().trim().substring(0, 50) + "\n";
});

out += "\n--- VacancyMail ---\n";
$ = cheerio.load(fs.readFileSync('vm.html', 'utf8'));
$('a').each((i, el) => {
    out += $(el).attr('href') + " | " + $(el).text().trim().substring(0, 50) + "\n";
});

fs.writeFileSync('all_links.txt', out);
console.log("Dumped all links to all_links.txt");
