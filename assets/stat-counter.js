if (!customElements.get('stat-counter')) {
  class StatCounter extends HTMLElement {
    constructor() {
      super();
      this.counters = [];
      this.observer = null;
      this.hasAnimated = false;
    }

    connectedCallback() {
      this.counters = Array.from(this.querySelectorAll('.stats-number[data-number]'));
      this.initObserver();
    }

    initObserver() {
      const options = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.triggerAnimations();
            this.animateCounters();
            this.observer.unobserve(entry.target);
          }
        });
      }, options);

      this.observer.observe(this);
    }

    triggerAnimations() {
      // Animate heading
      const heading = document.querySelector('.stats-grid__item:first-child');
      if (heading) {
        heading.classList.add('stats-animate');
      }

      // Animate stat items
      this.counters.forEach((counter, index) => {
        const statItem = counter.closest('.stats-item__content');
        if (statItem) {
          statItem.classList.add('stats-animate');
        }
      });

      // Animate floating images
      const floatingImages = document.querySelectorAll('.stats-float__top-right, .stats-float__bottom-left, .stats-float__bottom-bottom');
      floatingImages.forEach((img, index) => {
        setTimeout(() => {
          img.classList.add('stats-animate');
        }, index * 200);
      });
    }

    animateCounters() {
      this.counters.forEach((counter, index) => {
        const target = parseInt(counter.getAttribute('data-number'), 10);
        const suffix = counter.getAttribute('data-text') || '';
        const duration = 2000; // 2 seconds
        const startDelay = index * 100; // Stagger animation

        setTimeout(() => {
          this.animateValue(counter, 0, target, duration, suffix);
        }, startDelay);
      });
    }

    animateValue(element, start, end, duration, suffix) {
      if (start === end) {
        element.textContent = end + suffix;
        return;
      }

      const range = end - start;
      const increment = range / (duration / 16); // 60fps
      let current = start;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        current = start + (range * easeOutQuart);
        element.textContent = Math.floor(current) + suffix;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = end + suffix;
        }
      };

      requestAnimationFrame(animate);
    }

    disconnectedCallback() {
      if (this.observer) {
        this.observer.disconnect();
      }
    }
  }

  customElements.define('stat-counter', StatCounter);
}
