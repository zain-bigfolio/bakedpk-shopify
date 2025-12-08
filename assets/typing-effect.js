class TypingEffect extends HTMLElement {
  constructor() {
    super();
    this.speed = parseInt(this.getAttribute('data-speed')) || 80;
    this.delay = parseInt(this.getAttribute('data-delay')) || 500;

    // Split text into multiple segments using "|" as separator
    const raw = this.getAttribute('data-text') || '';
    this.textSegments = raw.split('|').map(s => s.trim());

    this.currentSegment = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.hasStarted = false;

    this.textSpan = null;
    this.cursor = null;
    this.observer = null;
  }

  connectedCallback() {
    this.innerHTML = '';

    this.textSpan = document.createElement('span');
    this.textSpan.className = 'typing-text';

    this.cursor = document.createElement('span');
    this.cursor.className = 'typing-cursor';
    this.cursor.textContent = '|';
    this.cursor.style.animation = 'blink 0.8s step-end infinite';

    this.appendChild(this.textSpan);
    this.appendChild(this.cursor);

    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const options = { threshold: 0.1 };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasStarted) {
          this.hasStarted = true;
          setTimeout(() => this.type(), this.delay);
          this.observer.unobserve(this);
        }
      });
    }, options);

    this.observer.observe(this);
  }

  type() {
    const currentText = this.textSegments[this.currentSegment];

    if (!this.isDeleting) {
      // Typing
      this.textSpan.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;

      if (this.charIndex === currentText.length) {
        // Pause before deleting
        setTimeout(() => {
          this.isDeleting = true;
          this.type();
        }, 1000);
        return;
      }
    } else {
      // Deleting
      this.textSpan.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;

      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.currentSegment = (this.currentSegment + 1) % this.textSegments.length;
      }
    }

    const variance = Math.random() * 30 - 15;
    const typingSpeed = Math.max(30, this.speed + variance);
    setTimeout(() => this.type(), typingSpeed);
  }

  disconnectedCallback() {
    if (this.observer) this.observer.disconnect();
  }
}

customElements.define('typing-effect', TypingEffect);
