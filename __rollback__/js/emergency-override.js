/* ================================
   EMERGENCY VISIBILITY OVERRIDE
   ================================ */

setTimeout(() => {
  document.querySelectorAll('*').forEach(el => {
    const style = getComputedStyle(el);
    if (style.opacity === '0' || style.visibility === 'hidden') {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
      el.style.transform = 'none';
    }
  });

  document.body.style.opacity = '1';
  document.body.style.visibility = 'visible';

  console.warn('⚠️ Emergency visibility override activated');
}, 3000);
