document.addEventListener("DOMContentLoaded", () => {

/* =================================================
LOADING SCREEN CONTROL
================================================= */

const loadingScreen =
document.querySelector(".loading-screen");

const audioControls =
document.getElementById("audioControls");

if (loadingScreen) {


if (sessionStorage.getItem("visited")) {

    loadingScreen.remove();

} else {

    sessionStorage.setItem("visited", "true");

    setTimeout(() => {

        if (audioControls) {

            audioControls.classList.add(
                "visible"
            );

        }

    }, 5600);

}


}

/* =================================================
RESET SCROLL
================================================= */

if ("scrollRestoration" in history) {


history.scrollRestoration = "manual";


}

window.scrollTo(0, 0);

/* =================================================
SETUP
================================================= */

const panels =
document.querySelectorAll(".panel");

const SCROLL_FACTOR = 1.5;

/* =================================================
VARIABLE RANDOM FONTS
================================================= */

const randomFontText = (element) => {


if (!element) return;

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

if (!text) return;

element.innerHTML = "";

let currentFont =
    fonts[
        Math.floor(
            Math.random() *
            fonts.length
        )
    ];

[...text].forEach(letter => {

    const span =
        document.createElement("span");

    span.textContent =
        letter === " "
            ? "\u00A0"
            : letter;

    if (Math.random() > 0.75) {

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

    span.style.fontWeight = "400";

    span.style.display =
        "inline-block";

    element.appendChild(span);

});


};

/* =================================================
ALPHABET DECODE TEXT
================================================= */

const decodeText = (element) => {


if (!element) return;

const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const text =
    element.textContent.trim();

if (!text) return;

element.innerHTML = "";

[...text].forEach((character, index) => {

    const span =
        document.createElement("span");

    span.style.display =
        "inline-block";

    if (character === " ") {

        span.textContent =
            "\u00A0";

        element.appendChild(span);

        return;

    }

    span.textContent =
        characters[
            Math.floor(
                Math.random() *
                characters.length
            )
        ];

    element.appendChild(span);

    let cycles = 0;

    const maxCycles =
        4 +
        Math.floor(
            Math.random() * 7
        );

    const delay =
        index * 35;

    setTimeout(() => {

        const interval =
            setInterval(() => {

                if (cycles >= maxCycles) {

                    clearInterval(interval);

                    span.textContent =
                        character;

                    return;

                }

                span.textContent =
                    characters[
                        Math.floor(
                            Math.random() *
                            characters.length
                        )
                    ];

                cycles++;

            }, 60);

    }, delay);

});


};

/* =================================================
PAGE HEIGHT
================================================= */

function getPanelHeight() {


if (!panels.length) {

    return window.innerHeight;

}

return panels[0]
    .getBoundingClientRect()
    .height;


}

function setPageHeight() {


const totalPanels =
    panels.length;

const panelHeight =
    getPanelHeight();

document.body.style.height =
    `${
        (
            (totalPanels - 1) *
            SCROLL_FACTOR +
            1
        ) *
        panelHeight
    }px`;


}

/* =================================================
IMAGE LOADING
================================================= */

const loadedPanels =
new WeakSet();

const imageObserver =
new IntersectionObserver(


(entries) => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) {
            return;
        }

        const panel =
            entry.target;

        if (loadedPanels.has(panel)) {
            return;
        }

        let image =
            panel.dataset.image;

        if (!image) {
            return;
        }

        if (
            window.innerWidth <= 768 &&
            image.includes(".webp")
        ) {

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

        img.alt = "";

        img.decoding =
            "async";

        panel.appendChild(img);

        img.src =
            image;

        img.onload =
            async () => {

                try {

                    await img.decode();

                }

                catch (error) {

                    console.warn(
                        "IMAGE DECODE FAILED:",
                        image
                    );

                }

                img.classList.add(
                    "loaded"
                );

                updateImageParallax();

            };

        img.onerror =
            () => {

                console.warn(
                    "IMAGE FAILED:",
                    image
                );

            };

        loadedPanels.add(panel);

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

panels.forEach(panel => {


imageObserver.observe(panel);


});

/* =================================================
VIDEO LOADING
================================================= */

const loadedVideos =
new WeakSet();

function getVideoFrame(panel) {


if (!panel) return null;

const mobile =
    window.innerWidth <= 768;

if (mobile) {

    return (

        panel.querySelector(
            ".mobile-frame"
        )

        ||

        panel.querySelector(
            "iframe[data-src]"
        )

        ||

        panel.querySelector(
            "iframe"
        )

    );

}

return (

    panel.querySelector(
        ".desktop-frame"
    )

    ||

    panel.querySelector(
        "iframe[data-src]"
    )

    ||

    panel.querySelector(
        "iframe"
    )

);


}

/* =================================================
LOAD VIDEO
================================================= */

function loadVideo(
panel,
priority = false
) {


if (!panel) return null;

const frame =
    getVideoFrame(panel);

if (!frame) {

    console.warn(
        "NO VIDEO FRAME FOUND:",
        panel.className
    );

    return null;

}

if (
    frame.src &&
    !frame.dataset.src
) {

    loadedVideos.add(panel);

    return frame;

}

const source =
    frame.dataset.src;

if (!source) {

    console.warn(
        "NO VIDEO SOURCE FOUND:",
        panel.className
    );

    return null;

}

if (priority) {

    frame.setAttribute(
        "loading",
        "eager"
    );

    frame.setAttribute(
        "fetchpriority",
        "high"
    );

    frame.setAttribute(
        "importance",
        "high"
    );

}

frame.onload =
    () => {

        const videoFrame =
            frame.closest(
                ".video-frame"
            );

        if (videoFrame) {

            videoFrame.classList.add(
                "video-ready"
            );

        }

        console.log(
            "VIDEO READY:",
            panel.className
        );

    };

frame.onerror =
    () => {

        console.warn(
            "VIDEO FRAME FAILED:",
            panel.className
        );

    };

frame.src =
    source;

frame.dataset.originalSrc =
    source;

frame.removeAttribute(
    "data-src"
);

loadedVideos.add(panel);

return frame;


}

/* =================================================
NORMAL VIDEO OBSERVER
================================================= */

const videoObserver =
new IntersectionObserver(


(entries) => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) {
            return;
        }

        const panel =
            entry.target;

        if (
            loadedVideos.has(panel)
        ) {
            return;
        }

        loadVideo(panel);

        videoObserver.unobserve(
            panel
        );

    });

},

{
    rootMargin:
        "800px 0px"
}


);

