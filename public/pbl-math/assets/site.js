
document.addEventListener('click', function (e) {
  var t = e.target.closest('[data-zoom]');
  if (!t) return;
  e.preventDefault();
  var lb = document.querySelector('.lb');
  lb.querySelector('img').src = t.getAttribute('href');
  lb.classList.add('on');
});
document.addEventListener('click', function (e) {
  if (e.target.closest('.lb')) document.querySelector('.lb').classList.remove('on');
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') document.querySelector('.lb').classList.remove('on');
});
