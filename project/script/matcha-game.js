// ========================================
// MATCHA GAME
// ========================================

const matchaGameState = {
  currentStep: 0,
  selectedGlass: null,
  powderAdded: false,
  waterFilled: false,
  waterLevel: 0,
  targetWaterLevel: 75,
  stirred: false,
  stirProgress: 0,
  syrupSelected: null,
  milkAdded: false,
  iceAdded: false
};

const matchaImages = {
  iced: {
    glass: "images/icedCup.png",
    withMilk: "images/IcedMilkGlas.png"
  },
  warm: {
    glass: "images/warmCup.png",
    withMilk: "images/CupMilk.png"
  },
  final: {
    icedMatcha: "images/finalIcedMatcha.png",
    icedStrawberryMatcha: "images/finalIcedStrawberryMatcha.png",
    warmMatcha: "images/finalWarmMatcha.png",
    warmStrawberryMatcha: "images/finalWarmStrawberryMatcha.png",
    icedMatchaNoIce: "images/finalNoIcedMatcha.png",
    icedStrawberryMatchaNoIce: "images/finalNoIcedStrawberryMatcha.png"
  }
}

// ========================================
// MATCHA GAME 
// ========================================

function createMatchaGameHTML() {
  const gameContent = document.querySelector(".game-content");
  if (!gameContent){
    return;
  }

  const matchaMakingHTML = `
    <div id="matcha-game-container" class="matcha-game-overlay">
      <div class="matcha-overlay-content">
        <div class="matcha-corner-select" id="matcha-selection-overlay">
          <h2>Matcha Corner</h2>
          <p>Pick a glass for your matcha</p>
          <div class="matcha-selection-grid">
            <div class="matcha-option">
              <img src="images/icedCup.png" alt="Iced Glass" class="matcha-glass-img">
              <button class="game-btn matcha-select-btn" data-glass="iced" type="button">Iced Glass</button>
            </div>
            <div class="matcha-option">
              <img src="images/warmCup.png" alt="Warm Cup" class="matcha-glass-img">
              <button class="game-btn matcha-select-btn" data-glass="warm" type="button">Warm Cup</button>
            </div>
          </div>
        </div>

        <div class="matcha-steps">
          <div class="step hidden" id="matcha-step-1">
            <h3>Step 1: Add Matcha Powder</h3>
            <div class="matcha-working-area">
              <div class="matcha-powder-area">
                <img src="images/matchaPowder.png" alt="Powder" class="matcha-powder-img" id="matcha-powder" draggable="true">
              </div>
              <div class="matcha-bowl-area" style="position: relative; width: 300px; height: 300px;">
                <img src="images/matchaBowl.png" alt="Bowl" class="matcha-bowl" id="matcha-bowl-drop" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
              </div>
              <div class="matcha-filled-bowl-area hidden" id="matcha-filled-bowl-area">
                <img src="images/matchaBowlFilled.png" alt="Filled Bowl" class="matcha-bowl-filled" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
              </div>
            </div>
          </div>

          <div class="step hidden" id="matcha-step-2">
            <h3>Step 2: Fill Water</h3>
            <div class="matcha-water-fill-area">
              <div class="matcha-fill-progress-container" id="matcha-fill-container">
                <div class="matcha-fill-progress">
                  <div class="matcha-fill-line-50"></div>
                  <div class="matcha-fill-bar" id="matcha-kettle-fill-bar"></div>
                </div>
                <p class="matcha-fill-instruction">Hold down to fill!</p>
              </div>
            </div>
          </div>

          <div class="step hidden" id="matcha-step-3">
            <h3>Step 3: Whisk the Matcha</h3>
            <div class="matcha-whisk-container">
              <div class="matcha-whisk-area" id="matcha-whisk-area">
                <img src="images/matchaBowl.png" alt="Bowl" class="matcha-bowl-whisk" style="width: 350px; margin-bottom: -60px; z-index: 1;">
                <img src="images/matchaWhisk.png" alt="Whisk" class="matcha-whisk-img" style="width: 150px; cursor: grab; z-index: 2;">
                <p style="margin-top: 3rem;">Move your mouse in circles!</p>
                <div class="matcha-whisk-progress-text"><strong id="matcha-whisk-progress">0%</strong></div>
              </div>
            </div>
          </div>

          <div class="step hidden" id="matcha-step-4">
            <h3>Step 4: Add Syrup?</h3>
            <div class="matcha-syrup-selection">
              <div class="matcha-syrup-option">
                <img src="images/strawberrySirup.png" alt="Strawberry Syrup" class="matcha-syrup-bottle" id="matcha-syrup-yes" style="cursor: pointer;">
              </div>
              <div class="matcha-syrup-option">
                <img src="images/noSirup.png" alt="No Syrup" class="matcha-no-syrup-bottle" id="matcha-syrup-no" style="cursor: pointer;">
              </div>
            </div>
          </div>

          <div class="step hidden" id="matcha-step-5">
            <h3>Step 5: Add Milk</h3>
            <div class="matcha-milk-final-area">
              <div class="matcha-milk-final-section">
                <div class="matcha-milk-container">
                  <img src="images/milkJug.png" alt="Milk Jug" class="matcha-milk-img" id="matcha-milk-jug" draggable="true" style="width: 250px; height: auto;">
                </div>
                <div class="matcha-cup-final-area" id="matcha-cup-drop" style="text-align: center;">
                  <img id="matcha-cup-image" class="matcha-cup-final" alt="Cup">
                </div>
              </div>
            </div>
          </div>

          <div class="step hidden" id="matcha-step-6">
            <h3>Step 6: Add Ice?</h3>
            <div class="matcha-ice-options" style="display: flex; flex-direction: column; align-items: center; gap: 2rem;">
              <img src="images/iceCubes.png" alt="Ice" class="matcha-ice-img" style="width: 120px; height: auto;">
              <div class="matcha-ice-buttons" style="display: flex; gap: 1.5rem;">
                <button class="game-btn matcha-ice-btn" id="matcha-ice-yes" type="button">Yes</button>
                <button class="game-btn matcha-ice-btn" id="matcha-ice-no" type="button">No</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  gameContent.insertAdjacentHTML("beforeend", matchaMakingHTML);
}

// ========================================
// MATCHA STEP MANAGEMENT
// ========================================

function showMatchaStep(stepNumber) {
  document.querySelectorAll(".matcha-steps .step").forEach(step => step.classList.add("hidden"));
  const step = document.getElementById("matcha-step-" + stepNumber);
  if (step) {
    step.classList.remove("hidden");
  }
}

function goToMatchaStep(stepNumber) {
  matchaGameState.currentStep = stepNumber;
  showMatchaStep(stepNumber);
}

function advanceMatchaStep(nextStep, delay = 500) {
  setTimeout(() => {
    goToMatchaStep(nextStep);
    if (nextStep === 4) {
      initMatchaStep4();
    }
    if (nextStep === 6) {
      initMatchaStep6();
    }
  }, delay);
}

// ========================================
// START MATCHA GAME
// ========================================

function startMatchaGame() {
  const gameContent = document.querySelector(".game-content");
  if (!gameContent){
    return;
  }

  hide(document.getElementById("order-dialog"));
  hide(document.querySelector(".game-cat"));
  removeMiniGames();

  createMatchaGameHTML();

  matchaGameState.currentStep = 0;
  matchaGameState.selectedGlass = null;
  matchaGameState.powderAdded = false;
  matchaGameState.waterFilled = false;
  matchaGameState.waterLevel = 0;
  matchaGameState.stirred = false;
  matchaGameState.stirProgress = 0;
  matchaGameState.syrupSelected = null;
  matchaGameState.milkAdded = false;
  matchaGameState.iceAdded = false;

  handleMatchaSelection();
  attachMatchaListeners();
  showMatchaStep(0);
}

// ========================================
// MATCHA GLASS SELECTION
// ========================================

function handleMatchaSelection() {
  document.querySelectorAll(".matcha-select-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      matchaGameState.selectedGlass = btn.dataset.glass;
      
      const overlay = document.getElementById("matcha-selection-overlay");
      if (overlay) {
        overlay.classList.add("hidden");
      }

      const cupImage = document.getElementById("matcha-cup-image");
      if (cupImage) {
        let glassImg = matchaImages[matchaGameState.selectedGlass];
        if (glassImg) {
          cupImage.src = glassImg.glass;
        }
      }

      goToMatchaStep(1);
      initMatchaStep1();
      initMatchaStep2();
      initMatchaStep3();
      initMatchaStep5();
    });
  });
}

// ========================================
// MATCHA STEP 1
// ========================================

function initMatchaStep1() {
  const powder = document.getElementById("matcha-powder");
  const bowl = document.getElementById("matcha-bowl-drop");

  setupDragDropMatcha(powder, bowl, () => {
    matchaGameState.powderAdded = true;
    powder.style.display = "none";
    
    const filledBowlArea = document.getElementById("matcha-filled-bowl-area");
    if (filledBowlArea) {
      bowl.style.display = "none";
      filledBowlArea.classList.remove("hidden");
    }
    
    advanceMatchaStep(2);
  });
}

// ========================================
// MATCHA STEP 2
// ========================================

function initMatchaStep2() {
  const fillContainer = document.getElementById("matcha-fill-container");
  const fillBar = document.getElementById("matcha-kettle-fill-bar");
  if (!fillContainer || !fillBar) {
    return;
  }

  let fillPercentage = 0;
  let isMouseDown = false;
  let fillInterval = null;

  const startFilling = () => {
    isMouseDown = true;

    if (fillInterval) {
      return;
    }

    fillInterval = setInterval(() => {
      if (!isMouseDown) {
        return;
      }

      fillPercentage += 3;
      fillBar.style.width = Math.min(fillPercentage, 100) + "%";
      matchaGameState.waterLevel = fillPercentage;

      if (fillPercentage >= 50 && !matchaGameState.waterFilled) {
        clearInterval(fillInterval);
        fillInterval = null;
        matchaGameState.waterFilled = true;
        advanceMatchaStep(3);
      }
    }, 50);
  };

  const stopFilling = () => {
    isMouseDown = false;
  };

  fillContainer.addEventListener("mousedown", startFilling);
  document.addEventListener("mouseup", stopFilling);
}

// ========================================
// MATCHA STEP 3
// ========================================

function initMatchaStep3() {
  const whiskArea = document.getElementById("matcha-whisk-area");
  if (!whiskArea) {
    return;
  }

  let lastX = 0;
  let lastY = 0;
  let isWhisking = false;

  whiskArea.addEventListener("mousedown", event => {
    isWhisking = true;
    lastX = event.offsetX;
    lastY = event.offsetY;
  });

  document.addEventListener("mouseup", () => {
    isWhisking = false;
  });

  whiskArea.addEventListener("mousemove", event => {
    if (!isWhisking) {
      return;
    }

    const x = event.offsetX;
    const y = event.offsetY;

    if (lastX === 0 && lastY === 0) {
      lastX = x;
      lastY = y;
      return;
    }

    const distance = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2);
    matchaGameState.stirProgress = Math.min(100, matchaGameState.stirProgress + distance / 3);
    safeText("matcha-whisk-progress", Math.round(matchaGameState.stirProgress) + "%");

    lastX = x;
    lastY = y;

    if (matchaGameState.stirProgress >= 80) {
      matchaGameState.stirred = true;
      advanceMatchaStep(4);
    }
  });

  whiskArea.addEventListener("mouseleave", () => {
    isWhisking = false;
    lastX = 0;
    lastY = 0;
  });
}

// ========================================
// MATCHA STEP 4
// ========================================

function initMatchaStep4() {
  const syrupYes = document.getElementById("matcha-syrup-yes");
  const syrupNo = document.getElementById("matcha-syrup-no");

  if (syrupYes) {
    syrupYes.addEventListener("click", () => {
      matchaGameState.syrupSelected = "yes";
      advanceMatchaStep(5);
    }, { once: true });
  }

  if (syrupNo) {
    syrupNo.addEventListener("click", () => {
      matchaGameState.syrupSelected = "no";
      advanceMatchaStep(5);
    }, { once: true });
  }
}

// ========================================
// MATCHA STEP 5
// ========================================

function initMatchaStep5() {
  const milk = document.getElementById("matcha-milk-jug");
  const cupArea = document.getElementById("matcha-cup-drop");
  const cupImage = document.getElementById("matcha-cup-image");

  setupDragDropMatcha(milk, cupArea, () => {
    matchaGameState.milkAdded = true;
    milk.style.display = "none";
    
    if (cupImage && matchaGameState.selectedGlass) {
      let milkImageSrc = matchaImages[matchaGameState.selectedGlass].withMilk;
      if (milkImageSrc) {
        cupImage.src = milkImageSrc;
      }
    }
    
    let needsIce = matchaGameState.selectedGlass === "iced";
    if (needsIce) {
      advanceMatchaStep(6);
    } else {
      completeMatchaMaking();
    }
  });
}

// ========================================
// MATCHA STEP 6
// ========================================

function initMatchaStep6() {
  const iceYes = document.getElementById("matcha-ice-yes");
  const iceNo = document.getElementById("matcha-ice-no");

  if (iceYes) {
    iceYes.addEventListener("click", () => {
      matchaGameState.iceAdded = true;
      completeMatchaMaking();
    }, { once: true });
  }

  if (iceNo) {
    iceNo.addEventListener("click", () => {
      matchaGameState.iceAdded = false;
      completeMatchaMaking();
    }, { once: true });
  }
}

function attachMatchaListeners() {}

// ========================================
// DRAG AND DROP
// ========================================

function setupDragDropMatcha(source, target, onDrop) {
  if (!source || !target) {
    return;
  }

  source.addEventListener("dragstart", event => {
    event.dataTransfer.effectAllowed = "move";
    source.classList.add("dragging");
  });

  source.addEventListener("dragend", () => {
    source.classList.remove("dragging");
  });

  target.addEventListener("dragover", event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    target.style.opacity = "0.7";
  });

  target.addEventListener("dragleave", () => {
    target.style.opacity = "1";
  });

  target.addEventListener("drop", event => {
    event.preventDefault();
    target.style.opacity = "1";
    onDrop();
  });
}

// ========================================
// COMPLETE MATCHA MAKING
// ========================================

function completeMatchaMaking() {
  if (!currentOrder) {
    showNextOrder();
    return;
  }

  let isCorrect = checkMatchaCompletion();
  let drinkPrice = currentOrder.price;
  
  if (!isCorrect) {
    const randomValue = Math.random();
    if (randomValue < 0.25) {
      drinkPrice = 0;
    } else {
      drinkPrice = currentOrder.price / 2;
    }
  }
  
  const result = handleDrinkCompletion(isCorrect, drinkPrice);

  let finalImageSrc = "images/finalWarmMatcha.png";
  if (matchaGameState.selectedGlass === "iced") {
    if (!matchaGameState.iceAdded) {
      if (matchaGameState.syrupSelected === "yes") {
        finalImageSrc = "images/finalNoIcedStrawberryMatcha.png";
      } else {
        finalImageSrc = "images/finalNoIcedMatcha.png";
      }
    } else {
      if (matchaGameState.syrupSelected === "yes") {
        finalImageSrc = "images/finalIcedStrawberryMatcha.png";
      } else {
        finalImageSrc = "images/finalIcedMatcha.png";
      }
    }
  } else {
    if (matchaGameState.syrupSelected === "yes") {
      finalImageSrc = "images/finalWarmStrawberryMatcha.png";
    } else {
      finalImageSrc = "images/finalWarmMatcha.png";
    }
  }

  const finalMsg = document.createElement("div");
  finalMsg.className = "matcha-final-message";
  finalMsg.style.display = "flex";
  finalMsg.style.flexDirection = "column";
  finalMsg.style.alignItems = "center";
  finalMsg.style.gap = "2rem";
  finalMsg.style.padding = "2rem";

  const imgElement = document.createElement("img");
  imgElement.src = finalImageSrc;
  imgElement.style.width = "280px";
  imgElement.style.height = "auto";
  imgElement.style.filter = "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))";
  imgElement.classList.add("final-image");
  
  finalMsg.appendChild(imgElement);
  document.body.appendChild(finalMsg);

  setTimeout(() => {
    finalMsg.remove();
    
    const successMsg = document.createElement("div");
    successMsg.className = "matcha-success-message";
    successMsg.style.display = "flex";
    successMsg.style.flexDirection = "column";
    successMsg.style.alignItems = "center";
    successMsg.style.gap = "1rem";

    let coins = Math.round(result.earnedCoins * 100) / 100;
    let textElement = document.createElement("p");
    if (isCorrect) {
      textElement.textContent = `Perfect! +${coins} coins 🍵`;
      successMsg.style.background = "#4CAF50";
    } else if (drinkPrice > 0) {
      textElement.textContent = `Good! +${coins} coins 🍵`;
      successMsg.style.background = "#FF9800";
    } else {
      textElement.textContent = `Oops! +${coins} coins 🍵`;
      successMsg.style.background = "#FF6B6B";
    }
    textElement.style.margin = "0";
    textElement.style.color = "white";
    textElement.style.fontSize = "1.5rem";
    textElement.style.fontWeight = "bold";

    successMsg.appendChild(textElement);
    document.body.appendChild(successMsg);

    setTimeout(() => {
      successMsg.remove();
      removeMiniGames();
      showNextOrder();
    }, 1500);
  }, 1500);
}

// ========================================
// CHECK
// ========================================

function checkMatchaCompletion() {
  let orderName = currentOrder.item.toLowerCase();

  let glassCorrect =
    (orderName.includes("iced") && matchaGameState.selectedGlass === "iced") ||
    (!orderName.includes("iced") && matchaGameState.selectedGlass === "warm");

  let waterCorrect = matchaGameState.waterFilled === true;

  let syrupCorrect =
    (orderName.includes("strawberry") && matchaGameState.syrupSelected === "yes") ||
    (!orderName.includes("strawberry") && matchaGameState.syrupSelected === "no");

  let iceCorrect =
    (orderName.includes("iced") && matchaGameState.iceAdded === true) ||
    (!orderName.includes("iced") && matchaGameState.selectedGlass === "warm");

  return glassCorrect && waterCorrect && syrupCorrect && iceCorrect;
}