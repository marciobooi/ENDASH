document.addEventListener("DOMContentLoaded", function () {
    const scrollAmount = 379;
    const duration = 300;

    let rafId = null;
    let targetY = window.scrollY;

    function smoothScrollTo(newTarget) {
        // Accumulate target — don't restart from current position on each wheel tick
        targetY = Math.max(0, newTarget);

        if (rafId) {
            cancelAnimationFrame(rafId);
        }

        const startY = window.scrollY;
        const diff = targetY - startY;
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic for natural deceleration
            const ease = 1 - Math.pow(1 - progress, 3);
            window.scrollTo(0, startY + diff * ease);

            if (progress < 1) {
                rafId = requestAnimationFrame(step);
            } else {
                rafId = null;
            }
        }

        rafId = requestAnimationFrame(step);
    }

    function onWheel(e) {
        e.preventDefault();
        // Accumulate from current targetY, not window.scrollY, to avoid stutter on fast scrolling
        targetY = targetY + (e.deltaY > 0 ? scrollAmount : -scrollAmount);
        smoothScrollTo(targetY);
    }

    const flexContainer = document.querySelector('.flex-container');
    if (flexContainer) {
        flexContainer.addEventListener('mouseenter', () => {
            flexContainer.addEventListener('wheel', onWheel, { passive: false });
        });

        flexContainer.addEventListener('mouseleave', () => {
            flexContainer.removeEventListener('wheel', onWheel);
        });
    }
});
