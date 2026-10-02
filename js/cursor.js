/**
 * PAUD-KB Nurul Ilmi Sumberadi
 * Aesthetic Rainbow & Sparkles Cursor Trail
 * Animasi Kursor Pelangi Estetik, Lembut, & Ceria untuk Website Sekolah
 */

(function () {
  'use strict';

  // Deteksi kursor mouse nyata (pointer: fine) dan hormati preferensi reduced-motion
  if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Siapkan canvas fullscreen
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.id = 'aesthetic-rainbow-cursor';
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

  // State Partikel & Kursor
  const particles = [];
  let mouseX = -100;
  let mouseY = -100;
  let followerX = -100;
  let followerY = -100;
  let lastX = null;
  let lastY = null;
  let lastMoveTime = 0;
  let lastSpawnTime = 0;
  let hue = 0;
  let isMouseOver = false;
  let isHoveringInteractive = false;
  let isRunning = false;

  // Fungsi menggambar bintang 4 sisi bercahaya (✦ Sparkle)
  function drawSparkleStar(context, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    context.beginPath();
    context.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      context.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      context.lineTo(x, y);
      rot += step;
    }
    context.lineTo(cx, cy - outerRadius);
    context.closePath();
    context.fill();
  }

  // Kelas Partikel Pelangi
  class RainbowSparkle {
    constructor(x, y, isClick = false) {
      this.x = x;
      this.y = y;
      this.initialSize = isClick ? Math.random() * 8 + 6 : Math.random() * 6 + 3.5;
      this.size = this.initialSize;

      const angle = Math.random() * Math.PI * 2;
      const speed = isClick ? Math.random() * 4.5 + 1.8 : Math.random() * 1.6 + 0.4;

      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - (isClick ? 1.2 : 0.45); // Gerak melayang anggun

      this.hue = (hue + Math.random() * 40 - 20) % 360;
      this.alpha = 1;
      this.decay = isClick ? Math.random() * 0.022 + 0.018 : Math.random() * 0.028 + 0.022;
      this.rotation = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.16;

      // 70% Bintang berkilau ✦, 30% Gelembung pastel bercahaya 🫧
      this.type = Math.random() > 0.3 ? 'star' : 'bubble';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.025; // Efek gravitasi halus
      this.vx *= 0.985;
      this.rotation += this.vRot;
      this.alpha -= this.decay;
      this.size = Math.max(0, this.initialSize * (this.alpha > 0 ? this.alpha : 0));
    }

    draw(context) {
      if (this.alpha <= 0 || this.size <= 0.1) return;

      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.rotation);
      context.globalAlpha = Math.max(0, this.alpha);

      // Glow estetik pelangi
      context.shadowBlur = 10;
      context.shadowColor = `hsla(${this.hue}, 95%, 65%, ${this.alpha * 0.9})`;

      if (this.type === 'star') {
        context.fillStyle = `hsla(${this.hue}, 95%, 70%, ${this.alpha})`;
        drawSparkleStar(context, 0, 0, 4, this.size, this.size * 0.36);
      } else {
        // Bubble gelembung pelangi transparan
        const grad = context.createRadialGradient(-this.size * 0.3, -this.size * 0.3, 0, 0, 0, this.size);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, `hsla(${this.hue}, 90%, 75%, ${this.alpha})`);
        grad.addColorStop(1, `hsla(${this.hue}, 95%, 60%, ${this.alpha * 0.65})`);
        context.fillStyle = grad;
        context.beginPath();
        context.arc(0, 0, this.size, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();
    }
  }

  function spawnParticles(x, y, count = 2, isClick = false) {
    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 8;
      const offsetY = (Math.random() - 0.5) * 8;
      particles.push(new RainbowSparkle(x + offsetX, y + offsetY, isClick));
    }
    startLoop();
  }

  function startLoop() {
    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(render);
    }
  }

  function render(time) {
    ctx.clearRect(0, 0, width, height);

    // 1. Gambar cincin pelangi lembut pengikut kursor (Cursor Follower Ring)
    const timeSinceMove = time - lastMoveTime;
    if (isMouseOver && followerX > 0 && followerY > 0 && timeSinceMove < 2500) {
      // Lerp interpolasi halus agar mengikuti mouse dengan mulus
      followerX += (mouseX - followerX) * 0.22;
      followerY += (mouseY - followerY) * 0.22;

      const followerAlpha = Math.max(0, 1 - timeSinceMove / 2500);
      const ringRadius = isHoveringInteractive ? 16 : 10;

      ctx.save();
      ctx.globalAlpha = followerAlpha * (isHoveringInteractive ? 0.9 : 0.7);
      ctx.shadowBlur = 12;
      ctx.shadowColor = `hsla(${hue}, 100%, 65%, 0.8)`;

      // Gradien cincin pelangi berputar
      ctx.beginPath();
      ctx.arc(followerX, followerY, ringRadius, 0, Math.PI * 2);
      ctx.lineWidth = isHoveringInteractive ? 2.5 : 1.8;
      ctx.strokeStyle = `hsla(${hue}, 95%, 65%, ${followerAlpha})`;
      ctx.stroke();

      // Titik tengah berkilau
      ctx.beginPath();
      ctx.arc(followerX, followerY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(hue + 180) % 360}, 100%, 80%, ${followerAlpha})`;
      ctx.fill();

      ctx.restore();
    }

    // 2. Perbarui & Gambar Jejak Partikel Pelangi
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    // Lanjutkan animasi jika masih ada partikel atau kursor sedang aktif bergerak
    if (particles.length > 0 || (isMouseOver && timeSinceMove < 2500)) {
      requestAnimationFrame(render);
    } else {
      isRunning = false;
      ctx.clearRect(0, 0, width, height);
    }
  }

  // Event Listener Mouse Move
  window.addEventListener('mousemove', (e) => {
    isMouseOver = true;
    const now = performance.now();
    lastMoveTime = now;

    mouseX = e.clientX;
    mouseY = e.clientY;

    if (followerX === -100) {
      followerX = mouseX;
      followerY = mouseY;
    }

    // Perubahan gradasi warna pelangi setiap pergeseran kursor
    hue = (hue + 5) % 360;

    // Periksa apakah kursor berada di atas tombol, link, atau elemen interaktif
    const target = e.target;
    isHoveringInteractive = !!(target && (
      target.closest('a') ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('.gallery-item')
    ));

    // Pembuatan jejak partikel berdasarkan jarak perpindahan
    if (lastX !== null && lastY !== null) {
      const dist = Math.hypot(mouseX - lastX, mouseY - lastY);

      if (dist > 3 && now - lastSpawnTime > 14) {
        const count = isHoveringInteractive
          ? Math.min(4, Math.max(2, Math.floor(dist / 10)))
          : Math.min(3, Math.max(1, Math.floor(dist / 14)));

        spawnParticles(mouseX, mouseY, count, false);
        lastSpawnTime = now;
      }
    } else {
      spawnParticles(mouseX, mouseY, 1, false);
      lastSpawnTime = now;
    }

    lastX = mouseX;
    lastY = mouseY;
    startLoop();
  }, { passive: true });

  // Event Listener Mouse Click (Efek Letupan Bintang Pelangi Menyenangkan)
  window.addEventListener('click', (e) => {
    hue = (hue + 50) % 360;
    spawnParticles(e.clientX, e.clientY, 10, true);
  }, { passive: true });

  // Event Mouse Keluar Jendela
  window.addEventListener('mouseleave', () => {
    isMouseOver = false;
    lastX = null;
    lastY = null;
  });

  window.addEventListener('mouseenter', () => {
    isMouseOver = true;
  });

})();
