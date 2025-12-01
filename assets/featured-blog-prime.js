class FeaturedBlogPrime extends HTMLElement {
  constructor() {
    super();
    this.initializeAnimations();
  }

  initializeAnimations() {
    const animateItems = this.querySelectorAll('[data-animate]');
    
    if (!animateItems.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add CSS variable for staggered content animation
          const contentItems = entry.target.querySelectorAll('.cr-col__content-inner > *');
          contentItems.forEach((item, index) => {
            item.style.setProperty('--item-index', index);
          });
          
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animateItems.forEach((item) => {
      observer.observe(item);
    });
  }
}

customElements.define('featured-blog-prime', FeaturedBlogPrime);
