import axios from 'axios';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import { API_URL } from '../config/apiurl.config.js';

class CategoryController {
    constructor() {
        this.API_URL = API_URL; 
    }

    redirect(path) {
        window.location.href = path;
    }

    validateFormData(data) {
        const errors = {};
        
        if (!data.name || data.name.trim() === '') {
            errors.name = 'Category name is required';
            document.querySelector('input[name="categoryName"]')?.focus();
            return { isValid: false, errors };
        }

        if (!data.description || data.description.trim() === '') {
            errors.description = 'Category description is required';
            document.querySelector('textarea[name="description"]')?.focus();
            return { isValid: false, errors };
        }

        // Chỉ kiểm tra image khi thêm mới
        if (data.mode === 'create' && !data.imageUrl) {
            errors.image = 'Category image is required';
            document.querySelector('#imageInput')?.focus();
            return { isValid: false, errors };
        }

        return {
            isValid: true,
            errors: {}
        };
    }

    async handleImageUpload(file) {
        if (!file) return null;
        try {
            return await uploadToCloudinary(file);
        } catch (error) {
            console.error('Error uploading image:', error);
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
        const uploadAreaElement = uploadArea || document.querySelector('.thumbnail__upload-area');
        if (uploadAreaElement) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadAreaElement.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

            uploadAreaElement.addEventListener('drop', (e) => {
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

    async getCategories() {
        try {
            const response = await axios.get(`${this.API_URL}/cate`);
            return response.data;
        } catch (error) {
            console.error('Error loading categories:', error);
            throw error;
        }
    }

    async getCategoryById(id) {
        try {
            const response = await axios.get(`${this.API_URL}/cate/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    }

    async saveCategory(categoryData) {
        try {
            const response = await axios.post(`${this.API_URL}/cate`, categoryData);
            return response.data;
        } catch (error) {
            console.error('Error saving category:', error);
            throw error;
        }
    }

    async updateCategory(id, categoryData) {
        try {
            const response = await axios.put(`${this.API_URL}/cate/${id}`, categoryData);
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }

    async deleteCategory(id) {
        try {
            const response = await axios.delete(`${this.API_URL}/cate/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
}

export default CategoryController; 