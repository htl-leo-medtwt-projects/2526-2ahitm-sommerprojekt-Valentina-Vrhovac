// ========================================
// SOUND DESIGN MANAGER
// ========================================
/*Teilweise Hilfe (Google + ChatGPT => kleine schwierigkeiten)*/

const SoundDesign = (() => {
  let defaultMusicVolume = 0.5;
  let defaultSoundVolume = 0.5;

  let musicVolume = readVolume("musicVolume", defaultMusicVolume);
  let soundVolume = readVolume("soundVolume", defaultSoundVolume);
  let backgroundMusic = null;
  let musicStartWanted = true;

  let missingFiles = new Set();
  let activeSounds = new Map();

  let library = {
    backgroundGame: ["sounds/background_music_game.mp3"],

    button: ["sounds/button_click.mp3"],
    menuOpen: ["sounds/button_click.mp3"],
    menuClose: ["sounds/button_click.mp3"],
    popup: ["sounds/order_popup.mp3", "sounds/button_click.mp3"],
    order: ["sounds/order_popup.mp3"],
    guestEnter: ["sounds/order_popup.mp3"],
    guestLeave: ["sounds/button_click.mp3"],

    levelUnlock: ["sounds/level_unlock.mp3"],
    coins: ["sounds/coins_gain.mp3"],

    dragPickup: ["sounds/drag_pickup.mp3", "sounds/drag_pickupmp3.mp3"],
    dragDrop: ["sounds/drag_drop.mp3"],
    correct: ["sounds/coins_gain.mp3", "sounds/drag_drop.mp3"],
    wrong: ["sounds/button_click.mp3"],

    teaBag: ["sounds/drag_drop.mp3"],
    pourWater: ["sounds/milk_pour.mp3"],

    matchaScoop: ["sounds/drag_drop.mp3"],
    matchaWhisk: ["sounds/matcha_whisk.mp3"],
    milkPour: ["sounds/milk_pour.mp3"],
    iceDrop: ["sounds/ice_drop.mp3"],
    syrupPour: ["sounds/milk_pour.mp3"],

    coffeeMachine: ["sounds/coffee_pour.mp3"],
    coffeePour: ["sounds/coffee_pour.mp3"],
    stir: ["sounds/spoon_stir.mp3"],

    creamSpread: ["sounds/cream_spread.mp3"],
    fruitPlace: ["sounds/drag_drop.mp3"],
    topping: ["sounds/drag_drop.mp3"],
    complete: ["sounds/coins_gain.mp3"],

    ratingPerfect: ["sounds/coins_gain.mp3"],
    ratingGood: ["sounds/coins_gain.mp3"],
    ratingWrong: ["sounds/button_click.mp3"]
  };

  let maxDurations = {
    coffeeMachine: 0.9,
    coffeePour: 0.9,
    milkPour: 0.8,
    pourWater: 0.8,
    syrupPour: 0.55,
    matchaWhisk: 1.0,
    stir: 0.75,
    creamSpread: 0.75,
    coins: 0.9,
    levelUnlock: 1.2,
    order: 0.8,
    popup: 0.7,
    guestEnter: 0.7,
    complete: 0.9,
    ratingPerfect: 0.9,
    ratingGood: 0.75,
    ratingWrong: 0.55
  };

  let cooldowns = {
    button: 90,
    dragPickup: 80,
    dragDrop: 80,
    coffeePour: 500,
    milkPour: 450,
    pourWater: 450,
    syrupPour: 350,
    matchaWhisk: 550,
    stir: 450,
    creamSpread: 450
  };

  let lastPlayedAt = new Map();

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  function readVolume(key, fallback) {
    let saved = localStorage.getItem(key);
    if (saved === null) return fallback;

    let value = Number(saved);
    if (Number.isNaN(value)) return fallback;

    return clamp01(value);
  }

  function saveVolume(key, value) {
    localStorage.setItem(key, String(clamp01(value)));
  }

  function clamp01(value) {
    let num = Number(value);
    if (!num) {
      num = 0;
    }
    return Math.max(0, Math.min(1, num));
  }

  function getSources(name) {
    let sources = library[name];
    if (!sources) {
      sources = [`sounds/${name}.mp3`];
    }
    return sources;
  }

  // ========================================
  // SOUND PLAYBACK
  // ========================================

  function getMusic() {
    if (!backgroundMusic) {
      backgroundMusic = new Audio(library.backgroundGame[0]);
      backgroundMusic.loop = true;
      backgroundMusic.preload = "auto";
      backgroundMusic.volume = musicVolume;

      backgroundMusic.addEventListener("error", () => {
        missingFiles.add(library.backgroundGame[0]);
      }, { once: true });
    }

    return backgroundMusic;
  }

  function play(name, options = {}) {
    let now = Date.now();
    let cooldown = cooldowns[name];
    if (cooldown === null || cooldown === undefined) {
      cooldown = 0;
    }
    let last = lastPlayedAt.get(name);
    if (last === null || last === undefined) {
      last = 0;
    }

    if (cooldown && now - last < cooldown) return;
    lastPlayedAt.set(name, now);

    let sources = getSources(name).filter(src => !missingFiles.has(src));
    if (sources.length === 0 || soundVolume <= 0) return;

    let maxDuration = options.maxDuration;
    if (maxDuration === null || maxDuration === undefined) {
      maxDuration = maxDurations[name];
    }
    let volume = options.volume;
    if (volume === null || volume === undefined) {
      volume = 1;
    }
    let startAt = options.startAt;
    if (startAt === null || startAt === undefined) {
      startAt = 0;
    }
    let restart = options.restart;
    if (restart === null || restart === undefined) {
      restart = true;
    }
    playFromSources(sources, {
      name,
      volume: soundVolume * volume,
      maxDuration,
      startAt: startAt,
      restart: restart
    });
  }

  function playFromSources(sources, options, index = 0) {
    if (index >= sources.length) return;

    let src = sources[index];

    if (options.restart && activeSounds.has(options.name)) {
      let oldAudio = activeSounds.get(options.name);
      oldAudio.pause();
      oldAudio.currentTime = 0;
      activeSounds.delete(options.name);
    }

    let audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = clamp01(options.volume);

    audio.addEventListener("loadedmetadata", () => {
      if (options.startAt > 0 && options.startAt < audio.duration) {
        audio.currentTime = options.startAt;
      }
    }, { once: true });

    audio.addEventListener("ended", () => {
      activeSounds.delete(options.name);
    }, { once: true });

    audio.addEventListener("error", () => {
      missingFiles.add(src);
      activeSounds.delete(options.name);
      playFromSources(sources, options, index + 1);
    }, { once: true });

    if (options.maxDuration) {
      window.setTimeout(() => fadeOutAndStop(audio, options.name), options.maxDuration * 1000);
    }

    activeSounds.set(options.name, audio);

    let promise = audio.play();
    if (promise) {
      promise.catch(() => {
        activeSounds.delete(options.name);
      });
    }
  }

  function fadeOutAndStop(audio, name) {
    if (!audio || audio.paused) return;

    let steps = 6;
    let startVolume = audio.volume;
    let currentStep = 0;

    let fade = window.setInterval(() => {
      currentStep += 1;
      audio.volume = Math.max(0, startVolume * (1 - currentStep / steps));

      if (currentStep >= steps) {
        window.clearInterval(fade);
        audio.pause();
        audio.currentTime = 0;
        activeSounds.delete(name);
      }
    }, 35);
  }

  // ========================================
  // MUSIC MANAGEMENT
  // ========================================

  function startMusic() {
    musicStartWanted = true;
    let music = getMusic();
    music.volume = musicVolume;

    if (musicVolume <= 0 || missingFiles.has(library.backgroundGame[0])) {
      music.pause();
      return;
    }

    let promise = music.play();
    if (promise) {
      promise.catch(() => {
      });
    }
  }

  function prepareAutostart() {
    getMusic();
    startMusic();

    let unlock = () => {
      if (musicStartWanted) startMusic();
    };

    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
  }

  function stopMusic() {
    musicStartWanted = false;
    if (!backgroundMusic) return;
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }

  function setMusicVolume(value) {
    musicVolume = clamp01(value);
    saveVolume("musicVolume", musicVolume);

    let music = getMusic();
    music.volume = musicVolume;

    if (musicVolume === 0) {
      music.pause();
      return;
    }

    if (musicStartWanted) {
      startMusic();
    }
  }

  function setSoundVolume(value) {
    soundVolume = clamp01(value);
    saveVolume("soundVolume", soundVolume);
  }

  function getMusicVolumePercent() {
    return Math.round(musicVolume * 100);
  }

  function getSoundVolumePercent() {
    return Math.round(soundVolume * 100);
  }

  return {
    play,
    startMusic,
    prepareAutostart,
    stopMusic,
    setMusicVolume,
    setSoundVolume,
    getMusicVolumePercent,
    getSoundVolumePercent
  };
})();

function playSound(name, options) {
  SoundDesign.play(name, options);
}

function startBackgroundMusic() {
  SoundDesign.startMusic();
}

function stopBackgroundMusic() {
  SoundDesign.stopMusic();
}