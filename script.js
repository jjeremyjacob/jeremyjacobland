document.addEventListener("DOMContentLoaded", () => {

    const panels = document.querySelectorAll(".panel");
    const totalPanels = panels.length;

    // Controls how much scrolling each panel requires
    // 1 = normal speed
    // 2 = cinematic
    // 2.5 = slow
    // 3 = very slow
    const SCROLL_FACTOR = 3;

    const vh = window.innerHeight;
    const scrollDistance = vh * SCROLL_FACTOR;

    // Create scrolling space
    document.body.style.height = `${totalPanels * SCROLL_FACTOR * 100}vh`;


    // Initial state:
    // First panel visible, all others above viewport
    panels.forEach((panel, index) => {

        if (index === 0) {
            panel.style.transform = "translateY(0)";
        } else {
            panel.style.transform = "translateY(-100%)";
        }

    });


    function updatePanels() {

        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const distance = viewportHeight * SCROLL_FACTOR;


        panels.forEach((panel, index) => {

            // First panel stays fixed
            if (index === 0) {
                return;
            }


            // Each panel gets its own scrolling window
            const start = (index - 1) * distance;

            let progress = (scrollY - start) / distance;


            // Keep between 0 and 1
            progress = Math.max(0, Math.min(progress, 1));


            // Move from above viewport (-100%)
            // to fully visible (0%)
            const translateY = -100 + (progress * 100);


            panel.style.transform = `translateY(${translateY}%)`;

        });

    }


    // Initial calculation
    updatePanels();


    // Scroll updates
    window.addEventListener("scroll", updatePanels, {
        passive: true
    });


    // Recalculate if browser size changes
    window.addEventListener("resize", () => {

        updatePanels();

    });


});