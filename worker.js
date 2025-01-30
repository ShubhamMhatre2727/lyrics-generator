const { parentPort } = require('worker_threads');
const {createServer} = require("node:http")
const querystring = require('querystring')

// to handle redirected url request and generate authorization code
parentPort.on('message', (msg) => {
    if(msg=="startserver"){

        const server = createServer((req, res)=>{
            if(req.url.startsWith('/?code=')){
                const query = querystring.parse(req.url.split('?')[1]);
                res.end('Authentication successful! You can close this window.');
                parentPort.postMessage(query); // Return URL parameters
                server.close(); // Stop the server once done
            }
        })

        server.listen(3000,()=>{
            console.log("server started att port 3000 for callback");
            
        })
    }
});
