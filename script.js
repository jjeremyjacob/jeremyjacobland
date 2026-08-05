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


function getPanelHeight(){

    if(!panels.length){
        return window.innerHeight;
    }

    return panels[0].getBoundingClientRect().height;

}


function setPageHeight(){

    const totalPanels =
    panels.length;

    const panelHeight =
    getPanelHeight();

    document.body.style.height =
    `${((totalPanels - 1) * SCROLL_FACTOR + 1) * panelHeight}px`;

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
VIDEO LOADING
=========================
*/


const loadedVideos =
new WeakSet();



const videoObserver =
new IntersectionObserver(
(entries)=>{


    entries.forEach(entry=>{


        if(!entry.isIntersecting)
        return;


        const panel =
        entry.target;



        if(loadedVideos.has(panel))
        return;



        const frame =
        panel.querySelector(
            window.innerWidth <= 768
            ? ".mobile-frame"
            : ".desktop-frame"
        );



        if(
            frame &&
            frame.dataset.src
        ){

            frame.src =
            frame.dataset.src;


            frame.removeAttribute(
                "data-src"
            );


            frame.onload = ()=>{

                frame
                .closest(".video-frame")
                .classList.add(
                    "video-ready"
                );

            };


            console.log(
                "VIDEO LOADED:",
                panel.className
            );


        }



        loadedVideos.add(panel);

        videoObserver.unobserve(panel);



    });


},
{
    rootMargin:"800px 0px"
});





document
.querySelectorAll(".panel")
.forEach(panel=>{


    if(
    panel.querySelector(
        "iframe[data-src]"
    )
    ){

        videoObserver.observe(panel);

    }


});
 
/*
=========================
PANEL MOVEMENT
=========================
*/

function updatePanels(){

    const height =
    getPanelHeight();


const mobile =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;



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


        /*
        DISMISS PANEL 1 ARROW
        WHEN PANEL 2 STARTS DESCENDING
        */

        if(index === 1 && progress > 0){

            dismissScrollArrow();

        }


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
FLOATING PANEL OBJECTS
=========================
*/

const floatingElements =
document.querySelectorAll(
    ".panel-07 .panel-content-left, .panel-09 .social-links"
);

function updateFloatingObjects(){

const mobile =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;


    let scrollY;


    if(mobile){

        const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;


        scrollY =
        maxScroll - window.scrollY;

    }
    else{

        scrollY =
        window.scrollY;

    }



    floatingElements.forEach(el=>{


        const speed =
        0.08;


        el.style.translate =
        `0 ${scrollY * speed}px`;


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
    updateFloatingObjects();

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

    updateFloatingObjects();

});


/*
=========================
INITIAL POSITION
=========================
*/

requestAnimationFrame(()=>{

    setPageHeight();


    if(
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
){

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

    updateFloatingObjects();


});



/*
=========================
APPLY RANDOM FONT TO ALL TICKERS
=========================
*/

document
.querySelectorAll(
    ".ticker-wrap .ticker-item, " +
    ".loading-ticker-track .ticker-item, " +
    ".random-font")
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
MACHINE CHATTER
=========================
*/

const chatter =
document.querySelector(".machine-chatter");


if(
    chatter &&
    window.innerWidth > 768
){

    const messages = [

        "SIGNAL TRANSMITTING..",
        "DOOR IS AJAR",
        "SOURCE UNKNOWN",
        "IN PROGRESS",
        "CURRENT",
        "COLLECTION CONTINUES",
        "RETURN PATH ACTIVE",
        "NO RECORD FOUND",
        "THE PRINCESS: LOST",
        "DOORWAY REMAINS OPEN",
        "AN OTHER SIGNAL DETECTED",
        "EAR...",
        "FOUND"

    ];


    /*
    WAIT UNTIL LOADING SCREEN IS GONE
    */

    const startChatter = ()=>{


        const chatterOverlay =
        document.querySelector(
            ".machine-chatter-overlay"
        );


        if(chatterOverlay){

            chatterOverlay.classList.add(
                "active"
            );

        }


        function updateChatter(){


            const message =
            messages[
                Math.floor(
                    Math.random() *
                    messages.length
                )
            ];


            chatter.style.opacity="0";


            setTimeout(()=>{


                chatter.textContent =
                message;


                chatter.style.opacity=".55";


            },300);


        }


        updateChatter();


setInterval(
    updateChatter,
    60000
);


    };



    /*
    MATCH LOADING EXIT
    */

    if(sessionStorage.getItem("visited")){

        // returning visitor
        setTimeout(
            startChatter,
            500
        );

    }
    else{

        // first visit
        setTimeout(
            startChatter,
            7000
        );

    }


}

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

        const isOpen =
        transmissionContainer.classList.toggle("active");


        transmitButton.innerHTML =
        isOpen
        ?
        "H<br>I<br>D<br>E<br><br>T<br>R<br>A<br>N<br>S<br>M<br>I<br>S<br>S<br>I<br>O<br>N<br>S"
        :
        "S<br>E<br>N<br>D<br><br>T<br>R<br>A<br>N<br>S<br>M<br>I<br>S<br>S<br>I<br>O<br>N<br>S";

    });

}


/*
=========================
FORM SUBMISSION
=========================
*/

const form =
document.querySelector(".message-form");


if(form){

    form.addEventListener("submit", async (e)=>{

        e.preventDefault();


        const data =
        new FormData(form);


        try {

            const response =
            await fetch(
                form.action,
                {
                    method:"POST",
                    body:data,
                    headers:{
                        "Accept":"application/json"
                    }
                }
            );


            if(response.ok){

                form.reset();

                const button =
                form.querySelector("button");

                button.textContent =
                "SENT";

            }
            else {

                throw new Error(
                    "Transmission failed"
                );

            }


        }
        catch(error){

            console.log(error);

            const button =
            form.querySelector("button");

            button.textContent =
            "FAILED";

        }


    });

}


/*
=========================
IMAGE ARCHIVE DRAWER
=========================
*/


const galleryButton =
document.getElementById("galleryButton");


const galleryDrawer =
document.getElementById("galleryDrawer");


const galleryClose =
document.getElementById("galleryClose");





if(galleryButton && galleryDrawer){


    galleryButton.addEventListener("click",()=>{


        const isOpen =
        galleryDrawer.classList.toggle("open");



        /*
        FOUNDINGS ATMOSPHERE
        */


        document.body.classList.toggle(
            "foundings-mode",
            isOpen
        );



        /*
        BUTTON STATE
        */


        galleryButton.innerHTML =
        isOpen
        ?
        "F<br>O<br>U<br>N<br>D<br>I<br>N<br>G<br>S"
        :
        "F<br>I<br>N<br>D<br>I<br>N<br>G<br>S";


    });


}





if(galleryClose && galleryDrawer){


    galleryClose.addEventListener("click",()=>{


        galleryDrawer.classList.remove("open");



        document.body.classList.remove(
            "foundings-mode"
        );



        galleryButton.innerHTML =
        "F<br>I<br>N<br>D<br>I<br>N<br>G<br>S";


    });


}

/* =========================
   DRAWER PULL
========================= */
const drawerPullButton =
document.getElementById("drawerPullButton");

const drawerPullDrawer =
document.getElementById("drawerPullDrawer");

const drawerPullClose =
document.getElementById("drawerPullClose");


if(drawerPullButton && drawerPullDrawer){

    drawerPullButton.addEventListener(
        "click",
        ()=>{

            const isOpen =
            drawerPullDrawer.classList.toggle("open");

            drawerPullButton.classList.toggle(
                "active",
                isOpen
            );

        }
    );

}


if(drawerPullClose && drawerPullDrawer){

    drawerPullClose.addEventListener(
        "click",
        ()=>{

            drawerPullDrawer.classList.remove("open");

            drawerPullButton.classList.remove(
                "active"
            );

        }
    );

}


/* =========================
   WAVES AUDIO DRAWER
========================= */


const audioDrawerTab =
    document.getElementById("audioDrawerTab");


if(audioControls && audioDrawerTab){

    audioDrawerTab.addEventListener("click", () => {

        audioControls.classList.toggle("open");

        audioDrawerTab.classList.toggle("active");

    });

}

const scrollArrow = document.querySelector(
    ".panel-01 .scroll-arrow"
);

let arrowDismissed = false;


function dismissScrollArrow() {

    if (arrowDismissed) return;

    arrowDismissed = true;

    if (scrollArrow) {

        scrollArrow.classList.add("gone");

        setTimeout(() => {

            scrollArrow.remove();

        }, 700);

    }

}


/*
=========================
END
=========================
*/

});