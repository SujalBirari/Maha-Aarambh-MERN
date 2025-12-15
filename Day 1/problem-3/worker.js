const { parentPort } = require('worker_threads')

parentPort.on('message', () => {
    console.log('Starting heavy calculation on a worker thread');

    const start = Date.now();
    while (Date.now() - start < 20000) {
    }

    parentPort.postMessage('Heavy calculation finished');
});