/* =================================================
OBSERVE VIDEOS
================================================= */

panels.forEach(panel => {


const frame =
    panel.querySelector(
        "iframe[data-src], iframe"
    );

if (!frame) {
    return;
}

if (
    panel.classList.contains(
        "panel-10"
    )
) {

    loadVideo(
        panel,
        true
    );

    return;

}

if (frame.dataset.src) {

    videoObserver.observe(
        panel
    );

}


});

/* =================================================
PANEL 10 MOBILE VIDEO FAILSAFE
================================================= */

const panel10 =
document.querySelector(".panel-10");

if (panel10) {


const panel10Frame =
    getVideoFrame(panel10);

if (panel10Frame) {

    if (
        panel10Frame.dataset.src
    ) {

        panel10Frame.dataset.originalSrc =
            panel10Frame.dataset.src;

    }

    setTimeout(() => {

        const videoFrame =
            panel10.querySelector(
                ".video-frame"
            );

        const ready =
            videoFrame &&
            videoFrame.classList.contains(
                "video-ready"
            );

        if (!ready) {

            console.warn(
                "PANEL 10 VIDEO NOT READY — RETRYING"
            );

            const source =
                panel10Frame.dataset.originalSrc ||
                panel10Frame.dataset.src ||
                panel10Frame.src;

            if (source) {

                panel10Frame.src =
                    "about:blank";

                requestAnimationFrame(() => {

                    panel10Frame.src =
                        source;

                });

            }

        }

    }, 5000);

}


}

/* =================================================
THEATER 003 — PANEL 07
================================================= */

const theater003 =
document.querySelector(
".panel-07 .panel-07-theater"
);

if (theater003) {


theater003.classList.add(
    "theater-ready"
);


}

/* =================================================
PANEL MOVEMENT
================================================= */

function updatePanels() {


const height =
    getPanelHeight();

const mobile =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

let scrollY;

if (mobile) {

    const maxScroll =
        document.documentElement
            .scrollHeight -
        document.documentElement
            .clientHeight;

    scrollY =
        maxScroll -
        window.scrollY;

}

else {

    scrollY =
        window.scrollY;

}

panels.forEach((panel, index) => {

    if (index === 0) {

        panel.style.transform =
            "translateY(0)";

        return;

    }

    const start =
        (index - 1) *
        height *
        SCROLL_FACTOR;

    const progress =
        (
            scrollY -
            start
        ) /
        (
            height *
            SCROLL_FACTOR
        );

    if (
        index === 1 &&
        progress > 0
    ) {

        dismissScrollArrow();

    }

    const position =
        Math.min(
            0,
            Math.max(
                -100,
                -100 +
                progress * 100
            )
        );

    panel.style.transform =
        `translateY(${position}%)`;


    /* EMAIL ARRIVAL */

    if (index === 9) {

        const email =
            panel.querySelector(
                ".email-arrival"
            );

        if (email) {

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
                emailProgress * 180;

            email.style.transform =
                `translateY(${move}px)`;

            email.style.opacity = 1;

        }

    }

});


}

