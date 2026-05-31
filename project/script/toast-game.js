// ========================================
// TOAST GAME
// ========================================
const toastState = { cream: null, spreadDone: false, fruitTopping: null, secondTopping: null };

// ========================================
// START GAME/CONTENT
// ========================================

function startToastGame() {
  const container = document.getElementById("game-content");
  if (!container) { return; }
  hide(document.getElementById("order-dialog"));
  hide(document.querySelector(".game-cat"));
  removeMiniGames();

  toastState.cream = null;
  toastState.spreadDone = false;
  toastState.fruitTopping = null;
  toastState.secondTopping = null;

  const wrap = document.createElement("div");
  wrap.id = "toast-game-container";
  wrap.className = "mini-game-overlay pretty-mini-game picture-game";
  wrap.innerHTML = `
    <div class="mini-game-card pretty-card picture-card toast-card">
      <h2>Toast Station</h2>
      <p class="mini-instruction">Choose spread, spread it, then choose fruit + extra topping.</p>

      <div class="mini-step" id="toast-step-1">
        <h3>Step 1: Choose spread</h3>
        <div class="choice-row image-choice-row">
          <button class="image-choice" data-cream="honey"><img src="images/honey.png"><span>Honey</span></button>
          <button class="image-choice" data-cream="strawberry"><img src="images/strawberrySpread.png"><span>Berry cream</span></button>
          <button class="image-choice" data-cream="peanut"><img src="images/peanutButter.png"><span>Peanut butter</span></button>
        </div>
      </div>

      <div class="mini-step hidden" id="toast-step-2">
        <h3>Step 2: Spread over toast</h3>
        <p class="small-help">Hold mouse and move over the toast until it is ready.</p>
        <div class="toast-picture-area">
          <img id="toast-img" src="images/toast.png" alt="Toast">
          <img src="images/knife.png" alt="Knife" class="knife-img">
          <span id="toast-spread-progress">0%</span>
        </div>
      </div>

      <div class="mini-step hidden" id="toast-step-3">
        <h3>Step 3: Choose fruit topping</h3>
        <div class="choice-row image-choice-row">
          <button class="image-choice" data-fruit="apple"><img src="images/appleSlices.png"><span>Apple slices</span></button>
          <button class="image-choice" data-fruit="berry"><img src="images/strawberryPieces.png"><span>Berries</span></button>
          <button class="image-choice" data-fruit="banana"><img src="images/bananaSlices.png"><span>Banana slices</span></button>
        </div>
      </div>

      <div class="mini-step hidden" id="toast-step-4">
        <h3>Step 4: Choose second topping</h3>
        <p class="small-help">This is required too: drizzle, daisies or coconut.</p>
        <div class="choice-row image-choice-row">
          <button class="image-choice" data-extra="drizzle"><img src="images/honeyDrizzle.png"><span>Honey drizzle</span></button>
          <button class="image-choice" data-extra="daisies"><img src="images/daisies.png"><span>Daisies</span></button>
          <button class="image-choice" data-extra="coconut"><img src="images/coconutFlakes.png"><span>Coconut</span></button>
        </div>
      </div>
    </div>`;
  container.appendChild(wrap);
  attachToastEvents();
}

// ========================================
// HELPERS
// ========================================

function toastRecipeFromOrder() {
  const name = currentOrder.item.toLowerCase();
  if (name.includes("apple")) { return { cream: "honey", fruit: "apple", extra: "drizzle", spreadImg: "images/toastWithHoney.png", finalImg: "images/appleHoneyToast.png" }; }
  if (name.includes("banana")) { return { cream: "peanut", fruit: "banana", extra: "coconut", spreadImg: "images/toastWithPeanutButter.png", finalImg: "images/peanutButterBananaToast.png" }; }
  return { cream: "strawberry", fruit: "berry", extra: "daisies", spreadImg: "images/toastWithStrawberrySpread.png", finalImg: "images/strawberryCreamToast.png" };
}

