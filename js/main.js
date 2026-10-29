/**
 * PAUD-KB Nurul Ilmi Sumberadi
 * Main Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    }
    // Close mobile menu on clicking any navigation link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Desktop Dropdown Click/Touch Toggle
  document.querySelectorAll('nav .group > button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = btn.nextElementSibling;
      if (dropdown) {
        const isHidden = dropdown.classList.contains('hidden');
        document.querySelectorAll('nav .group > div').forEach(d => d.classList.add('hidden'));
        if (isHidden) {
          dropdown.classList.remove('hidden');
        }
      }
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('nav .group > div').forEach(dropdown => {
      dropdown.classList.add('hidden');
    });
  });

  // 2. Navbar Sticky Shadow on Scroll
  const headerNav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      headerNav?.classList.add('shadow-md', 'bg-white/95');
      headerNav?.classList.remove('bg-white');
    } else {
      headerNav?.classList.remove('shadow-md', 'bg-white/95');
      headerNav?.classList.add('bg-white');
    }
  }, { passive: true });

  // 3. Counter Animation for Stat Metrics
  const counters = document.querySelectorAll('.counter-value');
  let animated = false;

  const countUp = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      let current = 0;
      const step = Math.ceil(target / 40);

      const updateCounter = () => {
        current += step;
        if (current >= target) {
          counter.innerText = target + suffix;
        } else {
          counter.innerText = current + suffix;
          requestAnimationFrame(updateCounter);
        }
      };
      updateCounter();
    });
  };

  const statSection = document.getElementById('stats-section');
  if (statSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          countUp();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(statSection);
  }

  // 4. PPDB Modal Dialog Handling
  const ppdbModal = document.getElementById('ppdb-modal');
  const openPpdbBtns = document.querySelectorAll('.btn-open-ppdb');
  const closePpdbBtn = document.getElementById('btn-close-ppdb');
  const ppdbForm = document.getElementById('ppdb-form');

  openPpdbBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetJenjang = btn.getAttribute('data-jenjang');
      const selectJenjang = document.getElementById('ppdb-jenjang');
      if (targetJenjang && selectJenjang) {
        selectJenjang.value = targetJenjang;
      }
      if (ppdbModal) {
        ppdbModal.showModal();
      }
    });
  });

  if (closePpdbBtn && ppdbModal) {
    closePpdbBtn.addEventListener('click', () => {
      ppdbModal.close();
    });
  }

  // Light dismiss on backdrop click
  if (ppdbModal) {
    ppdbModal.addEventListener('click', (e) => {
      const dialogDimensions = ppdbModal.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        ppdbModal.close();
      }
    });
  }

  // 5. WhatsApp PPDB Form Submission
  if (ppdbForm) {
    ppdbForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const namaAnak = document.getElementById('ppdb-nama-anak')?.value.trim();
      const panggilan = document.getElementById('ppdb-panggilan')?.value.trim();
      const usia = document.getElementById('ppdb-usia')?.value.trim();
      const jenjang = document.getElementById('ppdb-jenjang')?.value;
      const orangTua = document.getElementById('ppdb-ortu')?.value.trim();
      const noHp = document.getElementById('ppdb-hp')?.value.trim();
      const alamat = document.getElementById('ppdb-alamat')?.value.trim();
      const catatan = document.getElementById('ppdb-catatan')?.value.trim() || '-';

      const waPhone = '6287718082751';
      const text = `*FORMULIR PENDAFTARAN PPDB ONLINE*\n` +
        `*PAUD-KB Nurul Ilmi Sumberadi*\n` +
        `-----------------------------------------\n` +
        `👤 *Nama Lengkap Anak:* ${namaAnak}\n` +
        `👶 *Nama Panggilan:* ${panggilan}\n` +
        `🎂 *Usia / Tgl Lahir:* ${usia}\n` +
        `🏫 *Pilihan Program:* ${jenjang}\n` +
        `👨‍👩‍👧 *Nama Orang Tua / Wali:* ${orangTua}\n` +
        `📱 *No. WhatsApp:* ${noHp}\n` +
        `🏡 *Alamat Domisili:* ${alamat}\n` +
        `📝 *Catatan / Pertanyaan:* ${catatan}\n` +
        `-----------------------------------------\n` +
        `Assalamu'alaikum Bapak/Ibu Guru PAUD-KB Nurul Ilmi, saya bermaksud mendaftarkan ananda kami. Mohon informasi syarat dan jadwal selanjutnya. Terima kasih! 🙏`;

      const encodedText = encodeURIComponent(text);
      window.open(`https://wa.me/${waPhone}?text=${encodedText}`, '_blank');
      if (ppdbModal) ppdbModal.close();
      ppdbForm.reset();
    });
  }

  // 6. Direct Contact Consultation Form
  const consultForm = document.getElementById('consult-form');
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nama = document.getElementById('consult-nama')?.value.trim();
      const pesan = document.getElementById('consult-pesan')?.value.trim();
      const subjek = document.getElementById('consult-subjek')?.value || 'Konsultasi Belajar';

      const waPhone = '6287718082751';
      const text = `*KONSULTASI & PERTANYAAN*\n` +
        `*PAUD-KB Nurul Ilmi Sumberadi*\n` +
        `-----------------------------------------\n` +
        `👤 *Nama Penanya:* ${nama}\n` +
        `📌 *Perihal / Subjek:* ${subjek}\n` +
        `💬 *Pesan:* ${pesan}\n` +
        `-----------------------------------------\n` +
        `Mohon informasinya Bapak/Ibu Guru. Terima kasih!`;

      const encodedText = encodeURIComponent(text);
      window.open(`https://wa.me/${waPhone}?text=${encodedText}`, '_blank');
      consultForm.reset();
    });
  }

  // 7. FAQ Accordion Functionality
  const faqButtons = document.querySelectorAll('.faq-toggle-btn');
  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const targetId = button.getAttribute('aria-controls');
      const content = document.getElementById(targetId);
      const icon = button.querySelector('.faq-icon');

      // Close other FAQs
      faqButtons.forEach(otherBtn => {
        if (otherBtn !== button) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherTargetId = otherBtn.getAttribute('aria-controls');
          const otherContent = document.getElementById(otherTargetId);
          const otherIcon = otherBtn.querySelector('.faq-icon');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      // Toggle current
      if (isExpanded) {
        button.setAttribute('aria-expanded', 'false');
        if (content) content.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        button.setAttribute('aria-expanded', 'true');
        if (content) content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // 8. Gallery Category Filter
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-sky-500', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-gray-700', 'border');
      });
      btn.classList.add('bg-sky-500', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-gray-700', 'border');

      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 9. Lightbox Photo Modal
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeLightbox = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-zoom-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parent = btn.closest('.gallery-item');
      if (parent && lightboxModal && lightboxImg) {
        const img = parent.querySelector('img');
        const caption = parent.querySelector('.gallery-title')?.innerText || 'Dokumentasi PAUD-KB Nurul Ilmi';
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          if (lightboxCaption) lightboxCaption.innerText = caption;
          lightboxModal.showModal();
        }
      }
    });
  });

  if (closeLightbox && lightboxModal) {
    closeLightbox.addEventListener('click', () => lightboxModal.close());
  }
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      const rect = lightboxModal.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        lightboxModal.close();
      }
    });
  }

  // 10. Floating WhatsApp Chat Popup Toggle
  const waToggleBtn = document.getElementById('wa-floating-btn');
  const waPopupCard = document.getElementById('wa-floating-popup');
  const waPopupClose = document.getElementById('wa-popup-close');

  if (waToggleBtn && waPopupCard) {
    waToggleBtn.addEventListener('click', () => {
      waPopupCard.classList.toggle('hidden');
    });
  }
  if (waPopupClose && waPopupCard) {
    waPopupClose.addEventListener('click', () => {
      waPopupCard.classList.add('hidden');
    });
  }

  // 11. Swiper Carousel Initialization (Testimonial & Hero)
  if (typeof Swiper !== 'undefined') {
    // Testimonial Swiper
    new Swiper('.testimonials-swiper', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 16,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.testimonials-pagination',
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }
});
