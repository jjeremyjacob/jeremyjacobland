document.addEventListener("DOMContentLoaded",()=>{


/*
=========================
RESET SCROLL POSITION
=========================
*/


if ("scrollRestoration" in history){

    history.scrollRestoration = "manual";

}


window.scrollTo(
    0,
    0
);





/*
=========================
PANELS
=========================
*/


const panels =
document.querySelectorAll(".panel");


const SCROLL_FACTOR = 1.5;





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
PANEL MOVEMENT
=========================
*/


function updatePanels(){


    const panelHeight =
    window.innerHeight;


    const isMobile =
    window.innerWidth <= 768;


    let scrollY;


    if(isMobile){


        const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;


        scrollY =
        maxScroll - window.scrollY;


    }else{


        scrollY =
        window.scrollY;


    }



    panels.forEach((panel,index)=>{


        if(index===0){


            panel.style.transform =
            "translateY(0)";


            return;

        }



        const start =
        (index - 1) *
        panelHeight *
        SCROLL_FACTOR;



        const progress =
        (scrollY - start) /
        (panelHeight * SCROLL_FACTOR);



        const position =
        Math.min(
            0,
            Math.max(
                -100,
                -100 + progress * 100
            )
        );



        panel.style.transform =
        `translateY(${position}%)`;



    });


}






/*
=========================
IMAGE PARALLAX
=========================
*/


function updateImageParallax(){


    panels.forEach(panel=>{


        const image =
        panel.querySelector(".panel-image");


        if(!image)
        return;


        const rect =
        panel.getBoundingClientRect();


        const offset =
        rect.top +
        rect.height / 2 -
        window.innerHeight / 2;



        image.style.transform =
        `translateY(${offset * -0.82}px)`;


    });


}






/*
=========================
VIMEO LOADING
=========================
*/


const isMobile =
window.innerWidth <= 768;


const videos =
document.querySelectorAll(".video-frame");




function loadVideo(container){


    if(container.dataset.loaded)
    return;



    const iframe =
    isMobile
    ?
    container.querySelector(".mobile-frame")
    :
    container.querySelector(".desktop-frame");



    if(!iframe)
    return;



    let src =
    iframe.dataset.src;



    if(!src.includes("autoplay")){


        src +=
        "&autoplay=1&autopause=0&playsinline=1";


    }



    iframe.src =
    src;


    container.dataset.loaded =
    "true";



    iframe.onload = ()=>{


        if(typeof Vimeo === "undefined")
        return;



        const player =
        new Vimeo.Player(iframe);



        player.setVolume(0);



        player.play()

        .then(()=>{


            container.classList.add(
                "video-ready"
            );


        })

        .catch(()=>{


            setTimeout(()=>{


                player.play()

                .then(()=>{


                    container.classList.add(
                        "video-ready"
                    );


                });


            },1000);


        });


    };


}






/*
=========================
LOAD VIDEOS WHEN NEEDED
=========================
*/


const videoObserver =
new IntersectionObserver(
(entries)=>{


    entries.forEach(entry=>{


        if(entry.isIntersecting){


            loadVideo(
                entry.target
            );


        }


    });


},
{

    rootMargin:"800px 0px",

    threshold:0.01

});




videos.forEach(video=>{


    videoObserver.observe(video);


});






/*
=========================
SCROLL PERFORMANCE
=========================
*/


let ticking = false;



function scrollUpdate(){


    if(!ticking){


        requestAnimationFrame(()=>{


            updatePanels();

            updateImageParallax();


            ticking = false;


        });


        ticking = true;


    }


}



window.addEventListener(
    "scroll",
    scrollUpdate,
    {
        passive:true
    }
);






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


});






/*
=========================
INITIAL POSITION
=========================
*/


requestAnimationFrame(()=>{


    if(window.innerWidth <= 768){


        window.scrollTo(
            0,
            document.documentElement.scrollHeight -
            window.innerHeight
        );


    }else{


        window.scrollTo(
            0,
            0
        );


    }


    updatePanels();

    updateImageParallax();


});


});