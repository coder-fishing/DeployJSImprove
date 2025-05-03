export const showConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
    // Create dialog container
    const dialogContainer = document.createElement('div');
    dialogContainer.className = 'confirm-dialog-overlay';
    
    // Create dialog content
    dialogContainer.innerHTML = `
        <div class="confirm-dialog">
            <div class="confirm-dialog__content">
                <h3 class="confirm-dialog__title">${title}</h3>
                <p class="confirm-dialog__message">${message}</p>
                <div class="confirm-dialog__buttons">
                    <button class="confirm-dialog__button confirm-dialog__button--cancel">Cancel</button>
                    <button class="confirm-dialog__button confirm-dialog__button--confirm">OK</button>
                </div>
            </div>
        </div>
    `;

    // Add to body
    document.body.appendChild(dialogContainer);

    // Add event listeners
    const confirmBtn = dialogContainer.querySelector('.confirm-dialog__button--confirm');
    const cancelBtn = dialogContainer.querySelector('.confirm-dialog__button--cancel');
    const dialog = dialogContainer.querySelector('.confirm-dialog');

    // Add animation class after a small delay
    setTimeout(() => {
        dialog.classList.add('confirm-dialog--visible');
    }, 10);

    // Handle confirm
    confirmBtn.addEventListener('click', () => {
        dialog.classList.remove('confirm-dialog--visible');
        setTimeout(() => {
            dialogContainer.remove();
            onConfirm();
        }, 200);
    });

    // Handle cancel
    cancelBtn.addEventListener('click', () => {
        dialog.classList.remove('confirm-dialog--visible');
        setTimeout(() => {
            dialogContainer.remove();
            if (onCancel) onCancel();
        }, 200);
    });

    // Handle click outside
    dialogContainer.addEventListener('click', (e) => {
        if (e.target === dialogContainer) {
            dialog.classList.remove('confirm-dialog--visible');
            setTimeout(() => {
                dialogContainer.remove();
                if (onCancel) onCancel();
            }, 200);
        }
    });
}; 