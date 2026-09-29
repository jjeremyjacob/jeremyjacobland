/* ============================================================
   JEREMY JACOBLAND

   SCRIPT.JS

   ============================================================ */


document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* ========================================================
       ELEMENTS
    ======================================================== */

    const loadingScreen =
        document.querySelector(".loading-screen");

    const panels =
        Array.from(
            document.querySelectorAll(".panel")
        );

    const audioToggle =
        document.getElementById("audioToggle");

    const layerButtons =
        Array.from(
            document.querySelectorAll(
                ".layer-button[data-panel]"
            )
        );

    const scrollArrow =
        document.querySelector(".scroll-arrow");


    /* ========================================================
       STATE
    ======================================================== */

    let currentPanel = -1;

    let navigationLocked = false;

    const PANEL_TRANSITION = 900;

    let touchStartY = 0;

    let touchStartX = 0;

    let radioOn = false;

    let activeAudioPanel = null;

    const vimeoPlayers =
        new Map();


    /* ========================================================
       LOADING SCREEN
    ======================================================== */

    function hideLoadingScreen() {

        if (!loadingScreen) return;

        loadingScreen.classList.add(
            "is-hidden"
        );

        window.setTimeout(() => {

            loadingScreen.style.display =
                "none";

        }, 1000);

    }


    function initializeLoadingScreen() {

        if (!loadingScreen) return;

        window.setTimeout(
            hideLoadingScreen,
            1800
        );

    }


    /* ========================================================
       PANEL IMAGES
    ======================================================== */

    function loadPanelImage(panel) {

        if (!panel) return;

        if (
            panel.dataset.imageLoaded === "true"
        ) {
            return;
        }

        const imageSource =
            panel.dataset.image;

        if (!imageSource) {

            panel.dataset.imageLoaded =
                "true";

            return;

        }


        const mobile =
            window.innerWidth <= 768;


        let source =
            imageSource;


        /*
           Look for a mobile-specific image.

           Example:
           section3.webp
           section3-mobile.webp
        */

        if (mobile) {

            const dot =
                source.lastIndexOf(".");

            if (dot !== -1) {

                const mobileSource =
                    source.slice(0, dot)
                    +
                    "-mobile"
                    +
                    source.slice(dot);

                source =
                    mobileSource;

            }

        }


        panel.style.backgroundImage =
            `url("${source}")`;

        panel.dataset.imageLoaded =
            "true";

    }


    /* ========================================================
       VIDEO FRAME
    ======================================================== */

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


    /* ========================================================
       VIDEO LOADING
    ======================================================== */

    function loadVideo(
        panel,
        priority = false
    ) {

        if (!panel) return null;

        const frame =
            getVideoFrame(panel);

        if (!frame) return null;


        /*
           This particular iframe is already loaded.

           Never replace its src.
           Never reload it.
        */

        if (
            frame.src &&
            !frame.dataset.src
        ) {

            return frame;

        }


        const source =
            frame.dataset.src;

        if (!source) {

            return frame;

        }


        frame.setAttribute(
            "loading",
            "eager"
        );


        if (priority) {

            frame.setAttribute(
                "fetchpriority",
                "high"
            );

        }


        frame.onload = () => {

            const videoFrame =
                frame.closest(
                    ".video-frame"
                );

            if (videoFrame) {

                videoFrame.classList.add(
                    "video-ready"
                );

            }

        };


        frame.src =
            source;

        frame.dataset.originalSrc =
            source;

        frame.removeAttribute(
            "data-src"
        );


        return frame;

    }


    /* ========================================================
       VIMEO PLAYER
    ======================================================== */

    function getVimeoPlayer(frame) {

        if (!frame) return null;


        /*
           Return the existing player.

           This is important.

           We never create a second Vimeo
           player for the same iframe.
        */

        if (
            vimeoPlayers.has(frame)
        ) {

            return vimeoPlayers.get(
                frame
            );

        }


        if (
            !frame.src ||
            frame.src === "about:blank"
        ) {

            return null;

        }


        if (
            typeof Vimeo === "undefined" ||
            !Vimeo.Player
        ) {

            return null;

        }


        const player =
            new Vimeo.Player(frame);


        vimeoPlayers.set(
            frame,
            player
        );


        return player;

    }


    /* ========================================================
       PLAY BUTTONS
    ======================================================== */

    function setupVideoPlayButtons() {

        const buttons =
            document.querySelectorAll(
                ".video-play-button"
            );


        buttons.forEach((button) => {

            button.textContent =
                "play";

            button.setAttribute(
                "aria-label",
                "Play video"
            );


            button.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();


                    const panel =
                        button.closest(
                            ".panel"
                        );


                    if (!panel) return;


                    /*
                       Make sure the Vimeo iframe
                       has been loaded before creating
                       the Vimeo player.
                    */

                    const frame =
                        loadVideo(panel);


                    if (!frame) return;


                    const player =
                        getVimeoPlayer(frame);


                    if (!player) return;


                    player.getPaused()
                        .then((paused) => {

                            if (paused) {

                                player.play()
                                    .then(() => {

                                        button.textContent =
                                            "pause";

                                        button.setAttribute(
                                            "aria-label",
                                            "Pause video"
                                        );

                                    })
                                    .catch(() => {

                                        button.textContent =
                                            "play";

                                        button.setAttribute(
                                            "aria-label",
                                            "Play video"
                                        );

                                    });

                            } else {

                                player.pause()
                                    .then(() => {

                                        button.textContent =
                                            "play";

                                        button.setAttribute(
                                            "aria-label",
                                            "Play video"
                                        );

                                    })
                                    .catch(() => {

                                        button.textContent =
                                            "play";

                                        button.setAttribute(
                                            "aria-label",
                                            "Play video"
                                        );

                                    });

                            }

                        })
                        .catch(() => {

                            button.textContent =
                                "play";

                            button.setAttribute(
                                "aria-label",
                                "Play video"
                            );

                        });

                }
            );

        });

    }


    /* ========================================================
       PREPARE PANEL
    ======================================================== */

    function preparePanel(index) {

        const panel =
            panels[index];

        if (!panel) return;


        loadPanelImage(
            panel
        );


        const frame =
            getVideoFrame(
                panel
            );


        if (frame) {

            loadVideo(
                panel,
                index === currentPanel
            );

        }


        /*
           Preload the next panel's image/video.

           We load it but DO NOT play it.
        */

        const next =
            panels[index + 1];


        if (!next) return;


        loadPanelImage(
            next
        );


        const nextFrame =
            getVideoFrame(
                next
            );


        if (nextFrame) {

            loadVideo(
                next
            );

        }

    }


    /* ========================================================
       INITIAL PANEL STATE
    ======================================================== */

    function setInitialPanels() {

        panels.forEach(
            (panel, index) => {

                panel.classList.remove(
                    "is-visible",
                    "is-coming-down",
                    "is-leaving-back"
                );

                panel.style.transform =
                    "translate3d(0, -100dvh, 0)";

                panel.style.zIndex =
                    "1";

            }
        );


        currentPanel = -1;


        updateLayerNavigation();

    }


    /* ========================================================
       LAYER NAVIGATION
    ======================================================== */

    function updateLayerNavigation() {

        layerButtons.forEach(
            button => {

                const index =
                    Number(
                        button.dataset.panel
                    );


                const active =
                    index === currentPanel;


                button.classList.toggle(
                    "is-active",
                    active
                );


                if (active) {

                    button.setAttribute(
                        "aria-current",
                        "true"
                    );

                } else {

                    button.removeAttribute(
                        "aria-current"
                    );

                }

            }
        );

    }


    /* ========================================================
       PANEL NAVIGATION
    ======================================================== */

    function goToPanel(
        targetIndex,
        direction = "forward"
    ) {

        if (navigationLocked) return;

        if (
            targetIndex < 0 ||
            targetIndex >= panels.length
        ) {

            return;

        }


        if (
            targetIndex === currentPanel
        ) {

            return;

        }


        navigationLocked = true;


        const previousIndex =
            currentPanel;


        const previousPanel =
            previousIndex >= 0
                ? panels[previousIndex]
                : null;


        const targetPanel =
            panels[targetIndex];


        /*
           Reset panels that are not involved
           in this transition.
        */

        panels.forEach(
            (panel, index) => {

                if (
                    index !== previousIndex &&
                    index !== targetIndex
                ) {

                    panel.classList.remove(
                        "is-visible",
                        "is-coming-down",
                        "is-leaving-back"
                    );

                    panel.style.transform =
                        "translate3d(0, -100dvh, 0)";

                    panel.style.zIndex =
                        "1";

                }

            }
        );


        /*
           Previous panel stays visible while
           the new panel comes down.
        */

        if (previousPanel) {

            previousPanel.classList.remove(
                "is-coming-down"
            );

            previousPanel.classList.add(
                "is-visible"
            );

            previousPanel.style.transform =
                "translate3d(0, 0, 0)";

            previousPanel.style.zIndex =
                "2";

        }


        /*
           Put the new panel above the viewport.
        */

        targetPanel.classList.remove(
            "is-visible",
            "is-leaving-back"
        );

        targetPanel.classList.add(
            "is-coming-down"
        );

        targetPanel.style.transform =
            "translate3d(0, -100dvh, 0)";

        targetPanel.style.zIndex =
            "3";


        /*
           Force layout so the browser recognizes
           the starting position before transition.
        */

        void targetPanel.offsetHeight;


        /*
           Animate the new panel downward.
        */

        requestAnimationFrame(
            () => {

                targetPanel.style.transform =
                    "translate3d(0, 0, 0)";

                if (previousPanel) {

                    previousPanel.style.transform =
                        "translate3d(0, -100dvh, 0)";

                }

            }
        );


        currentPanel =
            targetIndex;


        updateLayerNavigation();


        /*
           Load the panel's image/video.

           This does NOT automatically play the video.
        */

        preparePanel(
            targetIndex
        );


        /*
           Change audio focus only.

           We do NOT pause the old video.
        */

        updateRadioForActivePanel();


        window.setTimeout(
            () => {

                if (previousPanel) {

                    previousPanel.classList.remove(
                        "is-visible",
                        "is-coming-down"
                    );

                    previousPanel.classList.add(
                        "is-leaving-back"
                    );

                    previousPanel.style.zIndex =
                        "1";

                }


                targetPanel.classList.remove(
                    "is-coming-down"
                );

                targetPanel.classList.add(
                    "is-visible"
                );

                targetPanel.style.transform =
                    "translate3d(0, 0, 0)";

                targetPanel.style.zIndex =
                    "2";


                navigationLocked =
                    false;

            },
            PANEL_TRANSITION + 50
        );

    }


    function nextPanel() {

        if (
            currentPanel >=
            panels.length - 1
        ) {

            return;

        }


        goToPanel(
            currentPanel + 1,
            "forward"
        );

    }


    function previousPanel() {

        if (
            currentPanel <= 0
        ) {

            return;

        }


        goToPanel(
            currentPanel - 1,
            "back"
        );

    }


    /* ========================================================
       LAYER BUTTONS
    ======================================================== */

    layerButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    const target =
                        Number(
                            button.dataset.panel
                        );


                    if (
                        Number.isNaN(target)
                    ) {

                        return;

                    }


                    const direction =
                        target > currentPanel
                            ? "forward"
                            : "back";


                    goToPanel(
                        target,
                        direction
                    );

                }
            );

        }
    );


    /* ========================================================
       AUDIO BUTTON
    ======================================================== */

    function updateAudioButton() {

        if (!audioToggle) return;


        audioToggle.classList.toggle(
            "is-on",
            radioOn
        );


        audioToggle.setAttribute(
            "aria-pressed",
            String(radioOn)
        );


        audioToggle.textContent =
            radioOn
                ? "audio"
                : "audio";

    }


    function muteAllPanelVideos() {

        vimeoPlayers.forEach(
            player => {

                player.setMuted(
                    true
                )
                .catch(
                    () => {}
                );

            }
        );


        activeAudioPanel =
            null;

    }


    function updateRadioForActivePanel() {

        /*
           Audio OFF:
           mute everything.

           We do NOT pause anything.
        */

        if (!radioOn) {

            muteAllPanelVideos();

            return;

        }


        if (currentPanel < 0) {

            muteAllPanelVideos();

            return;

        }


        const panel =
            panels[currentPanel];


        if (!panel) {

            muteAllPanelVideos();

            return;

        }


        const frame =
            getVideoFrame(panel);


        if (!frame) {

            muteAllPanelVideos();

            return;

        }


        /*
           Make sure the iframe exists.
        */

        loadVideo(
            panel,
            true
        );


        const player =
            getVimeoPlayer(frame);


        if (!player) {

            muteAllPanelVideos();

            return;

        }


        /*
           Mute every other Vimeo player.
           None of them are paused.
        */

        vimeoPlayers.forEach(
            (otherPlayer, otherFrame) => {

                if (
                    otherPlayer === player
                ) {

                    return;

                }


                otherPlayer
                    .setMuted(true)
                    .catch(
                        () => {}
                    );

            }
        );


        /*
           Unmute the active panel.
        */

        player
            .setMuted(false)
            .then(
                () => {

                    activeAudioPanel =
                        currentPanel;

                }
            )
            .catch(
                () => {}
            );


        player
            .setVolume(1)
            .catch(
                () => {}
            );


        /*
           If the user has explicitly started
           this video, let it continue.

           We do not automatically start it
           merely because audio is enabled.
        */

    }


    if (audioToggle) {

        audioToggle.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                radioOn =
                    !radioOn;


                updateAudioButton();


                updateRadioForActivePanel();

            }
        );

    }


    /* ========================================================
       PANEL CLICK NAVIGATION
    ======================================================== */

    panels.forEach(
        panel => {

            panel.addEventListener(
                "click",
                event => {

                    /*
                       Don't treat controls as panel
                       navigation.
                    */

                    if (
                        event.target.closest(
                            ".layer-navigation"
                        )
                    ) {

                        return;

                    }


                    if (
                        event.target.closest(
                            "a, button, iframe, .theater-frame, .theater003, .drawer-sigil, .scroll-arrow, .video-play-button"
                        )
                    ) {

                        return;

                    }


                    const clickY =
                        event.clientY;


                    const viewportMiddle =
                        window.innerHeight / 2;


                    /*
                       Top half = previous
                       Bottom half = next
                    */

                    if (
                        clickY <
                        viewportMiddle
                    ) {

                        previousPanel();

                        return;

                    }


                    nextPanel();

                }
            );

        }
    );


    /* ========================================================
       KEYBOARD NAVIGATION
    ======================================================== */

    document.addEventListener(
        "keydown",
        event => {

            /*
               Don't hijack typing or controls.
            */

            const tag =
                event.target.tagName;


            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                tag === "SELECT"
            ) {

                return;

            }


            switch (
                event.key
            ) {

                case "ArrowDown":

                case "ArrowRight":

                case " ":

                    event.preventDefault();

                    nextPanel();

                    break;


                case "ArrowUp":

                case "ArrowLeft":

                    event.preventDefault();

                    previousPanel();

                    break;

            }

        }
    );


    /* ========================================================
       TOUCH / SWIPE NAVIGATION
    ======================================================== */

    document.addEventListener(
        "touchstart",
        event => {

            if (
                !event.touches ||
                !event.touches.length
            ) {

                return;

            }


            touchStartY =
                event.touches[0].clientY;


            touchStartX =
                event.touches[0].clientX;

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "touchend",
        event => {

            if (
                !event.changedTouches ||
                !event.changedTouches.length
            ) {

                return;

            }


            const endY =
                event.changedTouches[0].clientY;


            const endX =
                event.changedTouches[0].clientX;


            const deltaY =
                touchStartY - endY;


            const deltaX =
                touchStartX - endX;


            /*
               Ignore mostly-horizontal gestures.
            */

            if (
                Math.abs(deltaY) <
                Math.abs(deltaX)
            ) {

                return;

            }


            /*
               Ignore tiny movements.
            */

            if (
                Math.abs(deltaY) < 50
            ) {

                return;

            }


            /*
               Swipe up = next.
               Swipe down = previous.
            */

            if (deltaY > 0) {

                nextPanel();

            } else {

                previousPanel();

            }

        },
        {
            passive: true
        }
    );


    /* ========================================================
       SCROLL ARROW
    ======================================================== */

    if (scrollArrow) {

        scrollArrow.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                nextPanel();

            }
        );

    }


    /* ========================================================
       DRAWER / RADIO BUTTON
    ======================================================== */

    const drawerToggle =
        document.getElementById(
            "drawerToggle"
        );


    if (drawerToggle) {

        drawerToggle.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                radioOn =
                    !radioOn;


                drawerToggle.classList.toggle(
                    "is-on",
                    radioOn
                );


                drawerToggle.setAttribute(
                    "aria-pressed",
                    String(radioOn)
                );


                drawerToggle.setAttribute(
                    "aria-label",
                    radioOn
                        ? "Turn radio off"
                        : "Turn radio on"
                );


                updateAudioButton();


                updateRadioForActivePanel();

            }
        );

    }


    /* ========================================================
       MACHINE CHATTER
    ======================================================== */

    const machineChatterOverlay =
        document.querySelector(
            ".machine-chatter-overlay"
        );

    const machineChatter =
        document.querySelector(
            ".machine-chatter"
        );


    const chatterMessages = [

        "STATUS UPDATING...",

        "SIGNAL STABLE...",

        "RECEIVING TRANSMISSION...",

        "ROOM INDEXED...",

        "COLLECTION CONTINUES...",

        "SIGNAL MOVING...",

        "TRANSMISSION RECEIVED..."

    ];


    function showMachineChatter() {

        if (
            !machineChatterOverlay ||
            !machineChatter
        ) {

            return;

        }


        const message =
            chatterMessages[
                Math.floor(
                    Math.random() *
                    chatterMessages.length
                )
            ];


        machineChatter.textContent =
            message;


        machineChatterOverlay.classList.add(
            "is-visible"
        );


        window.setTimeout(
            () => {

                machineChatterOverlay.classList.remove(
                    "is-visible"
                );

            },
            1200
        );

    }


    function hideMachineChatter() {

        if (
            !machineChatterOverlay
        ) {

            return;

        }


        machineChatterOverlay.classList.remove(
            "is-visible"
        );

    }


    /* ========================================================
       OPTIONAL VIMEO FRAME WAIT
    ======================================================== */

    function waitForVideoFrame(
        panel,
        callback,
        attempts = 20
    ) {

        if (!panel) return;


        const frame =
            getVideoFrame(panel);


        if (
            frame &&
            frame.src &&
            frame.src !== "about:blank"
        ) {

            callback(frame);

            return;

        }


        if (attempts <= 0) {

            return;

        }


        window.setTimeout(
            () => {

                waitForVideoFrame(
                    panel,
                    callback,
                    attempts - 1
                );

            },
            100
        );

    }


    /* ========================================================
       RESIZE
    ======================================================== */

    let resizeTimer = null;


    window.addEventListener(
        "resize",
        () => {

            window.clearTimeout(
                resizeTimer
            );


            resizeTimer =
                window.setTimeout(
                    () => {

                        /*
                           Do not do anything if the
                           user hasn't entered a panel.
                        */

                        if (
                            currentPanel < 0
                        ) {

                            return;

                        }


                        const panel =
                            panels[currentPanel];


                        if (!panel) return;


                        /*
                           The desktop/mobile iframe
                           can change at 768px.

                           If the active viewport frame
                           hasn't loaded yet, load it.

                           Do not destroy the old Vimeo
                           player.
                        */

                        const frame =
                            getVideoFrame(panel);


                        if (!frame) return;


                        loadVideo(
                            panel,
                            true
                        );


                        /*
                           Audio focus is reapplied
                           without pausing anything.
                        */

                        if (radioOn) {

                            updateRadioForActivePanel();

                        }

                    },
                    150
                );

        }
    );

    /* ============================================================
   JEREMYJACOBLAND — X TRANSMISSIONS
   ============================================================ */