/* =================================================
IMAGE PARALLAX
================================================= */

function updateImageParallax() {


const images =
    document.querySelectorAll(
        ".panel[data-image] > .panel-image"
    );

if (!images.length) {
    return;
}

images.forEach(image => {

    const panel =
        image.closest(".panel");

    if (!panel) {
        return;
    }

    const rect =
        panel.getBoundingClientRect();

    const progress =
        (
            window.innerHeight -
            rect.top
        ) /
        (
            window.innerHeight +
            rect.height
        );

    const movement =
        (progress - 0.5) * 40;

    image.style.transform =
        `translate3d(0, ${movement}px, 0)`;

});


}

/* =================================================
FLOATING PANEL OBJECTS
================================================= */

const floatingElements =
document.querySelectorAll(
".panel-07 .panel-content-left, " +
".panel-09 .social-links"
);

function updateFloatingObjects() {


const mobile =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

let scrollY;

if (mobile) {

    const maxScroll =
        document.documentElement
            .scrollHeight -
        document.documentElement
            .clientHeight;

    scrollY =
        maxScroll -
        window.scrollY;

}

else {

    scrollY =
        window.scrollY;

}

floatingElements.forEach(element => {

    const speed =
        0.08;

    element.style.translate =
        `0 ${scrollY * speed}px`;

});


}

/* =================================================
SCROLL
================================================= */

window.addEventListener(
"scroll",
() => {


    updatePanels();

    updateImageParallax();

    updateFloatingObjects();

},
{
    passive: true
}


);

/* =================================================
RESIZE
================================================= */

window.addEventListener(
"resize",
() => {


    setPageHeight();

    updatePanels();

    updateImageParallax();

    updateFloatingObjects();

}


);

/* =================================================
INITIAL POSITION
================================================= */

requestAnimationFrame(() => {


setPageHeight();

if (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
) {

    window.scrollTo(
        0,
        document.documentElement
            .scrollHeight -
        document.documentElement
            .clientHeight
    );

}

else {

    window.scrollTo(0, 0);

}

updatePanels();

updateImageParallax();

updateFloatingObjects();


});

/* =================================================
TICKER TEXT
================================================= */

document
.querySelectorAll(
".ticker-wrap .ticker-item, " +
".loading-ticker-track .ticker-item"
)
.forEach(item => {


decodeText(item);


});

/* =================================================
RANDOM FONT ELEMENTS
================================================= */

document
.querySelectorAll(".random-font")
.forEach(item => {


randomFontText(item);


});

/* =================================================
TRANSMISSION FIELDS
================================================= */

document
.querySelectorAll(
".message-field, " +
".message-form button"
)
.forEach(field => {


randomFontText(field);


});

/* =================================================
MACHINE CHATTER
================================================= */

const chatter =
document.querySelector(
".machine-chatter"
);

if (
chatter &&
window.innerWidth > 768
) {


const messages = [

    "SIGNAL: TRANSMITTING..",

    "SOURCE UNKNOWN",

    "SEARCHING...",

    "NO RECORD FOUND",

    "THE PRINCESS /// STATUS: LOST"

];

const startChatter = () => {

    const chatterOverlay =
        document.querySelector(
            ".machine-chatter-overlay"
        );

    if (chatterOverlay) {

        chatterOverlay.classList.add(
            "active"
        );

    }

    function updateChatter() {

        const message =
            messages[
                Math.floor(
                    Math.random() *
                    messages.length
                )
            ];

        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        chatter.style.opacity = "0";

        setTimeout(() => {

            chatter.innerHTML = "";

            [...message].forEach(
                (character, index) => {

                    const span =
                        document.createElement(
                            "span"
                        );

                    if (
                        character === " "
                    ) {

                        span.textContent =
                            "\u00A0";

                        chatter.appendChild(
                            span
                        );

                        return;

                    }

                    span.textContent =
                        characters[
                            Math.floor(
                                Math.random() *
                                characters.length
                            )
                        ];

                    chatter.appendChild(
                        span
                    );

                    let cycles = 0;

                    const maxCycles =
                        3 +
                        Math.floor(
                            Math.random() * 8
                        );

                    const interval =
                        setInterval(() => {

                            if (
                                cycles >=
                                maxCycles
                            ) {

                                clearInterval(
                                    interval
                                );

                                span.textContent =
                                    character;

                                return;

                            }

                            span.textContent =
                                characters[
                                    Math.floor(
                                        Math.random() *
                                        characters.length
                                    )
                                ];

                            cycles++;

                        }, 45 + index * 8);

                }
            );

            chatter.style.opacity =
                ".55";

        }, 300);

    }

    updateChatter();

    setInterval(
        updateChatter,
        15000
    );

};


if (
    sessionStorage.getItem(
        "visited"
    )
) {

    setTimeout(
        startChatter,
        500
    );

}

else {

    setTimeout(
        startChatter,
        7000
    );

}


}

