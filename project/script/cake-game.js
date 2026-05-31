// ========================================
// CAKE CUP GAME
// ========================================
const cakeState = { cream: null, layers: [], topping: null };
const cakeRecipes = {
  strawberry: {
    cream: "strawberry",
    topping: "strawberry",
    final: "images/strawberryCakeCup.png",
    fruitLayer: "images/strawberryLayer.png",
    creamLayer: "images/strawberryCreamLayer.png",
    creamImg: "images/strawberryCream.png",
    toppingImg: "images/strawberryPieces.png"
  },
  banana: {
    cream: "banana",
    topping: "banana",
    final: "images/bananaCakeCup.png",
    fruitLayer: "images/bananaLayer.png",
    creamLayer: "images/bananaCreamLayer.png",
    creamImg: "images/bananaCream.png",
    toppingImg: "images/bananaSlices.png"
  },
  raspberry: {
    cream: "raspberry",
    topping: "raspberry",
    final: "images/raspberryCakeCup.png",
    fruitLayer: "images/raspberryLayer.png",
    creamLayer: "images/raspberryCreamLayer.png",
    creamImg: "images/raspberryCream.png",
    toppingImg: "images/raspberrys.png"
  }
};

// ========================================
// START GAME/CONTENT
// ========================================

function startCakeGame() {
  const container = document.getElementById("game-content");
  if (!container) { return; }
  hide(document.getElementById("order-dialog"));
  hide(document.querySelector(".game-cat"));
  removeMiniGames();

  cakeState.cream = null;
  cakeState.layers = [];
  cakeState.topping = null;

  const wrap = document.createElement("div");
  wrap.id = "cake-game-container";
  wrap.className = "mini-game-overlay pretty-mini-game picture-game";
  wrap.innerHTML = `
    <div class="mini-game-card pretty-card picture-card cake-card">
      <h2>Cake Cup Station</h2>
      <p class="mini-instruction">Choose cream, stack the image layers, then choose topping.</p>

      <div class="mini-step" id="cake-step-1">
        <h3>Step 1: Choose cream</h3>
        <div class="choice-row image-choice-row">
          <button class="image-choice" data-cream="strawberry"><img src="images/strawberryCream.png"><span>Strawberry</span></button>
          <button class="image-choice" data-cream="banana"><img src="images/bananaCream.png"><span>Banana</span></button>
          <button class="image-choice" data-cream="raspberry"><img src="images/raspberryCream.png"><span>Raspberry</span></button>
        </div>
      </div>

      <div class="mini-step hidden" id="cake-step-2">
        <h3>Step 2: Build layers</h3>
        <p class="small-help">Drag into the cup: cake → cream → fruit → cake → cream.</p>
        <div class="cake-picture-builder">
          <div id="cake-layer-source" class="cake-layer-source"></div>
          <div id="cake-layer-target" class="cake-cup-target">
            <span class="cup-label">Drop layers here</span>
          </div>
        </div>
      </div>

      <div class="mini-step hidden" id="cake-step-3">
        <h3>Step 3: Choose topping</h3>
        <div class="choice-row image-choice-row">
          <button class="image-choice" data-topping="strawberry"><img src="images/strawberryPieces.png"><span>Strawberry</span></button>
          <button class="image-choice" data-topping="banana"><img src="images/bananaSlices.png"><span>Banana</span></button>
          <button class="image-choice" data-topping="raspberry"><img src="images/raspberrys.png"><span>Raspberry</span></button>
        </div>
      </div>
    </div>`;
  container.appendChild(wrap);
  attachCakeEvents();
}

// ========================================
// HELPERS
// ========================================

function cakeFlavorFromOrder() {
  let name = currentOrder.item.toLowerCase();
  if (name.includes("banana")) { return "banana"; }
  if (name.includes("raspberry")) { return "raspberry"; }
  return "strawberry";
}

function showCakeStep(num) {
  document.querySelectorAll("#cake-game-container .mini-step").forEach(el => el.classList.add("hidden"));
  show(document.getElementById("cake-step-" + num));
}

// ========================================
// LAYERS
// ========================================

function attachCakeEvents() {
  document.querySelectorAll("#cake-step-1 [data-cream]").forEach(btn => {
    btn.addEventListener("click", () => {
      playSound("button");
      cakeState.cream = btn.dataset.cream;
      buildCakeLayerChoices();
      showCakeStep(2);
    });
  });

  document.querySelectorAll("#cake-step-3 [data-topping]").forEach(btn => {
    btn.addEventListener("click", () => {
      playSound("topping");
      cakeState.topping = btn.dataset.topping;
      completeCakeMaking();
    });
  });
}

