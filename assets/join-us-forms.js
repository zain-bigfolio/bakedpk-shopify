// Web Component for Join Us Forms with Tingle Modal Integration
// NO HTML IN JAVASCRIPT - Uses DOM templates from Liquid
if (!customElements.get('join-us-forms')) {
  class JoinUsForms extends HTMLElement {
    constructor() {
      super();
      this.modals = {};
    }

    connectedCallback() {
      this.attachEventListeners();
      this.checkForSuccess();
    }

    attachEventListeners() {
      // Use event delegation on document to catch all clicks on [data-popup-trigger] elements
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-popup-trigger]');
        if (trigger) {
          e.preventDefault();
          const formType = trigger.getAttribute('data-popup-trigger');
          console.log('Popup trigger clicked:', formType);
          this.openModal(formType);
        }
      });
    }

    openModal(type) {
      const formTemplate = this.querySelector(`template[data-form="${type}"]`);
      console.log(`template[data-form="${type}"]`,formTemplate, "formTemplateformTemplateformTemplateformTemplate");
      
      if (!formTemplate) {
        console.warn(`Form template for "${type}" not found.`);
        return;
      }

      // Create modal if it doesn't exist
      if (!this.modals[type]) {
        this.modals[type] = new tingle.modal({
          closeMethods: ['overlay', 'button', 'escape'],
          closeLabel: "Close",
          cssClass: [`${type}-signup-modal`],
          onClose: () => {
            this.modals[type].destroy();
            this.modals[type] = null;
          }
        });
      }

      // Clone template content and convert to HTML string for Tingle
      const formContent = formTemplate.content.cloneNode(true);
      const wrapper = document.createElement('div');
      wrapper.appendChild(formContent);

      // Set modal content using DOM element's innerHTML
      this.modals[type].setContent(wrapper.innerHTML);

      // Add event listener for close button after content is set
      const closeButton = this.modals[type].modalBoxContent.querySelector('.tingle-modal-close');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          this.modals[type].close();
        });
      }

      // Open modal
      this.modals[type].open();
    }

    checkForSuccess() {
      // Check if URL contains ?contact_posted=true
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('contact_posted') === 'true') {
        this.showSuccessBanner();
        // Remove the parameter from URL without reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }

    showSuccessBanner() {
      // Create success banner at top of section
      const banner = document.createElement('div');
      banner.className = 'success-banner';
      banner.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; max-width: 60rem; width: 90%; padding: 2rem; background: #4caf50; color: white; border-radius: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideDown 0.3s ease-out;';
      
      banner.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 700;">Form Submitted Successfully!</h3>
            <p style="margin: 0;">Your form has been submitted successfully. We will get in touch with you via email or phone shortly.</p>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" style="background: transparent; border: none; color: white; font-size: 2rem; cursor: pointer; padding: 0 0.5rem; line-height: 1;">&times;</button>
        </div>
      `;

      document.body.appendChild(banner);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        banner.remove();
      }, 5000);
    }

    disconnectedCallback() {
      // Clean up modals
      Object.values(this.modals).forEach(modal => {
        if (modal) modal.destroy();
      });
    }
  }

  customElements.define('join-us-forms', JoinUsForms);
}
