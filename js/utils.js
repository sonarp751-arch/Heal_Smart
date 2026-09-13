export function toast(m) {
  const t = document.getElementById('toast');
  if (t) {
    t.textContent = m;
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 3000);
  }
}
