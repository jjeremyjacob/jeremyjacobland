document.addEventListener("DOMContentLoaded", () => {


    const panels = document.querySelectorAll(".panel");

    const SCROLL_FACTOR = 1.5;



    /*
    =========================
    PANEL MOVEMENT
    =========================
    */


    function updatePanels() {


        const scrollY = window.scrollY;

        const panelHeight = window.innerHeight;



        panels.forEach((panel, index) => {



            // FIRST PANEL ALWAYS DOWN

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



            const centerOffset =
                rect.top +
                rect.height / 2 -
                window.innerHeight / 2;



            const movement =
                centerOffset * -0.82;



            image.style.transform =
                `translateY(${movement}px)`;


        });


    }





    /*
    =========================
    SCROLL PERFORMANCE
    =========================
    */


    let ticking = false;



    function onScroll() {


        if (!ticking) {


            requestAnimationFrame(() => {


                updatePanels();

                updateImageParallax();


                ticking = false;


            });


            ticking = true;

        }

    }




    window.addEventListener(
        "scroll",
        onScroll,
        { passive:true }
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
    INITIAL STATE
    =========================
    */


    updatePanels();

    updateImageParallax();



});