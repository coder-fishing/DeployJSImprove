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

        console.log('Setting up image handling in CategoryUIHandler');

        const handleImageUpload = async (file) => {
            if (!file) return;

            try {
                console.log('Handling image upload in CategoryUIHandler');
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (previewImage) {
                        previewImage.src = e.target.result;
                        console.log('Image preview updated');
                    }
                };
                reader.readAsDataURL(file);

                this.updateUIState(emptyState, previewState, true);
            } catch (error) {
                console.error('Error handling image:', error);
                alert('Error handling image. Please try again.');
            }
        };

        // Direct file input change handler
        imageInput.onchange = function(e) {
            console.log('Image input change detected');
            const file = e.target.files[0];
            if (file) {
                console.log('File selected:', file.name);
                handleImageUpload(file);
            }
        };

        // Setup drag and drop
        if (uploadArea) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`Drag event: ${eventName}`);
                });
            });

            uploadArea.addEventListener('drop', (e) => {
                console.log('File dropped on upload area');
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    console.log('Image file dropped:', file.name);
                    handleImageUpload(file);
                    if (imageInput) {
                        // Create a new DataTransfer object
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        imageInput.files = dataTransfer.files;
                    }
                }
            });
        }

        // Setup remove image button
        const removeButton = document.querySelector('.thumbnail__preview-remove');
        if (removeButton) {
            removeButton.onclick = () => {
                console.log('Remove image button clicked');
                if (imageInput) {
                    imageInput.value = '';
                }
                if (previewImage) {
                    previewImage.src = '';
                }
                this.updateUIState(emptyState, previewState, false);
            };
        }
    }
}

export default CategoryUIHandler; 