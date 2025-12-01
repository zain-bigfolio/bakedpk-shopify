if (!customElements.get('marquee-section')) {
  class MarqueeSection extends HTMLElement {
    constructor() {
      super();
      this.autoplay = this.getAttribute('data-autoplay') === 'true';
      this.innerElements = this.querySelectorAll('.marquee-list');
      this.isInView = false;
      this.lastScrollY = window.scrollY;
      this.progress = parseFloat(localStorage.getItem(`marquee-progress-${this.dataset.id}`)) || 0;
      this.hasAnimated = false;

      this.setItemIndices();

      if (!this.autoplay) {
        this.innerElements.forEach(el => {
          el.style.animation = 'none';
        });

        this.handleScroll = this.handleScroll.bind(this);
        this.observeVisibility();
        window.addEventListener('scroll', this.handleScroll);
      } else {
        this.observeVisibility();
      }

      this.updatePosition();
    }

    setItemIndices() {
      // Add CSS variable for staggered animation
      this.innerElements.forEach(list => {
        const items = list.querySelectorAll('.marquee-list__item');
        items.forEach((item, index) => {
          item.style.setProperty('--item-index', index);
        });
      });
    }

    observeVisibility() {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const wasInView = this.isInView;
          this.isInView = entry.isIntersecting;

          if (this.isInView && !wasInView) {
            // Trigger animation on first view
            if (!this.hasAnimated) {
              this.classList.add('marquee--visible');
              this.hasAnimated = true;
            }
            
            // Reset lastScrollY and ensure position is updated when re-entering view
            this.lastScrollY = window.scrollY;
            this.updatePosition();
          }
        });
      }, { threshold: 0.5 });
      observer.observe(this);
    }

    handleScroll() {
      if (!this.isInView) return;

      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - this.lastScrollY;
      this.lastScrollY = currentScrollY;

      this.progress = Math.max(-300, Math.min(0, this.progress - scrollDelta * 0.3));

      this.updatePosition();
      localStorage.setItem(`marquee-progress-${this.dataset.id}`, this.progress);
    }

    updatePosition() {
      this.innerElements.forEach(el => {
        el.style.transform = `translateX(${this.progress}%)`;
      });
    }

    disconnectedCallback() {
      if (!this.autoplay) {
        window.removeEventListener('scroll', this.handleScroll);
      }
    }
  }

  customElements.define('marquee-section', MarqueeSection);
}