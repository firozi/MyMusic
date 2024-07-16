let currentSong;
let current_img;
let songs = []
let songname = []
let playbutton = document.querySelector("#play")
let last_vol;
let selected_album;
let song_Ul = document.querySelector(".song_list").getElementsByTagName("ul")[0];
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", async () => {

        let clicked_album = card.querySelector("h2").innerText.replaceAll(" ", "_")
        if (clicked_album === selected_album) {
            return
        }
        if (currentSong) {
            currentSong.pause()
            playbutton.src = "images/play.svg"
        }
        song_Ul.innerHTML = ""
        selected_album = clicked_album;
        console.log("Current Album: ", selected_album);
        songs = [];
        songname = [];
        await main()
    });
});
async function GetSongs(album) {
    let a = await fetch(`http://127.0.0.1:5500/spotify/${album}.html`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    return songs
}

async function GetSongName(album) {
    let a = await fetch(`http://127.0.0.1:5500/spotify/${album}.html`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let name = div.getElementsByTagName("p")

    for (let i = 0; i < name.length; i++) {
        const element = name[i];
        songname.push(element.innerText)
    }

    return songname

}
async function GetArtistName(album) {
    let a = await fetch(`http://127.0.0.1:5500/spotify/${album}.html`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let name = div.getElementsByClassName("artname")
    let artistname = []
    for (let i = 0; i < name.length; i++) {
        const element = name[i];
        artistname.push(element.innerText)
    }
    return artistname;

}


async function main() {
    let artistName = await GetArtistName(selected_album)
    let songName = await GetSongName(selected_album);

    for (let i = 0; i < songName.length; i++) {
        song_Ul.innerHTML = song_Ul.innerHTML + `<li><img class="invert" src="images/music.svg" alt="">
                        <div class="info ">
                            <div class="songName">${songName[i]}</div>
                            <div class="artist">${artistName[i]}</div>
                        </div>
                        <div class="playnow">
                            <img src="images/play.svg" alt="">
                        </div>
                        </li>`
    }
    await playsongs()

}

async function playsongs() {
    let song_name = await GetSongName(selected_album);
    let Song_Link = await GetSongs(selected_album);
    let playing = Array.from(document.querySelectorAll(".playnow img"))
    playing.forEach((element, index) => {
        element.addEventListener("click", () => {
            if (currentSong) {
                if (currentSong.src === Song_Link[index]) {
                    if (currentSong.paused) {
                        currentSong.play()
                        element.src = "images/pause.svg"
                        console.log("played")
                        playbutton.src = "images/pause.svg"

                    }
                    else {
                        currentSong.pause()
                        console.log("paused")
                        element.src = "images/play.svg"
                        playbutton.src = "images/play.svg"
                    }
                } else {
                    current_img.src = "images/play.svg";
                    currentSong.pause();
                    currentSong = new Audio(Song_Link[index]);
                    currentSong.play();
                    currentSong.volume = last_vol;
                    let name = document.querySelector(".songinfo")
                    name.innerHTML = `${song_name[index]}`
                    let time = document.querySelector(".songtime");
                    currentSong.addEventListener("loadedmetadata", () => {
                        currentSong.addEventListener("timeupdate", () => {

                            time.innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
                            document.querySelector(".circle").style.width = (currentSong.currentTime) / (currentSong.duration) * 100 + "%";
                        })

                    })
                    console.log("played another song")
                    playbutton.src = "images/pause.svg"
                    element.src = "images/pause.svg"
                    current_img = element;
                    last_vol = currentSong.volume




                }
            } else {
                currentSong = new Audio(Song_Link[index]);
                currentSong.play();
                currentSong.volume = 0.1
                let name = document.querySelector(".songinfo");
                name.innerHTML = `${song_name[index]}`
                console.log("played first song")
                let time = document.querySelector(".songtime");
                currentSong.addEventListener("loadedmetadata", () => {
                    currentSong.addEventListener("timeupdate", () => {
                        time.innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
                        document.querySelector(".circle").style.width = (currentSong.currentTime) / (currentSong.duration) * 100 + "%";
                    })

                })
                playbutton.src = "images/pause.svg"
                element.src = "images/pause.svg"
                current_img = element;
                last_vol = currentSong.volume;

            }


        })

    })



}


function formatTime(seconds) {
    if (isNaN(seconds)) {
        return "0:00"
    }
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

document.querySelector(".hamburger img").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%"
})
function close_sidebar() {
    document.querySelector("#cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })
}
playbutton.addEventListener("click", () => {
    if (currentSong) {
        if (currentSong.paused) {
            currentSong.play()
            playbutton.src = "images/pause.svg"
            console.log("played by 2nd button")
        }
        else {
            currentSong.pause()
            playbutton.src = "images/play.svg"
            console.log("paused by 2nd button")
        }
    }
})
let volume = document.querySelector(".seekbar1");
volume.addEventListener("click", (e) => {
    let vol = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle1").style.width = vol + "%"
    if (currentSong) {
        currentSong.volume = (vol) / 100
        console.log(currentSong.volume)
        last_vol = currentSong.volume
    }

})
let prev = document.querySelector("#prev")
prev.addEventListener("click", () => {
    if (currentSong) {
        let index = songs.indexOf(currentSong.src);
        console.log("prev song index", index)
        let image = Array.from(document.querySelectorAll(".playnow img"))
        console.log(image[index])
        image[index].src = "images/play.svg"
        if (index > 0) {
            currentSong.src = songs[index - 1];
            console.log("now prev song is", index - 1)
            let name = document.querySelector(".songinfo");
            name.innerHTML = `${songname[index - 1]}`
            playbutton.src = "images/pause.svg"

            currentSong.play();
            console.log("played prev song auto")
        }
        else {
            console.log("no prev songs")
        }


    }
})
let next = document.querySelector("#next")
next.addEventListener("click", () => {
    if (currentSong) {
        let index = songs.indexOf(currentSong.src);
        let image = Array.from(document.querySelectorAll(".playnow img"))
        console.log(image[index])
        image[index].src = "images/play.svg"
        console.log(songs.length)
        if (index < songs.length - 1) {
            currentSong.src = songs[index + 1];
            let name = document.querySelector(".songinfo");
            name.innerHTML = `${songname[index + 1]}`
            playbutton.src = "images/pause.svg"
            currentSong.play();
        }
        else {
            console.log("no next song")
        }
    }
})
document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    console.log(percent);
    document.querySelector(".circle").style.width = percent + "%";
    if (currentSong) {
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    }
})
let img=document.querySelector(".volume img")
img.addEventListener("click",()=>{
    console.log("working")
    
    if(img.src.includes("volume.svg")){
        console.log("in")
        img.src=img.src.replace("volume.svg","mute.svg")
        if(currentSong){
            currentSong.volume=0
            document.querySelector(".circle1").style.width=0+"%"
        }
    }
    else{
        img.src=img.src.replace("mute.svg","volume.svg")
        if(currentSong){
            currentSong.volume=0.1
            document.querySelector(".circle1").style.width=10+"%"
        }
    }
})
close_sidebar()
playsongs()
main()




