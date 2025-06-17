const openBtn = document.querySelector('.open-btn');
const closeDrawerBtn = document.querySelector('.close-drawer-btn');
const closeBtn = document.querySelector('.close-btn');
const drawer = document.querySelector('.drawer');
const resizer = document.querySelector('.resizer');
const backdrop = document.querySelector('.backdrop');

function updateBackdrop() {
    const backdropToggle = document.getElementById('backdrop-toggle');
    if (backdropToggle.checked && drawer.classList.contains('open')) {
        backdrop.classList.add('visible');
    } else {
        backdrop.classList.remove('visible');
    }
}

function openDrawer() {
    drawer.classList.add('open');
    updateBackdrop();
}

function closeDrawer() {
    drawer.classList.remove('open');
    drawer.style.width = ''; // Reset width to default
    updateBackdrop();
}

openBtn.addEventListener('click', () => {
    openDrawer();
});

closeDrawerBtn.addEventListener('click', () => {
    closeDrawer();
});

closeBtn.addEventListener('click', () => {
    closeDrawer();
});

backdrop.addEventListener('click', () => {
    closeDrawer();
});

drawer.addEventListener('click', (e) => {
    if (e.target === drawer && !drawer.classList.contains('open')) {
        openDrawer();
    }
});

// --- Default Width Settings ---
const widthInput = document.getElementById('default-width');
const setWidthBtn = document.querySelector('.set-width-btn');

setWidthBtn.addEventListener('click', () => {
    const newWidth = widthInput.value;
    if (newWidth) {
        drawer.style.setProperty('--drawer-width', `${newWidth}px`);
    }
});

// --- Backdrop Toggle ---
const backdropToggle = document.getElementById('backdrop-toggle');
backdropToggle.addEventListener('change', updateBackdrop);

// --- Breakpoint Settings ---
const breakpointInput = document.getElementById('breakpoint');
let breakpoint = parseInt(breakpointInput.value, 10);

function checkBreakpoint() {
    if (window.innerWidth < breakpoint) {
        drawer.classList.add('full-width-overlay');
    } else {
        drawer.classList.remove('full-width-overlay');
    }
}

breakpointInput.addEventListener('change', (e) => {
    breakpoint = parseInt(e.target.value, 10);
    checkBreakpoint();
});

window.addEventListener('resize', checkBreakpoint);
// Initial check
checkBreakpoint();

// --- Dismissal Settings ---
const dismissRadios = document.querySelectorAll('input[name="dismiss-mode"]');

function setDismissedWidth(width) {
    if (width > 0) {
        drawer.style.setProperty('--drawer-closed-transform', `translateX(calc(100% - ${width}px))`);
        drawer.classList.add('is-partially-dismissible');
    } else {
        drawer.style.setProperty('--drawer-closed-transform', 'translateX(100%)');
        drawer.classList.remove('is-partially-dismissible');
    }
}

dismissRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        setDismissedWidth(parseInt(e.target.value, 10));
    });
});

// Initial setup on load
const initialDismissMode = document.querySelector('input[name="dismiss-mode"]:checked');
if (initialDismissMode) {
    setDismissedWidth(parseInt(initialDismissMode.value, 10));
}

let isResizing = false;

resizer.addEventListener('mousedown', (e) => {
    if (!drawer.classList.contains('open')) {
        openDrawer();
    }
    isResizing = true;
    document.body.classList.add('is-resizing');
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => {
        isResizing = false;
        document.body.classList.remove('is-resizing');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', arguments.callee);
    });
});

function handleMouseMove(e) {
    if (!isResizing) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 200 && newWidth < 800) { // Min and max width
        drawer.style.width = `${newWidth}px`;
    }
} 