document.addEventListener("DOMContentLoaded", () => {


/*
=========================
LOADING SCREEN CONTROL
=========================
*/

const loadingScreen =
document.querySelector(".loading-screen");


if(loadingScreen){


    setTimeout(()=>{


        loadingScreen.classList.add(
            "loaded"
        );


        setTimeout(()=>{


            loadingScreen.remove();


      loadVideo(
    document.querySelector(".panel-02 .video-frame")
);


setTimeout(() => {

    loadVideo(
        document.querySelector(".panel-04 .video-frame")
    );

},1000);



        },1000);


    },2000);


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



        panel.appendChild(img);



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


}

);







panels.forEach(panel=>{


    imageObserver.observe(
        panel
    );


});









/*
=========================
SCROLL POSITION
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









/*
=========================
PANEL MOVEMENT
=========================
*/


function updatePanels(){


    const height =
    window.innerHeight;



    const scrollY =
    getScrollPosition();





    panels.forEach(
    (panel,index)=>{


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


    panels.forEach(panel=>{


        const images =

        panel.querySelectorAll(
            ".panel-image"
        );



        images.forEach(image=>{


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


    if(!container)
    return;


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

    "&autoplay=1&muted=1&loop=1&background=1&quality=720p";








    container.dataset.loaded =

    "true";







    iframe.onload = ()=>{


        container.classList.add(
            "video-ready"
        );


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


    entries.forEach(entry=>{


if(entry.isIntersecting){


    loadVideo(
        entry.target
    );


    videoObserver.unobserve(
        entry.target
    );


}


    });


},


{


    rootMargin:
    "1500px",


    threshold:
    .5


}



);









videos.forEach(video=>{


    videoObserver.observe(
        video
    );


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


}

);









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
            Math.random()
            *
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
                        Math.random()
                        *
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