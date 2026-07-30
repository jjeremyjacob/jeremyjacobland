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


if(!audio || !toggle || !prev || !next){
    return;
}



/* =========================
   PLAYLIST
========================= */


const tracks = [

    "audio/nwht.mp3",
    "audio/lght.mp3",
    "audio/nfrn.mp3",
    "audio/tsfrdgs.mp3"

];



/* =========================
   SHUFFLE
========================= */


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
   PLAY / PAUSE
========================= */


toggle.addEventListener("click", () => {


    if(audio.paused){

        audio.play().catch(()=>{});

    }

    else {

        audio.pause();

    }


});




/* =========================
   NEXT
========================= */


next.addEventListener("click", () => {


    currentTrack++;


    if(currentTrack >= tracks.length){

        currentTrack = 0;

    }


    loadTrack(currentTrack);

    audio.play().catch(()=>{});


});




/* =========================
   PREVIOUS
========================= */


prev.addEventListener("click", () => {


    currentTrack--;


    if(currentTrack < 0){

        currentTrack = tracks.length - 1;

    }


    loadTrack(currentTrack);

    audio.play().catch(()=>{});


});




/* =========================
   AUTO ADVANCE
========================= */


audio.addEventListener("ended", () => {


    currentTrack++;


    if(currentTrack >= tracks.length){

        currentTrack = 0;

    }


    loadTrack(currentTrack);

    audio.play().catch(()=>{});


});




/* =========================
   PLAY ICON STATE
========================= */


audio.addEventListener("play", () => {

    toggle.classList.add("playing");

});


audio.addEventListener("pause", () => {

    toggle.classList.remove("playing");

});




loadTrack(0);


});