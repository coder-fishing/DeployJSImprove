import categoryForm from "../components/categoryForm";
import { caretRight, cross, save } from "./../../assets/icon";
import "./../../assets/css/categoryForm.css";
import { Category } from "../../model/category.model";
import CategoryController from "../../controller/CategoryController";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { createToast } from "../../utils/toast.js";

class addCategories {  
    constructor() {
        this.controller = new CategoryController();
        this.render();
    }

    setupImageHandling() {
        const elements = {
            emptyState: document.getElementById('emptyState'),
            previewState: document.getElementById('previewState'),
            imageInput: document.getElementById('imageInput'),
            previewImage: document.getElementById('previewImage'),
            uploadArea: document.querySelector('.thumbnail__upload-area')
        };

        if (elements.emptyState && elements.previewState && elements.imageInput) {
            console.log('Setting up image handling for add category');
            this.controller.setupImageHandling(elements);
        } else {
            console.error('Image elements not found for setup');
        }
    }

    setupEventListeners() {
        const saveBtn = document.getElementById('saveCategoryBtn');
        const cancelBtn = document.querySelector(".product-title__buttons--cancel");

        console.log('Save button found:', !!saveBtn);
        console.log('Cancel button found:', !!cancelBtn);

        if (saveBtn) {
            saveBtn.onclick = (e) => {
                e.preventDefault();
                console.log('Save button clicked');
                this.handleAddCategory();
                return false;
            };
        }

        if (cancelBtn) {
            cancelBtn.onclick = (e) => {
                e.preventDefault();
                console.log('Cancel button clicked');
                window.location.href = "/category";
                return false;
            };
        }
    }

    async handleAddCategory() {
        console.log('handleAddCategory method called');
        
        const nameInput = document.querySelector('input[name="categoryName"]');
        const descriptionInput = document.querySelector('textarea[name="description"]');
        const imageInput = document.getElementById('imageInput');
        const submitButton = document.getElementById('saveCategoryBtn');
    
        console.log('Form elements:', {
            nameInput: !!nameInput,
            descriptionInput: !!descriptionInput,
            imageInput: !!imageInput,
            submitButton: !!submitButton
        });
        
        if (!nameInput || !descriptionInput || !imageInput) {
            console.error('One or more form elements not found');
            createToast('Form elements not found', 'error');
            return;
        }
    
        const formData = {
            name: nameInput.value.trim(),
            description: descriptionInput.value.trim(),
            imageUrl: imageInput.files[0],
            mode: 'create'
        };
    
        console.log('Form data collected:', {
            name: formData.name,
            description: formData.description.substring(0, 20) + '...',
            hasImage: !!formData.imageUrl
        });
        
        const validation = this.controller.validateFormData(formData);
        if (!validation.isValid) {
            createToast(Object.values(validation.errors)[0], 'error');
            return;
        }

        try {
            showLoading();
            this.controller.setButtonLoading(submitButton, true);
            const imageUrl = await this.controller.handleImageUpload(formData.imageUrl);
            const categoryData = new Category(formData.name, formData.description, imageUrl);
            await this.controller.saveCategory(categoryData);
            
            createToast('Category added successfully!', 'success');
            setTimeout(() => {
                window.location.href = "/category";
            }, 1000);
        } catch (error) {
            console.error('Error:', error);
            createToast('Failed to add category', 'error');
        } finally {
            hideLoading();
            this.controller.setButtonLoading(submitButton, false);
        }
    }

    render() {
        try {
            showLoading();
            const content = `
               <div class="product-list">
                    <div class="product-title">
                        <div class="product-title-left">
                            <p class="product-title-left__name">Categories</p>
                            <div class="product-title-left__breadcrumb">
                                <a href="/dashboard"><p class="product-title-left__breadcrumb--active">Dashboard</p></a>
                                <figure><img src="${caretRight}" alt="arrow right" class="product-title__icon" /></figure>
                                <a href="/category"><p class="product-title-left__breadcrumb--active">Category List</p></a>
                                <figure><img src="${caretRight}" alt="arrow right" class="product-title__icon" /></figure>
                                <p class="product-title-left__breadcrumb--normal">Add Category</p>
                            </div>   
                        </div>
                        <div class="product-title__buttons">  
                            <button class="product-title__buttons--cancel">
                                <figure class="button__icon"><img src="${cross}" alt="icon"/></figure>
                                <span class="button__text">Cancel</span>
                            </button>
                            <button class="product-title__buttons--add" id="saveCategoryBtn" style="cursor: pointer;">
                                <figure class="button__icon"><img src="${save}" alt="icon" /></figure>
                                <span class="button__text">Save Category</span>
                            </button>
                        </div>
                    </div>
                    ${categoryForm({ mode: 'create' })}
                </div>
            `;
            document.querySelector(".content").innerHTML = content;
            
            // Setup event listeners after rendering
            setTimeout(() => {
                this.setupEventListeners();
                this.setupImageHandling();
            }, 100);
        } catch (error) {
            console.error('Error rendering form:', error);
            createToast('Failed to load form', 'error');
        } finally {
            hideLoading();
        }
    }
}

export default addCategories; 