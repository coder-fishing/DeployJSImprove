import { forceHideLoading, showLoading } from './loading';

export const navigate = (path) => {
    // Prevent multiple rapid navigations
    if (window.isNavigating) return;
    window.isNavigating = true;

    // Show loading before navigation
    showLoading();
    
    // Force hide any existing loading states
    forceHideLoading();
    
    // Use history API to update URL and trigger router
    history.pushState({}, '', path);
    
    // Dispatch a custom event that Router will listen to
    window.dispatchEvent(new CustomEvent('navigation', { 
        detail: { path }
    }));

    // Reset navigation flag after a short delay
    setTimeout(() => {
        window.isNavigating = false;
    }, 300);
}; 