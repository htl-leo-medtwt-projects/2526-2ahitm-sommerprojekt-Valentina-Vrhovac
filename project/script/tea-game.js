const gameState = {
  currentStep: 0,
  selectedTea: null,
  teaBagInCup: false,
  kettleFilled: false,
  teaPoured: false
};

const teaImages = {
  green: { box: "images/greenTea.png", boxOpen: "images/greenTeaOpen.png", bag: "images/greenTeaBag.png", mug: "images/GreenTeaMug.png", fullMug: "images/FullGreenTeaMug.png" },
  strawberry: { box: "images/strawberryTea.png", boxOpen: "images/strawberryTeaOpen.png", bag: "images/strawberryTeaBag.png", mug: "images/strawberryTeaMug.png", fullMug: "images/FullStrawberryTeaMug.png" }
};

function showStep(stepNumber) {
  document.querySelectorAll(".step").forEach(step => step.classList.add("hidden"));
  let step = document.querySelector(`#step-${stepNumber}`);
  if (step) {
    step.classList.remove("hidden");
  }
}

function updateTeaImages() {
  let tea = gameState.selectedTea;
  let images = teaImages[tea];
  if (images) {
    document.querySelector("#tea-box-img").src = images.box;
    document.querySelector("#tea-bag-image").src = images.bag;
  }
}

function goToStep(stepNumber) {
  gameState.currentStep = stepNumber;
  showStep(stepNumber);
}

function advanceStep(nextStep, delay = 500) {
  setTimeout(() => goToStep(nextStep), delay);
}

function handleStartGame() {
  let btn = document.querySelector("#lets-make-it-btn");
  if (!btn) {
    return;
  }
  
  btn.addEventListener("click", () => {
    document.querySelector("#tea-making").classList.remove("hidden");
  });
}

function handleTeaSelection() {
  let buttons = document.querySelectorAll(".tea-select-btn");
  if (buttons.length == 0) {
    return;
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", (element) => {
      gameState.selectedTea = element.target.getAttribute("data-tea");
      updateTeaImages();
      
      document.querySelector("#tea-selection-overlay").classList.add("hidden");
      goToStep(1);
      
      initStep1();
      initStep2();
      initStep3();
      initStep4();
      initStep5();
    });
  });
}

function initStep1() {
  let box = document.querySelector("#tea-box");
  if (!box) {
    return;
  }

  box.addEventListener("click", () => {
    box.classList.add("opened");
    
    let images = teaImages[gameState.selectedTea];
    document.querySelector("#tea-box-img").src = images.boxOpen;
    
    advanceStep(2);
  });
}

function setupDragDrop(source, target, onDrop) {
  source.addEventListener("dragstart", (element) => {
    element.dataTransfer.effectAllowed = "move";
    source.classList.add("dragging");
  });

  source.addEventListener("dragend", () => {
    source.classList.remove("dragging");
  });

  target.addEventListener("dragover", (element) => {
    element.preventDefault();
    element.dataTransfer.dropEffect = "move";
    target.style.opacity = "0.7";
  });

  target.addEventListener("dragleave", () => {
    target.style.opacity = "1";
  });

  target.addEventListener("drop", (element) => {
    element.preventDefault();
    target.style.opacity = "1";
    onDrop();
  });
}

function initStep2() {
  let teaBag = document.querySelector(".tea-bag-img");
  let cup = document.querySelector("#tea-cup-drop");
  if (!teaBag || !cup) {
    return;
  }

  let onTeaBagDropped = () => {
    gameState.teaBagInCup = true;
    teaBag.style.display = "none";
    
    let images = teaImages[gameState.selectedTea];
    cup.src = images.mug;
    
    advanceStep(3);
  };

  setupDragDrop(teaBag, cup, onTeaBagDropped);

  let nextBtn = document.querySelector("#step2-next");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => goToStep(3));
  }
}

