document.addEventListener("DOMContentLoaded", () => {

/*
=========================
LOADING SCREEN CONTROL
=========================
*/

const loadingScreen =
document.querySelector(".loading-screen");


if(loadingScreen){

    if(sessionStorage.getItem("visited")){

        loadingScreen.remove();

    }
    else{

        sessionStorage.setItem(
            "visited",
            "true"
        );

    }

}

/*
=========================
SHOW AUDIO CONTROL
=========================
*/

const audioControl =
document.querySelector(".audio-control");


if(audioControl){

    audioControl.classList.add(
        "visible"
    );

}


/*
=========================
RESET SCROLL
=========================
*/

if("scrollRestoration" in history){

    history.scrollRestoration =
    "manual";

}


window.scrollTo(
    0,
    0
);







/*
=========================
SETUP
=========================
*/


const panels =
document.querySelectorAll(".panel");


const videos =
document.querySelectorAll(".video-frame");



const SCROLL_FACTOR =
1.5;


const STACK_REVEAL =
28;








/*
=========================
AUDIO SYSTEM
=========================
*/


const audioState = {

    volume:0.5,

    enabled:false,

    players:new Map()

};





const audioButton =
document.getElementById(
    "audio-toggle"
);



const audioSlider =
document.getElementById(
    "audio-level"
);








function updateAudioButton(){


    if(!audioButton)
    return;



    audioButton.textContent =
    audioState.enabled
    ?
    "AUDIO ON"
    :
    "AUDIO OFF";


}








function setPlayerVolume(
    player,
    volume
){

    player.setVolume(

        Math.max(
            0,
            Math.min(
                1,
                volume
            )
        )

    );

}








function fadePlayer(
    player,
    target,
    duration = 800
){

    player.getVolume()

    .then(current=>{


        const start =
        current;



        const startTime =
        performance.now();





        function animate(time){


            const elapsed =
            time - startTime;



            const progress =
            Math.min(
                elapsed / duration,
                1
            );



            const volume =
            start +
            (
                target -
                start
            )
            *
            progress;



            setPlayerVolume(
                player,
                volume
            );




            if(progress < 1){


                requestAnimationFrame(
                    animate
                );


            }


        }




        requestAnimationFrame(
            animate
        );


    });


}









function fadeAllAudio(){


    audioState.players.forEach(
        player=>{


            fadePlayer(

                player,

                audioState.enabled
                ?
                audioState.volume
                :
                0

            );


        }
    );


}








function updateAllAudio(){


    audioState.players.forEach(
        player=>{


            setPlayerVolume(

                player,

                audioState.enabled
                ?
                audioState.volume
                :
                0

            );


        }
    );


}









/*
=========================
AUDIO BUTTON
=========================
*/


if(audioButton){


    audioButton.addEventListener(
        "click",
        ()=>{


            audioState.enabled =
            !audioState.enabled;




            if(
            audioState.enabled &&
            audioState.volume === 0
            ){


                audioState.volume =
                .5;



                if(audioSlider){

                    audioSlider.value =
                    50;

                }


            }




            updateAudioButton();



            fadeAllAudio();



        }
    );


}









/*
=========================
AUDIO SLIDER
=========================
*/


if(audioSlider){


    audioSlider.addEventListener(
        "input",
        ()=>{


            audioState.volume =
            Number(
                audioSlider.value
            )
            /
            100;




            if(audioState.volume > 0){


                audioState.enabled =
                true;


            }




            updateAudioButton();



            fadeAllAudio();



        }
    );


}





updateAudioButton();






/*
=========================
PAGE HEIGHT
=========================
*/


function setPageHeight(){


    const totalPanels =
    panels.length;



    document.body.style.height =

    `${((totalPanels - 1) * SCROLL_FACTOR + 1) * 100}vh`;


}



setPageHeight();

/*
=========================
IMAGE LOADING
=========================
*/


const loadedPanels =
new WeakSet();



const imageObserver =
new IntersectionObserver(
(entries)=>{


    entries.forEach(entry=>{


        if(!entry.isIntersecting)
        return;



        const panel =
        entry.target;



        if(loadedPanels.has(panel))
        return;



        let image =
        panel.dataset.image;



        if(!image)
        return;





        /*
        MOBILE IMAGE SWITCH
        */

        if(
        window.innerWidth <= 768 &&
        image.includes(".webp")
        ){


            image =
            image.replace(
                ".webp",
                "-mobile.webp"
            );


        }







        const img =
        document.createElement(
            "img"
        );



        img.className =
        "panel-image";



        img.alt =
        "";



        img.decoding =
        "async";





        /*
        APPEND FIRST
        */

        panel.appendChild(
            img
        );





        img.src =
        image;






        img.onload =
        async ()=>{


            try{

                await img.decode();

            }
            catch(e){

                console.warn(
                    "IMAGE DECODE FAILED:",
                    image
                );

            }



            img.classList.add(
                "loaded"
            );


        };







        img.onerror =
        ()=>{


            console.warn(
                "IMAGE FAILED:",
                image
            );


        };






        loadedPanels.add(
            panel
        );



        imageObserver.unobserve(
            panel
        );



    });


},
{
    rootMargin:
    "200px 0px"
});







panels.forEach(
panel=>{


    imageObserver.observe(
        panel
    );


});









/*
=========================
PANEL MOVEMENT
=========================
*/


function getScrollPosition(){


    const mobile =
    window.innerWidth <= 768;



    if(mobile){


        const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;



        return (
            maxScroll -
            window.scrollY
        );


    }


    return window.scrollY;


}









function updatePanels(){


    const height =
    window.innerHeight;



    const scrollY =
    getScrollPosition();






    panels.forEach(
    (panel,index)=>{


        /*
        FIRST PANEL FIXED
        */


        if(index === 0){


            panel.style.transform =
            "translateY(0)";


            return;


        }






        const start =
        (index - 1)
        *
        height
        *
        SCROLL_FACTOR;







        const progress =
        Math.min(
            1,
            Math.max(
                0,
                (
                    scrollY -
                    start
                )
                /
                (
                    height *
                    SCROLL_FACTOR
                )
            )
        );






        /*
        NEW PANEL DESCENDS
        */


        const stackOffset =
        index *
        STACK_REVEAL;





        const y =
        -height +
        (
            progress *
            (
                height -
                stackOffset
            )
        );






        panel.style.transform =
        `translateY(${y}px)`;








        /*
        EMAIL ARRIVAL
        */


        if(index === 9){


            const email =
            panel.querySelector(
                ".email-arrival"
            );



            if(email){


                email.style.transform =
                `translateY(${
                    -180 +
                    progress * 180
                }px)`;


                email.style.opacity =
                progress;


            }


        }




    });



}









/*
=========================
IMAGE PARALLAX
=========================
*/


function updateImageParallax(){


    panels.forEach(
    panel=>{


        const images =
        panel.querySelectorAll(
            ".panel-image"
        );




        images.forEach(
        image=>{


            /*
            KEEP UI ELEMENTS FIXED
            */


            if(
            image.classList.contains(
                "logo-image"
            ) ||
            image.classList.contains(
                "social-image"
            ) ||
            image.classList.contains(
                "find-image"
            ) ||
            image.classList.contains(
                "email-image"
            )
            ){


                image.style.transform =
                "translateY(0)";


                return;


            }






            /*
            BACKGROUND MOTION
            */


            image.style.transform =
            "translateY(0)";



        });



    });



}









/*
=========================
VIMEO LAZY LOADING
=========================
*/


function loadVideo(container){


    if(container.dataset.loaded)
    return;






    const mobile =
    window.innerWidth <= 768;






    const iframe =
    mobile
    ?
    container.querySelector(
        ".mobile-frame"
    )
    :
    container.querySelector(
        ".desktop-frame"
    );






    if(!iframe)
    return;







    const unused =
    mobile
    ?
    container.querySelector(
        ".desktop-frame"
    )
    :
    container.querySelector(
        ".mobile-frame"
    );






    if(unused){

        unused.remove();

    }








    iframe.src =

    iframe.dataset.src +

    "&autoplay=1&autopause=0&playsinline=1";







    container.dataset.loaded =
    "true";





iframe.onload = ()=>{


    if(typeof Vimeo === "undefined")
    return;



    const player =
    new Vimeo.Player(
        iframe
    );



    /*
    REGISTER PLAYER
    */

    audioState.players.set(
        container,
        player
    );



    /*
    START MUTED
    */

    player.setVolume(0);



    player.play()

    .then(()=>{


        container.classList.add(
            "video-ready"
        );


    })

    .catch(()=>{});


};

}
/*
=========================
VIDEO OBSERVER
=========================
*/


const videoObserver =
new IntersectionObserver(
(entries)=>{



    entries.forEach(
    entry=>{


        if(entry.isIntersecting){


            loadVideo(
                entry.target
            );


        }


    });


},
{
    rootMargin:"100px 0px",
    threshold:.25
});






videos.forEach(
video=>{


    videoObserver.observe(
        video
    );


});







/*
=========================
AUDIO PANEL SYNC
=========================
*/

function updateAudioFade(){

    const height =
    window.innerHeight;


    const scrollY =
    getScrollPosition();



    let activeIndex = 0;



    panels.forEach(
    (panel,index)=>{


        if(index === 0)
        return;



        const start =
        (index - 1)
        *
        height
        *
        SCROLL_FACTOR;



        const progress =
        Math.min(
            1,
            Math.max(
                0,
                (
                    scrollY -
                    start
                )
                /
                (
                    height *
                    SCROLL_FACTOR
                )
            )
        );



        if(progress > .05){

            activeIndex = index;

        }



    });







    videos.forEach(
    video=>{


        const panel =
        video.closest(".panel");


        if(!panel)
        return;



        const index =
        [...panels].indexOf(panel);



        const player =
        audioState.players.get(
            video
        );



        if(!player)
        return;





        let volume = 0;



        if(
        index === activeIndex &&
        audioState.enabled
        ){

            volume =
            audioState.volume;

        }



        fadePlayer(
            player,
            volume,
            500
        );



    });



}




/*
=========================
SCROLL PERFORMANCE LOOP
=========================
*/


let ticking =
false;





function scrollUpdate(){


    if(ticking)
    return;





    requestAnimationFrame(
    ()=>{


        updatePanels();


        updateImageParallax();


        updateAudioFade();




        ticking =
        false;



    });





    ticking =
    true;


}







window.addEventListener(
"scroll",
scrollUpdate,
{
    passive:true
});









/*
=========================
RESIZE
=========================
*/


window.addEventListener(
"resize",
()=>{


    setPageHeight();


    updatePanels();


    updateImageParallax();


    updateAudioFade();



});









/*
=========================
INITIAL POSITION
=========================
*/


requestAnimationFrame(
()=>{


    if(window.innerWidth <= 768){


        window.scrollTo(

            0,

            document.documentElement.scrollHeight -
            window.innerHeight

        );


    }
    else{


        window.scrollTo(
            0,
            0
        );


    }





    updatePanels();


    updateImageParallax();


    updateAudioFade();



});









/*
=========================
VARIABLE TICKER FONTS
=========================
*/


document
.querySelectorAll(".ticker-item")
.forEach(
item=>{


    const fonts = [


        '"Courier Prime", monospace',

        '"Courier New", monospace',

        '"Baskerville", serif',

        '"Georgia", serif',

        '"Times New Roman", serif',

        'Helvetica, Arial, sans-serif',

        '"Helvetica Neue", sans-serif',

        'Arial, sans-serif',

        '"Gill Sans", sans-serif'


    ];






    const text =
    item.textContent.trim();





    item.innerHTML =
    "";





    let currentFont =
    fonts[
        Math.floor(
            Math.random() *
            fonts.length
        )
    ];








    [...text].forEach(
    letter=>{


        const span =
        document.createElement(
            "span"
        );



        span.textContent =
        letter;







        if(
        /[.,;:'"!?]/.test(letter)
        ){


            span.style.fontFamily =
            '"Courier Prime", monospace';


        }
        else{



            if(
            Math.random() > .85
            ){


                currentFont =
                fonts[
                    Math.floor(
                        Math.random() *
                        fonts.length
                    )
                ];


            }






            span.style.fontFamily =
            currentFont;


        }







        span.style.fontWeight =
        "400";





        item.appendChild(
            span
        );



    });



});






});