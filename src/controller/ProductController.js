import axios from 'axios';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import { API_URL } from '../config/apiurl.config.js';
import { navigate } from '../utils/navigation';
import ProductUIHandler from '../handlers/ui/ProductUIHandler.js';

class ProductController {
    constructor() {
        this.API_URL = API_URL;
        this.uiHandler = new ProductUIHandler();
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

        // Only check SKU in 'add' mode (not required in edit mode if already exists)
        if ((!data.mode || data.mode !== 'edit') && (!data.sku || data.sku.trim() === '')) {
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
            barcodeInput,
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
            barcode: barcodeInput?.value.trim() || '',
            stock: quantityInput?.value.trim() || '0',
            quantity: quantityInput?.value.trim() || '0',
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
            console.log(`Updating product with ID ${id} with data:`, productData);
            const response = await axios.put(`${this.API_URL}/product/${id}`, productData);
            console.log('Update response:', response.data);
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

    setButtonLoading(button, isLoading, text = 'Add Product') {
        this.uiHandler.setButtonLoading(button, isLoading, text);
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

        if (!emptyState || !filledState || (!imageInputEmpty && !imageInputFilled)) {
            console.error('Required image elements not found for product setup');
            return;
        }

        console.log('Setting up image handling in ProductController');
        
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
        
        // Hàm xử lý upload ảnh - simplified
        const handleImageUpload = async (event) => {
            console.log('Image input change event triggered');
            const files = event.target.files;
            
            if (!files || files.length === 0) {
                console.log('No files selected');
                return;
            }
            
            console.log('Image files selected:', files.length);
            
            try {
                const file = files[0]; // Get the first file only
                let emptySlotIndex = -1;
                
                // Find the first empty slot
                for (let i = 0; i < previewImages.length; i++) {
                    if (!isValidImage(previewImages[i].src)) {
                        emptySlotIndex = i;
                        break;
                    }
                }
                
                if (emptySlotIndex === -1) {
                    alert("All image slots are filled. Please remove an image first.");
                    return;
                }
                
                // Show the preview
                console.log(`Setting up preview for image in slot ${emptySlotIndex}`);
                await this.setupImagePreview(file, previewImages[emptySlotIndex]);
                frames[emptySlotIndex].style.display = 'block';
                
                // Update UI state
                this.updateUIState(emptyState, filledState, true);
                
            } catch (error) {
                console.error('Error handling image upload:', error);
                alert('Error uploading image. Please try again.');
            }
        };

        // Set up image input handlers
        if (imageInputEmpty) {
            console.log('Setting up empty state image input handler');
            imageInputEmpty.value = ''; // Clear any existing value
            
            // Use direct onchange
            imageInputEmpty.onchange = handleImageUpload;
        }
        
        if (imageInputFilled) {
            console.log('Setting up filled state image input handler');
            imageInputFilled.value = ''; // Clear any existing value
            
            // Use direct onchange
            imageInputFilled.onchange = handleImageUpload;
        }

        // Setup direct button handlers (as a backup)
        if (uploadButtons && uploadButtons.length > 0) {
            if (uploadButtons[0] && imageInputEmpty) {
                uploadButtons[0].onclick = (e) => {
                    e.preventDefault();
                    console.log('Empty state upload button clicked from controller');
                    imageInputEmpty.click();
                    return false;
                };
            }
            
            if (uploadButtons.length > 1 && uploadButtons[1] && imageInputFilled) {
                uploadButtons[1].onclick = (e) => {
                    e.preventDefault();
                    console.log('Filled state upload button clicked from controller');
                    imageInputFilled.click();
                    return false;
                };
            }
        }

        // Setup delete buttons with direct onclick handlers
        if (deleteButtons && deleteButtons.length > 0) {
            deleteButtons.forEach((button, i) => {
                button.onclick = (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    console.log(`Delete button clicked for image ${index}`);
                    
                    const frame = frames[index];
                    const img = previewImages[index];
                    
                    img.src = '';
                    frame.style.display = 'none';
                    currentImages[index] = null;
                    
                    // Check remaining images
                    const remainingValidImages = Array.from(previewImages)
                        .filter(img => isValidImage(img.src));
                    
                    console.log(`Remaining valid images: ${remainingValidImages.length}`);
                    this.updateUIState(emptyState, filledState, remainingValidImages.length > 0);
                };
            });
        }
    }
}

export default ProductController;