const fs = require('fs')
const path = require('path')
const readline = require('readline');
const { pipeline } = require('stream/promises');

const inputFile = path.join(__dirname, "bigfile.csv");
const fileStream = fs.createReadStream(inputFile);
const outputFile = path.join(__dirname, "cleaned_bigfile.csv");
const writeStream = fs.createWriteStream(outputFile);

// Source
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

// Transform
async function* transformData(source) {
    for await (const line of source) {
        const parts = line.split(',');
        if (parts[0]) {
            parts[0] = parts[0].toUpperCase();
        }

        yield parts.join(',') + '\n';
    }
}

async function run() {
    console.time("Processing Time");

    try {
        await pipeline(
            rl,
            transformData,
            writeStream
        );
        console.log("Pipeline succeeded.");
    }
    catch (err) {
        console.error("Pipeline failed.", err);
    }

    console.timeEnd("Processing Time");
}

run();