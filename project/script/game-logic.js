// ========================================
// GAME LOGIC  (ORDERS, COINS, LEVELS)
// ========================================

const levelRequirements = {
  1: 0,
  2: 20,
  3: 50,
  4: 100,
  5: 150
};

let playerCoins = 0;
let unlockedLevels = [1];
let currentOrder = null;
let currentGameType = null;

function initializeGame() {
  loadCoins();
  loadUnlockedLevels();
  if (!isLevelUnlocked(1)) {
    unlockedLevels.push(1);
    saveUnlockedLevels();
  }
  checkLevelUnlocks();
  updateCoinDisplay();
}

// ========================================
// COIN MANAGEMENT
// ========================================

function loadCoins() {
  const saved = localStorage.getItem("playerCoins");
  if (saved) {
    playerCoins = Number(saved);
  } else {
    playerCoins = 0;
  }
  if (Number.isNaN(playerCoins)) playerCoins = 0;
}

function saveCoins() {
  localStorage.setItem("playerCoins", String(playerCoins));
}

function addCoins(amount) {
  playerCoins += Number(amount) || 0;
  playerCoins = Math.round(playerCoins * 100) / 100;
  saveCoins();
  checkLevelUnlocks();
  updateCoinDisplay();
}

function getCoins() {
  return playerCoins;
}

// ========================================
// LEVEL MANAGEMENT
// ========================================

function loadUnlockedLevels() {
  const saved = localStorage.getItem("unlockedLevels");
  if (!saved) {
    unlockedLevels = [1];
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      unlockedLevels = parsed;
    } else {
      unlockedLevels = [1];
    }
  } catch {
    unlockedLevels = [1];
  }
}

function saveUnlockedLevels() {
  localStorage.setItem("unlockedLevels", JSON.stringify(unlockedLevels));
}

function isLevelUnlocked(levelId) {
  return unlockedLevels.includes(levelId);
}

function checkLevelUnlocks() {
  for (let levelId = 1; levelId <= 5; levelId++) {
    const requiredCoins = levelRequirements[levelId];
    if (playerCoins >= requiredCoins && !isLevelUnlocked(levelId)) {
      unlockedLevels.push(levelId);
      showLevelUnlockEffect(levelId);
    }
  }
  unlockedLevels.sort((a, b) => a - b);
  saveUnlockedLevels();
}

function showLevelUnlockEffect(levelId) {
  const levelBtn = document.querySelector(`[data-level="${levelId}"]`);
  if (levelBtn) {
    levelBtn.style.animation = "level-unlock-glow 0.6s ease-out";

    const notification = document.createElement("div");
    notification.style.position = "fixed";
    notification.style.top = "50%";
    notification.style.left = "50%";
    notification.style.transform = "translate(-50%, -50%)";
    notification.style.background = "linear-gradient(135deg, #FFD700, #FFA500)";
    notification.style.color = "white";
    notification.style.padding = "2rem 3rem";
    notification.style.borderRadius = "15px";
    notification.style.fontSize = "1.8rem";
    notification.style.fontWeight = "bold";
    notification.style.zIndex = "9999";
    notification.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
    notification.style.animation = "unlock-pop 0.5s ease-out";
    notification.textContent = `🌟 Level ${levelId} Unlocked! 🌟`;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
}

function getCurrentLevel() {
  let currentLevel = 1;
  for (let levelId = 5; levelId >= 1; levelId--) {
    if (isLevelUnlocked(levelId)) {
      currentLevel = levelId;
      break;
    }
  }
  return currentLevel;
}

function updateCoinDisplay() {
  const coins = Math.round(playerCoins * 100) / 100;
  safeText("menu-coins-text", coins);
  safeText("game-coins-text", coins);
  updateLevelDisplay();
  if (typeof updateLocks === "function") {
    updateLocks();
  }
}

function updateLevelDisplay() {
  const currentLevel = getCurrentLevel();

  const menuLevelText = document.getElementById("menu-level-text");
  const gameLevelText = document.getElementById("game-level-text");

  if (menuLevelText) {
    menuLevelText.textContent = "Level " + currentLevel;
    const img = menuLevelText.parentElement.querySelector("img");
    if (img) {
      img.src = "images/level" + currentLevel + ".png";
    }
  }

  if (gameLevelText) {
    gameLevelText.textContent = "Level " + currentLevel;
    const img = gameLevelText.parentElement.querySelector("img");
    if (img) {
      img.src = "images/level" + currentLevel + ".png";
    }
  }
}

function getItemLevel(itemId) {
  for (const section of menu.sections) {
    for (const item of section.items) {
      if (item.id === itemId) {
        return section.level;
      }
    }
  }
  return 1;
}

function getItemGameType(itemId) {
  for (const section of menu.sections) {
    for (const item of section.items) {
      if (item.id === itemId) {
        return item.gameType;
      }
    }
  }
  return "locked";
}

function getAvailableOrders() {
  if (typeof orders === "undefined") {
    return [];
  }

  return orders.filter(order => {
    const itemLevel = getItemLevel(order.itemId);
    const gameType = getItemGameType(order.itemId);

    return isLevelUnlocked(itemLevel) && (gameType === "tea" || gameType === "matcha");
  });
}

function getRandomOrder() {
  const availableOrders = getAvailableOrders();
  if (availableOrders.length === 0) {
    return null;
  }
  return availableOrders[Math.floor(Math.random() * availableOrders.length)];
}

function showNextOrder() {
  removeMiniGames();

  const catImg = document.querySelector(".game-cat");
  const orderDialog = document.getElementById("order-dialog");
  const btn = document.getElementById("lets-make-it-btn");

  show(catImg);
  show(orderDialog);
  show(btn);

  currentOrder = getRandomOrder();

  if (!currentOrder) {
    currentGameType = null;
    safeText("order-text", "No orders are available right now.");
    return;
  }

  currentGameType = getItemGameType(currentOrder.itemId);
  safeText("order-text", currentOrder.text);
}

function startGame() {
  if (!currentOrder) {
    showNextOrder();
  }

  if (currentGameType === "tea") {
    startTeaGame();
  } else if (currentGameType === "matcha") {
    startMatchaGame();
  } else {
    alert("This order is not playable yet.");
    showNextOrder();
  }
}

// ========================================
// GAME COMPLETION
// ========================================

function handleDrinkCompletion(isCorrect, drinkPrice) {
  let earnedCoins = 0;

  if (isCorrect) {
    earnedCoins = drinkPrice;
  } else {
    if (Math.random() < 0.5) {
      earnedCoins = 0;
    } else {
      earnedCoins = drinkPrice / 2;
    }
  }

  earnedCoins = Math.round(earnedCoins * 100) / 100;
  addCoins(earnedCoins);

  return {
    isCorrect,
    earnedCoins,
    totalCoins: playerCoins
  };
}

function resetProgress() {
  localStorage.removeItem("playerCoins");
  localStorage.removeItem("unlockedLevels");
  playerCoins = 0;
  unlockedLevels = [1];
  saveUnlockedLevels();
  saveCoins();
  updateCoinDisplay();
  showNextOrder();
}

function removeMiniGames() {
  const teaGame = document.getElementById("tea-making");
  const matchaGame = document.getElementById("matcha-game-container");
  if (teaGame) {
    teaGame.remove();
  }
  if (matchaGame) {
    matchaGame.remove();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeGame();

  const makeBtn = document.getElementById("lets-make-it-btn");
  if (makeBtn) {
    makeBtn.addEventListener("click", startGame);
  }

  showNextOrder();
});