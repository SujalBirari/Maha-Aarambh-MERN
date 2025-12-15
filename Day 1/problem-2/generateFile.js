const { log } = require('console');
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, "bigfile.csv");

const writeStream = fs.createWriteStream(filePath);

function randomName() {
    const firstNames = ["John", "Jane", "Alex", "Emily", "Chris", "Sujal", "Aisha", "Ravi", "Meera"];
    const lastNames = ["Doe", "Smith", "Brown", "Patel", "Khan", "Birari", "Singh", "Sharma", "Lee"];
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${first} ${last}`;
}
function randomAge() {
    return Math.floor(Math.random() * (70 - 18 + 1)) + 18;
}
function randomEmail(name) {
    const domains = ["example.com", "mail.com", "test.org", "demo.net"];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const emailName = name.toLowerCase().replace(" ", ".");
    return `${emailName}@${domain}`;
}

async function generateFile() {
    console.log("Generating bigfile.csv with 1,000,000 lines...");

    for (let i = 0; i < 1_000_000; i++) {
        const name = randomName();
        const age = randomAge();
        const email = randomEmail(name);
        const line = `${name},${age},${email}\n`

        if (!writeStream.write(line)) {
            await new Promise(resolve => writeStream.once("drain", resolve));
        }
    }

    writeStream.end(() => {
        console.log("Finished writing bigfile.csv ✅");
    });
}

generateFile();

// more simpler version using fs.writeSync which writes directly to the disk blocking the event loop without any internal buffer

// const fs = require("fs");
// const path = require("path");

// const filePath = path.join(__dirname, "bigfile.csv");

// const fd = fs.openSync(filePath, "w");

// function randomName() {
//   const firstNames = ["John", "Jane", "Alex", "Emily", "Chris", "Sujal", "Aisha", "Ravi", "Meera"];
//   const lastNames = ["Doe", "Smith", "Brown", "Patel", "Khan", "Birari", "Singh", "Sharma", "Lee"];
//   const first = firstNames[Math.floor(Math.random() * firstNames.length)];
//   const last = lastNames[Math.floor(Math.random() * lastNames.length)];
//   return `${first} ${last}`;
// }

// function randomAge() {
//   return Math.floor(Math.random() * (70 - 18 + 1)) + 18;
// }

// function randomEmail(name) {
//   const domains = ["example.com", "mail.com", "test.org", "demo.net"];
//   const domain = domains[Math.floor(Math.random() * domains.length)];
//   const emailName = name.toLowerCase().replace(" ", ".");
//   return `${emailName}@${domain}`;
// }

// console.log("Generating bigfile.csv with 1,000,000 lines...");

// for (let i = 0; i < 1_000_000; i++) {
//   const name = randomName();
//   const age = randomAge();
//   const email = randomEmail(name);
//   const line = `${name},${age},${email}\n`;

//   fs.writeSync(fd, line);
// }

// fs.closeSync(fd);

// console.log("Finished writing bigfile.csv ✅");