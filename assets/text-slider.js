if (!customElements.get('text-slider')) {
  class TextSlider extends HTMLElement {
    constructor() {
      super();
      this.selector = {
        sliderComponent: 'slider-component',
        currentIndex: '.slider-counter--current',
        textItem: '.text-slider__item',
      };
      this.currentIndex = -1; // Start with -1 to force first update
      this.init();
    }

    init() {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        this.sliderComponent = this.closest(this.selector.sliderComponent);
        this.textItems = this.querySelectorAll(this.selector.textItem);
        
        if (!this.sliderComponent || !this.textItems.length) return;

        this.currentIndexEl = this.sliderComponent.querySelector(this.selector.currentIndex);
        
        // Show first item immediately
        this.updateActiveText(0);

        // Listen to slider changes
        if (this.currentIndexEl) {
          this.startMonitoringSlider();
        }

        // Listen to custom slider events
        this.sliderComponent.addEventListener('slider-index-changed', (event) => {
          const slidesPerView = this.getSlidesPerView();
          const slideIndex = event.detail.currentIndex - 1; // 0-based
          const textIndex = Math.floor(slideIndex / slidesPerView);
          this.updateActiveText(textIndex);
        });
      });
    }

    startMonitoringSlider() {
      this.lastKnownIndex = this.currentIndexEl.textContent;
      this.monitorInterval = setInterval(() => {
        const currentText = this.currentIndexEl.textContent;
        if (currentText !== this.lastKnownIndex) {
          const slidesPerView = this.getSlidesPerView();
          const slideIndex = Number(currentText) - 1; // 0-based
          const textIndex = Math.floor(slideIndex / slidesPerView);
          this.updateActiveText(textIndex);
          this.lastKnownIndex = currentText;
        }
      }, 100);
    }

    getSlidesPerView() {
      const slidesPerViewAttr = this.sliderComponent?.dataset.slidesPerView;
      return slidesPerViewAttr ? Number(slidesPerViewAttr) : 1;
    }

    updateActiveText(index) {
      // Ensure index is within bounds
      if (index < 0 || index >= this.textItems.length) return;
      
      // Always update, even if same index (for initial state)
      if (index === this.currentIndex && this.currentIndex !== -1) return;
      
      console.log('Text slider updating to index:', index);
      this.currentIndex = index;
      
      this.textItems.forEach((item, i) => {
        if (i === index) {
          item.classList.add('active');
          item.classList.remove('hidden');
        } else {
          item.classList.remove('active');
          item.classList.add('hidden');
        }
      });
    }

    disconnectedCallback() {
      if (this.monitorInterval) {
        clearInterval(this.monitorInterval);
      }
    }
  }

  customElements.define('text-slider', TextSlider);
}
