const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

self.onmessage = async function(event) {
    let { lyrics, duration, progress } = event.data;
    for (const line of lyrics) {
    // If a new execution started, stop the current one
        self.postMessage({lyrics:line[1]});
        await delay(line[0]-progress); // Waits before processing the next item
        progress = line[0]
    }

};