/* =================================================
TRANSMIT DRAWER
================================================= */

const transmitButton =
document.getElementById(
"transmitButton"
);

const transmissionContainer =
document.getElementById(
"transmissionContainer"
);

if (
transmitButton &&
transmissionContainer
) {


transmitButton.addEventListener(
    "click",
    () => {

        const isOpen =
            transmissionContainer.classList.toggle(
                "active"
            );

        transmitButton.innerHTML =
            isOpen

                ? "H<br>I<br>D<br>E<br><br>T<br>R<br>A<br>N<br>S<br>M<br>I<br>S<br>S<br>I<br>O<br>N"

                : "S<br>E<br>N<br>D<br><br>T<br>R<br>A<br>N<br>S<br>M<br>I<br>S<br>S<br>I<br>O<br>N";

    }
);


}

/* =================================================
FORM SUBMISSION
================================================= */

const form =
document.querySelector(
".message-form"
);

if (form) {


form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const data =
            new FormData(form);

        try {

            const response =
                await fetch(
                    form.action,
                    {
                        method: "POST",

                        body: data,

                        headers: {
                            "Accept":
                                "application/json"
                        }
                    }
                );

            if (response.ok) {

                form.reset();

                const button =
                    form.querySelector(
                        "button"
                    );

                if (button) {

                    button.textContent =
                        "SENT";

                }

            }

            else {

                throw new Error(
                    "Transmission failed"
                );

            }

        }

        catch (error) {

            console.log(error);

            const button =
                form.querySelector(
                    "button"
                );

            if (button) {

                button.textContent =
                    "FAILED";

            }

        }

    }
);


}

/* =================================================
IMAGE ARCHIVE DRAWER
================================================= */

const galleryButton =
document.getElementById(
"galleryButton"
);

const galleryDrawer =
document.getElementById(
"galleryDrawer"
);

const galleryClose =
document.getElementById(
"galleryClose"
);

if (
galleryButton &&
galleryDrawer
) {


galleryButton.addEventListener(
    "click",
    () => {

        const isOpen =
            galleryDrawer.classList.toggle(
                "open"
            );

        document.body.classList.toggle(
            "foundings-mode",
            isOpen
        );

        galleryButton.innerHTML =
            isOpen

                ? "F<br>O<br>U<br>N<br>D<br>I<br>N<br>G<br>S"

                : "F<br>I<br>N<br>D<br>I<br>N<br>G<br>S";

    }
);


}

if (
galleryClose &&
galleryDrawer
) {


galleryClose.addEventListener(
    "click",
    () => {

        galleryDrawer.classList.remove(
            "open"
        );

        document.body.classList.remove(
            "foundings-mode"
        );

        galleryButton.innerHTML =
            "F<br>I<br>N<br>D<br>I<br>N<br>G<br>S";

    }
);


}

/* =================================================
DRAWER PULL
================================================= */

const drawerPullButton =
document.getElementById(
"drawerPullButton"
);

const drawerPullDrawer =
document.getElementById(
"drawerPullDrawer"
);

const drawerPullClose =
document.getElementById(
"drawerPullClose"
);

if (
drawerPullButton &&
drawerPullDrawer
) {


drawerPullButton.addEventListener(
    "click",
    () => {

        const isOpen =
            drawerPullDrawer.classList.toggle(
                "open"
            );

        drawerPullButton.classList.toggle(
            "active",
            isOpen
        );

    }
);


}

if (
drawerPullClose &&
drawerPullDrawer
) {


drawerPullClose.addEventListener(
    "click",
    () => {

        drawerPullDrawer.classList.remove(
            "open"
        );

        drawerPullButton.classList.remove(
            "active"
        );

    }
);


}

/* =================================================
WAVES AUDIO DRAWER
================================================= */

const audioDrawerTab =
document.getElementById(
"audioDrawerTab"
);

if (
audioControls &&
audioDrawerTab
) {


audioDrawerTab.addEventListener(
    "click",
    () => {

        audioControls.classList.toggle(
            "open"
        );

        audioDrawerTab.classList.toggle(
            "active"
        );

    }
);


}

/* =================================================
SCROLL ARROW
================================================= */

const scrollArrow =
document.querySelector(
".panel-01 .scroll-arrow"
);

let arrowDismissed =
false;

function dismissScrollArrow() {


if (arrowDismissed) {
    return;
}

arrowDismissed = true;

if (scrollArrow) {

    scrollArrow.classList.add(
        "gone"
    );

    setTimeout(() => {

        scrollArrow.remove();

    }, 700);

}


}

/* =================================================
END
================================================= */

});
