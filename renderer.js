const worker = new Worker('webWorker.js');
const lyricsBox = document.getElementById('lyrics')
const lyricsBtn = document.getElementById('generateLyrics')

document.addEventListener('DOMContentLoaded',async()=>{
    const userData = await window.electronAPI.getProfile()
    const profileImg = document.getElementById('profileImage');
    profileImg.src = userData.images[0].url
    profileImg.title  = userData.display_name
})

document.getElementById('close').addEventListener('click',()=>{
    window.electronAPI.closeWindow()
})


lyricsBtn.addEventListener('click',generateLyrics)

let contentVisible = true;
lyricsBox.addEventListener('click',()=>{
    const content = document.getElementById('content');
    const navBtn = document.querySelector('nav');
    if(contentVisible){
        content.style.display = 'none'
        navBtn.style.display="none"
        contentVisible = false;
        window.electronAPI.resize(600,60)
    }else{
        content.style.display = 'flex'
        navBtn.style.display = 'flex'
        contentVisible = true;
        window.electronAPI.resize(600,235)
    }
})

async function generateLyrics(){
    const currentlyPlaying = await window.electronAPI.getCurrentTrack();
    if(currentlyPlaying == -2){
        window.electronAPI.logIn()
        alert("token was expired, play lyrics again")
    }else if(currentlyPlaying == -1){
        alert("No song playing")
    }else if(currentlyPlaying.currently_playing_type == "ad"){
        alert("ad playing")
    }
    else{

    document.getElementById('name').innerText = currentlyPlaying.item.name
    document.getElementById('artist').innerText = currentlyPlaying.item.artists[0].name
    document.getElementById('poster').src = currentlyPlaying.item.album.images[0].url

    getLyrics(currentlyPlaying.item.artists[0].name, currentlyPlaying.item.name, currentlyPlaying.item.duration_ms, currentlyPlaying.progress_ms)
    }
    
}

function getLyrics(artist,song, duration,progress){
    const params = new URLSearchParams({
        "artist_name":artist,
        "track_name":song
    })

    fetch(`https://lrclib.net//api/get?${params}`)
        .then((result)=>{
            if(result.ok){
                result.json().then((data)=>{
                    const lyrics = formatLyrics(data.syncedLyrics);
                    playLyrics(lyrics, duration, progress);
                })
            }else{
                alert('lyrics not found')
            }
        })
}

function formatLyrics(lyrics){
    const arr = lyrics.split('\n');
    const lst = []
    arr.forEach((line)=>{
        // converting time from min:sec to ms and storing in dictionary
        lst.push([Number(line.slice(1,9).split(':')[0])*60000  +  Number(line.slice(1,9).split(':')[1])*1000, line.slice(11,)])
    })
    

    // condition if line not exists
    // console.log(lst[249259] || "lyrics ono ");

    return lst
}


async function playLyrics(lyrics, duration, progress){

    lyrics = lyrics.filter((line)=>line[0]>=progress);
    lyrics.push([duration, "END"]);
    lyricsBtn.style.pointerEvents = 'none';
    lyricsBtn.innerText = 'CTRL + R \n to stop';
    worker.postMessage({
        lyrics:lyrics,
        duration: duration,
        progress:progress
    })
}


// Add message handling for the worker
worker.onmessage = function(event) {
    // console.log(event.data.lyrics);
    if(event.data.lyrics == "END"){
        lyricsBtn.style.pointerEvents = 'auto'
        lyricsBtn.innerText = 'Play Lyrics'
        generateLyrics()
    }
    lyricsBox.innerHTML += `<p>${event.data.lyrics}</p>`;
    lyricsBox.scrollTop = lyricsBox.scrollHeight;
};