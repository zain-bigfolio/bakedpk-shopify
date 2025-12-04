if (!customElements.get('slider-dots')) {
  class SliderDots extends HTMLElement {
    constructor() {
      super();
      this.selector = {
        button: '.slider-bar',
        sliderComponent: 'slider-component',
        currentIndex: '.slider-counter--current',
        buttonNext: '.slider-button--next',
        buttonPrev: '.slider-button--prev',
        slide: '.slider__slide',
        sliderList: '.slider',
      };
      this.lastKnownIndexText = 0;
      setTimeout(() => this.init(), 500);
    }

    init() {
      this.sliderComponent = this.closest(this.selector.sliderComponent);
      if (!this.sliderComponent) return;

      this.currentIndexEl = this.sliderComponent.querySelector(this.selector.currentIndex);
      this.nextButton = this.sliderComponent.querySelector(this.selector.buttonNext);
      this.prevButton = this.sliderComponent.querySelector(this.selector.buttonPrev);
      this.buttons = this.querySelectorAll(this.selector.button);
      this.slides = this.sliderComponent.querySelectorAll(this.selector.slide);
      this.sliderList = this.sliderComponent.querySelector(this.selector.sliderList);

      this.updateSlidesPerView();
      this.updateDotsVisibility();

      this.buttons?.forEach((button, index) => {
        button.addEventListener('click', () => {
          this.handleClick(button, index);
        });
      });

      if (this.currentIndexEl) this.startMonitoringTextContent();

      window.addEventListener('resize', () => {
        this.updateSlidesPerView();
        this.updateDotsVisibility();
      });
    }

    updateSlidesPerView() {
      const mobile = Number(this.sliderComponent.dataset.slidesPerViewMobile || 1);
      const desktop = Number(this.sliderComponent.dataset.slidesPerViewDesktop || mobile);
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const finalSlides = isDesktop ? desktop : mobile;
      this.sliderComponent.dataset.slidesPerView = finalSlides;
    }

    startMonitoringTextContent() {
      this.lastKnownIndexText = this.currentIndexEl.textContent;
      this.textContentCheckInterval = setInterval(() => {
        const currentText = this.currentIndexEl.textContent;
        if (currentText !== this.lastKnownIndexText) {
          const currentNumber = Number(currentText);
          this.updateActiveButton(this.buttons[currentNumber - 1]);
          this.lastKnownIndexText = currentText;
          this.updateDotsVisibility();
        }
      }, 100);
    }

    handleClick(clickedButton, index) {
      const targetIndex = index + 1;
      this.currentIndexEl.textContent = targetIndex;
      this.updateSliderScroll();
      this.updateActiveButton(clickedButton);
      this.updateDotsVisibility();
    }

    updateSliderScroll() {
      if (!this.sliderList || !this.slides.length) return;
      const i = Number(this.currentIndexEl.textContent) - 1;
      const s = this.slides[i];
      if (!s) return;

      this.sliderList.scrollTo({
        left: s.offsetLeft,
        behavior: 'smooth',
      });

      this.sliderComponent.dispatchEvent(new CustomEvent('slider-index-changed', {
        detail: { currentIndex: i + 1 },
        bubbles: true,
      }));
    }

    updateActiveButton(newActive) {
      this.buttons.forEach(btn => btn.classList.remove('active'));
      newActive.classList.add('active');
    }

    getVisibleSlidesCount() {
      return Number(this.sliderComponent.dataset.slidesPerView || 1);
    }

    updateDotsVisibility() {
      if (!this.slides || !this.buttons) return;

      const total = this.slides.length;
      const perView = this.getVisibleSlidesCount();
      const dots = Math.max(1, total - perView + 1);

      this.buttons.forEach((btn, i) => {
        if (i < dots) btn.classList.remove('hidden');
        else btn.classList.add('hidden');
      });
    }
  }

  customElements.define('slider-dots', SliderDots);
}