const X_TRANSMISSION_ENDPOINT = "/api/x-posts";

const X_TRANSMISSION_REFRESH =
    5 * 60 * 1000;

let xTransmissionTimer = null;
let xTransmissionLoading = false;


/* ============================================================
   GET ELEMENT
   ============================================================ */

function getXTransmission() {

    return document.getElementById(
        "xTransmission"
    );

}


/* ============================================================
   FORMAT DATE
   ============================================================ */

function formatXDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(dateString);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


/* ============================================================
   RENDER POSTS
   ============================================================ */

function renderXTransmissions(posts) {

    const container =
        getXTransmission();

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !Array.isArray(posts) ||
        posts.length === 0
    ) {

        const status =
            document.createElement(
                "div"
            );

        status.className =
            "x-transmission-status";

        status.textContent =
            "no transmissions received";

        container.appendChild(
            status
        );

        return;
    }


    posts.forEach(
        (post, index) => {

            if (
                !post ||
                !post.text
            ) {
                return;
            }


            const article =
                document.createElement(
                    "article"
                );

            article.className =
                "x-post";


            article.style.animationDelay =
                `${index * 120}ms`;


            const text =
                document.createElement(
                    "div"
                );

            text.className =
                "x-post-text";


            /*
             * textContent is intentional.
             *
             * It prevents anything contained
             * in an X post from being interpreted
             * as HTML.
             */

            text.textContent =
                post.text;


            article.appendChild(
                text
            );


            if (post.created_at) {

                const date =
                    document.createElement(
                        "div"
                    );

                date.className =
                    "x-post-date";

                date.textContent =
                    formatXDate(
                        post.created_at
                    );

                article.appendChild(
                    date
                );

            }


            container.appendChild(
                article
            );

        }
    );

}


