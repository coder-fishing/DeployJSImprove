import categoryForm from "../components/categoryForm";
import { caretRight, cross, save } from "./../../assets/icon";
import { Category } from "../../model/category.model";
import CategoryController from "../../controller/CategoryController";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { createToast } from "../../utils/toast.js";

export default class editCategory {
    constructor() {
        this.controller = new CategoryController();
        this.categoryId = window.location.pathname.split('/').pop();
        this.currentCategory = null;
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
            console.log('Setting up image handling for edit category');
            this.controller.setupImageHandling(elements);
        } else {
            console.error('Image elements not found for setup');
        }
    }

    setupEventListeners() {
        const saveBtn = document.getElementById('saveCategoryBtn');
        const cancelBtn = document.querySelector(".product-title__buttons--cancel");

        console.log('Edit category - Save button found:', !!saveBtn);
        console.log('Edit category - Cancel button found:', !!cancelBtn);

        if (saveBtn) {
            saveBtn.onclick = (e) => {
                e.preventDefault();
                console.log('Edit category - Save button clicked');
                this.handleEditCategory();
                return false;
            };
        }

        if (cancelBtn) {
            cancelBtn.onclick = (e) => {
                e.preventDefault();
                console.log('Edit category - Cancel button clicked');
                window.location.href = "/category";
                return false;
            };
        }
    }

    async handleEditCategory() {
        console.log('handleEditCategory method called');
        
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
        
        if (!nameInput || !descriptionInput) {
            console.error('One or more form elements not found');
            createToast('Form elements not found', 'error');
            return;
        }
    
        const formData = {
            name: nameInput.value.trim(),
            description: descriptionInput.value.trim(),
            imageUrl: imageInput.files[0],
            mode: 'edit'
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

        // Check if data has changed
        const hasNameChanged = formData.name !== this.currentCategory.name;
        const hasDescriptionChanged = formData.description !== this.currentCategory.description;
        const hasImageChanged = formData.imageUrl != null;

        if (!hasNameChanged && !hasDescriptionChanged && !hasImageChanged) {
            window.location.href = "/category";
            return;
        }

        try {
            showLoading();
            this.controller.setButtonLoading(submitButton, true, 'Save Category');
    
            let imageUrl = this.currentCategory.image; // Keep existing image by default
            
            // Only upload new image if a file was selected
            if (formData.imageUrl) {
                imageUrl = await this.controller.handleImageUpload(formData.imageUrl);
            }
            
            const categoryData = new Category(formData.name, formData.description, imageUrl);
            await this.controller.updateCategory(this.categoryId, categoryData);          
            createToast('Category updated successfully!', 'success');
            setTimeout(() => {
                window.location.href = "/category";
            }, 1000);
        } catch (error) {
            console.error('Error:', error);
            createToast('Failed to update category', 'error');
        } finally {
            hideLoading();
            this.controller.setButtonLoading(submitButton, false, 'Save Category');
        }
    }

    render = async () => {
        try {
            showLoading();
            this.currentCategory = await this.controller.getCategoryById(this.categoryId);
            
            if (!this.currentCategory) {
                document.querySelector(".content").innerHTML = "<p>Error loading category</p>";
                createToast('Category not found', 'error');
                return;
            }
            
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
                                <p class="product-title-left__breadcrumb--normal">Edit Category</p>
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
                    ${categoryForm({ mode: 'edit', categoryData: this.currentCategory })}
                </div>
            `;
            
            document.querySelector(".content").innerHTML = content;
            
            // Setup event listeners after rendering
            setTimeout(() => {
                this.setupEventListeners();
                this.setupImageHandling();
            }, 100);
        } catch (error) {
            console.error("Error in render:", error);
            document.querySelector(".content").innerHTML = "<p>Error loading category</p>";
            createToast('Failed to load category', 'error');
        } finally {
            hideLoading();
        }
    }
}
