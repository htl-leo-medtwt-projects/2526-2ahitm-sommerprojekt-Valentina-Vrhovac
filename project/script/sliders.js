/* ============================================
   SLIDER CONTROLS
   ============================================ */

/*Teilweise Hilfe (Google + ChatGPT => Slider)*/
let draggedStrawberry = null;

function updateAllSliders() {
  let sliders = document.querySelectorAll(".slider");
  
  sliders.forEach(slider => {
    updateSliderBackground(slider);
  });
}

function updateSliderBackground(slider) {
  let minValue = parseInt(slider.min);
  let maxValue = parseInt(slider.max);
  let currentValue = parseInt(slider.value);
  
  let percentage = ((currentValue - minValue) / (maxValue - minValue)) * 100;
  
  slider.style.background = 
    `linear-gradient(to right, #FFFFFF 0%, #FFFFFF ${percentage}%, #F3D1D1 ${percentage}%, #F3D1D1 100%)`;
}

function getSliderFromStrawberry(strawberry) {
  let track = strawberry.closest(".slider-track");
  return track.querySelector(".slider");
}

function updateStrawberryPosition(strawberry, slider) {
  let track = strawberry.closest(".slider-track");
  let trackWidth = track.offsetWidth;
  let sliderValue = parseInt(slider.value);
  
  let position = (sliderValue / 100) * trackWidth;
  
  let strawberryWidth = strawberry.offsetWidth || 24;
  position = position - (strawberryWidth / 2);
  
  strawberry.style.left = position + "px";
  
  updateSliderBackground(slider);
}

function initSliders() {
  let sliders = document.querySelectorAll(".slider");
  sliders.forEach(slider => {
    slider.addEventListener("input", () => {
      updateAllSliders();
    });
  });

  updateAllSliders();
}

function initStrawberries() {
  let strawberries = document.querySelectorAll(".strawberry-drag");

  strawberries.forEach(strawberry => {
    let slider = getSliderFromStrawberry(strawberry);
    
    updateStrawberryPosition(strawberry, slider);
    
    strawberry.addEventListener("mousedown", (event) => {
      draggedStrawberry = strawberry;
      strawberry.classList.add("dragging");
      event.preventDefault();
    });
  });

  document.addEventListener("mousemove", (event) => {
    if (!draggedStrawberry) {
      return;
    }
    
    let slider = getSliderFromStrawberry(draggedStrawberry);
    let track = draggedStrawberry.closest(".slider-track");
    let trackRect = track.getBoundingClientRect();
    
    let mouseX = event.clientX - trackRect.left;
    
    if (mouseX < 0) mouseX = 0;
    if (mouseX > trackRect.width) mouseX = trackRect.width;
    
    let percentage = (mouseX / trackRect.width) * 100;
    
    slider.value = Math.round(percentage);
    
    updateAllSliders();
    updateStrawberryPosition(draggedStrawberry, slider);
  });

  document.addEventListener("mouseup", () => {
    if (draggedStrawberry) {
      draggedStrawberry.classList.remove("dragging");
      draggedStrawberry = null;
    }
  });

  window.addEventListener("resize", () => {
    strawberries.forEach(strawberry => {
      let slider = getSliderFromStrawberry(strawberry);
      updateStrawberryPosition(strawberry, slider);
    });
  });
}