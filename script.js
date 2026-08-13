document.getElementById('year').textContent = new Date().getFullYear();
document.querySelectorAll('.reveal').forEach((section) => section.classList.add('visible'));

const carousel = document.getElementById('project-carousel');
const track = carousel?.querySelector('.featured-track');
const slides = Array.from(carousel?.querySelectorAll('.featured-slide') || []);
const dots = Array.from(document.querySelectorAll('.dot'));
const prevButton = document.getElementById('carousel-prev');
const nextButton = document.getElementById('carousel-next');
let currentIndex = 0;

function setSlide(index, smooth = true) {
  if (!slides.length || !track) return;
  currentIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentIndex));
  dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentIndex));

  const mobile = window.matchMedia('(max-width: 620px)').matches;
  if (mobile) {
    slides[currentIndex].scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest', inline: 'center' });
  } else {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
}

prevButton?.addEventListener('click', () => setSlide(currentIndex - 1));
nextButton?.addEventListener('click', () => setSlide(currentIndex + 1));
dots.forEach((dot, index) => dot.addEventListener('click', () => setSlide(index)));
carousel?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') { event.preventDefault(); setSlide(currentIndex + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); setSlide(currentIndex - 1); }
});

let scrollTimer;
carousel?.addEventListener('scroll', () => {
  if (!window.matchMedia('(max-width: 620px)').matches) return;
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    let nearest = 0;
    let distance = Infinity;
    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const delta = Math.abs(center - slideCenter);
      if (delta < distance) { distance = delta; nearest = index; }
    });
    currentIndex = nearest;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentIndex));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentIndex));
  }, 80);
});

const tabs = Array.from(document.querySelectorAll('.category-tab'));
const cards = Array.from(document.querySelectorAll('.portfolio-card'));
const count = document.getElementById('project-count');

function filterProjects(filter) {
  let visible = 0;
  cards.forEach((card) => {
    const categories = (card.dataset.category || '').split(' ');
    const show = filter === 'all' || categories.includes(filter);
    card.classList.toggle('is-hidden', !show);
    if (show) visible += 1;
  });
  if (count) count.textContent = `${visible} ${visible === 1 ? 'projeto' : 'projetos'}`;
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => item.classList.remove('is-active'));
    tab.classList.add('is-active');
    filterProjects(tab.dataset.filter || 'all');
  });
});

window.addEventListener('resize', () => setSlide(currentIndex, false));
setSlide(0, false);
filterProjects('all');
