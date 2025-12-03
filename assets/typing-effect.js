class TypingEffect extends HTMLElement {
  constructor() {
    super();
    this.text = this.getAttribute('data-text') || '';
    this.speed = parseInt(this.getAttribute('data-speed')) || 80;
    this.delay = parseInt(this.getAttribute('data-delay')) || 500;
    this.charIndex = 0;
    this.hasStarted = false;
    this.observer = null;
    this.cursor = null;
    this.textSpan = null;
    this.isTyping = false;
  }

  connectedCallback() {
    this.originalText = this.textContent;
    this.innerHTML = '';
    
    // Create text span and cursor
    this.textSpan = document.createElement('span');
    this.textSpan.className = 'typing-text';
    
    this.cursor = document.createElement('span');
    this.cursor.className = 'typing-cursor';
    this.cursor.textContent = '|';
    
    this.appendChild(this.textSpan);
    this.appendChild(this.cursor);
    
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasStarted) {
          this.hasStarted = true;
          // Start cursor blinking immediately
          this.cursor.style.animation = 'blink 0.8s step-end infinite';
          
          // Wait 2 seconds, then start typing
          setTimeout(() => {
            this.isTyping = true;
            this.startTyping();
          }, this.delay + 2000);
          
          this.observer.unobserve(this);
        }
      });
    }, options);

    this.observer.observe(this);
  }

  startTyping() {
    if (this.charIndex < this.originalText.length) {
      this.textSpan.textContent += this.originalText.charAt(this.charIndex);
      this.charIndex++;
      
      // Variable speed for more natural typing
      const variance = Math.random() * 30 - 15; // ±15ms variance
      const typingSpeed = Math.max(30, this.speed + variance);
      
      requestAnimationFrame(() => {
        setTimeout(() => this.startTyping(), typingSpeed);
      });
    } else {
      this.isTyping = false;
      // Remove cursor suddenly after typing completes
      if (this.cursor) {
        this.cursor.style.opacity = '0';
        this.cursor.style.display = 'none';
      }
    }
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

customElements.define('typing-effect', TypingEffect);
