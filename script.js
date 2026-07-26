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

    const totalPanels = panels.length;

    document.body.style.height =
    `${((totalPanels - 1) * SCROLL_FACTOR + 1) * 100}vh`;

}


setPageHeight();








/*
=========================
LAZY LOAD BACKGROUNDS
=========================
*/

const imageObserver =
new IntersectionObserver(entries => {


    entries.forEach(entry => {


        if(!entry.isIntersecting)
        return;



        const panel =
        entry.target;



        let image =
        panel.dataset.image;



        if(!image)
        return;



        if(window.innerWidth <= 768){

            image =
            image.replace(
                ".webp",
                "-mobile.webp"
            );

        }



        const img =
        new Image();



        img.onload = ()=>{


            panel.style.backgroundImage =
            `url("${image}")`;


        };



        img.src = image;



        imageObserver.unobserve(panel);


    });


},
{
    rootMargin:"500px 0px"
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






    panels.forEach((panel,index)=>{


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
=========================
EMAIL SCROLL ARRIVAL
=========================
*/

if(index === 9){


    const email =
    panel.querySelector(".email-arrival");


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
        -180 + (emailProgress * 180);



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
        panel.querySelectorAll(".panel-image");




        images.forEach((image,index)=>{


            let speed = -0.82;



            if(index === 0)
            speed = -0.9;



            if(index === 1)
            speed = -0.6;



            if(index === 2)
            speed = -0.3;





            image.style.transform =
            `translateY(${offset * speed}px)`;


        });



    });


}









/*
=========================
VIMEO
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
new IntersectionObserver(entries=>{


    entries.forEach(entry=>{


        if(entry.isIntersecting){


            loadVideo(entry.target);


        }


    });


},
{
    rootMargin:"150px 0px",
    threshold:.01
});




videos.forEach(video=>{


    videoObserver.observe(video);


});









/*
=========================
SCROLL LOOP
=========================
*/

let ticking = false;




function scrollUpdate(){


    if(ticking)
    return;



    requestAnimationFrame(()=>{


        updatePanels();

        updateImageParallax();



        ticking = false;


    });



    ticking = true;


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
START POSITION
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


});









/*
=========================
VARIABLE FONTS
=========================
*/


document.querySelectorAll(".ticker-item")
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



    item.innerHTML = "";



    let currentFont =
    fonts[
        Math.floor(
            Math.random()*fonts.length
        )
    ];




    [...text].forEach(letter=>{


        const span =
        document.createElement("span");



        span.textContent =
        letter;





        if(/[.,;:'"!?]/.test(letter)){


            span.style.fontFamily =
            '"Courier Prime", monospace';


        }

        else{


            if(Math.random() > .85){


                currentFont =
                fonts[
                    Math.floor(
                        Math.random()*fonts.length
                    )
                ];


            }



            span.style.fontFamily =
            currentFont;


        }





        span.style.fontWeight =
        "400";



        item.appendChild(span);



    });



});