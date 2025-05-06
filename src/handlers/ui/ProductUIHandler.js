import uploadToCloudinary from '../../utils/uploadToCloudinary.js';

class ProductUIHandler {
    setupImagePreview(file, previewImage) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                resolve();
            };
            reader.readAsDataURL(file);
        });
    }

    setupDragAndDrop(uploadArea, handleFileUpload) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.preventDefaults, false);
        });

        uploadArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const file = dt.files[0];
            if (file && file.type.startsWith('image/')) {
                handleFileUpload(file);
            }
        }, false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    updateUIState(emptyState, previewState, show) {
        if (emptyState && previewState) {
            emptyState.style.display = show ? 'none' : 'flex';
            previewState.style.display = show ? 'flex' : 'none';
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

        // Setup click on Add Image button
        const addImageBtn = document.querySelector('.thumbnail__add-btn');
        if (addImageBtn && imageInput) {
            addImageBtn.addEventListener('click', () => {
                imageInput.click();
            });
        }

        // Setup drag and drop
        if (uploadArea) {
            this.setupDragAndDrop(uploadArea, handleImageUpload);
        }

        // Setup file input change
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    handleImageUpload(file);
                }
            });
        }

        // Setup remove image button
        const removeButton = document.querySelector('.thumbnail__preview-remove');
        if (removeButton) {
            removeButton.addEventListener('click', () => {
                if (imageInput) {
                    imageInput.value = '';
                }
                if (previewImage) {
                    previewImage.src = '';
                }
                this.updateUIState(emptyState, previewState, false);
            });
        }
    }
}

export default ProductUIHandler; 