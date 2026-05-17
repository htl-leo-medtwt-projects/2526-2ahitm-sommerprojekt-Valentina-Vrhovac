// ========================================
// TEA GAME
// ========================================

const gameState = {
  currentStep: 0,
  selectedTea: null,
  teaBagInCup: false,
  kettleFilled: false,
  teaPoured: false
};

const teaImages = {
  green: {
    box: "images/greenTea.png",
    boxOpen: "images/greenTeaOpen.png",
    bag: "images/greenTeaBag.png",
    mug: "images/GreenTeaMug.png",
    fullMug: "images/FullGreenTeaMug.png"
  },
  strawberry: {
    box: "images/strawberryTea.png",
    boxOpen: "images/strawberryTeaOpen.png",
    bag: "images/strawberryTeaBag.png",
    mug: "images/strawberryTeaMug.png",
    fullMug: "images/FullStrawberryTeaMug.png"
  }
};

// ========================================
// CONTENT
// ========================================

function createTeaGameHTML() {
  const gameContent = document.querySelector(".game-content");
  if (!gameContent) {
    return;
  }

  const teaMakingHTML = `
    <div id="tea-making" class="tea-game-overlay">
      <div class="tea-overlay-content">
        <div class="tea-corner-select" id="tea-selection-overlay">
          <h2>Tea Corner</h2>
          <p>Pick a tea to brew</p>
          <div class="tea-selection-grid">
            <div class="tea-option">
              <img src="images/greenTea.png" alt="Green Tea" class="tea-box-img">
              <button class="game-btn tea-select-btn" data-tea="green" type="button">Select</button>
            </div>
            <div class="tea-option">
              <img src="images/strawberryTea.png" alt="Strawberry Tea" class="tea-box-img">
              <button class="game-btn tea-select-btn" data-tea="strawberry" type="button">Select</button>
            </div>
          </div>
        </div>

        <div class="tea-steps">
          <div class="step hidden" id="step-1">
            <h3>Step 1: Open Box</h3>
            <div class="tea-box" id="tea-box">
              <img src="images/greenTea.png" alt="Tea Box" class="box-img" id="tea-box-img">
              <p>Click on the box!</p>
            </div>
          </div>

          <div class="step hidden" id="step-2">
            <h3>Step 2: Tea Bag in Cup</h3>
            <div class="tea-working-area">
              <div class="tea-box-open">
                <img src="images/greenTeaBag.png" alt="Tea Bag" class="tea-bag-img" id="tea-bag-image" draggable="true">
              </div>
              <div class="tea-cup-area">
                <img src="images/mug.png" alt="Cup" class="tea-cup" id="tea-cup-drop">
              </div>
            </div>
          </div>

          <div class="step hidden" id="step-3">
            <h3>Step 3: Fill Water</h3>
            <div class="water-fill-area">
              <div class="kettle-container">
                <img src="images/kettle.png" alt="Kettle" class="kettle-img" id="kettle-fill">
                <div class="fill-progress">
                  <div class="fill-bar" id="kettle-fill-bar"></div>
                </div>
              </div>
              <p class="fill-instruction">Hold down to fill!</p>
            </div>
          </div>

          <div class="step hidden" id="step-4">
            <h3>Step 4: Water is Boiling!</h3>
            <p style="margin-top: 0.3rem; margin-bottom: 0.8rem; font-size: 1rem; color: #6B705C; font-style: italic;">Stop after 5 sek</p>
            <div class="timer-area">
              <div class="timer" id="boil-timer">
                <span class="timer-text" id="timer-display">0:10</span>
              </div>
              <p>Wait until the water boils...</p>
              <button class="game-btn" id="stop-timer-btn" style="margin-top: 1rem;">Stop</button>
            </div>
          </div>

          <div class="step hidden" id="step-5">
            <h3>Step 5: Fill the Cup</h3>
            <div class="tea-pour-area">
              <div class="kettle-pour" id="kettle-pour" draggable="true">
                <img src="images/kettle.png" alt="Kettle" class="kettle-pour-img">
              </div>
              <div class="tea-cup-fill" id="cup-fill-target">
                <img src="images/mug.png" alt="Cup" class="cup-fill-img">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  gameContent.insertAdjacentHTML("beforeend", teaMakingHTML);
}

// ========================================
// STEPS
// ========================================

function showStep(stepNumber) {
  document.querySelectorAll(".tea-steps .step").forEach(step => step.classList.add("hidden"));
  const step = document.getElementById(`step-${stepNumber}`);
  if (step) {
    step.classList.remove("hidden");
  }
}

// ========================================
// HELPERS
// ========================================

function updateTeaImages() {
  let images = teaImages[gameState.selectedTea];
  if (!images) {
    return;
  }

  const box = document.getElementById("tea-box-img");
  const bag = document.getElementById("tea-bag-image");

  if (box) {
    box.src = images.box;
  }
  if (bag) {
    bag.src = images.bag;
  }
}

function goToStep(stepNumber) {
  gameState.currentStep = stepNumber;
  showStep(stepNumber);
}

function advanceStep(nextStep, delay = 500) {
  setTimeout(() => goToStep(nextStep), delay);
}

// ========================================
// SELECTION & INITIALIZATION
// ========================================

function handleTeaSelection() {
  document.querySelectorAll(".tea-select-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      gameState.selectedTea = btn.dataset.tea;
      updateTeaImages();

      const overlay = document.getElementById("tea-selection-overlay");
      if (overlay) {
        overlay.classList.add("hidden");
      }

      goToStep(1);
      initStep1();
      initStep2();
      initStep3();
      initStep5();
    });
  });
}

function initStep1() {
  const box = document.getElementById("tea-box");
  if (!box) {
    return;
  }

  box.addEventListener("click", () => {
    let images = teaImages[gameState.selectedTea];
    let boxImg = document.getElementById("tea-box-img");
    if (boxImg && images) {
      boxImg.src = images.boxOpen;
    }
    advanceStep(2);
  }, { once: true });
}

function setupDragDrop(source, target, onDrop) {
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

function initStep2() {
  const teaBag = document.getElementById("tea-bag-image");
  const cup = document.getElementById("tea-cup-drop");

  setupDragDrop(teaBag, cup, () => {
    gameState.teaBagInCup = true;
    teaBag.style.display = "none";

    const images = teaImages[gameState.selectedTea];
    if (images) {
      cup.src = images.mug;
    }

    advanceStep(3);
  });
}

function initStep3() {
  const kettle = document.getElementById("kettle-fill");
  const fillBar = document.getElementById("kettle-fill-bar");
  if (!kettle || !fillBar) { return; }

  let fillPercentage = 0;
  let isMouseDown = false;
  let fillInterval = null;

  const startFilling = () => {
    isMouseDown = true;
    kettle.classList.add("filling");

    if (fillInterval) {
      return;
    }

    fillInterval = setInterval(() => {
      if (!isMouseDown) {
        return;
      }

      fillPercentage += 3;
      fillBar.style.width = Math.min(fillPercentage, 100) + "%";

      if (fillPercentage >= 100) {
        clearInterval(fillInterval);
        fillInterval = null;
        gameState.kettleFilled = true;
        goToStep(4);
        startBoilTimer();
      }
    }, 50);
  };

  const stopFilling = () => {
    isMouseDown = false;
    kettle.classList.remove("filling");
  };

  kettle.addEventListener("mousedown", startFilling);
  kettle.addEventListener("touchstart", event => {
    event.preventDefault();
    startFilling();
  });

  document.addEventListener("mouseup", stopFilling);
  document.addEventListener("touchend", stopFilling);
}

function startBoilTimer() {
  const display = document.getElementById("timer-display");
  const circle = document.getElementById("boil-timer");
  const stopBtn = document.getElementById("stop-timer-btn");
  if (!display || !circle || !stopBtn) {
    return;
  }

  let timeRemaining = 10;
  let totalTime = 10;
  let userStopped = false;

  stopBtn.disabled = false;
  stopBtn.addEventListener("click", () => {
    if (!userStopped) {
      userStopped = true;
      gameState.stopTime = totalTime - timeRemaining;
      if (gameState.stopTime !== 5) {
        gameState.wrongTiming = true;
      }
      clearInterval(timerInterval);
      display.textContent = "Done!";
      circle.style.background = "conic-gradient(#E8C4B8 0deg, #E8C4B8 360deg)";
      stopBtn.disabled = true;
      advanceStep(5);
    }
  });

  const timerInterval = setInterval(() => {
    timeRemaining--;
    display.textContent = `0: ${String(timeRemaining).padStart(2, "0")}`;

    let progress = (totalTime - timeRemaining) / totalTime;
    let degrees = progress * 360;
    circle.style.background = `conic-gradient(#E8C4B8 0deg, #E8C4B8 ${degrees}deg, #F3D1D1 ${degrees}deg, #F3D1D1 360deg)`;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      display.textContent = "Over-cooked!";
      circle.style.background = "conic-gradient(#D75A4A 0deg, #D75A4A 360deg)";
      gameState.stopTime = 10;
      gameState.wrongTiming = true;
      stopBtn.disabled = true;
      setTimeout(() => advanceStep(5), 1500);
    }
  }, 1000);
}

