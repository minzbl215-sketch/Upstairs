/* ============================================================
   GAME.JS — engine. Edit story.js untuk isi cerita; file ini
   biasanya gak perlu diubah kecuali nambah fitur mekanik baru.
============================================================ */

(function () {
  "use strict";

  const loadingScreen  = document.getElementById("loading-screen");
  const loadingBarFill = document.getElementById("loading-bar-fill");
  const loadingStatus  = document.getElementById("loading-status");
  const titleScreen    = document.getElementById("title-screen");
  const cutsceneScreen = document.getElementById("cutscene-screen");
  const cutsceneCanvas = document.getElementById("cutscene-canvas");
  const cutsceneCtx    = cutsceneCanvas.getContext("2d");
  const cutsceneText   = document.getElementById("cutscene-text");
  const cutsceneNext   = document.getElementById("cutscene-next");
  const gameScreen     = document.getElementById("game-screen");
  const endScreen      = document.getElementById("end-screen");
  const canvas         = document.getElementById("scene-canvas");
  const ctx            = canvas.getContext("2d");
  const jsCanvas       = document.getElementById("jumpscare-canvas");
  const jsCtx          = jsCanvas.getContext("2d");
  const dialogueBox    = document.getElementById("dialogue-box");
  const dialogueName   = document.getElementById("dialogue-name");
  const dialogueText   = document.getElementById("dialogue-text");
  const sceneLabel     = document.getElementById("scene-label");
  const interactPrompt = document.getElementById("interact-prompt");

  let W = 0, H = 0, CW = 0, CH = 0;
  let flags = {};
  let currentScene = null;
  let player = { x: 0.5, y: 0.6, targetX: 0.5, targetY: 0.6, speed: 0.9 };
  let nearestHotspot = null;
  let state = "explore"; // explore | dialogue | jumpscare | cutscene
  let dialogueQueue = [];
  let dialogueTypingTimer = null;
  let pendingAfterDialogue = null;
  let audioCtx = null;
  let lastFrameTime = 0;

  // ---------------- Canvas sizing ----------------
  function resize() {
    W = canvas.parentElement.clientWidth;
    H = canvas.parentElement.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    jsCanvas.width = W * devicePixelRatio;
    jsCanvas.height = H * devicePixelRatio;
    jsCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    CW = cutsceneCanvas.parentElement.clientWidth;
    CH = cutsceneCanvas.parentElement.clientHeight;
    cutsceneCanvas.width = CW * devicePixelRatio;
    cutsceneCanvas.height = CH * devicePixelRatio;
    cutsceneCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener("resize", resize);

  // ---------------- Audio (no asset files needed) ----------------
  function ensureAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { audioCtx = null; }
    }
  }
  function playSting() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.5);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now); osc.stop(now + 0.65);
  }
  function playSoftAmbience() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(60, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.018, now + 2);
    gain.gain.linearRampToValueAtTime(0.0001, now + 4);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now); osc.stop(now + 4.1);
  }

  // ---------------- Scene handling ----------------
  function loadScene(id) {
    currentScene = STORY.scenes.find(s => s.id === id);
    if (!currentScene) return;
    player.x = player.targetX = currentScene.playerStart.x;
    player.y = player.targetY = currentScene.playerStart.y;
    sceneLabel.textContent = currentScene.label;
    nearestHotspot = null;
    interactPrompt.classList.add("hidden");
  }

  function findNearbyHotspot() {
    if (!currentScene) return null;
    let best = null, bestD = Infinity;
    for (const h of currentScene.hotspots) {
      if (h._used) continue;
      const dx = h.x - player.x, dy = h.y - player.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < h.r * 1.6 && d < bestD) { best = h; bestD = d; }
    }
    return best;
  }

  // ---------------- Input: tap to move / interact ----------------
  function screenToRel(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return { x: (clientX - rect.left) / rect.width, y: (clientY - rect.top) / rect.height };
  }

  canvas.addEventListener("pointerdown", (e) => {
    ensureAudio();
    if (state === "dialogue") { advanceDialogue(); return; }
    if (state !== "explore") return;

    const p = screenToRel(e.clientX, e.clientY);
    if (nearestHotspot) {
      const dx = nearestHotspot.x - p.x, dy = nearestHotspot.y - p.y;
      if (Math.sqrt(dx * dx + dy * dy) < nearestHotspot.r * 1.4) {
        interact(nearestHotspot);
        return;
      }
    }
    player.targetX = Math.min(0.94, Math.max(0.06, p.x));
    player.targetY = Math.min(0.9, Math.max(0.42, p.y));
  });

  dialogueBox.addEventListener("pointerdown", (e) => { e.stopPropagation(); advanceDialogue(); });

  // ---------------- Dialogue system ----------------
  function startDialogue(lines, after) {
    state = "dialogue";
    dialogueQueue = lines.slice();
    pendingAfterDialogue = after || null;
    dialogueBox.classList.remove("hidden");
    interactPrompt.classList.add("hidden");
    nextDialogueLine();
  }

  function nextDialogueLine() {
    clearTimeout(dialogueTypingTimer);
    if (dialogueQueue.length === 0) {
      dialogueBox.classList.add("hidden");
      state = "explore";
      const after = pendingAfterDialogue;
      pendingAfterDialogue = null;
      if (after) after();
      return;
    }
    const line = dialogueQueue.shift();
    dialogueName.textContent = line.name || "";
    dialogueText.textContent = "";
    dialogueText.__fullLine = line.text;
    let i = 0;
    const full = line.text;
    function type() {
      dialogueText.textContent = full.slice(0, i);
      i++;
      if (i <= full.length) dialogueTypingTimer = setTimeout(type, 18);
      else dialogueText.dataset.done = "1";
    }
    dialogueText.dataset.done = "0";
    type();
  }

  function advanceDialogue() {
    if (dialogueText.dataset.done === "0") {
      clearTimeout(dialogueTypingTimer);
      dialogueText.textContent = dialogueText.__fullLine || "";
      dialogueText.dataset.done = "1";
      return;
    }
    nextDialogueLine();
  }

  // ---------------- Interaction ----------------
  function interact(hotspot) {
    const locked = hotspot.requiresFlag && !flags[hotspot.requiresFlag];
    if (locked) {
      startDialogue(hotspot.lockedLines || [{ name: "", text: "..." }], null);
      return;
    }
    startDialogue(hotspot.lines || [], () => {
      if (hotspot.setFlag) flags[hotspot.setFlag] = true;
      if (hotspot.oneTime) hotspot._used = true;

      const proceed = () => afterInteractionEffects(hotspot);

      if (hotspot.jumpscare) {
        triggerJumpscare(hotspot.jumpscare, () => {
          if (hotspot.cutscene) playCutscene(hotspot.cutscene, proceed);
          else proceed();
        });
      } else if (hotspot.cutscene) {
        playCutscene(hotspot.cutscene, proceed);
      } else {
        proceed();
      }
    });
  }

  function afterInteractionEffects(hotspot) {
    if (hotspot.goto === "END") showEnd();
    else if (hotspot.goto) loadScene(hotspot.goto);
  }

  // ---------------- Jumpscare ----------------
  function triggerJumpscare(id, done) {
    const js = STORY.jumpscares[id];
    if (!js) { done && done(); return; }
    state = "jumpscare";
    jsCanvas.classList.remove("hidden");
    jsCanvas.classList.add("shake");
    playSting();
    if (js.vibrate && navigator.vibrate) navigator.vibrate(js.vibrate);

    const start = performance.now();
    function frame(now) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / js.duration);
      js.draw(jsCtx, W, H, t);
      if (elapsed < js.duration) requestAnimationFrame(frame);
      else {
        jsCanvas.classList.add("hidden");
        jsCanvas.classList.remove("shake");
        state = "explore";
        done && done();
      }
    }
    requestAnimationFrame(frame);
  }

  // ---------------- Cutscenes ----------------
  let cutsceneAnimHandle = null;
  let cutsceneLines = [];
  let cutsceneStartTime = 0;
  let cutsceneOnDone = null;

  function playCutscene(id, onDone) {
    const cs = STORY.cutscenes[id];
    if (!cs) { onDone && onDone(); return; }
    state = "cutscene";
    cutsceneOnDone = onDone;
    cutsceneLines = cs.lines.slice();
    gameScreen.classList.add("hidden");
    titleScreen.classList.add("hidden");
    cutsceneScreen.classList.remove("hidden");
    cutsceneStartTime = performance.now();

    function animate(now) {
      cs.draw(cutsceneCtx, CW, CH, now - cutsceneStartTime);
      cutsceneAnimHandle = requestAnimationFrame(animate);
    }
    cutsceneAnimHandle = requestAnimationFrame(animate);
    showNextCutsceneLine();
  }

  function showNextCutsceneLine() {
    if (cutsceneLines.length === 0) {
      cancelAnimationFrame(cutsceneAnimHandle);
      cutsceneScreen.classList.add("hidden");
      const done = cutsceneOnDone;
      cutsceneOnDone = null;
      state = "explore";
      if (done) done();
      return;
    }
    cutsceneText.textContent = cutsceneLines.shift();
  }

  cutsceneScreen.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    if (state !== "cutscene") return;
    showNextCutsceneLine();
  });

  // ---------------- Render loop (exploration) ----------------
  function render(now) {
    requestAnimationFrame(render);
    if (!currentScene || (state !== "explore" && state !== "dialogue")) return;
    const dt = Math.min(0.05, (now - lastFrameTime) / 1000 || 0);
    lastFrameTime = now;

    if (state === "explore") {
      const dx = player.targetX - player.x, dy = player.targetY - player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const step = player.speed * dt;
      if (dist > step) { player.x += (dx / dist) * step; player.y += (dy / dist) * step; }
      else { player.x = player.targetX; player.y = player.targetY; }

      const hs = findNearbyHotspot();
      if (hs !== nearestHotspot) {
        nearestHotspot = hs;
        interactPrompt.classList.toggle("hidden", !hs);
      }
    }

    ctx.clearRect(0, 0, W, H);
    currentScene.bg(ctx, W, H);

    for (const h of currentScene.hotspots) {
      if (h._used) continue;
      const px = h.x * W, py = h.y * H;
      const pulse = 0.5 + 0.5 * Math.sin(now / 500 + px);
      ctx.beginPath();
      ctx.arc(px, py, W * h.r * 0.35 * (0.85 + pulse * 0.15), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(184,216,201,0.07)";
      ctx.fill();
    }

    const pxp = player.x * W, pyp = player.y * H;
    const grad = ctx.createRadialGradient(pxp, pyp, 2, pxp, pyp, 34);
    grad.addColorStop(0, "rgba(223,227,223,0.22)");
    grad.addColorStop(1, "rgba(223,227,223,0)");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(pxp, pyp, 34, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#dfe3df";
    ctx.beginPath(); ctx.ellipse(pxp, pyp, 6, 9, 0, 0, Math.PI * 2); ctx.fill();
  }

  // ---------------- Screens ----------------
  function beginStory() {
    titleScreen.classList.add("hidden");
    resize();
    flags = {};
    playCutscene(STORY.openingCutscene, () => {
      gameScreen.classList.remove("hidden");
      loadScene(STORY.startScene);
      playSoftAmbience();
    });
  }
  function showEnd() {
    gameScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");
  }
  function showTitle() {
    endScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    cutsceneScreen.classList.add("hidden");
    titleScreen.classList.remove("hidden");
  }

  document.getElementById("btn-start").addEventListener("pointerdown", (e) => {
    e.stopPropagation(); ensureAudio();
    tryLockLandscape();
    beginStory();
  });
  document.getElementById("btn-restart").addEventListener("pointerdown", (e) => {
    e.stopPropagation(); showTitle();
  });

  // Best-effort: ask the browser to go fullscreen + lock to landscape.
  // Not all mobile browsers allow this outside an installed PWA — if it
  // fails, the CSS rotate-prompt overlay is the reliable fallback.
  function tryLockLandscape() {
    const root = document.getElementById("game-root");
    const req = root.requestFullscreen || root.webkitRequestFullscreen;
    if (req) {
      try { req.call(root).catch(() => {}); } catch (e) {}
    }
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock("landscape").catch(() => {});
    }
  }

  // ---------------- Loading sequence ----------------
  function runLoadingSequence() {
    const statuses = [
      "menyalakan lampu koridor...",
      "membuka kotak surat lama...",
      "memutar kunci warisan...",
      "menghitung lantai...",
      "hampir sampai...",
    ];
    let progress = 0, statusIdx = 0;
    loadingStatus.textContent = statuses[0];
    const timer = setInterval(() => {
      progress += 4 + Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        loadingBarFill.style.width = "100%";
        loadingStatus.textContent = "selesai.";
        setTimeout(() => {
          loadingScreen.classList.add("hidden");
          titleScreen.classList.remove("hidden");
        }, 400);
        return;
      }
      loadingBarFill.style.width = progress + "%";
      const nextIdx = Math.min(statuses.length - 1, Math.floor((progress / 100) * statuses.length));
      if (nextIdx !== statusIdx) { statusIdx = nextIdx; loadingStatus.textContent = statuses[statusIdx]; }
    }, 220);
  }

  resize();
  requestAnimationFrame((t) => { lastFrameTime = t; render(t); });
  runLoadingSequence();
})();
