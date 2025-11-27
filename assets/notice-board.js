document.addEventListener('DOMContentLoaded', function () {
  const noticeBoard = document.querySelector('.notice-board');

  if (!noticeBoard) return;

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.notice-board__item-wrapper');
        items.forEach((item, index) => {
          item.style.setProperty('--item-index', index);
          item.classList.add('animate');
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(noticeBoard);
});