function initStep5() {
  const kettle = document.getElementById("kettle-pour");
  const cup = document.getElementById("cup-fill-target");

  setupDragDrop(kettle, cup, () => {
    gameState.teaPoured = true;
    cup.style.borderColor = "#E6C6A3";
    cup.style.background = "rgba(232, 196, 184, 0.3)";

    let images = teaImages[gameState.selectedTea];
    const cupImg = cup.querySelector(".cup-fill-img");
    if (cupImg && images) {
      cupImg.src = images.fullMug;
    }

    setTimeout(completeTeaMaking, 500);
  });
}

// ========================================
// COMPLETION
// ========================================

function completeTeaMaking() {
  const teaMakingElement = document.getElementById("tea-making");
  if (!teaMakingElement) { return; }

  let isCorrect = false;
  if (currentOrder) {
    const orderName = currentOrder.item.toLowerCase();
    if (orderName.includes("green") && gameState.selectedTea === "green") { isCorrect = true; }
    if (orderName.includes("strawberry") && gameState.selectedTea === "strawberry") { isCorrect = true; }
    if (gameState.wrongTiming) { isCorrect = false; }
  }

  let result;
  if (currentOrder) {
    result = handleDrinkCompletion(isCorrect, currentOrder.price);
  } else {
    result = { earnedCoins: 0 };
  }
  let label;
  if (gameState.wrongTiming) {
    label = "Wrong Timing!";
  } else {
    if (isCorrect) {
      label = "Perfect Tea!";
    } else {
      label = "Tea Served!";
    }
  }
  const msg = showRatingPopup(result, isCorrect, label, "🍵");

  setTimeout(() => {
    msg.remove();
    teaMakingElement.remove();
    resetTeaMaking();
    showNextOrder();
  }, 1900);
}

function resetTeaMaking() {
  gameState.currentStep = 0;
  gameState.selectedTea = null;
  gameState.teaBagInCup = false;
  gameState.kettleFilled = false;
  gameState.teaPoured = false;
  gameState.wrongTiming = false;
  gameState.stopTime = null;
}

// ========================================
// START GAME
// ========================================

function startTeaGame() {
  const gameContent = document.querySelector(".game-content");
  if (!gameContent) {
    return;
  }

  hide(document.getElementById("order-dialog"));
  hide(document.querySelector(".game-cat"));
  removeMiniGames();

  resetTeaMaking();
  createTeaGameHTML();
  handleTeaSelection();
}