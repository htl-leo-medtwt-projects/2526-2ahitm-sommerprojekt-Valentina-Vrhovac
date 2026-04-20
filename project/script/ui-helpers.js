function show(element) {
  if (element) {
    element.classList.remove("hidden");
    if (element.id === "game-screen" || element.id === "menu-screen" || element.id === "settings-screen" || element.id === "loading-screen") {
      document.body.style.overflow = "hidden";
    }
  }
}

function hide(element) {
  if (element) {
    element.classList.add("hidden");
    let gameScreen = document.getElementById("game-screen");
    let menuScreen = document.getElementById("menu-screen");
    let settingsScreen = document.getElementById("settings-screen");
    let loadingScreen = document.getElementById("loading-screen");

    if ((gameScreen && gameScreen.classList.contains("hidden")) &&
      (menuScreen && menuScreen.classList.contains("hidden")) &&
      (settingsScreen && settingsScreen.classList.contains("hidden")) &&
      (loadingScreen && loadingScreen.classList.contains("hidden"))) {
      document.body.style.overflow = "auto";
    }
  }
}

function toggle(element, className, condition) {
  if (element) {
    if (condition) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }
}