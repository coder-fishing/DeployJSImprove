class CategoryUIHandler {
    constructor() {
        this.eventListenersInitialized = false;
    }

    updateUIState(emptyState, previewState, show) {
        if (emptyState && previewState) {
            emptyState.style.display = show ? 'none' : 'flex';
            previewState.style.display = show ? 'block' : 'none';
        }
    }

    setButtonLoading(button, isLoading, text = 'Add Category') {
        if (button) {
            button.disabled = isLoading;
            const buttonText = button.querySelector('.button__text');
            if (buttonText) {
                buttonText.textContent = isLoading ? 'Processing...' : text;
            }
        }
    }

    setupImageHandling(elements) {
        const { 
            emptyState, 
            previewState, 
            imageInput, 
            previewImage, 
            uploadArea 
        } = elements;

        if (!imageInput || !previewImage) {
            console.error('Required image elements not found');
            return;
        }

        const handleImageUpload = async (file) => {
            if (!file) return;

            try {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (previewImage) {
                        previewImage.src = e.target.result;
                    }
                };
                reader.readAsDataURL(file);

                this.updateUIState(emptyState, previewState, true);
            } catch (error) {
                console.error('Error handling image:', error);
                alert('Error handling image. Please try again.');
            }
        };

        // Remove existing event listeners if any
        const addImageBtn = document.querySelector('.thumbnail__add-btn');
        const oldBtn = addImageBtn?.cloneNode(true);
        if (oldBtn && addImageBtn.parentNode) {
            addImageBtn.parentNode.replaceChild(oldBtn, addImageBtn);
        }

        // Setup click on Add Image button
        if (oldBtn) {
            oldBtn.addEventListener('click', () => {
                imageInput.click();
            });
        }

        // Setup drag and drop
        if (uploadArea) {
            // Remove existing listeners
            const newUploadArea = uploadArea.cloneNode(true);
            uploadArea.parentNode.replaceChild(newUploadArea, uploadArea);

            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                newUploadArea.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

            newUploadArea.addEventListener('drop', (e) => {
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    handleImageUpload(file);
                    if (imageInput) {
                        imageInput.files = e.dataTransfer.files;
                    }
                }
            });
        }

        // Setup file input change
        const newImageInput = imageInput.cloneNode(true);
        imageInput.parentNode.replaceChild(newImageInput, imageInput);
        newImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleImageUpload(file);
            }
        });

        // Setup remove image button
        const removeButton = document.querySelector('.thumbnail__preview-remove');
        if (removeButton) {
            const newRemoveButton = removeButton.cloneNode(true);
            removeButton.parentNode.replaceChild(newRemoveButton, removeButton);
            
            newRemoveButton.addEventListener('click', () => {
                if (newImageInput) {
                    newImageInput.value = '';
                }
                if (previewImage) {
                    previewImage.src = '';
                }
                this.updateUIState(emptyState, previewState, false);
            });
        }
    }
}

export default CategoryUIHandler; 