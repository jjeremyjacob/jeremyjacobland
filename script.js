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
       RANDOMIZED TYPOGRAPHY
       ======================================================== */

   function createRandomLetter(character) {

    const letter =
        document.createElement("span");

    letter.className =
        "random-letter";

    letter.textContent =
        character;


    /* ====================================================
       RANDOM POSITION
       ==================================================== */

    letter.style.setProperty(
        "--random-x",
        `${(-1.5 + Math.random() * 3).toFixed(2)}px`
    );

    letter.style.setProperty(
        "--random-y",
        `${(-1.5 + Math.random() * 3).toFixed(2)}px`
    );


    /* ====================================================
       RANDOM SCALE
       ==================================================== */

    letter.style.setProperty(
        "--random-x-scale",
        (
            0.88 +
            Math.random() * 0.24
        ).toFixed(3)
    );

    letter.style.setProperty(
        "--random-y-scale",
        (
            0.90 +
            Math.random() * 0.20
        ).toFixed(3)
    );


    /* ====================================================
       RANDOM ROTATION
       ==================================================== */

    letter.style.setProperty(
        "--random-rotate",
        `${(
            -2.5 +
            Math.random() * 5
        ).toFixed(2)}deg`
    );


    /* ====================================================
       RANDOM OPACITY
       ==================================================== */

    letter.style.setProperty(
        "--random-opacity",
        (
            0.78 +
            Math.random() * 0.22
        ).toFixed(2)
    );


    return letter;

}


    function randomizeElementText(
        element,
        text
    ) {

        if (!element) return;

        element.textContent = "";

        const fragment =
            document.createDocumentFragment();

        Array.from(text).forEach(
            character => {

                if (/\s/.test(character)) {

                    fragment.appendChild(
                        document.createTextNode(
                            character
                        )
                    );

                    return;

                }

                fragment.appendChild(
                    createRandomLetter(
                        character
                    )
                );

            }
        );

        element.appendChild(
            fragment
        );

    }


    function randomizeAllText() {

        const excludedSelectors = [
            "script",
            "style",
            "noscript",
            "iframe",
            "video",
            "audio"
        ];

        const excluded =
            excludedSelectors.join(",");

        const walker =
            document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode(node) {

                        if (
                            !node.nodeValue.trim()
                        ) {

                            return NodeFilter.FILTER_REJECT;

                        }

                        if (
                            node.parentElement &&
                            node.parentElement.closest(
                                excluded
                            )
                        ) {

                            return NodeFilter.FILTER_REJECT;

                        }

                        if (
                            node.parentElement &&
                            node.parentElement.closest(
                                ".random-letter"
                            )
                        ) {

                            return NodeFilter.FILTER_REJECT;

                        }

                        return NodeFilter.FILTER_ACCEPT;

                    }
                }
            );

        const textNodes = [];

        let node;

        while (
            (node = walker.nextNode())
        ) {

            textNodes.push(node);

        }


        textNodes.forEach(
            textNode => {

                const text =
                    textNode.nodeValue;

                const fragment =
                    document.createDocumentFragment();

                Array.from(text).forEach(
                    character => {

                        if (/\s/.test(character)) {

                            fragment.appendChild(
                                document.createTextNode(
                                    character
                                )
                            );

                            return;

                        }

                        fragment.appendChild(
                            createRandomLetter(
                                character
                            )
                        );

                    }
                );

                textNode.parentNode.replaceChild(
                    fragment,
                    textNode
                );

            }
        );

    }




    /* ========================================================
       STATE
       ======================================================== */

    let currentPanel = 0;

    let navigationLocked = false;

    const PANEL_TRANSITION = 900;

    let radioOn = false;

    let activeAudioPanel = null;

    const vimeoPlayers =
        new Map();


    /* ========================================================
       LOADING SCREEN
       ======================================================== */

    function hideLoadingScreen() {

        if (!loadingScreen) return;

        loadingScreen.style.transition =
            "transform 1800ms ease-in-out";

        loadingScreen.style.transform =
            "translate3d(0, -120dvh, 0)";

        window.setTimeout(
            () => {

                loadingScreen.style.display =
                    "none";

            },
            1800
        );

    }


    function initializeLoadingScreen() {

        if (!loadingScreen) return;

        loadingScreen.style.transform =
            "translate3d(0, 0, 0)";

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
       PLAY / PAUSE BUTTONS
       ======================================================== */

    function setupVideoPlayButtons() {

        const buttons =
            document.querySelectorAll(
                ".video-play-button"
            );


        buttons.forEach(
            button => {

                randomizeElementText(
                    button,
                    "let's play"
                );

                button.setAttribute(
                    "aria-label",
                    "Play video"
                );


                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();


                        const panel =
                            button.closest(
                                ".panel"
                            );


                        if (!panel) return;


                        const frame =
                            loadVideo(
                                panel
                            );


                        if (!frame) return;


                        const player =
                            getVimeoPlayer(
                                frame
                            );


                        if (!player) return;


                        player.getPaused()
                            .then(
                                paused => {

                                    if (paused) {

                                        player.play()
                                            .then(
                                                () => {

                                                    randomizeElementText(
                                                        button,
                                                        "pause"
                                                    );

                                                    button.setAttribute(
                                                        "aria-label",
                                                        "Pause video"
                                                    );

                                                }
                                            )
                                            .catch(
                                                () => {

                                                    randomizeElementText(
                                                        button,
                                                        "play"
                                                    );

                                                    button.setAttribute(
                                                        "aria-label",
                                                        "Play video"
                                                    );

                                                }
                                            );

                                    } else {

                                        player.pause()
                                            .then(
                                                () => {

                                                    randomizeElementText(
                                                        button,
                                                        "play"
                                                    );

                                                    button.setAttribute(
                                                        "aria-label",
                                                        "Play video"
                                                    );

                                                }
                                            )
                                            .catch(
                                                () => {

                                                    randomizeElementText(
                                                        button,
                                                        "play"
                                                    );

                                                    button.setAttribute(
                                                        "aria-label",
                                                        "Play video"
                                                    );

                                                }
                                            );

                                    }

                                }
                            )
                            .catch(
                                () => {

                                    randomizeElementText(
                                        button,
                                        "play"
                                    );

                                    button.setAttribute(
                                        "aria-label",
                                        "Play video"
                                    );

                                }
                            );

                    }
                );

            }
        );

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


                if (index === 0) {

                    panel.style.transform =
                        "translate3d(0, 0, 0)";

                    panel.style.zIndex =
                        "2";

                    panel.classList.add(
                        "is-visible"
                    );

                } else {

                    panel.style.transform =
                        "translate3d(0, -100dvh, 0)";

                    panel.style.zIndex =
                        "1";

                }

            }
        );


        currentPanel = 0;

        updateLayerNavigation();

        preparePanel(0);

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


        void targetPanel.offsetHeight;


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

        preparePanel(
            targetIndex
        );

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


        randomizeElementText(
            audioToggle,
            "audio"
        );

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
            getVideoFrame(
                panel
            );


        if (!frame) {

            muteAllPanelVideos();

            return;

        }


        loadVideo(
            panel,
            true
        );


        const player =
            getVimeoPlayer(
                frame
            );


        if (!player) {

            muteAllPanelVideos();

            return;

        }


        vimeoPlayers.forEach(
            otherPlayer => {

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
       KEYBOARD NAVIGATION
       ======================================================== */

    document.addEventListener(
        "keydown",
        event => {

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


        randomizeElementText(
            machineChatter,
            message
        );


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
            getVideoFrame(
                panel
            );


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

                        if (
                            currentPanel < 0
                        ) {

                            return;

                        }


                        const panel =
                            panels[currentPanel];


                        if (!panel) return;


                        const frame =
                            getVideoFrame(
                                panel
                            );


                        if (!frame) return;


                        loadVideo(
                            panel,
                            true
                        );


                        if (radioOn) {

                            updateRadioForActivePanel();

                        }

                    },
                    150
                );

        }
    );


    /* ========================================================
       INITIALIZATION
       ======================================================== */

    randomizeAllText();

    updateAudioButton();

    setInitialPanels();

    setupVideoPlayButtons();

    initializeLoadingScreen();


    /* ========================================================
       PRELOAD FIRST VIDEO
       ======================================================== */

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


});