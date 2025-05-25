import axios from 'axios';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import { API_URL } from '../config/apiurl.config.js';
import CategoryUIHandler from '../handlers/ui/CategoryUIHandler.js';

class CategoryController {
    constructor() {
        this.API_URL = API_URL; 
        this.uiHandler = new CategoryUIHandler();
    }

    validateFormData(formData) {
        const errors = {};
        
        if (!formData.name || formData.name.length < 3) {
            errors.name = 'Name must be at least 3 characters long';
        }

        if (!formData.description || formData.description.length < 10) {
            errors.description = 'Description must be at least 10 characters long';
        }

        if (formData.mode === 'create' && !formData.imageUrl) {
            errors.image = 'Please select an image';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
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

    async getCategoryById(id) {
        try {
            const response = await axios.get(`${this.API_URL}/cate/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
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

    setButtonLoading(button, isLoading, text = 'Add Category') {
        this.uiHandler.setButtonLoading(button, isLoading, text);
    }

    setupImageHandling(elements) {
        this.uiHandler.setupImageHandling(elements);
    }
}

export default CategoryController; 