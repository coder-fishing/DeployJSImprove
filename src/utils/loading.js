let loadingCount = 0;

export const showLoading = () => {
    loadingCount++;
    
    // Only create new loading overlay if one doesn't exist
    if (!document.querySelector('.loading-overlay')) {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <div class="loading-text">Loading...</div>
            </div>
        `;
        document.body.appendChild(loading);
    }
};

export const hideLoading = () => {
    loadingCount--;
    
    // Only remove loading overlay when all loading states are complete
    if (loadingCount <= 0) {
        loadingCount = 0; // Reset to prevent negative values
        const loading = document.querySelector('.loading-overlay');
        if (loading) {
            loading.classList.add('loading-fade-out');
            setTimeout(() => {
                if (loading && loading.parentNode) {
                    loading.remove();
                }
            }, 300);
        }
    }
};

// Force hide all loading states
export const forceHideLoading = () => {
    loadingCount = 0;
    const loading = document.querySelector('.loading-overlay');
    if (loading) {
        loading.classList.add('loading-fade-out');
        setTimeout(() => {
            if (loading && loading.parentNode) {
                loading.remove();
            }
        }, 300);
    }
}; 