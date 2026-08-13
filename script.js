document.getElementById('year').textContent = new Date().getFullYear();

const sections = document.querySelectorAll('.reveal');
sections.forEach((section) => section.classList.add('visible'));
