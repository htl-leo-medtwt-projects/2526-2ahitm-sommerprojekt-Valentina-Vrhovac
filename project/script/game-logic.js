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
const guestImages = ["images/cat.png", "images/bunny.png", "images/bear.png", "images/dog.png"];

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
    let requiredCoins = levelRequirements[levelId];
    if (playerCoins >= requiredCoins && !isLevelUnlocked(levelId)) {
      unlockedLevels.push(levelId);
      showLevelUnlockEffect(levelId);
    }
  }
  unlockedLevels.sort((a, b) => a - b);
  saveUnlockedLevels();
}

function showLevelUnlockEffect(levelId) {
  const old = document.querySelector(".level-up-popup");
  if (old) old.remove();

  const notification = document.createElement("div");
  notification.className = "level-up-popup";
  notification.innerHTML = `
    <div class="level-up-inner">
      <div class="level-up-sparkles">✦ ✨ ✦</div>
      <img src="images/level${levelId}.png" alt="Level ${levelId}">
      <h2>LEVEL UP!</h2>
      <p>Level ${levelId} unlocked</p>
    </div>
  `;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add("show"), 20);
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 2800);
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
  let currentLevel = getCurrentLevel();

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
    let itemLevel = getItemLevel(order.itemId);
    let gameType = getItemGameType(order.itemId);

    return isLevelUnlocked(itemLevel) && gameType !== "locked";
  });
}

function getRandomOrder() {
  let availableOrders = getAvailableOrders();
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
  if (catImg) {
    let guest = guestImages[Math.floor(Math.random() * guestImages.length)];
    catImg.src = guest;
  }
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
  } else if (currentGameType === "coffee") {
    startCoffeeGame();
  } else if (currentGameType === "cake") {
    startCakeGame();
  } else if (currentGameType === "toast") {
    startToastGame();
  } else {
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
  const ids = ["tea-making", "matcha-game-container", "coffee-game-container", "cake-game-container", "toast-game-container"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeGame();

  const makeBtn = document.getElementById("lets-make-it-btn");
  if (makeBtn) {
    makeBtn.addEventListener("click", startGame);
  }

  showNextOrder();
});

function setupSimpleDrop(sourceId, targetId, onDrop) {
  const source = document.getElementById(sourceId);
  const target = document.getElementById(targetId);

  if (!source || !target) {
    return;
  }

  source.addEventListener("dragstart", event => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", sourceId);
    source.classList.add("dragging");
  });

  source.addEventListener("dragend", () => {
    source.classList.remove("dragging");
  });

  target.addEventListener("dragover", event => {
    event.preventDefault();
    target.classList.add("drop-hover");
  });

  target.addEventListener("dragleave", () => {
    target.classList.remove("drop-hover");
  });

  target.addEventListener("drop", event => {
    event.preventDefault();
    target.classList.remove("drop-hover");
    onDrop();
  });
}

function showRatingPopup(result, isCorrect, label, emoji = "🍓") {
  let coins = Math.round(result.earnedCoins * 100) / 100;
  const msg = document.createElement("div");
  msg.className = "mini-success-message pretty-rating-message";

  let ratingText;
  if (isCorrect) {
    ratingText = "Perfect!";
  } else {
    if (coins > 0) {
      ratingText = "Good try!";
    } else {
      ratingText = "Oops!";
    }
  }

  let subText;
  if (isCorrect) {
    subText = "Order completed";
  } else {
    if (coins > 0) {
      subText = "Half coins earned";
    } else {
      subText = "No coins earned";
    }
  }

  msg.innerHTML = `
    <div class="rating-sparkles">✦ ${emoji} ✦</div>
    <strong>${ratingText}</strong>
    <span>${label}</span>
    <p>${subText}</p>
    <div class="rating-coins">+${coins} coins</div>
  `;

  document.body.appendChild(msg);
  return msg;
}

function setImageWithFallback(img, sources) {
  if (!img) {
    return;
  }

  let list;

  if (Array.isArray(sources)) {
    list = sources.filter(Boolean);
  } else {
    list = [sources].filter(Boolean);
  }

  if (list.length === 0) {
    return;
  }

  let index = 0;

  img.onerror = () => {
    index += 1;

    if (index < list.length) {
      img.src = list[index];
    }
  };

  img.src = list[0];
}

function showFinalProduct(finalImageSrc) {
  if (!finalImageSrc) {
    return null;
  }

  let sources;

  if (Array.isArray(finalImageSrc)) {
    sources = finalImageSrc.filter(Boolean);
  } else {
    sources = [finalImageSrc];
  }

  if (sources.length === 0) {
    return null;
  }

  const finalMsg = document.createElement("div");
  finalMsg.className = "final-product-popup";

  finalMsg.innerHTML = `
    <div class="final-product-card">
      <img src="${sources[0]}" alt="Finished product">
    </div>
  `;

  const img = finalMsg.querySelector("img");
  let fallbackIndex = 1;

  img.addEventListener("error", () => {
    if (fallbackIndex < sources.length) {
      img.src = sources[fallbackIndex];
      fallbackIndex++;
    }
  });

  document.body.appendChild(finalMsg);
  return finalMsg;
}

function finishMiniGame(isCorrect, price, containerId, label, emoji = "🍓", finalImageSrc = null) {
  let result = handleDrinkCompletion(isCorrect, price);
  let finalMsg = showFinalProduct(finalImageSrc);

  let delay;

  if (finalImageSrc) {
    delay = 900;
  } else {
    delay = 0;
  }

  setTimeout(() => {
    if (finalMsg) {
      finalMsg.remove();
    }

    let msg = showRatingPopup(result, isCorrect, label, emoji);

    setTimeout(() => {
      msg.remove();

      const container = document.getElementById(containerId);

      if (container) {
        container.remove();
      }

      showNextOrder();
    }, 1900);
  }, delay);
}

document.addEventListener("DOMContentLoaded", () => {
  initializeGame();

  const makeBtn = document.getElementById("lets-make-it-btn");

  if (makeBtn) {
    makeBtn.addEventListener("click", startGame);
  }

  showNextOrder();
});