export const createToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = document.createElement('div');
    icon.className = 'toast-icon';
    icon.innerHTML = type === 'success' 
        ? '✓'
        : type === 'error' 
            ? '✕' 
            : 'ℹ';
    
    const content = document.createElement('div');
    content.className = 'toast-content';
    content.textContent = message;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'toast-progress';
    
    toast.appendChild(icon);
    toast.appendChild(content);
    toast.appendChild(progressBar);
    
    // Create toast container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    container.appendChild(toast);
    
    // Animate progress bar
    progressBar.style.width = '100%';
    progressBar.style.transition = 'width 3s linear';
    setTimeout(() => progressBar.style.width = '0%', 100);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        setTimeout(() => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }, 3000);
}; 