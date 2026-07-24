document.addEventListener("DOMContentLoaded", () => {

const TOTAL_LAYERS = 12;
const DURATION = 6000;
const STAGGER_DELAY = 550;

    const world = document.querySelector(".world");
    const sigilsContainer = document.querySelector(".sigils");

    const sigilSet = [
        "❂","⟴","⇶","⊙",
        "e","✦","◉","⟡",
        "▢","■","✶","✷"
    ];

    const layers = [];
    const sigils = [];
    const layerState = new Array(TOTAL_LAYERS).fill(true);


    /* =========================
       IMAGE RESOLVER
       WEBP → PNG → GIF
    ========================= */

    function resolveImage(i) {

        const base = `images/layer_${String(i).padStart(4,"0")}_${i + 1}`;

        const webp = `${base}.webp`;
        const png = `${base}.png`;
        const gif = `${base}.gif`;


        return new Promise((resolve) => {


            function testImage(src, fallback) {

                const img = new Image();

                img.onload = () => resolve(src);

                img.onerror = fallback;

                img.src = src;

            }


            testImage(webp, () => {

                testImage(png, () => {

                    testImage(gif, () => {

                        resolve(null);

                    });

                });

            });


        });

    }



    /* =========================
       BUILD LAYERS
    ========================= */

    for (let i = 0; i < TOTAL_LAYERS; i++) {

        const layer = document.createElement("div");

        layer.className = "layer";
        layer.id = `layer${i + 1}`;


        // ALL LAYERS START DOWN
        layer.style.transform = "translateY(0)";

        layer.style.transition =
            `transform ${DURATION}ms cubic-bezier(.22,1,.36,1)`;


        world.appendChild(layer);

        layers.push(layer);



        resolveImage(i).then((src) => {

            if (src) {

                layer.style.backgroundImage =
                    `url("${src}")`;

            }

        });

    }



    /* =========================
       BUILD SIGILS
    ========================= */

    sigilSet.forEach((label, index) => {


        const sigil = document.createElement("div");

        sigil.textContent = label;


        sigil.classList.add("active");


        sigil.addEventListener("click", () => {

            toggleLayer(index);

        });


        sigilsContainer.appendChild(sigil);

        sigils.push(sigil);


    });


/* =========================
   LOWER ALL
========================= */

const liftAll = document.createElement("div");

liftAll.textContent = "+";

liftAll.classList.add("lift-all");


liftAll.addEventListener("click", () => {

for (let i = 0; i < TOTAL_LAYERS; i++) {

    setTimeout(() => {

        layerState[i] = true;

        layers[i].style.transform =
            "translateY(0)";


        if (sigils[i]) {

            sigils[i].classList.add("active");

        }

    }, i * STAGGER_DELAY);

}


});


sigilsContainer.appendChild(liftAll);



    /* =========================
       TOGGLE SINGLE LAYER
    ========================= */

    function toggleLayer(index) {


        layerState[index] = !layerState[index];


        layers[index].style.transform =
            layerState[index]
            ? "translateY(0)"
            : "translateY(-140%)";



        sigils[index].classList.toggle(
            "active",
            layerState[index]
        );


    }



});