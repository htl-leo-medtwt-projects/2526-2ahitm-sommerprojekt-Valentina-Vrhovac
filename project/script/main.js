/* ============================================
   ELEMENTS
   ============================================ */
const menuBtn = document.querySelector(".menu");
const menuScreen = document.getElementById("menu-screen");
const homeBtn = document.getElementById("home-btn");
const settingsBtn = document.querySelector(".menu-panel .left-ui .ui-btn");

const settingsScreen = document.getElementById("settings-screen");
const settingsBg = document.querySelector(".settings-bg");
const homeSettingsBtn = document.querySelector(".home-settings");
const resetBtn = document.querySelector(".reset-btn");

const loadingScreen = document.getElementById("loading-screen");
const openCafeBtn = document.getElementById("open-cafe-btn");

const gameScreen = document.getElementById("game-screen");
const gameSettingsBtn = gameScreen.querySelector(".left-ui .ui-btn:first-child");
const gameHomeBtn = gameScreen.querySelector(".left-ui .ui-btn:last-child");


/* ============================================
   MENU SCREEN
   ============================================ */
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    currentIndex = 0;
    updateBook();
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
    hide(menuScreen);
  });
}

if (settingsBtn) {
  settingsBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    hide(menuScreen);
    show(settingsScreen);
  });
}


/* ============================================
   SETTINGS SCREEN
   ============================================ */
if (settingsScreen) {
  settingsScreen.addEventListener("click", (event) => {
    if (event.target == settingsBg) {
      hide(settingsScreen);
    }
  });
}

if (homeSettingsBtn) {
  homeSettingsBtn.addEventListener("click", () => {
    hide(settingsScreen);
  });
}

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    let musicSlider = document.querySelector(".music-slider");
    let soundSlider = document.querySelector(".sound-slider");
    let musicStrawberry = document.querySelector(".music-strawberry");
    let soundStrawberry = document.querySelector(".sound-strawberry");
    
    if (musicSlider) musicSlider.value = 50;
    if (soundSlider) soundSlider.value = 50;
    
    updateAllSliders();
    if (musicStrawberry && musicSlider) updateStrawberryPosition(musicStrawberry, musicSlider);
    if (soundStrawberry && soundSlider) updateStrawberryPosition(soundStrawberry, soundSlider);
  });
}

/* ============================================
   GAME SCREEN
   ============================================ */
if (openCafeBtn) {
  openCafeBtn.addEventListener("click", () => {
    show(loadingScreen);
    
    setTimeout(() => {
      hide(loadingScreen);
      show(gameScreen);
    }, 3000);
  });
}

if (gameSettingsBtn) {
  gameSettingsBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    hide(gameScreen);
    show(settingsScreen);
  });
}

if (gameHomeBtn) {
  gameHomeBtn.addEventListener("click", () => {
    hide(gameScreen);
  });
}

initMenuBook();
initSliders();
initStrawberries();