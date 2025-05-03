export const showLoading = () => {
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <div class="loading-text">Loading...</div>
        </div>
    `;
    document.body.appendChild(loading);
};

export const  hideLoading = () => {
    const loading = document.querySelector('.loading-overlay');
    if (loading) {
        loading.classList.add('loading-fade-out');
        setTimeout(() => loading.remove(), 300);
    }
}; 