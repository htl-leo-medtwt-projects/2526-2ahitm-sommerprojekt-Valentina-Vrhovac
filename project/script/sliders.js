// ========================================
// SLIDER CONTROLS
// ========================================
/*Teilweise Hilfe (Google + ChatGPT => Slider)*/

let draggedStrawberry = null;

function updateAllSliders() {
  document.querySelectorAll(".slider").forEach(slider => {
    updateSliderBackground(slider);
  });
}

function updateSliderBackground(slider) {
  let minValue = Number(slider.min);
  let maxValue = Number(slider.max);
  let currentValue = Number(slider.value);
  let percentage = ((currentValue - minValue) / (maxValue - minValue)) * 100;

  slider.style.background = `linear-gradient(to right, #FFFFFF 0%, #FFFFFF ${percentage}%, #F3D1D1 ${percentage}%, #F3D1D1 100%)`;
}

// ========================================
// HELPERS
// ========================================

function getSliderFromStrawberry(strawberry) {
  let track = strawberry.closest(".slider-track");
  if (track) {
    return track.querySelector(".slider");
  } else {
    return null;
  }
}

function updateStrawberryPosition(strawberry, slider) {
  if (!strawberry || !slider) {
    return;
  }

  let track = strawberry.closest(".slider-track");
  if (!track) {
    return;
  }

  let trackWidth = track.offsetWidth;
  let sliderValue = Number(slider.value);
  let position = (sliderValue / 100) * trackWidth;
  let strawberryWidth = strawberry.offsetWidth || 24;
  position -= strawberryWidth / 2;

  strawberry.style.left = position + "px";
  updateSliderBackground(slider);
}

// ========================================
// SLIDER INITIALIZATION
// ========================================

function initSliders() {
  document.querySelectorAll(".slider").forEach(slider => {
    slider.addEventListener("input", updateAllSliders);
  });

  updateAllSliders();
}

// ========================================
// STRAWBERRY DRAG
// ========================================

function initStrawberries() {
  const strawberries = document.querySelectorAll(".strawberry-drag");

  strawberries.forEach(strawberry => {
    let slider = getSliderFromStrawberry(strawberry);
    updateStrawberryPosition(strawberry, slider);

    strawberry.addEventListener("mousedown", event => {
      draggedStrawberry = strawberry;
      strawberry.classList.add("dragging");
      event.preventDefault();
    });
  });

  document.addEventListener("mousemove", event => {
    if (!draggedStrawberry) {
      return;
    }

    let slider = getSliderFromStrawberry(draggedStrawberry);
    const track = draggedStrawberry.closest(".slider-track");
    if (!slider || !track) {
      return;
    }

    let trackRect = track.getBoundingClientRect();
    let mouseX = event.clientX - trackRect.left;
    mouseX = Math.max(0, Math.min(trackRect.width, mouseX));

    let percentage = (mouseX / trackRect.width) * 100;
    slider.value = Math.round(percentage);

    updateAllSliders();
    updateStrawberryPosition(draggedStrawberry, slider);
  });

  document.addEventListener("mouseup", () => {
    if (!draggedStrawberry) {
      return;
    }
    draggedStrawberry.classList.remove("dragging");
    draggedStrawberry = null;
  });

  window.addEventListener("resize", () => {
    strawberries.forEach(strawberry => {
      updateStrawberryPosition(strawberry, getSliderFromStrawberry(strawberry));
    });
  });
}