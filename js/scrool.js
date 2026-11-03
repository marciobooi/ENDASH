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

    // The gallery is now split into one .flex-container per themed section
    // (see THEME_SECTIONS), not a single one - wire this up on all of them.
    document.querySelectorAll('.flex-container').forEach((flexContainer) => {
        flexContainer.addEventListener('mouseenter', () => {
            flexContainer.addEventListener('wheel', onWheel, { passive: false });
        });

        flexContainer.addEventListener('mouseleave', () => {
            flexContainer.removeEventListener('wheel', onWheel);
        });
    });

    // #toTop lives outside both the tool's #page and the accessibility
    // statement's #accessibilityView, so one button/listener covers both -
    // whichever is visible, scrolling the real page is all it needs to do.
    const toTopBtn = document.getElementById('toTop');
    if (toTopBtn) {
        const SHOW_AFTER_PX = 400;
        const updateToTopVisibility = () => {
            toTopBtn.classList.toggle('show', window.scrollY > SHOW_AFTER_PX);
        };
        updateToTopVisibility();
        window.addEventListener('scroll', updateToTopVisibility, { passive: true });
    }
});

function topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
