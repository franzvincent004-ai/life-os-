/*
 * ======================================================================
 * 05 · JAVASCRIPT-ANWENDUNGSLOGIK
 * ======================================================================
 * 01  Three.js / 3D-Roboter
 * 02  Storage-Core
 * 03  Sound-System
 * 05  Accounts, Login & Backups
 * 06  App-Design & Themes
 * 07  Datenmodelle & Standardwerte
 * 08  Roboter-Shop & Skins
 * 09  Daily Challenges
 * 10  App-Start, Splash & Navigation
 * 11  Roboter-Reaktionen & Emotionen
 * 12  Confetti / visuelle Effekte
 * 13  Habits, Uhrzeiten & Kalorien
 * 14  Rank-System
 * 15  Dashboard, Statistiken & Tagesarchiv
 * 16  Globale Modals & Diagramme
 * 17  Trainingspläne
 * 18  Gym
 * 19  Schule & Noten
 * 20  Initialisierung & PWA
 * ======================================================================
 */

// ==================== 05.01 · THREE.JS / 3D-ROBOTER ====================
var R3D = (function () {
  var scene, camera, renderer, robot, parts, animState, clock;
  var container = null;
  var running = false;

  function init(el) {
    container = el;
    if (!container || !window.THREE) return;
    // Scene
    scene = new THREE.Scene();
    // Camera – closer, face-focused
    camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 1.55, 4.6);
    camera.lookAt(0, 1.3, 0);
    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    // Lights – stronger front fill so face is always readable
    var amb = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(amb);
    var dir = new THREE.DirectionalLight(0xffffff, 1.35);
    dir.position.set(2.5, 5.5, 4.5);
    dir.castShadow = true;
    dir.shadow.mapSize.set(512, 512);
    scene.add(dir);
    var rim = new THREE.DirectionalLight(0x88aacc, 0.55);
    rim.position.set(-3.5, 3.5, -2);
    scene.add(rim);
    var point = new THREE.PointLight(0xffffff, 0.55, 12);
    point.position.set(0, 2.2, 3.5);
    scene.add(point);
    // Face fill light (cool cyan tint)
    var faceFill = new THREE.PointLight(0x66ddff, 0.45, 8);
    faceFill.position.set(0, 2.6, 2.8);
    scene.add(faceFill);
    // Ground plane (shadow receiver)
    var groundGeo = new THREE.PlaneGeometry(10, 10);
    var groundMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.8;
    ground.receiveShadow = true;
    scene.add(ground);
    // Clock
    clock = new THREE.Clock();
    animState = { idle: 0, target: "idle", t: 0, react: "", reactT: 0 };
    running = true;
    animate();
    // Resize
    window.addEventListener("resize", onResize);
  }

  function onResize() {
    if (!container || !renderer || !camera) return;
    var w = container.clientWidth,
      h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function hexStr(s) {
    return s || "#888";
  }

  function buildRobot(cfg) {
    if (robot) {
      scene.remove(robot);
    }
    robot = new THREE.Group();
    var c1 = new THREE.Color(cfg.c1);
    var c2 = new THREE.Color(cfg.c2);
    var acc = new THREE.Color(cfg.accent);
    var met = new THREE.Color(cfg.metal || cfg.c2);
    var eyeC = new THREE.Color(cfg.eye);
    var rar = (cfg.rarity || "common").toLowerCase();

    var bodyMat = new THREE.MeshStandardMaterial({
      color: c1,
      metalness: 0.1,
      roughness: 0.35,
    });
    var darkMat = new THREE.MeshStandardMaterial({
      color: c2,
      metalness: 0.15,
      roughness: 0.4,
    });
    var accMat = new THREE.MeshStandardMaterial({
      color: acc,
      metalness: 0.25,
      roughness: 0.25,
      emissive: acc,
      emissiveIntensity: 0.6,
    });
    var eyeMat = new THREE.MeshBasicMaterial({ color: eyeC });
    var eyeGlowMat = new THREE.MeshBasicMaterial({
      color: eyeC,
      transparent: true,
      opacity: 0.4,
    });
    var faceMat = new THREE.MeshStandardMaterial({
      color: 0x0a1422,
      metalness: 0.4,
      roughness: 0.3,
    });

    parts = {
      head: new THREE.Group(),
      torso: new THREE.Group(),
      armL: new THREE.Group(),
      armR: new THREE.Group(),
      legL: new THREE.Group(),
      legR: new THREE.Group(),
      eyeL: null,
      eyeR: null,
      lidL: null,
      lidR: null,
      smile: null,
    };

    // HEAD
    var head = new THREE.Mesh(new THREE.SphereGeometry(1.0, 48, 36), bodyMat);
    head.castShadow = true;
    parts.head.add(head);

    // antenna
    var bump = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 16), bodyMat);
    bump.position.y = 0.88;
    bump.scale.set(1.0, 0.6, 1.0);
    bump.castShadow = true;
    parts.head.add(bump);
    var tip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 12), accMat);
    tip.position.y = 1.1;
    parts.head.add(tip);

    // ears
    var earL = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 14), bodyMat);
    earL.position.set(-1.0, 0, 0);
    earL.scale.set(0.4, 0.85, 0.6);
    earL.castShadow = true;
    parts.head.add(earL);
    var earR = earL.clone();
    earR.position.x = 1.0;
    parts.head.add(earR);

    // FACE – large dark oval plate (always front)
    var faceGeo = new THREE.SphereGeometry(
      0.7,
      32,
      24,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.85,
    );
    var face = new THREE.Mesh(faceGeo, faceMat);
    face.scale.set(1.05, 0.95, 0.55);
    face.position.set(0, 0.02, 0.55);
    parts.head.add(face);

    // Eyes as thick bright tubes (happy arcs) – MeshBasic so always visible
    function makeEye(x) {
      var g = new THREE.Group();
      var arc = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.06, 12, 28, Math.PI * 1.2),
        eyeMat,
      );
      arc.rotation.z = Math.PI * 0.9;
      g.add(arc);
      var glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 12, 10),
        eyeGlowMat,
      );
      glow.position.set(0, 0.02, -0.03);
      glow.scale.set(1.2, 0.85, 0.45);
      g.add(glow);
      g.position.set(x, 0.14, 0.95);
      return g;
    }
    parts.eyeL = makeEye(-0.28);
    parts.eyeR = makeEye(0.28);
    parts.head.add(parts.eyeL);
    parts.head.add(parts.eyeR);

    // lids
    var lidMat = new THREE.MeshStandardMaterial({
      color: 0x0a1422,
      roughness: 0.4,
    });
    parts.lidL = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.28, 0.07),
      lidMat,
    );
    parts.lidL.position.set(-0.28, 0.28, 0.98);
    parts.lidL.scale.y = 0.02;
    parts.head.add(parts.lidL);
    parts.lidR = parts.lidL.clone();
    parts.lidR.position.x = 0.28;
    parts.head.add(parts.lidR);

    // smile
    parts.smile = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.045, 10, 28, Math.PI * 1.0),
      eyeMat,
    );
    parts.smile.rotation.x = Math.PI / 2;
    parts.smile.rotation.z = Math.PI;
    parts.smile.position.set(0, -0.15, 0.95);
    parts.head.add(parts.smile);

    // highlight
    var hl = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 12, 10),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
      }),
    );
    hl.position.set(-0.3, 0.5, 0.55);
    parts.head.add(hl);

    parts.head.position.y = 2.0;
    robot.add(parts.head);

    // BODY
    var body = new THREE.Mesh(new THREE.SphereGeometry(1.0, 40, 32), bodyMat);
    body.scale.set(1.12, 1.22, 0.95);
    body.castShadow = true;
    parts.torso.add(body);

    var chest = new THREE.Mesh(new THREE.CircleGeometry(0.15, 24), accMat);
    chest.position.set(0, 0.18, 0.92);
    parts.torso.add(chest);

    var bodyHl = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 12, 10),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
      }),
    );
    bodyHl.position.set(-0.2, 0.3, 0.7);
    bodyHl.scale.set(1, 0.8, 0.3);
    parts.torso.add(bodyHl);

    parts.torso.position.y = 0.6;
    robot.add(parts.torso);

    // ARMS
    function mkArm(side) {
      var arm = new THREE.Group();
      var s = side === "l" ? -1 : 1;
      var a = new THREE.Mesh(new THREE.SphereGeometry(0.3, 18, 14), bodyMat);
      a.scale.set(0.65, 1.45, 0.6);
      a.castShadow = true;
      a.position.y = -0.28;
      arm.add(a);
      var hand = new THREE.Mesh(
        new THREE.SphereGeometry(0.17, 12, 10),
        bodyMat,
      );
      hand.position.y = -0.82;
      arm.add(hand);
      arm.position.set(s * 1.18, 1.15, 0.05);
      arm.rotation.z = s * 0.28;
      return arm;
    }
    parts.armL = mkArm("l");
    parts.armR = mkArm("r");
    robot.add(parts.armL);
    robot.add(parts.armR);

    // feet
    var fL = new THREE.Mesh(new THREE.SphereGeometry(0.25, 14, 12), bodyMat);
    fL.scale.set(1.1, 0.36, 1);
    fL.position.set(-0.3, -0.32, 0.05);
    fL.castShadow = true;
    parts.legL.add(fL);
    var fR = fL.clone();
    fR.position.x = 0.3;
    parts.legR.add(fR);
    robot.add(parts.legL);
    robot.add(parts.legR);

    // rarity
    if (
      rar === "rare" ||
      rar === "epic" ||
      rar === "legendary" ||
      rar === "mythic"
    ) {
      var ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.72, 0.028, 8, 40),
        accMat,
      );
      ring.position.set(0, 0.02, 0.82);
      parts.head.add(ring);
      var oL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), accMat);
      oL.position.set(-1.05, 1.3, 0.1);
      robot.add(oL);
      var oR = oL.clone();
      oR.position.x = 1.05;
      robot.add(oR);
    }
    if (rar === "epic" || rar === "legendary" || rar === "mythic") {
      var r1 = new THREE.Mesh(
        new THREE.TorusGeometry(1.35, 0.016, 8, 48),
        new THREE.MeshBasicMaterial({
          color: acc,
          transparent: true,
          opacity: 0.28,
        }),
      );
      r1.rotation.x = Math.PI / 2.2;
      r1.position.y = 0.9;
      robot.add(r1);
    }
    if (rar === "legendary" || rar === "mythic") {
      for (var i = -2; i <= 2; i++) {
        var sp = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.22, 5), accMat);
        sp.position.set(i * 0.15, 2.9, 0);
        robot.add(sp);
      }
    }
    if (rar === "mythic") {
      var wMat = new THREE.MeshStandardMaterial({
        color: acc,
        emissive: acc,
        emissiveIntensity: 0.65,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      var wL = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 12, 10, 0, Math.PI, 0, Math.PI),
        wMat,
      );
      wL.position.set(-1.35, 1.4, -0.25);
      wL.rotation.y = 0.35;
      wL.rotation.z = 0.3;
      wL.scale.set(0.28, 1.15, 0.8);
      robot.add(wL);
      var wR = wL.clone();
      wR.position.x = 1.35;
      wR.rotation.y = -0.35;
      wR.rotation.z = -0.3;
      robot.add(wR);
      var aura = new THREE.Mesh(
        new THREE.SphereGeometry(2.1, 20, 16),
        new THREE.MeshBasicMaterial({
          color: acc,
          transparent: true,
          opacity: 0.04,
          side: THREE.BackSide,
        }),
      );
      aura.position.y = 1.15;
      robot.add(aura);
    }

    robot.position.y = -0.2;
    scene.add(robot);
  }

  function updateColors(cfg) {
    if (!parts) return;
    var c1 = new THREE.Color(cfg.c1),
      c2 = new THREE.Color(cfg.c2),
      acc = new THREE.Color(cfg.accent),
      met = new THREE.Color(cfg.metal || cfg.c2),
      eyeC = new THREE.Color(cfg.eye);
    // Update materials on key meshes
    parts.head.children.forEach(function (m) {
      if (
        m.material &&
        m.material.metalness > 0.5 &&
        m.material.metalness < 0.8
      )
        m.material.color.copy(c1);
    });
    // We just rebuild for color changes to keep it simple
    buildRobot(cfg);
  }

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);
    var dt = clock.getDelta();
    var t = clock.getElapsedTime();
    if (!robot || !parts) {
      renderer.render(scene, camera);
      return;
    }

    // Per-robot animation style
    var animStyle = window._currentRobotAnim || "standard";
    var speedMul =
      animStyle === "heavy"
        ? 0.6
        : animStyle === "agile"
          ? 1.5
          : animStyle === "energetic"
            ? 1.3
            : animStyle === "floaty"
              ? 0.85
              : 1;
    var ampMul =
      animStyle === "heavy"
        ? 1.4
        : animStyle === "agile"
          ? 0.7
          : animStyle === "energetic"
            ? 1.25
            : animStyle === "floaty"
              ? 1.6
              : 1;
    var isMythic = window._currentRobotRarity === "mythic";
    var isLeg = window._currentRobotRarity === "legendary" || isMythic;

    // Idle floating (cute bob)
    var floatY = Math.sin(t * 1.15 * speedMul) * 0.18 * ampMul;
    var floatRot = Math.sin(t * 0.65 * speedMul) * 0.05 * ampMul;
    robot.position.y = -0.2 + floatY;
    robot.rotation.y = floatRot;
    if (isMythic) {
      robot.rotation.z = Math.sin(t * 0.9) * 0.04;
      robot.scale.setScalar(1 + Math.sin(t * 1.4) * 0.025);
    } else {
      robot.scale.set(1, 1, 1);
    }

    // Head subtle look / tilt
    parts.head.rotation.y = Math.sin(t * 0.85 * speedMul) * 0.1 * ampMul;
    parts.head.rotation.z = Math.sin(t * 0.55) * 0.04;
    parts.head.rotation.x = Math.sin(t * 0.7) * 0.03;

    // Arm idle sway
    parts.armL.rotation.x = 0.05 + Math.sin(t * 1.0 * speedMul) * 0.1 * ampMul;
    parts.armR.rotation.x =
      0.05 + Math.sin(t * 1.0 * speedMul + Math.PI) * 0.1 * ampMul;
    parts.armL.rotation.z = 0.25 + Math.sin(t * 0.7) * 0.05;
    parts.armR.rotation.z = -0.25 - Math.sin(t * 0.7) * 0.05;

    // Mythic / legendary: extra sparkle pulse on eyes
    if (isLeg && parts.head.children.length > 4) {
      var pulse = 0.9 + Math.sin(t * 3.2) * 0.35;
      // soft scale on face elements if present
    }

    // Reactions
    if (animState.react && animState.reactT > 0) {
      animState.reactT -= dt;
      var p = 1 - animState.reactT / animState.reactDur;
      if (animState.react === "excited") {
        robot.position.y = -0.2 + Math.sin(p * Math.PI * 3) * 0.5 * (1 - p);
        robot.rotation.y += dt * 8 * (1 - p);
        var s = 1 + Math.sin(p * Math.PI * 4) * 0.1 * (1 - p);
        robot.scale.set(s, 2 - s, s);
      } else if (animState.react === "dance") {
        robot.position.y = -0.2 + Math.abs(Math.sin(p * Math.PI * 5)) * 0.6;
        robot.rotation.y += dt * 12;
        robot.rotation.z = Math.sin(p * Math.PI * 8) * 0.15;
        parts.armL.rotation.x = Math.sin(p * Math.PI * 6) * 0.8;
        parts.armR.rotation.x = Math.sin(p * Math.PI * 6 + 1) * 0.8;
      } else if (animState.react === "wave") {
        parts.armR.rotation.x = -1.5 + Math.sin(p * Math.PI * 4) * 0.4;
        parts.armR.rotation.z = -0.3;
      } else if (animState.react === "nod") {
        parts.head.rotation.x = Math.sin(p * Math.PI * 3) * 0.2;
      } else if (animState.react === "tilt") {
        parts.head.rotation.z = Math.sin(p * Math.PI) * 0.25;
      } else if (animState.react === "surprised") {
        var sc = 1 + Math.sin(p * Math.PI) * 0.15;
        robot.scale.set(sc, sc, sc);
        robot.position.y = -0.2 + Math.sin(p * Math.PI) * 0.3;
      }
      if (animState.reactT <= 0) {
        animState.react = "";
        robot.scale.set(1, 1, 1);
        robot.rotation.z = 0;
      }
    }

    renderer.render(scene, camera);
  }

  function playReact(name, dur) {
    if (!robot) return;
    animState.react = name;
    animState.reactDur = dur || 1;
    animState.reactT = dur || 1;
    if (name === "excited") {
      // Spawn particles
      spawnParticles3D(12);
    } else if (name === "dance") {
      spawnParticles3D(20);
    }
  }

  function spawnParticles3D(count) {
    if (!scene) return;
    for (var i = 0; i < count; i++) {
      var geo = new THREE.SphereGeometry(0.04 + Math.random() * 0.06, 6, 6);
      var col = Math.random() > 0.5 ? 0x7ba889 : 0xfbbf24;
      var mat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 1,
      });
      var p = new THREE.Mesh(geo, mat);
      p.position.set(
        (Math.random() - 0.5) * 2,
        1 + Math.random() * 3,
        (Math.random() - 0.5) * 2,
      );
      scene.add(p);
      var vx = (Math.random() - 0.5) * 3,
        vy = 2 + Math.random() * 3,
        vz = (Math.random() - 0.5) * 3;
      var life = 1;
      (function (particle, vx, vy, vz) {
        function tick() {
          life -= 0.03;
          if (life <= 0) {
            scene.remove(particle);
            return;
          }
          particle.position.x += vx * 0.016;
          particle.position.y += vy * 0.016;
          particle.position.z += vz * 0.016;
          vy -= 3 * 0.016;
          particle.material.opacity = life;
          particle.scale.setScalar(life);
          requestAnimationFrame(tick);
        }
        tick();
      })(p, vx, vy, vz);
    }
  }

  var _blinkT = 0;
  function blink() {
    if (!parts || !parts.lidL || !parts.lidR) return;
    // close
    parts.lidL.scale.y = 1;
    parts.lidR.scale.y = 1;
    parts.lidL.position.y = 0.14;
    parts.lidR.position.y = 0.14;
    // hide eye glow during blink
    if (parts.eyeL) parts.eyeL.visible = false;
    if (parts.eyeR) parts.eyeR.visible = false;
    setTimeout(function () {
      if (!parts || !parts.lidL) return;
      parts.lidL.scale.y = 0.01;
      parts.lidR.scale.y = 0.01;
      parts.lidL.position.y = 0.28;
      parts.lidR.position.y = 0.28;
      if (parts.eyeL) parts.eyeL.visible = true;
      if (parts.eyeR) parts.eyeR.visible = true;
    }, 120);
  }

  function dispose() {
    running = false;
    if (renderer) {
      renderer.dispose();
    }
    if (container) container.innerHTML = "";
    window.removeEventListener("resize", onResize);
  }

  return {
    init: init,
    buildRobot: buildRobot,
    updateColors: updateColors,
    playReact: playReact,
    dispose: dispose,
    spawnParticles3D: spawnParticles3D,
    blink: blink,
  };
})();
