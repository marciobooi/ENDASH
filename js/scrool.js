// $(document).ready(function () {
//     // Function to perform a custom smooth scroll animation
//     function customSmoothScroll(targetY, duration) {
//         const startingY = window.scrollY;
//         const diff = targetY - startingY;
//         let start;

//         // Animation function
//         function step(timestamp) {
//             if (!start) start = timestamp;
//             const time = timestamp - start;
//             const percent = Math.min(time / duration, 1);
//             window.scrollTo(0, startingY + diff * percent);

//             if (time < duration) {
//                 requestAnimationFrame(step);
//             }
//         }

//         // Start the animation
//         requestAnimationFrame(step);
//     }

//     // Adjust this value to set the desired scroll amount in pixels
//     const scrollAmount = 379;

//     // Add an event listener to the '.flex-container' element
//     const flexContainer = document.querySelector('.flex-container');
//     if (flexContainer) {
//         flexContainer.addEventListener('mouseenter', () => {
//             // When the mouse enters the '.flex-container', apply smooth scroll
//             flexContainer.addEventListener('wheel', onWheel, { passive: false });
//         });

//         flexContainer.addEventListener('mouseleave', () => {
//             // When the mouse leaves the '.flex-container', remove smooth scroll
//             flexContainer.removeEventListener('wheel', onWheel);
//         });
//     }

//     // Function to handle mouse wheel events
//     function onWheel(e) {
//         e.preventDefault();

//         const currentScroll = window.scrollY;
//         const newScroll = currentScroll + (e.deltaY > 0 ? scrollAmount : -scrollAmount);

//         customSmoothScroll(newScroll, 200); // 1 second duration for smooth scroll
//     }
// });
