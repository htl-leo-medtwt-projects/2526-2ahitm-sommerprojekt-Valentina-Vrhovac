// ========================================
// MENU BOOK
// ========================================

const pages = [
  "images/menu-page1.png",
  "images/menu-page2.png",
  "images/menu-page3.png",
  "images/menu-page4.png"
];

let currentIndex = 0;

// ========================================
// UPDATE BOOK DISPLAY
// ========================================

function updateBook() {
  let leftPage = document.getElementById("page-left");
  let rightPage = document.getElementById("page-right");
  let leftArrow = document.querySelector(".arrow.left");
  let rightArrow = document.querySelector(".arrow.right");

  if (leftPage) {
    leftPage.src = pages[currentIndex];
  }
  if (rightPage) {
    rightPage.src = pages[currentIndex + 1];
  }

  toggle(leftArrow, "disabled", currentIndex === 0);
  toggle(rightArrow, "disabled", currentIndex >= pages.length - 2);

  updateLocks();
}

// ========================================
// LEVEL LOCKS & DISPLAY
// ========================================

function updateLocks() {
  let lockOverlayLeft = document.querySelector(".lock-overlay-left");
  let lockOverlay1 = document.querySelector(".lock-overlay-1");
  let lockOverlay2 = document.querySelector(".lock-overlay-2");

  [lockOverlayLeft, lockOverlay1, lockOverlay2].forEach(lock => {
    if (lock) {
      lock.style.display = "none";
    }
  });

  if (currentIndex === 0) {
    setLockPosition(lockOverlay1, "6rem", "1.7rem", "10rem", "5.5rem", 2);
    setLockPosition(lockOverlay2, "15.3rem", "11.3rem", "8rem", "5.5rem", 2);
  }

  if (currentIndex === 2) {
    setLockPosition(lockOverlayLeft, "2.3rem", "1.5rem", "12rem", "9rem", 3);
    setLockPosition(lockOverlay1, "2.8rem", "0.5rem", "19rem", "4rem", 5);
    setLockPosition(lockOverlay2, "13.3rem", "0.5rem", "19rem", "3.5rem", 4);
  }
}

function setLockPosition(element, bottom, left, width, height, levelNumber) {
  if (!element) {
    return;
  }

  if (typeof isLevelUnlocked === "function" && isLevelUnlocked(levelNumber)) {
    element.style.display = "none";
    return;
  }

  element.style.bottom = bottom;
  element.style.left = left;
  element.style.width = width;
  element.style.height = height;
  element.style.display = "flex";
  addLevelImage(element, levelNumber);
}

function addLevelImage(container, levelNum) {
  let levelImg = container.querySelector(".level-img");

  if (!levelImg) {
    levelImg = document.createElement("img");
    levelImg.classList.add("level-img");
    levelImg.style.position = "absolute";
    levelImg.style.width = "1.8rem";
    levelImg.style.height = "1.8rem";
    levelImg.style.left = "4rem";
    levelImg.style.top = "0.5rem";
    levelImg.style.objectFit = "contain";
    container.appendChild(levelImg);
  }

  levelImg.src = `images/level${levelNum}.png`;
}

function animatePageTurn() {
  let leftPage = document.getElementById("page-left");
  let rightPage = document.getElementById("page-right");

  if (leftPage) {
    leftPage.classList.add("fade");
  }
  if (rightPage) {
    rightPage.classList.add("fade");
  }

  setTimeout(() => {
    updateBook();
    if (leftPage) {
      leftPage.classList.remove("fade");
    }
    if (rightPage) {
      rightPage.classList.remove("fade");
    }
  }, 150);
}

function initMenuBook() {
  let leftArrow = document.querySelector(".arrow.left");
  let rightArrow = document.querySelector(".arrow.right");

  if (rightArrow) {
    rightArrow.addEventListener("click", () => {
      if (currentIndex < pages.length - 2) {
        currentIndex += 2;
        animatePageTurn();
      }
    });
  }

  if (leftArrow) {
    leftArrow.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex -= 2;
        animatePageTurn();
      }
    });
  }

  updateBook();
}