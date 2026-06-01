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

  let minValue = Number(slider.min);
  let maxValue = Number(slider.max);
  let currentValue = Number(slider.value);

  let percentage = ((currentValue - minValue) / (maxValue - minValue)) * 100;

  strawberry.style.left = percentage + "%";
  strawberry.style.transform = "translateX(-50%)";

  updateSliderBackground(slider);
}

// ========================================
// SLIDER INITIALIZATION
// ========================================

function initSliders() {
  const musicSlider = document.querySelector(".music-slider");
  const soundSlider = document.querySelector(".sound-slider");

  if (musicSlider && typeof SoundDesign !== "undefined") {
    musicSlider.value = SoundDesign.getMusicVolumePercent();
  }

  if (soundSlider && typeof SoundDesign !== "undefined") {
    soundSlider.value = SoundDesign.getSoundVolumePercent();
  }

  document.querySelectorAll(".slider").forEach(slider => {
    slider.addEventListener("input", () => {
      const strawberry = slider.closest(".slider-track")?.querySelector(".strawberry-drag");
      updateStrawberryPosition(strawberry, slider);
      updateAllSliders();

      if (typeof SoundDesign !== "undefined") {
        if (slider.classList.contains("music-slider")) {
          SoundDesign.setMusicVolume(Number(slider.value) / 100);
          SoundDesign.startMusic();
        }

        if (slider.classList.contains("sound-slider")) {
          SoundDesign.setSoundVolume(Number(slider.value) / 100);
          playSound("button", { volume: 0.35 });
        }
      }
    });
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
      playSound("dragPickup", { volume: 0.45 });
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

    if (typeof SoundDesign !== "undefined") {
      if (slider.classList.contains("music-slider")) {
        SoundDesign.setMusicVolume(Number(slider.value) / 100);
      }

      if (slider.classList.contains("sound-slider")) {
        SoundDesign.setSoundVolume(Number(slider.value) / 100);
      }
    }

    updateAllSliders();
    updateStrawberryPosition(draggedStrawberry, slider);
  });

  document.addEventListener("mouseup", () => {
    if (!draggedStrawberry) {
      return;
    }
    draggedStrawberry.classList.remove("dragging");
    playSound("dragDrop", { volume: 0.35 });
    draggedStrawberry = null;
  });

  window.addEventListener("resize", () => {
    strawberries.forEach(strawberry => {
      updateStrawberryPosition(strawberry, getSliderFromStrawberry(strawberry));
    });
  });
}