function toastCap(value) {
  if (!value) { return ""; }
  if (value === "berry") { return "Strawberry"; }
  if (value === "drizzle") { return "Honey"; }
  if (value === "daisies") { return "Daisy"; }
  if (value === "coconut") { return "Coconut"; }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toastSpreadImageFromChoice() {
  if (toastState.cream === "honey") { return "images/toastWithHoney.png"; }
  if (toastState.cream === "peanut") { return "images/toastWithPeanutButter.png"; }
  return "images/toastWithStrawberrySpread.png";
}

function toastPrefixFromCream(cream) {
  if (cream === "peanut") { return ["PeanutButterToast"]; }
  if (cream === "honey") { return ["honeyToast", "HoneyToast"]; }
  return ["creamToast"];
}

function toastFruitOnlyImagesFromChoices() {
  let cream = toastState.cream || "strawberry";
  let fruit = toastState.fruitTopping || "berry";
  let fruitName = toastCap(fruit);
  let prefixes = toastPrefixFromCream(cream);
  let images = [];

  prefixes.forEach(prefix => images.push(`images/${prefix}${fruitName}.png`));

  if (cream === "strawberry" && fruit === "berry") {
    images.unshift("images/creamToastStrawberrys.png");
  }

  images.push(toastSpreadImageFromChoice());
  return images;
}

function toastFinalImageFromChoices() {
  let cream = toastState.cream || "strawberry";
  let fruit = toastState.fruitTopping || "berry";
  let extra = toastState.secondTopping || null;
  let fruitName = toastCap(fruit);
  let prefixes = toastPrefixFromCream(cream);
  let images = [];

  if (cream === "peanut" && fruit === "banana" && extra === "coconut") {
    images.push("images/finalpeanutButterBananaToast.png");
  }

  if (cream === "honey" && fruit === "apple" && extra === "drizzle") {
    images.push("images/finalappleHoneyToast.png");
    images.push("images/finalAppleHoneyToast.png");
  }

  if (cream === "strawberry" && fruit === "berry" && extra === "daisies") {
    images.push("images/finalstrawberryCreamToast.png");
    images.push("images/finalStrawberryCreamToast.png");
  }

  if (extra) {
    let extraName = toastCap(extra);
    prefixes.forEach(prefix => images.push(`images/${prefix}${fruitName}${extraName}.png`));

    if (cream === "peanut") {
      images.push(`images/peanutButterToast${fruitName}${extraName}.png`);
      images.push(`images/PenautButterToast${fruitName}${extraName}.png`);
      images.push(`images/penautbuterToast${fruitName}${extraName}.png`);
    }
  }

  return images.concat(toastFruitOnlyImagesFromChoices());
}

// ========================================
// UI
// ========================================

function showToastStep(num) {
  document.querySelectorAll("#toast-game-container .mini-step").forEach(el => el.classList.add("hidden"));
  show(document.getElementById(`toast-step-${num}`));
}

// ========================================
// EVENTS
// ========================================

function attachToastEvents() {
  document.querySelectorAll("#toast-step-1 [data-cream]").forEach(btn => {
    btn.addEventListener("click", () => {
      playSound("button");
      toastState.cream = btn.dataset.cream;
      showToastStep(2);
    });
  });

  const toastArea = document.querySelector(".toast-picture-area");

  toastArea.querySelectorAll("img").forEach(img => {
    img.setAttribute("draggable", "false");
    img.addEventListener("dragstart", event => event.preventDefault());
  });
  toastArea.addEventListener("mousedown", event => {
    playSound("creamSpread", { volume: 0.65 });
    event.preventDefault();
  });

  let progress = 0;
  toastArea.addEventListener("mousemove", event => {
    if (event.buttons !== 1) return;
    progress = Math.min(100, progress + 5);
    document.getElementById("toast-spread-progress").textContent = Math.round(progress) + "%";
    if (progress >= 80 && !toastState.spreadDone) {
      toastState.spreadDone = true;
      document.getElementById("toast-img").src = toastSpreadImageFromChoice();
      setTimeout(() => showToastStep(3), 450);
    }
  });

  document.querySelectorAll("#toast-step-3 [data-fruit]").forEach(btn => {
    btn.addEventListener("click", () => {
      playSound("fruitPlace");
      toastState.fruitTopping = btn.dataset.fruit;
      setImageWithFallback(document.getElementById("toast-img"), toastFruitOnlyImagesFromChoices());
      showToastStep(4);
    });
  });

  document.querySelectorAll("#toast-step-4 [data-extra]").forEach(btn => {
    btn.addEventListener("click", () => {
      playSound(btn.dataset.extra === "drizzle" ? "syrupPour" : "topping");
      toastState.secondTopping = btn.dataset.extra;
      setImageWithFallback(document.getElementById("toast-img"), toastFinalImageFromChoices());
      completeToastMaking();
    });
  });
}

// ========================================
// COMPLETION
// ========================================

function completeToastMaking() {
  let recipe = toastRecipeFromOrder();
  let isCorrect = toastState.cream === recipe.cream && toastState.spreadDone && toastState.fruitTopping === recipe.fruit && toastState.secondTopping === recipe.extra;
  let toastMsg;
  if (isCorrect) {
    toastMsg = "Perfect Toast!";
  } else {
    toastMsg = "Toast Served!";
  }
  finishMiniGame(isCorrect, currentOrder.price, "toast-game-container", toastMsg, "🍞", toastFinalImageFromChoices());
}