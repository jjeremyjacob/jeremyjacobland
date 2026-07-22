document.addEventListener("DOMContentLoaded", () => {


    /*
    =========================
    PANEL MOVEMENT
    =========================
    */


    const panels = document.querySelectorAll(".panel");

    const SCROLL_FACTOR = 1.5;



    function updatePanels() {


        const scrollY = window.scrollY;

        const panelHeight = window.innerHeight;



        panels.forEach((panel, index) => {



            if (index === 0) {


                panel.style.transform =
                    "translateY(0)";


                return;

            }



            const start =
                index *
                panelHeight *
                SCROLL_FACTOR;



            const progress =
                (scrollY - start) /
                (panelHeight * SCROLL_FACTOR);



            const position =
                Math.max(
                    -100,
                    Math.min(
                        0,
                        -100 + (progress * 100)
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


    function updateImageParallax() {


        panels.forEach(panel => {


            const image =
                panel.querySelector(".panel-image");



            if (!image) return;



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
    SCROLL PERFORMANCE
    =========================
    */


    let ticking = false;



    function onScroll(){


        if(!ticking){


            requestAnimationFrame(()=>{


                updatePanels();

                updateImageParallax();


                ticking=false;


            });


            ticking=true;

        }


    }



    window.addEventListener(
        "scroll",
        onScroll,
        {passive:true}
    );



    window.addEventListener(
        "resize",
        () => {

            updatePanels();

            updateImageParallax();

        }
    );







    /*
    =========================
    PRIORITY VIDEO LOADING
    =========================
    */


    const isMobile =
        window.innerWidth <= 768;



    const videoPanels = [

        ".panel-02",

        ".panel-04",

        ".panel-10"

    ];



    const videoFrames =
        videoPanels.map(panel => {


            const container =
                document.querySelector(panel);


            if(!container) return null;



            return container.querySelector(
                isMobile
                ? ".mobile-frame"
                : ".desktop-frame"
            );


        });





    function loadVideo(index){


        if(index >= videoFrames.length)
            return;



        const iframe =
            videoFrames[index];



        if(!iframe)
            return;



        iframe.src =
            iframe.dataset.src;



        const player =
            new Vimeo.Player(iframe);



        player.ready().then(()=>{


            console.log(
                "Video ready",
                index + 1
            );



            iframe.parentElement.classList.add(
                "video-ready"
            );



            /*
            load next video
            */

            loadVideo(index + 1);



        }).catch(error=>{


            console.log(error);


        });


    }



    loadVideo(0);






    /*
    =========================
    INITIAL STATE
    =========================
    */


    updatePanels();

    updateImageParallax();


});