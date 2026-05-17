// ========================================
// COFFEE GAME
// ========================================
const coffeeState = {
  selectedCup: null,
  cupPlaced: false,
  coffeeFilled: false,
  milkAdded: false,
  syrupSelected: null,
  stirred: false,
  iceAdded: false
};

// ========================================
// IMAGE HELPERS
// ========================================

function icedCoffeeNoIceImage(flavor) {
  if (flavor === "strawberry") {
    return "images/icedStrawberryCoffeeNoIce.png";
  }
  return "images/icedVelvetCoffeeNoIce.png";
}

function coffeeImageForStage(stage) {
  let cup;
  if (coffeeState.selectedCup === "iced") {
    cup = "iced";
  } else {
    cup = "hot";
  }

  const images = {
    hot: {
      empty: "images/coffeeCup.png",
      coffee: "images/justCoffeeMug.png",
      milk: "images/justCoffeeMugxMilk.png"
    },
    iced: {
      empty: "images/icedCup.png",
      coffee: "images/justCoffeeIced.png",
      milk: "images/justCoffeeIcedXMilk.png"
    }
  };

  return images[cup][stage];
}

function coffeeMixedImage() {
  let flavor;
  if (coffeeState.syrupSelected === "strawberry") {
    flavor = "strawberry";
  } else {
    flavor = "velvet";
  }
  if (coffeeState.selectedCup === "iced") {
    if (flavor === "strawberry") {
      return "images/icedStrawberryCoffeeNoIce.png";
    } else {
      return "images/icedVelvetCoffeeNoIce.png";
    }
  }
  if (flavor === "strawberry") {
    return "images/strawberryCoffee.png";
  } else {
    return "images/velvetCoffee.png";
  }
}

function coffeeFinalImage() {
  let flavor;
  if (coffeeState.syrupSelected === "strawberry") {
    flavor = "strawberry";
  } else {
    flavor = "velvet";
  }

  if (coffeeState.selectedCup === "iced") {
    if (coffeeState.iceAdded) {
      if (flavor === "strawberry") {
        return "images/icedStrawberryCoffee.png";
      } else {
        return "images/icedVelvetCoffee.png";
      }
    }
    if (flavor === "strawberry") {
      return "images/icedStrawberryCoffeeNoIce.png";
    } else {
      return "images/icedVelvetCoffeeNoIce.png";
    }
  }

  if (flavor === "strawberry") {
    return "images/strawberryCoffee.png";
  } else {
    return "images/velvetCoffee.png";
  }
}

// ========================================
// START GAME/CONTENT
// ========================================