function initStep3() {
  let kettle = document.querySelector("#kettle-fill");
  let fillBar = document.querySelector("#kettle-fill-bar");
  if (!kettle || !fillBar) {
    return;
  }

  let fillPercentage = 0;
  let isMouseDown = false;

  kettle.addEventListener("mousedown", () => {
    isMouseDown = true;
    kettle.classList.add("filling");
  });

  document.addEventListener("mouseup", () => {
    isMouseDown = false;
    kettle.classList.remove("filling");
    if (fillPercentage < 15) {
      fillPercentage = 0;
      fillBar.style.width = "0%";
    }
  });

  let fillInterval = setInterval(() => {
    if (isMouseDown && fillPercentage < 100) {
      fillPercentage += 2;
      fillBar.style.width = fillPercentage + "%";
      
      if (fillPercentage >= 100) {
        gameState.kettleFilled = true;
        clearInterval(fillInterval);
        goToStep(4);
        startBoilTimer();
      }
    }
  }, 50);

  let nextBtn = document.querySelector("#step3-next");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      clearInterval(fillInterval);
      goToStep(4);
      startBoilTimer();
    });
  }
}

function startBoilTimer() {
  let display = document.querySelector("#timer-display");
  let circle = document.querySelector("#boil-timer");
  let step4 = document.querySelector("#step-4");
  if (!display || !circle || !step4) {
    return;
  }

  let timeRemaining = 30;
  const totalTime = 30;

  let nextBtn = document.querySelector("#step4-next");
  if (!nextBtn) {
    nextBtn = document.createElement("button");
    nextBtn.id = "step4-next";
    nextBtn.className = "step-btn next-btn hidden";
    nextBtn.textContent = "Next";
    step4.appendChild(nextBtn);
  }

  let timerInterval = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      let minutes = Math.floor(timeRemaining / 60);
      let seconds = timeRemaining % 60;
      display.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
      
      let progress = (totalTime - timeRemaining) / totalTime;
      let degrees = progress * 360;
      circle.style.background = `conic-gradient(#E8C4B8 0deg, #E8C4B8 ${degrees}deg, #F3D1D1 ${degrees}deg, #F3D1D1 360deg)`;
    } else {
      clearInterval(timerInterval);
      display.textContent = "Done!";
      circle.style.background = `conic-gradient(#E8C4B8 0deg, #E8C4B8 360deg)`;
      advanceStep(5);
    }
  }, 1000);

  nextBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    goToStep(5);
  });
}

function initStep4() {
}

function initStep5() {
  let kettle = document.querySelector("#kettle-pour");
  let cup = document.querySelector("#cup-fill-target");
  if (!kettle || !cup) {
    return;
  }

  let onKettleDropped = () => {
    gameState.teaPoured = true;
    cup.style.borderColor = "#E6C6A3";
    cup.style.background = "rgba(232, 196, 184, 0.3)";
    
    let images = teaImages[gameState.selectedTea];
    cup.querySelector(".cup-fill-img").src = images.fullMug;
    
    advanceStep(6, 500);
    setTimeout(() => completeTeaMaking(), 500);
  };

  setupDragDrop(kettle, cup, onKettleDropped);

  let nextBtn = document.querySelector("#step5-next");
  if (nextBtn) {
    nextBtn.addEventListener("click", completeTeaMaking);
  }
}

function completeTeaMaking() {
  let overlay = document.querySelector(".tea-overlay-content");
  if (!overlay) {
    return;
  }

  let successMsg = document.createElement("div");
  successMsg.className = "tea-success-message";
  successMsg.textContent = "Tea successfully prepared! 🍵";
  overlay.appendChild(successMsg);

  document.querySelector("#order-text").textContent = "Thank you! 🍵";
  document.querySelector("#lets-make-it-btn").classList.add("hidden");

  setTimeout(() => {
    successMsg.remove();
    document.querySelector("#tea-making").classList.add("hidden");
    
    setTimeout(() => {
      document.querySelector("#order-dialog").classList.add("hidden");
      document.querySelector(".game-cat").classList.add("hidden");
      resetTeaMaking();
    }, 1500);
  }, 2000);
}

function resetTeaMaking() {
  gameState.currentStep = 0;
  gameState.selectedTea = null;
  gameState.teaBagInCup = false;
  gameState.kettleFilled = false;
  gameState.teaPoured = false;

  let teaBag = document.querySelector("#tea-bag-image");
  if (teaBag) {
    teaBag.style.display = "block";
  }
  
  document.querySelector("#kettle-fill-bar").style.width = "0%";
  document.querySelector("#cup-fill-target").style.background = "rgba(243, 209, 209, 0.2)";
  document.querySelectorAll(".step-btn.next-btn").forEach(btn => btn.classList.add("hidden"));
}

function initTeaGame() {
  handleStartGame();
  handleTeaSelection();
}

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", initTeaGame);
} else {
  initTeaGame();
}