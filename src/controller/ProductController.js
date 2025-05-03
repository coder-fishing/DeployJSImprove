import axios from 'axios';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import { API_URL } from '../config/apiurl.config.js';

class ProductController {
    constructor() {
        this.API_URL = API_URL;

    }

    redirect(path) {
        window.location.href = path;
    }

    async handleImageUpload(file) {
        try {
            const imageUrl = await uploadToCloudinary(file);
            console.log('Upload successful:', imageUrl);
            return imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    async handleMultipleImageUpload(imageFiles) {
        try {
            const uploadedImages = await Promise.all(
                imageFiles.map(file => uploadToCloudinary(file))
            );
            return uploadedImages;
        } catch (error) {
            console.error('Error uploading multiple images:', error);
            throw error;
        }
    }

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

    validateProductData(data) {
        const errors = {};
        
        if (!data.name || data.name.trim() === '') {
            errors.name = 'Product name is required';
            document.querySelector('input[name="productName"]')?.focus();
            return { isValid: false, errors };
        }

        if (!data.sku || data.sku.trim() === '') {
            errors.sku = 'SKU is required';
            document.querySelector('input[name="sku"]')?.focus();
            return { isValid: false, errors };
        }

        if (!data.category || data.category === 'None') {
            errors.category = 'Category is required';
            document.querySelector('#dropdownButtonTop')?.focus();
            return { isValid: false, errors };
        }

        if (!data.price || isNaN(data.price) || data.price <= 0) {
            errors.price = 'Valid price is required';
            document.querySelector('input[name="basePrice"]')?.focus();
            return { isValid: false, errors };
        }

        if (!data.stock || isNaN(data.stock) || data.stock < 0) {
            errors.stock = 'Valid stock quantity is required';
            document.querySelector('input[name="quantity"]')?.focus();
            return { isValid: false, errors };
        }

        return {
            isValid: true,
            errors: {}
        };
    }

    getProductFormData(elements) {
        const { 
            images, 
            dropdownButton, 
            statusText, 
            nameInput, 
            skuInput, 
            priceInput, 
            descriptionInput, 
            quantityInput 
        } = elements;

        // Chỉ lấy ảnh từ Cloudinary
        const validImages = Array.from(images).filter(img => img.src && img.src.includes('cloudinary'));
        
        return {
            name: nameInput.value.trim(),
            sku: skuInput.value.trim(),
            category: dropdownButton ? dropdownButton.textContent : 'None',
            category_ID: dropdownButton ? dropdownButton.getAttribute("data-selected-id") : null,
            price: priceInput.value.trim(),
            status: statusText ? statusText.textContent.trim() : 'Draft',
            added: new Date().toISOString(),
            description: descriptionInput?.value.trim() || '',
            stock: quantityInput?.value.trim() || '0',
            ImageSrc: {
                firstImg: validImages.length > 0 ? validImages[0].src : null,
                secondImg: validImages.length > 1 ? validImages[1].src : null,
                thirdImg: validImages.length > 2 ? validImages[2].src : null,
            }
        };
    }

    async processProductImages(images, imageFiles) {
        try {
            const uploadedImages = await this.handleMultipleImageUpload(imageFiles);
            const imageUrls = {
                firstImg: null,
                secondImg: null,
                thirdImg: null
            };

            let uploadedIndex = 0;

            // Chỉ xử lý ảnh từ Cloudinary
            for (let i = 0; i < images.length; i++) {
                if (images[i]?.src) {
                    if (images[i].src.includes('cloudinary')) {
                        // Giữ lại ảnh Cloudinary hiện có
                        imageUrls[`${i === 0 ? 'first' : i === 1 ? 'second' : 'third'}Img`] = images[i].src;
                    } else if (images[i].src.includes('data:image')) {
                        // Upload ảnh mới
                        if (uploadedIndex < uploadedImages.length) {
                            imageUrls[`${i === 0 ? 'first' : i === 1 ? 'second' : 'third'}Img`] = uploadedImages[uploadedIndex];
                            uploadedIndex++;
                        }
                    }
                }
            }

            return imageUrls;
        } catch (error) {
            console.error('Error processing images:', error);
            throw error;
        }
    }

    async saveProduct(productData) {
        try {
            const response = await axios.post(`${this.API_URL}/product`, productData);
            return response.data;
        } catch (error) {
            console.error('Error saving product:', error);
            throw error;
        }
    }

    async updateProduct(id, productData) {
        try {
            const response = await axios.put(`${this.API_URL}/product/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const response = await axios.delete(`${this.API_URL}/product/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const response = await axios.get(`${this.API_URL}/product`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const response = await axios.get(`${this.API_URL}/product/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    async getCategories() {
        try {
            const response = await axios.get(`${this.API_URL}/cate`);
            return response.data;
        } catch (error) {
            console.error('Error loading categories:', error);
            throw error;
        }
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
            filledState, 
            imageInputEmpty, 
            imageInputFilled, 
            uploadButtons, 
            previewImages, 
            frames, 
            deleteButtons 
        } = elements;

        let currentImages = [];
        
        // Kiểm tra ảnh hợp lệ (chỉ nhận ảnh từ Cloudinary)
        const isValidImage = (src) => {
            return src && src !== '' && src.includes('cloudinary');
        };

        // Kiểm tra xem có ảnh hợp lệ nào không
        const hasValidImages = Array.from(previewImages).some(img => isValidImage(img.src));
        
        // Cập nhật UI ban đầu
        this.updateUIState(emptyState, filledState, hasValidImages);
        
        // Hiển thị frames cho ảnh hợp lệ
        previewImages.forEach((img, index) => {
            if (isValidImage(img.src)) {
                currentImages[index] = img.src;
                frames[index].style.display = 'block';
            } else {
                img.src = '';
                frames[index].style.display = 'none';
            }
        });

        // Setup upload buttons
        if (uploadButtons.length > 1) {
            uploadButtons[0].addEventListener('click', () => imageInputEmpty.click());
            uploadButtons[1].addEventListener('click', () => imageInputFilled.click());
        }

        // Setup delete buttons
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                const frame = frames[index];
                const img = previewImages[index];
                
                img.src = '';
                frame.style.display = 'none';
                currentImages[index] = null;
                
                // Kiểm tra ảnh còn lại
                const remainingValidImages = Array.from(previewImages)
                    .filter(img => isValidImage(img.src));
                this.updateUIState(emptyState, filledState, remainingValidImages.length > 0);
            });
        });

        // Setup image upload handling
        const handleImageUpload = async (event) => {
            const files = event.target.files;
            
            if (files.length > 0) {
                try {
                    const newFiles = Array.from(files);
                    let emptySlotIndex = -1;
                    
                    // Tìm vị trí trống đầu tiên
                    previewImages.forEach((img, index) => {
                        if (emptySlotIndex === -1 && !isValidImage(img.src)) {
                            emptySlotIndex = index;
                        }
                    });

                    if (emptySlotIndex === -1) {
                        alert("All image slots are filled. Please remove an image first.");
                        return;
                    }

                    // Hiển thị preview cho ảnh mới
                    for (let i = 0; i < newFiles.length; i++) {
                        if (emptySlotIndex + i < previewImages.length) {
                            const file = newFiles[i];
                            await this.setupImagePreview(file, previewImages[emptySlotIndex + i]);
                            frames[emptySlotIndex + i].style.display = 'block';
                        }
                    }

                    // Luôn hiển thị filled state khi có ảnh preview
                    this.updateUIState(emptyState, filledState, true);
                } catch (error) {
                    console.error('Error handling images:', error);
                    alert('Error uploading images. Please try again.');
                }
            }
        };

        imageInputEmpty.addEventListener('change', handleImageUpload);
        imageInputFilled.addEventListener('change', handleImageUpload);

        // Return cleanup function
        return () => {
            imageInputEmpty.removeEventListener('change', handleImageUpload);
            imageInputFilled.removeEventListener('change', handleImageUpload);
            uploadButtons.forEach(btn => {
                btn.replaceWith(btn.cloneNode(true));
            });
            deleteButtons.forEach(btn => {
                btn.replaceWith(btn.cloneNode(true));
            });
        };
    }
}

export default ProductController;