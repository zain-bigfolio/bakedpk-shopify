class closeAnnouncementBarButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', () => {
      const announcementBar = this.closest('.shopify-section');
      if (announcementBar) {
        announcementBar.style.display = 'none';
      }
    });
  }
}

customElements.define('close-announcement-bar-button', closeAnnouncementBarButton);