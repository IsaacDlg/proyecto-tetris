let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const minSwipeDistance = 30; // Minimum distance for a swipe
const maxTapDistance = 10;   // Maximum distance for a tap

document.addEventListener('touchstart', e => {
    // Ignore touches on controls/buttons to prevent conflict
    if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'INPUT') return;

    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: false });

document.addEventListener('touchend', e => {
    // Ignore touches on controls/buttons
    if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'INPUT') return;

    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleGesture();
}, { passive: false });

// Prevent default touch behavior to avoid scrolling/zooming while playing
document.addEventListener('touchmove', e => {
    if (e.target.closest('.game-container')) {
        e.preventDefault();
    }
}, { passive: false });

function handleGesture() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);

    if (absDiffX < maxTapDistance && absDiffY < maxTapDistance) {
        // Tap -> Rotate (ArrowUp)
        dispatchKey('ArrowUp');
    } else if (absDiffX > absDiffY) {
        // Horizontal Swipe
        if (absDiffX > minSwipeDistance) {
            if (diffX > 0) {
                // Swipe Right
                dispatchKey('ArrowRight');
            } else {
                // Swipe Left
                dispatchKey('ArrowLeft');
            }
        }
    } else {
        // Vertical Swipe
        if (absDiffY > minSwipeDistance) {
            if (diffY > 0) {
                // Swipe Down -> Drop (ArrowDown)
                dispatchKey('ArrowDown');
            } else {
                // Swipe Up -> Hard Drop? Or nothing for now.
                // Maybe Rotate as well? Let's stick to nothing or maybe rotate if user prefers.
                // For now, let's map Up Swipe to Rotate too, just in case.
                dispatchKey('ArrowUp');
            }
        }
    }
}

function dispatchKey(key) {
    const event = new KeyboardEvent('keydown', {
        key: key,
        code: key,
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(event);
}


