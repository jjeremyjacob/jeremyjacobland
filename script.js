document.addEventListener("DOMContentLoaded", () => {

/*
=========================
LOADING SCREEN CONTROL
=========================
*/

const loadingScreen =
document.querySelector(".loading-screen");


const audioControls =
document.getElementById("audioControls");



if(loadingScreen){


    if(sessionStorage.getItem("visited")){


        loadingScreen.remove();


        if(audioControls){

            audioControls.classList.add(
                "visible"
            );

        }


    }
    else{


        sessionStorage.setItem(
            "visited",
            "true"
        );


        setTimeout(()=>{


            if(audioControls){

                audioControls.classList.add(
                    "visible"
                );

            }


        },5600);


    }


}





/*
=========================
RESET SCROLL
=========================
*/

if("scrollRestoration" in history){

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







/*
=========================
VARIABLE RANDOM FONTS
=========================
*/

const randomFontText = (element)=>{

    if(!element)
    return;


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
    element.placeholder ||
    element.textContent.trim();


    if(!text)
    return;


    element.innerHTML = "";


    let currentFont =
    fonts[
        Math.floor(
            Math.random() *
            fonts.length
        )
    ];


    [...text].forEach(letter=>{


        const span =
        document.createElement("span");


        span.textContent =
        letter === " "
        ? "\u00A0"
        : letter;


        if(Math.random() > .75){

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


        span.style.fontWeight =
        "400";


        span.style.display =
        "inline-block";


        element.appendChild(span);


    });

};



 
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
        async ()=>{


            try {


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





        loadedPanels.add(panel);



        imageObserver.unobserve(panel);



    });


},
{
    rootMargin:"200px 0px"
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



                email.style.opacity = 1;



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
            "translateY(0)";



        });



    });


}

/*
=========================
SCROLL
=========================
*/

window.addEventListener(
"scroll",
()=>{

    updatePanels();
    updateImageParallax();

},
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

    setPageHeight();


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
APPLY RANDOM FONT TO ALL TICKERS
=========================
*/

document
.querySelectorAll(
    ".ticker-wrap .ticker-item, .loading-ticker-track .ticker-item"
)
.forEach(item=>{

    randomFontText(item);

});


/*
=========================
RANDOM FONT TRANSMISSION FIELDS
=========================
*/

document
.querySelectorAll(
    ".message-field, .message-form button"
)
.forEach(field=>{

    randomFontText(field);

});

/*
=========================
TRANSMIT DRAWER
=========================
*/


const transmitButton =
document.getElementById("transmitButton");

const transmissionContainer =
document.getElementById("transmissionContainer");


if(transmitButton && transmissionContainer){

    transmitButton.addEventListener("click",()=>{

        transmissionContainer.classList.toggle("active");

    });

}


/*
=========================
END
=========================
*/

});