function startCoffeeGame() {
  const container = document.getElementById("game-content");
  if (!container) {
    return;
  }

  hide(document.getElementById("order-dialog"));
  hide(document.querySelector(".game-cat"));
  removeMiniGames();

  coffeeState.selectedCup = null;
  coffeeState.cupPlaced = false;
  coffeeState.coffeeFilled = false;
  coffeeState.milkAdded = false;
  coffeeState.syrupSelected = null;
  coffeeState.stirred = false;
  coffeeState.iceAdded = false;

  const wrap = document.createElement("div");
  wrap.id = "coffee-game-container";
  wrap.className = "mini-game-overlay pretty-mini-game picture-game";
  wrap.innerHTML = `
    <div class="mini-game-card pretty-card picture-card coffee-card">
      <h2>Coffee Station</h2>
      <p class="mini-instruction">Make the customer coffee with the pictures.</p>

      <div class="mini-step" id="coffee-step-1">
        <h3>Step 1: Choose cup or glass</h3>
        <div class="choice-row image-choice-row">
          <button class="image-choice" data-cup="hot">
            <img src="images/coffeeCup.png" alt="Coffee cup">
            <span>Hot cup</span>
          </button>
          <button class="image-choice" data-cup="iced">
            <img src="images/icedCup.png" alt="Iced glass">
            <span>Iced glass</span>
          </button>
        </div>
      </div>

      <div class="mini-step hidden" id="coffee-step-2">
        <h3>Step 2: Put it under the machine</h3>
        <p class="small-help">Drag the cup/glass onto the coffee machine image.</p>
        <div class="coffee-scene coffee-machine-step">
          <img id="coffee-machine-img" class="coffee-machine-picture" src="images/coffeeMachine.png" alt="Coffee machine">
          <img id="coffee-cup-drag" class="floating-cup" draggable="true" src="images/coffeeCup.png" alt="Cup">
          <button id="coffee-fill-btn" class="game-btn coffee-fill-button hidden">Fill coffee</button>
        </div>
      </div>

      <div class="mini-step hidden" id="coffee-step-3">
        <h3>Step 3: Add milk</h3>
        <p class="small-help">Drag the milk onto the drink.</p>
        <div class="milk-scene">
          <img id="coffee-milk" class="ingredient-picture" draggable="true" src="images/milkJug.png" alt="Milk">
          <img id="coffee-milk-target" class="drink-target-picture" src="images/coffeeCup.png" alt="Drink">
        </div>
      </div>

      <div class="mini-step hidden" id="coffee-step-4">
        <h3>Step 4: Choose syrup</h3>
        <div class="choice-row image-choice-row">
          <button class="image-choice" data-syrup="strawberry">
            <img src="images/strawberrySirup.png" alt="Strawberry syrup">
            <span>Strawberry</span>
          </button>
          <button class="image-choice" data-syrup="velvet">
            <img src="images/velvetSirup.png" alt="Velvet syrup">
            <span>Velvet</span>
          </button>
        </div>
      </div>

      <div class="mini-step hidden" id="coffee-step-5">
        <h3>Step 5: Stir</h3>
        <p class="small-help">Hold mouse and move over the drink.</p>
        <div id="coffee-stir-area" class="stir-picture-area">
          <img id="coffee-stir-drink" class="stir-drink" src="images/coffeeCupMilk.png" alt="Coffee" draggable="false">
          <img class="stir-spoon" src="images/spoon.png" alt="Spoon" draggable="false">
          <span id="coffee-stir-progress">0%</span>
        </div>
      </div>

      <div class="mini-step hidden" id="coffee-step-6">
        <h3>Step 6: Ice cubes?</h3>
        <div class="coffee-ice-step">
          <img class="coffee-ice-img" src="images/iceCubes.png" alt="Ice cubes">
          <div class="coffee-ice-buttons">
            <button class="game-btn" data-ice="yes">Yes</button>
            <button class="game-btn" data-ice="no">No</button>
          </div>
        </div>
      </div>
    </div>`;
  container.appendChild(wrap);
  attachCoffeeEvents();
}

// ========================================
// STEPS
// ========================================

function showCoffeeStep(num) {
  const steps = document.querySelectorAll("#coffee-game-container .mini-step");

  for (let i = 0; i < steps.length; i++) {
    steps[i].classList.add("hidden");
  }

  show(document.getElementById("coffee-step-" + num));
}

// ========================================
// EVENTS
// ========================================

