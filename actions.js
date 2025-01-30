require("dotenv").config()
const crypto = require('crypto');
const {Worker} = require('worker_threads')
const fs = require('node:fs');

const state = crypto.randomBytes(16).toString('hex')
const worker = new Worker('./worker.js');

// to handle token generation with authorization code
worker.on('message',(data)=>{
    // got the authorization code
    const authCode = data.code;

    // fetching access token
    const authString = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');

    fetch('https://accounts.spotify.com/api/token',{
        method:'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authString}`
          },
          body: new URLSearchParams({
            code: authCode,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code'
          })
    })
    .then((res)=>{
        if(res.ok){
            res.json().then((data)=>{
                saveToken(data)
            })
        }else{
            console.log(res);
        }
    })
})


// Save token to a JSON file
function saveToken(token){
    fs.writeFileSync('token.json', JSON.stringify(token), 'utf-8');
    console.log('Token saved successfully!');
}


// Function to read the token from the JSON file
function getToken() {
    if (fs.existsSync('token.json')) {
      const data = fs.readFileSync('token.json', 'utf-8');
      return JSON.parse(data);
    } else {
      console.error('Token file not found! generate token');
      return null;
    }
  }

// code to fetch user profile
async function fetchProfile() {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${getToken().access_token}` }
    });

    if(result.ok){
        return await result.json();
    }else if(result.status == 401){
        return -2
    }else{
        console.log(result);
    }

}

// code to get song/track currently played by user
async function getCurrentTrack() {
    const result = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        method: "GET", headers: { Authorization: `Bearer ${getToken().access_token}` }
    });

    // return -1 if no song playing
    // return -2 if token expired
    if(result.ok){
        try{
            return await result.json();
        }
        catch(SyntaxError) {
            return -1
        }
    }else if(result.status == 401){
        return -2
    }else{
        console.log(result);
    }
}

// exportin all function to use somewhere else
module.exports = { getToken, worker, state, fetchProfile, getCurrentTrack }