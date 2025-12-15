const http = require("http");
const { Worker } = require("worker_threads");

function runWorker() {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js');

        worker.on('message', (message) => {
            resolve(message);
        });
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });

        worker.postMessage('Start heavy calculation!');
    });
}

const server = http.createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/health") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("I am alive");
    }

    else if (req.method === "GET" && req.url === "/heavy") {
        const result = await runWorker();

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(result);
    }

    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});