function attachCoffeeEvents() {
  const cupButtons = document.querySelectorAll("#coffee-step-1 [data-cup]");

  for (let i = 0; i < cupButtons.length; i++) {
    let btn = cupButtons[i];

    btn.addEventListener("click", function () {
      coffeeState.selectedCup = btn.dataset.cup;
      document.getElementById("coffee-cup-drag").src = coffeeImageForStage("empty");
      showCoffeeStep(2);
    });
  }

  const cup = document.getElementById("coffee-cup-drag");
  const machineScene = document.querySelector(".coffee-scene");

  cup.addEventListener("dragstart", function (event) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", "coffee-cup-drag");
    cup.classList.add("dragging");
  });

  cup.addEventListener("dragend", function () {
    cup.classList.remove("dragging");
  });

  machineScene.addEventListener("dragover", function (event) {
    event.preventDefault();
    machineScene.classList.add("picture-hover");
  });

  machineScene.addEventListener("dragleave", function () {
    machineScene.classList.remove("picture-hover");
  });

  machineScene.addEventListener("drop", function (event) {
    event.preventDefault();
    machineScene.classList.remove("picture-hover");

    coffeeState.cupPlaced = true;
    cup.style.display = "none";

    let machineImg;

    if (coffeeState.selectedCup === "iced") {
      machineImg = "images/coffeeMaschineXEmptyIcedCup.png";
    } else {
      machineImg = "images/coffeeMaschineXEmptyCup.png";
    }

    document.getElementById("coffee-machine-img").src = machineImg;
    show(document.getElementById("coffee-fill-btn"));
  });

  document.getElementById("coffee-fill-btn").addEventListener("click", function () {
    coffeeState.coffeeFilled = true;

    let fillImg;

    if (coffeeState.selectedCup === "iced") {
      fillImg = "images/coffeeMaschineXFullIcedCup.png";
    } else {
      fillImg = "images/coffeeMaschineXFullCup.png";
    }

    document.getElementById("coffee-machine-img").src = fillImg;

    setTimeout(function () {
      document.getElementById("coffee-milk-target").src = coffeeImageForStage("coffee");
      showCoffeeStep(3);
    }, 650);
  });

  setupPictureDrop("coffee-milk", "coffee-milk-target", function () {
    coffeeState.milkAdded = true;

    const target = document.getElementById("coffee-milk-target");
    target.classList.add("picture-done");
    target.src = coffeeImageForStage("milk");

    const stirDrink = document.getElementById("coffee-stir-drink");

    if (stirDrink) {
      stirDrink.src = coffeeImageForStage("milk");
    }

    setTimeout(function () {
      showCoffeeStep(4);
    }, 500);
  });

  const syrupButtons = document.querySelectorAll("#coffee-step-4 [data-syrup]");

  for (let i = 0; i < syrupButtons.length; i++) {
    let btn = syrupButtons[i];

    btn.addEventListener("click", function () {
      coffeeState.syrupSelected = btn.dataset.syrup;

      const stirDrink = document.getElementById("coffee-stir-drink");

      if (stirDrink) {
        stirDrink.src = coffeeImageForStage("milk");
      }

      showCoffeeStep(5);
    });
  }

  const stirArea = document.getElementById("coffee-stir-area");
  const stirImages = stirArea.querySelectorAll("img");

  for (let i = 0; i < stirImages.length; i++) {
    let img = stirImages[i];

    img.setAttribute("draggable", "false");

    img.addEventListener("dragstart", function (event) {
      event.preventDefault();
    });
  }

  stirArea.addEventListener("mousedown", function (event) {
    event.preventDefault();
  });

  let progress = 0;

  stirArea.addEventListener("mousemove", function (event) {
    if (event.buttons !== 1) {
      return;
    }

    progress = Math.min(100, progress + 4);
    document.getElementById("coffee-stir-progress").textContent = Math.round(progress) + "%";

    if (progress >= 80 && !coffeeState.stirred) {
      coffeeState.stirred = true;

      const stirDrink = document.getElementById("coffee-stir-drink");

      if (stirDrink) {
        stirDrink.src = coffeeMixedImage();
      }

      if (coffeeState.selectedCup === "iced") {
        setTimeout(function () {
          showCoffeeStep(6);
        }, 650);
      } else {
        coffeeState.iceAdded = false;
        setTimeout(completeCoffeeMaking, 650);
      }
    }
  });

  const iceButtons = document.querySelectorAll("#coffee-step-6 [data-ice]");

  for (let i = 0; i < iceButtons.length; i++) {
    let btn = iceButtons[i];

    btn.addEventListener("click", function () {
      coffeeState.iceAdded = btn.dataset.ice === "yes";
      completeCoffeeMaking();
    });
  }
}

// ========================================
// DRAG & DROP
// ========================================

function setupPictureDrop(sourceId, targetId, onDrop) {
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
  source.addEventListener("dragend", () => source.classList.remove("dragging"));
  target.addEventListener("dragover", event => {
    event.preventDefault();
    target.classList.add("picture-hover");
  });
  target.addEventListener("dragleave", () => target.classList.remove("picture-hover"));
  target.addEventListener("drop", event => {
    event.preventDefault();
    target.classList.remove("picture-hover");
    onDrop();
  });
}

// ========================================
// COMPLETION
// ========================================

function completeCoffeeMaking() {
  let orderName = currentOrder.item.toLowerCase();
  let cupCorrect;
  if (orderName.includes("iced")) {
    cupCorrect = coffeeState.selectedCup === "iced";
  } else {
    cupCorrect = coffeeState.selectedCup === "hot";
  }
  let syrupCorrect;
  if (orderName.includes("strawberry")) {
    syrupCorrect = coffeeState.syrupSelected === "strawberry";
  } else {
    syrupCorrect = coffeeState.syrupSelected === "velvet";
  }
  let iceCorrect;
  if (orderName.includes("iced")) {
    iceCorrect = coffeeState.iceAdded === true;
  } else {
    iceCorrect = coffeeState.iceAdded === false;
  }
  let isCorrect = cupCorrect && coffeeState.cupPlaced && coffeeState.coffeeFilled && coffeeState.milkAdded && syrupCorrect && coffeeState.stirred && iceCorrect;
  let finishMsg;
  if (isCorrect) {
    finishMsg = "Perfect Coffee!";
  } else {
    finishMsg = "Coffee Served!";
  }
  finishMiniGame(isCorrect, currentOrder.price, "coffee-game-container", finishMsg, "☕", coffeeFinalImage());
}