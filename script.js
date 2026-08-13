document.getElementById('year').textContent = new Date().getFullYear();

const sections = document.querySelectorAll('.reveal');
sections.forEach((section) => section.classList.add('visible'));

const carousel = document.getElementById('project-carousel');
const track = carousel?.querySelector('.carousel-track');
const slides = Array.from(carousel?.querySelectorAll('.project-slide') || []);
const dots = Array.from(document.querySelectorAll('.dot'));
const prevButton = document.getElementById('carousel-prev');
const nextButton = document.getElementById('carousel-next');
const currentLabel = document.getElementById('carousel-current');
let currentIndex = 0;

function updateCarousel(index, smooth = true) {
  if (!slides.length || !track) return;

  currentIndex = (index + slides.length) % slides.length;
  const isMobile = window.matchMedia('(max-width: 620px)').matches;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle('is-active', slideIndex === currentIndex);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === currentIndex);
    dot.setAttribute('aria-current', dotIndex === currentIndex ? 'true' : 'false');
  });

  if (currentLabel) {
    currentLabel.textContent = String(currentIndex + 1).padStart(2, '0');
  }

  if (isMobile) {
    slides[currentIndex].scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'nearest',
      inline: 'center'
    });
  } else {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
}

prevButton?.addEventListener('click', () => updateCarousel(currentIndex - 1));
nextButton?.addEventListener('click', () => updateCarousel(currentIndex + 1));

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => updateCarousel(index));
});

carousel?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    updateCarousel(currentIndex + 1);
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    updateCarousel(currentIndex - 1);
  }
});

let scrollTimer;
carousel?.addEventListener('scroll', () => {
  if (!window.matchMedia('(max-width: 620px)').matches) return;
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    let closestIndex = currentIndex;
    let closestDistance = Infinity;

    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(center - slideCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    currentIndex = closestIndex;
    slides.forEach((slide, index) => slide.classList.toggle('is-active', index === currentIndex));
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === currentIndex));
    if (currentLabel) currentLabel.textContent = String(currentIndex + 1).padStart(2, '0');
  }, 80);
});

window.addEventListener('resize', () => updateCarousel(currentIndex, false));
updateCarousel(0, false);
