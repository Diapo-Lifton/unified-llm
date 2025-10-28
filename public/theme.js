// theme.js — small helper to enable parallax and subtle logo animation
// Place <script src="theme.js"></script> at the end of body in the HTML pages.

(function () {
  const wrap = document.querySelector('.page-bg');
  if (!wrap) return;
  const logo = wrap.querySelector('.logo-wrap');

  // mouse based parallax
  window.addEventListener('mousemove', (e) => {
    const w = window.innerWidth, h = window.innerHeight;
    const nx = (e.clientX - w/2) / (w/2);
    const ny = (e.clientY - h/2) / (h/2);
    const tx = nx * 6; // px
    const ty = ny * 6; // px
    logo.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.02)`;
  });

  // subtle breathe animation
  let scale = 1.02;
  setInterval(() => {
    scale = scale === 1.02 ? 1.00 : 1.02;
    logo.style.transition = 'transform 2.4s cubic-bezier(.2,.9,.2,1)';
    logo.style.transform = `translateZ(0) scale(${scale})`;
  }, 4200);
})();
