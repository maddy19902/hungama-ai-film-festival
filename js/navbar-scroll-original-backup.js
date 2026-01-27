(() => {
  let lastScroll = 0;
  const nav = document.querySelector('nav');

  if (!nav) return;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    if (current > lastScroll && current > 40) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }

    lastScroll = current;
  }, { passive: true });
})();
