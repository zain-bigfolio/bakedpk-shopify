class FaqAccordion extends HTMLElement {
  constructor() {
    super();
    this.items = [];
    this.animationDuration = 400;
    this.mobileBreakpoint = 749;
  }

  connectedCallback() {
    this.init();
  }

  init() {
    this.items = Array.from(this.querySelectorAll('[data-faq-item]'));
    
    if (!this.items.length) return;

    this.items.forEach((item, index) => {
      const trigger = item.querySelector('[data-faq-trigger]');
      const body = item.querySelector('[data-faq-body]');
      const content = body.querySelector('.faq__item-content');
      const indexWrapper = item.querySelector('.faq__item-index-wrapper');
      
      if (!trigger || !body || !content) return;

      item.trigger = trigger;
      item.body = body;
      item.content = content;
      item.indexWrapper = indexWrapper;
      item.isAnimating = false;

      const isActive = item.classList.contains('is-active') || index === 0;
      if (isActive) {
        item.classList.add('is-active');
        trigger.setAttribute('aria-expanded', 'true');
        this.openItem(item, false);
      } else {
        this.closeItem(item, false);
      }

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleItem(item);
      });

      if (indexWrapper) {
        indexWrapper.addEventListener('click', (e) => {
          if (window.innerWidth <= this.mobileBreakpoint) {
            e.preventDefault();
            this.toggleItem(item);
          }
        });
        
        if (window.innerWidth <= this.mobileBreakpoint) {
          indexWrapper.style.cursor = 'pointer';
        }
        
        window.addEventListener('resize', () => {
          if (window.innerWidth <= this.mobileBreakpoint) {
            indexWrapper.style.cursor = 'pointer';
          } else {
            indexWrapper.style.cursor = '';
          }
        });
      }

      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleItem(item);
        }
      });
    });
  }

  toggleItem(item) {
    if (item.isAnimating) return;

    const isActive = item.classList.contains('is-active');
    
    if (isActive) {
      this.closeItem(item, true);
    } else {
      this.openItem(item, true);
    }
  }

  openItem(item, animate = true) {
    const { body, content, trigger, indexWrapper } = item;
    
    const contentHeight = content.scrollHeight;
    const isMobile = window.innerWidth <= this.mobileBreakpoint;
    
    item.classList.add('is-active');
    trigger.setAttribute('aria-expanded', 'true');

    if (animate) {
      item.isAnimating = true;
      
      body.style.setProperty('--max-height', '0px');
      
      if (indexWrapper && isMobile) {
        indexWrapper.style.setProperty('--max-height', '0px');
      }
      
      body.offsetHeight;
      
      requestAnimationFrame(() => {
        body.style.setProperty('--max-height', `${contentHeight}px`);
        
        if (indexWrapper && isMobile) {
          const indexWrapperHeight = indexWrapper.scrollHeight;
          indexWrapper.style.setProperty('--max-height', `${indexWrapperHeight}px`);
        }
      });

      setTimeout(() => {
        const finalContentHeight = content.scrollHeight;
        body.style.setProperty('--max-height', `${finalContentHeight}px`);
        
        if (indexWrapper && isMobile) {
          const finalIndexWrapperHeight = indexWrapper.scrollHeight;
          indexWrapper.style.setProperty('--max-height', `${finalIndexWrapperHeight}px`);
        }
        
        item.isAnimating = false;

        this.dispatchEvent(new CustomEvent('faq:opened', {
          detail: { item, index: this.items.indexOf(item) },
          bubbles: true
        }));
      }, this.animationDuration);
    } else {
      const finalContentHeight = content.scrollHeight;
      body.style.setProperty('--max-height', `${finalContentHeight}px`);
      
      if (indexWrapper && isMobile) {
        const finalIndexWrapperHeight = indexWrapper.scrollHeight;
        indexWrapper.style.setProperty('--max-height', `${finalIndexWrapperHeight}px`);
      }
    }
  }

  closeItem(item, animate = true) {
    const { body, content, trigger, indexWrapper } = item;
    const isMobile = window.innerWidth <= this.mobileBreakpoint;
    
    if (animate) {
      item.isAnimating = true;
      
      item.classList.remove('is-active');
      trigger.setAttribute('aria-expanded', 'false');
      
      const contentHeight = content.scrollHeight;
      
      body.style.setProperty('--max-height', `${contentHeight}px`);
      
      if (indexWrapper && isMobile) {
        const indexWrapperHeight = indexWrapper.scrollHeight;
        indexWrapper.style.setProperty('--max-height', `${indexWrapperHeight}px`);
      }
      
      body.offsetHeight;
      
      requestAnimationFrame(() => {
        body.style.setProperty('--max-height', '0px');
        
        if (indexWrapper && isMobile) {
          indexWrapper.style.setProperty('--max-height', '0px');
        }
      });

      setTimeout(() => {
        item.isAnimating = false;

        this.dispatchEvent(new CustomEvent('faq:closed', {
          detail: { item, index: this.items.indexOf(item) },
          bubbles: true
        }));
      }, this.animationDuration);
    } else {
      item.classList.remove('is-active');
      trigger.setAttribute('aria-expanded', 'false');
      body.style.setProperty('--max-height', '0px');
      
      if (indexWrapper && isMobile) {
        indexWrapper.style.setProperty('--max-height', '0px');
      }
    }
  }

  closeAll() {
    this.items.forEach(item => {
      if (item.classList.contains('is-active')) {
        this.closeItem(item, true);
      }
    });
  }

  openAll() {
    this.items.forEach(item => {
      if (!item.classList.contains('is-active')) {
        this.openItem(item, true);
      }
    });
  }
}

if (!customElements.get('faq-accordion')) {
  customElements.define('faq-accordion', FaqAccordion);
}
