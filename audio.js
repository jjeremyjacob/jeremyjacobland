document.addEventListener("DOMContentLoaded", () => {


/* =========================
   AUDIO SYSTEM
========================= */


const audio = document.getElementById("bgAudio");

const toggle =
document.getElementById("audioToggle");

const prev =
document.getElementById("prevTrack");

const next =
document.getElementById("nextTrack");

const trackName =
document.getElementById("trackName");


if(!audio){
    return;
}



/* =========================
   PLAYLIST
========================= */


const audioPath =
window.location.pathname.includes("theater003")
? "../audio/"
: "audio/";


const tracks = [

    audioPath + "nwht.mp3",
    audioPath + "lght.mp3",
    audioPath + "nfrn.mp3",
    audioPath + "tsfrdgs.mp3"

];


for(let i = tracks.length - 1; i > 0; i--){

    const j =
    Math.floor(
        Math.random() * (i + 1)
    );

    [tracks[i], tracks[j]] =
    [tracks[j], tracks[i]];

}

let currentTrack = 0;



function loadTrack(index){

    currentTrack = index;

    audio.src = tracks[currentTrack];

    if(trackName){

        trackName.textContent =
        tracks[currentTrack]
        .split("/")
        .pop();

    }


}




/* =========================
   CONTROLS
========================= */


toggle.addEventListener("click", () => {

    if(audio.paused){

        audio.play().catch(()=>{});

    }

    else{

        audio.pause();

    }

});



next.addEventListener("click", () => {


    currentTrack++;

    if(currentTrack >= tracks.length){

        currentTrack = 0;

    }


    loadTrack(currentTrack);

audio.play().catch(()=>{});


});



prev.addEventListener("click", () => {


    currentTrack--;

    if(currentTrack < 0){

        currentTrack = tracks.length - 1;

    }


    loadTrack(currentTrack);

audio.play().catch(()=>{});


});

audio.addEventListener("ended", () => {

    currentTrack++;

    if(currentTrack >= tracks.length){

        currentTrack = 0;

    }

    loadTrack(currentTrack);

    audio.play().catch(()=>{});

});


audio.addEventListener("play", () => {

    toggle.classList.add("playing");

});

audio.addEventListener("pause", () => {

    toggle.classList.remove("playing");

});


loadTrack(0);

});