/* ============================================================
   LOADING STATE
   ============================================================ */

function showXTransmissionLoading() {

    const container =
        getXTransmission();

    if (!container) {
        return;
    }


    container.innerHTML = "";


    const status =
        document.createElement(
            "div"
        );

    status.className =
        "x-transmission-status";

    status.textContent =
        "receiving transmission...";


    container.appendChild(
        status
    );

}


/* ============================================================
   ERROR STATE
   ============================================================ */

function showXTransmissionError() {

    const container =
        getXTransmission();

    if (!container) {
        return;
    }


    container.innerHTML = "";


    const status =
        document.createElement(
            "div"
        );

    status.className =
        "x-transmission-status";

    status.textContent =
        "transmission unavailable";


    container.appendChild(
        status
    );

}


/* ============================================================
   FETCH X POSTS
   ============================================================ */

async function loadXTransmissions() {

    if (xTransmissionLoading) {
        return;
    }


    xTransmissionLoading = true;


    try {

        const response =
            await fetch(
                X_TRANSMISSION_ENDPOINT,
                {
                    method: "GET",

                    cache: "no-store",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `X transmission request failed: ${response.status}`
            );

        }


        const data =
            await response.json();


        /*
         * Supports either:
         *
         * [
         *   { text: "..." }
         * ]
         *
         * or:
         *
         * {
         *   posts: [
         *     { text: "..." }
         *   ]
         * }
         */

        const posts =
            Array.isArray(data)
                ? data
                : data.posts;


        renderXTransmissions(
            posts || []
        );


    } catch (error) {

        console.error(
            "Jeremy Jacobland X transmission error:",
            error
        );


        showXTransmissionError();

    } finally {

        xTransmissionLoading = false;

    }

}


/* ============================================================
   START AUTOMATIC UPDATES
   ============================================================ */

function startXTransmissionUpdates() {

    if (xTransmissionTimer) {

        clearInterval(
            xTransmissionTimer
        );

    }


    /*
     * Load immediately.
     */

    loadXTransmissions();


    /*
     * Check again every five minutes.
     */

    xTransmissionTimer =
        setInterval(
            loadXTransmissions,
            X_TRANSMISSION_REFRESH
        );

}


/* ============================================================
   INITIALIZE
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        startXTransmissionUpdates();

    }
);

    /* ========================================================
       INITIALIZATION
    ======================================================== */

    updateAudioButton();

    setInitialPanels();

    setupVideoPlayButtons();

    initializeLoadingScreen();


    /*
       Preload the first video iframe so that it
       is ready when the visitor reaches it.

       IMPORTANT:
       This only loads the iframe.
       It does NOT start playback.
    */

    const firstVideoPanel =
        panels.find(
            panel =>
                getVideoFrame(panel)
        );


    if (firstVideoPanel) {

        loadVideo(
            firstVideoPanel,
            false
        );

    }


    /*
       Make the first panel available when
       navigation begins.
    */

});