function buildCakeLayerChoices() {
  let flavor = cakeState.cream || cakeFlavorFromOrder();
  let recipe = cakeRecipes[flavor] || cakeRecipes.strawberry;
  const source = document.getElementById("cake-layer-source");
  const target = document.getElementById("cake-layer-target");
  cakeState.layers = [];
  source.innerHTML = "";
  target.innerHTML = `<span class="cup-label">Drop layers here</span>`;

  const layers = [
    { key: "cake", label: "Cake", img: "images/cakeLayer.png" },
    { key: "cream", label: "Cream", img: recipe.creamLayer },
    { key: "fruit", label: "Fruit", img: recipe.fruitLayer },
    { key: "cake", label: "Cake", img: "images/cakeLayer.png" },
    { key: "cream", label: "Cream", img: recipe.creamLayer }
  ].sort(() => Math.random() - 0.5);

  layers.forEach((layer, index) => {
    const card = document.createElement("img");
    card.className = "cake-layer-img";
    card.draggable = true;
    card.dataset.layer = layer.key;
    card.id = "cake-layer-" + index;
    card.src = layer.img;
    card.alt = layer.label;
    source.appendChild(card);
    card.addEventListener("dragstart", e => {
      playSound("dragPickup");
      e.dataTransfer.setData("text/plain", card.id);
    });
  });

  target.addEventListener("dragover", e => {
    e.preventDefault();
    target.classList.add("picture-hover");
  });
  target.addEventListener("dragleave", () => target.classList.remove("picture-hover"));
  target.addEventListener("drop", e => {
    e.preventDefault();
    playSound("dragDrop");
    target.classList.remove("picture-hover");
    const id = e.dataTransfer.getData("text/plain");
    const card = document.getElementById(id);
    if (!card || card.dataset.used === "yes") { return; }
    const label = target.querySelector(".cup-label");
    if (label) { label.remove(); }
    cakeState.layers.push(card.dataset.layer);
    card.dataset.used = "yes";
    card.draggable = false;
    target.appendChild(card);
    if (cakeState.layers.length === 5) { setTimeout(() => showCakeStep(3), 500); }
  });
}

// ========================================
// IMAGE GENERATION
// ========================================

function cakeCap(value) {
  if (!value) { return ""; }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function cakeFilePrefix(flavor) {
  if (flavor === "banana") { return "BananaCakeCup"; }
  if (flavor === "raspberry") { return "RaspberryCakeCup"; }
  return "strawberryCakeCup";
}

function cakeFinalImagesFromChoices() {
  let orderFlavor = cakeFlavorFromOrder();
  let cream = cakeState.cream || orderFlavor;
  let topping = cakeState.topping || cream;
  let normal;
  if (cakeRecipes[cream]) {
    normal = cakeRecipes[cream].final;
  } else {
    normal = cakeRecipes.strawberry.final;
  }

  if (cream !== topping) {
    let prefix = cakeFilePrefix(cream);
    return [
      `images/${prefix}${cakeCap(topping)}.png`,
      `images/${cream}CakeCup${cakeCap(topping)}.png`,
      `images/${cream}Cup${cakeCap(topping)}.png`,
      normal
    ];
  }

  return [normal, `images/${cakeFilePrefix(cream)}.png`, `images/${cream}Cup.png`];
}

// ========================================
// COMPLETION
// ========================================

function completeCakeMaking() {
  let orderFlavor = cakeFlavorFromOrder();
  let correctLayers = ["cake", "cream", "fruit", "cake", "cream"];
  let layersCorrect = true;

  if (cakeState.layers.length !== correctLayers.length) {
    layersCorrect = false;
  } else {
    for (let i = 0; i < correctLayers.length; i++) {
      if (cakeState.layers[i] !== correctLayers[i]) {
        layersCorrect = false;
      }
    }
  }

  let isCorrect = cakeState.cream === orderFlavor && layersCorrect && cakeState.topping === orderFlavor;

  let cakeMsg;
  if (isCorrect) {
    cakeMsg = "Perfect Cake Cup!";
  } else {
    cakeMsg = "Cake Cup Served!";
  }
  finishMiniGame(isCorrect, currentOrder.price, "cake-game-container", cakeMsg, "🍰", cakeFinalImagesFromChoices());
}