if (!customElements.get('slider-dots-cs')) {
  class SliderDotsCs extends HTMLElement {
    constructor() {
      super();
      this.selector = {
        button: '.slider-bar',
        sliderComponent: 'slider-component',
        currentIndex: '.slider-counter--current',
        buttonNext: '.slider-button--next',
        buttonPrev: '.slider-button--prev',
        slide: '.slider__slide',
        sliderList: '.slider',
      };
      this.lastKnownIndexText = 0;
      setTimeout(() => this.init(), 500);
    }

    init() {
      this.sliderComponent = this.closest('.dps-block')?.querySelector(this.selector.sliderComponent);
      if (!this.sliderComponent) return;

      this.currentIndexEl = this.sliderComponent.querySelector(this.selector.currentIndex);
      this.nextButton = this.sliderComponent.querySelector(this.selector.buttonNext);
      this.prevButton = this.sliderComponent.querySelector(this.selector.buttonPrev);
      this.buttons = this.querySelectorAll(this.selector.button);
      this.slides = this.sliderComponent.querySelectorAll(this.selector.slide);
      this.sliderList = this.sliderComponent.querySelector(this.selector.sliderList);

      this.updateSlidesPerView();
      this.updateDotsVisibility();

      this.buttons?.forEach((button, index) => {
        button.addEventListener('click', () => {
          this.handleClick(button, index);
        });
      });

      if (this.currentIndexEl) this.startMonitoringTextContent();

      window.addEventListener('resize', () => {
        this.updateSlidesPerView();
        this.updateDotsVisibility();
      });
    }

    updateSlidesPerView() {
      const mobile = Number(this.sliderComponent.dataset.slidesPerViewMobile || 1);
      const desktop = Number(this.sliderComponent.dataset.slidesPerViewDesktop || mobile);
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const finalSlides = isDesktop ? desktop : mobile;
      this.sliderComponent.dataset.slidesPerView = finalSlides;
    }

    startMonitoringTextContent() {
      this.lastKnownIndexText = this.currentIndexEl.textContent;
      this.textContentCheckInterval = setInterval(() => {
        const currentText = this.currentIndexEl.textContent;
        if (currentText !== this.lastKnownIndexText) {
          const currentNumber = Number(currentText);
          this.updateActiveButton(this.buttons[currentNumber - 1]);
          this.lastKnownIndexText = currentText;
          this.updateDotsVisibility();
        }
      }, 100);
    }

    handleClick(clickedButton, index) {
      const targetIndex = index + 1;
      this.currentIndexEl.textContent = targetIndex;
      this.updateSliderScroll();
      this.updateActiveButton(clickedButton);
      this.updateDotsVisibility();
    }

    updateSliderScroll() {
      if (!this.sliderList || !this.slides.length) return;
      const i = Number(this.currentIndexEl.textContent) - 1;
      const s = this.slides[i];
      if (!s) return;

      this.sliderList.scrollTo({
        left: s.offsetLeft,
        behavior: 'smooth',
      });

      this.sliderComponent.dispatchEvent(new CustomEvent('slider-index-changed', {
        detail: { currentIndex: i + 1 },
        bubbles: true,
      }));
    }

    updateActiveButton(newActive) {
      this.buttons.forEach(btn => btn.classList.remove('active'));
      newActive.classList.add('active');
    }

    getVisibleSlidesCount() {
      return Number(this.sliderComponent.dataset.slidesPerView || 1);
    }

    updateDotsVisibility() {
      if (!this.slides || !this.buttons) return;

      const total = this.slides.length;
      const perView = this.getVisibleSlidesCount();
      const dots = Math.max(1, total - perView + 1);

      this.buttons.forEach((btn, i) => {
        if (i < dots) btn.classList.remove('hidden');
        else btn.classList.add('hidden');
      });
    }
  }

  customElements.define('slider-dots-cs', SliderDotsCs);
}
