/* ============================================
ELEMENTS
   ============================================ */

const menuBtn = document.querySelector(".menu");
const menuScreen = document.getElementById("menu-screen");
const homeBtn = document.getElementById("home-btn");
const settingsBtn = document.querySelector(".menu-panel .left-ui .ui-btn");


/* ============================================
MENU SCREEN
   ============================================ */

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        show(menuScreen);
    });
}

if (menuScreen) {
    menuScreen.addEventListener("click", (event) => {
        if (event.target == menuScreen) {
            hide(menuScreen);
        }
    });
}

if (homeBtn) {
    homeBtn.addEventListener("click", () => {
        hide(menuScreen)
    });
}
