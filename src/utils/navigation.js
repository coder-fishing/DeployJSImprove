import { forceHideLoading, showLoading } from './loading';

export const navigate = (path) => {
    // Log navigation attempt
    console.log('Navigation requested to:', path);
    
    // Prevent multiple rapid navigations
    if (window.isNavigating) {
        console.log('Navigation in progress, ignoring request');
        return;
    }
    window.isNavigating = true;

    // Show loading before navigation
    showLoading();
    
    // Force hide any existing loading states
    forceHideLoading();
    
    // IMPORTANT: Use direct URL change instead of history API for more reliable navigation
    console.log('Using direct location change for path:', path);
    window.location.href = path;
    
    // Reset navigation flag after a short delay - though this won't be needed with direct navigation
    setTimeout(() => {
        window.isNavigating = false;
    }, 300);
}; 