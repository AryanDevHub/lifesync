// Scroll reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      observer.unobserve(el.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .step, .cta-card').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Stagger feature cards
document.querySelectorAll('.feature-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
});

// Stagger steps
document.querySelectorAll('.step').forEach((step, i) => {
  step.style.transitionDelay = `${i * 0.1}s`;
});

// Nav scroll effect
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 50
    ? 'rgba(5,8,16,0.95)'
    : 'rgba(5,8,16,0.7)';
});

// Smooth hover on float cards
document.querySelectorAll('.float-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `scale(1.04) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
});
