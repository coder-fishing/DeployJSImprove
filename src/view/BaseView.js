export default class BaseView {
    constructor() {
        this.controller = null;
        this.params = {};
        this.eventListeners = new Map();
    }

    // Method to safely add event listeners that can be cleaned up
    addEventListenerWithCleanup(element, eventType, handler) {
        if (!element) return;
        
        const boundHandler = handler.bind(this);
        element.addEventListener(eventType, boundHandler);
        
        if (!this.eventListeners.has(element)) {
            this.eventListeners.set(element, []);
        }
        this.eventListeners.get(element).push({ type: eventType, handler: boundHandler });
    }

    // Method to safely add global event listeners
    addGlobalEventListener(eventType, handler) {
        this.addEventListenerWithCleanup(document, eventType, handler);
    }

    // Cleanup method that all views should inherit
    cleanup() {
        // Remove all registered event listeners
        for (const [element, listeners] of this.eventListeners.entries()) {
            listeners.forEach(({ type, handler }) => {
                element.removeEventListener(type, handler);
            });
        }
        this.eventListeners.clear();
    }

    // Method to set page title
    setTitle(title) {
        document.title = title;
    }

    // Abstract render method that all views must implement
    async render() {
        throw new Error('You must implement render()');
    }

    // Utility method to get DOM element
    getElement(selector) {
        return document.querySelector(selector);
    }

    // Utility method to get multiple DOM elements
    getAllElements(selector) {
        return document.querySelectorAll(selector);
    }

    // Utility method to create DOM element
    createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    // Utility method to show loading state
    showLoading() {
        const content = this.getElement('#content');
        if (content) {
            content.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Loading...</p>
                </div>
            `;
        }
    }

    // Utility method to hide loading state
    hideLoading() {
        const loading = this.getElement('.loading');
        if (loading) {
            loading.remove();
        }
    }

    // Utility method to show error message
    showError(message) {
        const content = this.getElement('#content');
        if (content) {
            content.innerHTML = `
                <div class="error">
                    <h3>Error</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }
} 