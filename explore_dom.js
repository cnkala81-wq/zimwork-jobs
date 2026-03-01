const cheerio = require('cheerio');
const fs = require('fs');

const ih = fs.readFileSync('ih.html', 'utf8');
let $ = cheerio.load(ih);
console.log("iHarare Jobs Links:");
$('a').each((i, el) => {
    const href = $(el).attr('href');
    if (href && (href.toLowerCase().includes('job') || href.toLowerCase().includes('vacancy'))) {
        console.log(href.trim());
    }
});

const vm = fs.readFileSync('vm.html', 'utf8');
$ = cheerio.load(vm);
console.log("VacancyMail Links:");
$('a').each((i, el) => {
    const href = $(el).attr('href');
    if (href && (href.toLowerCase().includes('job') || href.toLowerCase().includes('vacanc'))) {
        console.log(href.trim());
    }
});
