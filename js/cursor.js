/**
 * PAUD-KB Nurul Ilmi Sumberadi
 * Butterfly Fluttering Cursor & Sparkle Blink-Blink Trail
 * Efek Kursor Kupu-kupu Cantik Terbang dengan Taburan Bintang Blink-Blink Berkilau
 */

(function () {
  'use strict';

  // Hormati preferensi reduced-motion pengguna
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Hanya aktifkan kursor kupu-kupu di perangkat pointer/mouse (desktop/laptop).
  // Nonaktifkan di HP / touch device agar scrolling super mulus 60fps tanpa lag & hemat baterai.
  if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  // 1. Buat Canvas Fullscreen Overlay
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.id = 'butterfly-sparkle-cursor';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  // 2. State Kursor & Kupu-kupu
  let mouseX = -200;
  let mouseY = -200;
  let butterflyX = -200;
  let butterflyY = -200;
  let butterflyAngle = -Math.PI / 4;
  let wingPhase = 0;
  let globalHue = 320; // Mulai dari warna ceria magenta/pink pastel
  let isMouseActive = false;
  let isHoveringInteractive = false;
  let lastMoveTime = 0;
  let isRunning = false;

  const sparkles = [];

  // 3. Fungsi Gambar Bintang 4 Sisi (✦ Blink-Blink Diamond Star)
  function drawDiamondSparkle(c, cx, cy, radius, innerRadius) {
    c.beginPath();
    c.moveTo(cx, cy - radius);
    c.quadraticCurveTo(cx, cy, cx + radius, cy);
    c.quadraticCurveTo(cx, cy, cx, cy + radius);
    c.quadraticCurveTo(cx, cy, cx - radius, cy);
    c.quadraticCurveTo(cx, cy, cx, cy - radius);
    c.closePath();
    c.fill();
  }

  // Fungsi Gambar Bintang 6 Sisi Berkilau (★ Twinkle Star)
  function drawTwinkleStar(c, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let step = Math.PI / spikes;
    c.beginPath();
    c.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      c.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
      rot += step;
      c.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
      rot += step;
    }
    c.closePath();
    c.fill();
  }

  // 4. Kelas Partikel Blink-Blink (Bertaburan di Belakang Kupu-kupu)
  class BlinkSparkle {
    constructor(x, y, vx, vy, isBurst = false) {
      this.x = x;
      this.y = y;
      this.initialSize = isBurst ? Math.random() * 8 + 5 : Math.random() * 6 + 3.2;
      this.size = this.initialSize;

      this.vx = vx;
      this.vy = vy;

      // Warna ceria pelangi & emas pastel
      const huePalette = [330, 280, 195, 45, 160, 20]; // Pink, ungu, biru langit, emas kuning, toska, oranye
      this.hue = huePalette[Math.floor(Math.random() * huePalette.length)];

      this.alpha = 1;
      this.decay = isBurst ? Math.random() * 0.02 + 0.015 : Math.random() * 0.025 + 0.018;

      // Efek berkedip (Blink-Blink)
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.28 + 0.16;

      this.rot = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.12;

      // Tipe: Diamond 4-point (50%), Twinkle 6-point (35%), Micro-orb glitter (15%)
      const randType = Math.random();
      if (randType < 0.5) {
        this.type = 'diamond';
      } else if (randType < 0.85) {
        this.type = 'twinkle';
      } else {
        this.type = 'orb';
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.035; // Gerak melayang turun perlahan dengan anggun
      this.vx *= 0.98;
      this.rot += this.vRot;

      this.twinklePhase += this.twinkleSpeed;
      this.alpha -= this.decay;
      this.size = Math.max(0, this.initialSize * (this.alpha > 0 ? this.alpha : 0));
    }

    draw(c) {
      if (this.alpha <= 0 || this.size <= 0.2) return;

      // Menghitung intensitas kedip nyata (Blink-Blink)
      const blinkIntensity = 0.45 + 0.55 * Math.sin(this.twinklePhase);
      const currentAlpha = Math.max(0, Math.min(1, this.alpha * blinkIntensity));

      c.save();
      c.translate(this.x, this.y);
      c.rotate(this.rot);
      c.globalAlpha = currentAlpha;

      // Kilau Cahaya (Glow Aura)
      c.shadowBlur = 10;
      c.shadowColor = `hsla(${this.hue}, 100%, 75%, ${currentAlpha * 0.9})`;

      if (this.type === 'diamond') {
        c.fillStyle = `hsla(${this.hue}, 95%, 80%, ${currentAlpha})`;
        drawDiamondSparkle(c, 0, 0, this.size, this.size * 0.25);

        // Titik putih terang di inti bintang
        c.fillStyle = '#ffffff';
        drawDiamondSparkle(c, 0, 0, this.size * 0.5, this.size * 0.12);
      } else if (this.type === 'twinkle') {
        c.fillStyle = `hsla(${this.hue}, 95%, 75%, ${currentAlpha})`;
        drawTwinkleStar(c, 0, 0, 6, this.size, this.size * 0.38);

        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
        c.fill();
      } else {
        // Lingkaran glitter lembut
        c.fillStyle = `hsla(${this.hue}, 100%, 85%, ${currentAlpha})`;
        c.beginPath();
        c.arc(0, 0, this.size * 0.7, 0, Math.PI * 2);
        c.fill();
      }

      c.restore();
    }
  }

  // 5. Fungsi Menggambar Kupu-Kupu Indah yang Sedang Terbang
  function drawButterfly(c, x, y, angle, wingSpread, hue, isHover) {
    c.save();
    c.translate(x, y);
    c.rotate(angle);

    const scale = isHover ? 1.25 : 1.05;
    c.scale(scale, scale);

    // Cahaya bercahaya lembut di sekeliling kupu-kupu
    c.shadowBlur = 14;
    c.shadowColor = `hsla(${hue}, 100%, 70%, 0.85)`;

    // Sayap Kupu-kupu (Dua Sisi: Kiri & Kanan dengan Kepakan 3D)
    // wingSpread berkisar antara 0.25 (sayap terlipat) sampai 1.0 (sayap terbuka penuh)
    const sides = [1, -1]; // Kanan (1) dan Kiri (-1)

    sides.forEach((side) => {
      c.save();
      c.scale(side * wingSpread, 1);

      // --- Sayap Atas (Forewing: Lebih besar, bergradasi cerah) ---
      const upperGrad = c.createRadialGradient(8, -8, 2, 16, -14, 26);
      upperGrad.addColorStop(0, '#ffffff');
      upperGrad.addColorStop(0.25, `hsla(${hue}, 95%, 75%, 0.95)`);
      upperGrad.addColorStop(0.65, `hsla(${(hue + 40) % 360}, 95%, 65%, 0.9)`);
      upperGrad.addColorStop(1, `hsla(${(hue + 80) % 360}, 100%, 60%, 0.8)`);

      c.beginPath();
      c.moveTo(1, -2);
      c.bezierCurveTo(8, -14, 18, -24, 25, -20);
      c.bezierCurveTo(30, -16, 28, -4, 20, 2);
      c.bezierCurveTo(14, 6, 6, 2, 1, 1);
      c.closePath();

      c.fillStyle = upperGrad;
      c.fill();
      c.lineWidth = 1.2;
      c.strokeStyle = `hsla(${hue}, 90%, 40%, 0.5)`;
      c.stroke();

      // Pola Bintik Indah di Tepi Sayap Atas (Motif Kupu-kupu)
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.arc(22, -16, 1.8, 0, Math.PI * 2);
      c.arc(18, -20, 1.4, 0, Math.PI * 2);
      c.arc(24, -10, 1.4, 0, Math.PI * 2);
      c.fill();

      // --- Sayap Bawah (Hindwing: Bulat ceria) ---
      const lowerGrad = c.createRadialGradient(6, 6, 1, 12, 12, 18);
      lowerGrad.addColorStop(0, '#ffffff');
      lowerGrad.addColorStop(0.3, `hsla(${(hue + 50) % 360}, 95%, 75%, 0.92)`);
      lowerGrad.addColorStop(0.7, `hsla(${(hue + 100) % 360}, 90%, 65%, 0.88)`);
      lowerGrad.addColorStop(1, `hsla(${(hue + 140) % 360}, 95%, 55%, 0.75)`);

      c.beginPath();
      c.moveTo(1, 2);
      c.bezierCurveTo(8, 5, 18, 8, 17, 18);
      c.bezierCurveTo(15, 23, 7, 24, 2, 16);
      c.bezierCurveTo(0, 12, 0, 7, 1, 2);
      c.closePath();

      c.fillStyle = lowerGrad;
      c.fill();
      c.lineWidth = 1.0;
      c.strokeStyle = `hsla(${(hue + 60) % 360}, 90%, 40%, 0.45)`;
      c.stroke();

      // Bintik di Sayap Bawah
      c.fillStyle = `hsla(${hue}, 100%, 95%, 0.9)`;
      c.beginPath();
      c.arc(13, 17, 1.4, 0, Math.PI * 2);
      c.arc(8, 20, 1.2, 0, Math.PI * 2);
      c.fill();

      c.restore();
    });

    // --- Tubuh Kupu-kupu (Body) ---
    c.shadowBlur = 4;
    c.shadowColor = '#0f172a';

    // Perut & Dada
    c.fillStyle = '#1e1b4b';
    c.beginPath();
    c.ellipse(0, 2, 2.2, 8.5, 0, 0, Math.PI * 2);
    c.fill();

    // Kepala Kupu-kupu
    c.beginPath();
    c.arc(0, -7.5, 2.5, 0, Math.PI * 2);
    c.fillStyle = '#0f172a';
    c.fill();

    // Kilau Emas di Punggung Tubuh
    c.fillStyle = '#fbbf24';
    c.beginPath();
    c.ellipse(0, 0, 1.2, 5, 0, 0, Math.PI * 2);
    c.fill();

    // --- Antena Kupu-kupu dengan Ujung Berkilau ---
    c.lineWidth = 1.3;
    c.strokeStyle = '#1e1b4b';

    // Antena Kiri
    c.beginPath();
    c.moveTo(-0.8, -9);
    c.quadraticCurveTo(-5, -15, -8, -18);
    c.stroke();

    // Antena Kanan
    c.beginPath();
    c.moveTo(0.8, -9);
    c.quadraticCurveTo(5, -15, 8, -18);
    c.stroke();

    // Ujung Antena Berpendar (Golden Tips)
    c.fillStyle = '#fde047';
    c.shadowBlur = 8;
    c.shadowColor = '#facc15';
    c.beginPath();
    c.arc(-8, -18, 1.6, 0, Math.PI * 2);
    c.arc(8, -18, 1.6, 0, Math.PI * 2);
    c.fill();

    c.restore();
  }

  // 6. Spawn Partikel Bertaburan di Belakang Kupu-Kupu
  function spawnTrailSparkles(x, y, count = 2, angle = 0, isBurst = false) {
    for (let i = 0; i < count; i++) {
      let vx, vy;
      if (isBurst) {
        const spreadAngle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + 1.8;
        vx = Math.cos(spreadAngle) * speed;
        vy = Math.sin(spreadAngle) * speed - 1.2;
      } else {
        // Meluncur berlawanan arah terbang kupu-kupu dengan hembusan angin
        const backAngle = angle + Math.PI + (Math.random() - 0.5) * 1.2;
        const speed = Math.random() * 1.8 + 0.6;
        vx = Math.cos(backAngle) * speed + (Math.random() - 0.5) * 0.8;
        vy = Math.sin(backAngle) * speed - (Math.random() * 0.8 + 0.2);
      }

      const jitterX = (Math.random() - 0.5) * 8;
      const jitterY = (Math.random() - 0.5) * 8;

      sparkles.push(new BlinkSparkle(x + jitterX, y + jitterY, vx, vy, isBurst));
    }

    // Batasi maksimum 25 partikel aktif agar tidak membebani kartu grafis & CPU
    if (sparkles.length > 25) {
      sparkles.splice(0, sparkles.length - 25);
    }

    startAnimationLoop();
  }

  function startAnimationLoop() {
    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(render);
    }
  }

  // 7. Loop Utama Animasi (60fps)
  function render(timestamp) {
    ctx.clearRect(0, 0, width, height);

    const now = performance.now();
    const timeSinceMove = now - lastMoveTime;

    // Perbarui & Gambar Kupu-kupu jika kursor aktif
    if (isMouseActive && butterflyX > -150) {
      // Lerp Halus: Kupu-kupu terbang mengejar kursor dengan gerakan anggun
      const followSpeed = isHoveringInteractive ? 0.22 : 0.16;
      const dx = mouseX - butterflyX;
      const dy = mouseY - butterflyY;
      const dist = Math.hypot(dx, dy);

      butterflyX += dx * followSpeed;
      butterflyY += dy * followSpeed;

      // Putar kupu-kupu menghadap ke arah terbangnya
      if (dist > 1.5) {
        const targetAngle = Math.atan2(dy, dx) - Math.PI / 2;
        let angleDiff = targetAngle - butterflyAngle;

        // Normalisasi sudut delta terkecil
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

        butterflyAngle += angleDiff * 0.18;
      }

      // Frekuensi kepakan sayap:
      // Makin cepat terbang = kepakan sayap makin cepat & lincah
      const flapSpeed = dist > 2
        ? 0.22 + Math.min(dist * 0.02, 0.45)
        : (isHoveringInteractive ? 0.25 : 0.12); // Saat diam, tetap bernapas/mengepak lembut

      wingPhase += flapSpeed;
      const wingSpread = 0.25 + 0.75 * Math.abs(Math.cos(wingPhase));

      // Rotasi warna pelangi kupu-kupu seiring terbang
      globalHue = (globalHue + 0.5) % 360;

      // Gambar Kupu-kupu
      drawButterfly(ctx, butterflyX, butterflyY, butterflyAngle, wingSpread, globalHue, isHoveringInteractive);
    }

    // Perbarui & Gambar Taburan Bintang Blink-Blink
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.update();
      s.draw(ctx);
      if (s.alpha <= 0 || s.size <= 0.2) {
        sparkles.splice(i, 1);
      }
    }

    // Lanjutkan frame hanya jika ada partikel aktif atau kursor baru saja digerakkan (<1.2 detik)
    if (sparkles.length > 0 || (isMouseActive && timeSinceMove < 1200)) {
      requestAnimationFrame(render);
    } else {
      isRunning = false;
      ctx.clearRect(0, 0, width, height);
    }
  }

  // 8. Event Listener Mouse Move
  let lastSpawnDistance = 0;
  let lastTrackX = 0;
  let lastTrackY = 0;

  function handlePointerMove(clientX, clientY) {
    isMouseActive = true;
    const now = performance.now();
    lastMoveTime = now;

    // Inisialisasi posisi awal kupu-kupu dekat kursor jika pertama kali
    if (butterflyX < -100) {
      butterflyX = clientX;
      butterflyY = clientY;
      lastTrackX = clientX;
      lastTrackY = clientY;
    }

    mouseX = clientX;
    mouseY = clientY;

    // Cek jarak gerak sejak spawn terakhir
    const dist = Math.hypot(clientX - lastTrackX, clientY - lastTrackY);
    lastSpawnDistance += dist;

    // Setiap gerakan (jarak > 10px), taburkan bintang blink-blink di belakang kupu-kupu!
    if (lastSpawnDistance >= 10) {
      const sparkleCount = isHoveringInteractive ? 3 : 2;
      spawnTrailSparkles(butterflyX, butterflyY, sparkleCount, butterflyAngle, false);
      lastSpawnDistance = 0;
      lastTrackX = clientX;
      lastTrackY = clientY;
    }

    startAnimationLoop();
  }

  window.addEventListener('mousemove', (e) => {
    // Deteksi hover pada elemen interaktif
    const target = e.target;
    isHoveringInteractive = !!(target && (
      target.closest('a') ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('textarea') ||
      target.closest('.gallery-item') ||
      target.closest('.card-hover-lift')
    ));

    handlePointerMove(e.clientX, e.clientY);
  }, { passive: true });

  // 9. Event Click (Letupan Indah Bintang Blink-Blink)
  window.addEventListener('click', (e) => {
    globalHue = (globalHue + 45) % 360;
    // Letupan taburan blink-blink spektakuler saat mengklik
    spawnTrailSparkles(e.clientX, e.clientY, 12, butterflyAngle, true);
  }, { passive: true });

  // 10. Event Mouse Keluar / Masuk Jendela
  window.addEventListener('mouseleave', () => {
    isMouseActive = false;
  });

  window.addEventListener('mouseenter', () => {
    isMouseActive = true;
  });

  // Hentikan loop jika tab browser diminimalkan / tidak aktif
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      ctx.clearRect(0, 0, width, height);
    }
  });

})();
