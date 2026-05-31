/* ============================================
   MAIN UI
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof SoundDesign !== "undefined") {
    SoundDesign.prepareAutostart();
  }

  const menuBtn = document.querySelector(".menu");
  const menuScreen = document.getElementById("menu-screen");
  const homeBtn = document.getElementById("home-btn");
  const settingsBtn = document.getElementById("menu-settings-btn");

  const settingsScreen = document.getElementById("settings-screen");
  const backSettingsBtn = document.querySelector(".back-settings");
  const resetBtn = document.querySelector(".reset-btn");

  const loadingScreen = document.getElementById("loading-screen");
  const openCafeBtn = document.getElementById("open-cafe-btn");

  const gameScreen = document.getElementById("game-screen");
  const gameSettingsBtn = document.getElementById("game-settings-btn");
  const gameHomeBtn = document.getElementById("game-home-btn");

  let previousScreen = null;

  document.addEventListener("click", event => {
    const clickable = event.target.closest("button, .menu, .image-choice, .tea-select-btn, .page-img, .arrow");
    if (clickable) {
      playSound("button", { volume: 0.45 });
    }
  });

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      currentIndex = 0;
      updateBook();
      playSound("menuOpen");
      show(menuScreen);
    });
  }

  const menuBg = document.querySelector(".menu-bg");
  if (menuBg) {
    menuBg.addEventListener("click", () => {
      playSound("menuClose");
      hide(menuScreen);
    });
  }

  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      playSound("menuClose");
      hide(menuScreen);
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      previousScreen = "menu";
      hide(menuScreen);
      playSound("popup");
      show(settingsScreen);
    });
  }

  const settingsBg = document.querySelector(".settings-bg");
  if (settingsBg) {
    settingsBg.addEventListener("click", () => {
      playSound("menuClose");
      hide(settingsScreen);
    });
  }

  if (backSettingsBtn) {
    backSettingsBtn.addEventListener("click", () => {
      hide(settingsScreen);

      if (previousScreen === "game") {
        show(gameScreen);
      }
      if (previousScreen === "menu") {
        show(menuScreen);
      }

      previousScreen = null;
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const musicSlider = document.querySelector(".music-slider");
      const soundSlider = document.querySelector(".sound-slider");
      const musicStrawberry = document.querySelector(".music-strawberry");
      const soundStrawberry = document.querySelector(".sound-strawberry");

      if (musicSlider) {
        musicSlider.value = 50;
      }
      if (soundSlider) {
        soundSlider.value = 50;
      }

      updateAllSliders();
      updateStrawberryPosition(musicStrawberry, musicSlider);
      updateStrawberryPosition(soundStrawberry, soundSlider);

      if (typeof SoundDesign !== "undefined") {
        SoundDesign.setMusicVolume(0.5);
        SoundDesign.setSoundVolume(0.5);
        SoundDesign.startMusic();
      }
    });
  }

  if (openCafeBtn) {
    openCafeBtn.addEventListener("click", () => {
      startBackgroundMusic();
      playSound("menuOpen");
      show(loadingScreen);

      setTimeout(() => {
        hide(loadingScreen);
        show(gameScreen);
        removeMiniGames();
        showNextOrder();
      }, 1200);
    });
  }

  if (gameSettingsBtn) {
    gameSettingsBtn.addEventListener("click", () => {
      previousScreen = "game";
      hide(gameScreen);
      playSound("popup");
      show(settingsScreen);
    });
  }

  if (gameHomeBtn) {
    gameHomeBtn.addEventListener("click", () => {
      removeMiniGames();
      playSound("guestLeave");
      hide(gameScreen);
    });
  }

  initMenuBook();
  initSliders();
  initStrawberries();

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false
    });
  }
});