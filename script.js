document.addEventListener("DOMContentLoaded", () => {


/*
=========================
RESET SCROLL
=========================
*/

if ("scrollRestoration" in history){

    history.scrollRestoration = "manual";

}


window.scrollTo(0,0);







/*
=========================
SETUP
=========================
*/


const panels =
document.querySelectorAll(".panel");


const SCROLL_FACTOR = 1.5;



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
        document.createElement("img");



        img.className =
        "panel-image";



        img.alt =
        "";



        img.decoding =
        "async";



        /*
        APPEND FIRST
        */

        panel.appendChild(img);



        /*
        LOAD AFTER INSERT
        */

        img.src =
        image;



        img.onload =
        ()=>{


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



        loadedPanels.add(panel);



        imageObserver.unobserve(panel);



    });


},
{
    rootMargin:"1500px 0px"
});





panels.forEach(panel=>{


    imageObserver.observe(panel);


});





/*
=========================
PANEL MOVEMENT
=========================
*/


function updatePanels(){


    const height =
    window.innerHeight;



    const mobile =
    window.innerWidth <= 768;



    let scrollY;





    /*
    MOBILE REVERSED SCROLL
    */


    if(mobile){


        const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;



        scrollY =
        maxScroll -
        window.scrollY;


    }
    else{


        scrollY =
        window.scrollY;


    }






    panels.forEach((panel,index)=>{


        /*
        FIRST PANEL FIXED
        */


        if(index === 0){


            panel.style.transform =
            "translateY(0)";


            return;


        }





        const start =
        (index - 1) *
        height *
        SCROLL_FACTOR;





        const progress =
        (scrollY - start) /
        (height * SCROLL_FACTOR);





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





        /*
        EMAIL ARRIVAL
        */


        if(index === 9){


            const email =
            panel.querySelector(
                ".email-arrival"
            );



            if(email){


                const emailProgress =
                Math.min(
                    1,
                    Math.max(
                        0,
                        (position + 100) / 100
                    )
                );



                const move =
                -180 +
                (emailProgress * 180);



                email.style.transform =
                `translateY(${move}px)`;


                email.style.opacity =
                emailProgress;


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


    panels.forEach(panel=>{


        const rect =
        panel.getBoundingClientRect();



        const offset =
        rect.top +
        rect.height / 2 -
        window.innerHeight / 2;





        const images =
        panel.querySelectorAll(
            ".panel-image"
        );





        images.forEach(image=>{


            /*
            ONLY BACKGROUND PANEL IMAGES
            MOVE

            LOGOS / SOCIAL STAY FIXED
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





            image.style.transform =
            `translateY(${offset * -0.35}px)`;


        });



    });


}







/*
=========================
VIMEO LAZY LOADING
=========================
*/


const videos =
document.querySelectorAll(".video-frame");




function loadVideo(container){


    if(container.dataset.loaded)
    return;




    const mobile =
    window.innerWidth <= 768;





    const iframe =
    mobile
    ?
    container.querySelector(".mobile-frame")
    :
    container.querySelector(".desktop-frame");





    if(!iframe)
    return;






    const unused =
    mobile
    ?
    container.querySelector(".desktop-frame")
    :
    container.querySelector(".mobile-frame");




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
        new Vimeo.Player(iframe);





        player.setVolume(0);





        player.play()

        .then(()=>{


            container.classList.add(
                "video-ready"
            );


        })

        .catch(()=>{


        });



    };


}







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
    rootMargin:"200px 0px",
    threshold:.01
});






videos.forEach(video=>{


    videoObserver.observe(video);


});









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




    requestAnimationFrame(()=>{


        updatePanels();

        updateImageParallax();



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


    }
    else{


        window.scrollTo(
            0,
            0
        );


    }




    updatePanels();

    updateImageParallax();



});









/*
=========================
LOADING SCREEN EXIT SYNC
=========================
*/


const loadingScreen =
document.querySelector(
".loading-screen"
);



const loadingBar =
document.querySelector(
".loading-progress-bar"
);



if(
loadingScreen &&
loadingBar
){


    /*
    Match CSS timing:
    progress = 1.5s
    exit = 1.5s
    */


    setTimeout(()=>{


        loadingScreen.style.pointerEvents =
        "none";


    },1500);



}









/*
=========================
VARIABLE TICKER FONTS
=========================
*/


document
.querySelectorAll(".ticker-item")
.forEach(item=>{


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






    [...text].forEach(letter=>{


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