import productForm from "../components/productForm.js";
import { caretRight, cross, save } from "./../../assets/icon";
import { dropdown } from '../../utils/dropdown.js';
import ProductController from "../../controller/ProductController.js";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { createToast } from "../../utils/toast.js";
import { navigate } from "../../utils/navigation";

export class editProduct {
    constructor() {
        this.controller = new ProductController();
        this.productId = window.location.pathname.split('/').pop();
        this.currentProduct = null;
        this.render();
    }

    async loadCategories() {
        try {
            const categories = await this.controller.getCategories();
            const dropdownContent = document.getElementById('dropdownContentTop');
            const dropdownButton = document.getElementById('dropdownButtonTop');
            
            if (dropdownContent) {
                dropdownContent.innerHTML = categories.map(category => `
                    <div data-value="${category.name}" 
                         data-id="${category.categoryID}">
                    ${category.name}</div>
                `).join('');

                // Set initial category if product exists
                if (this.currentProduct && this.currentProduct.category_ID) {
                    const selectedCategory = categories.find(cat => cat.categoryID === this.currentProduct.category_ID);
                    if (selectedCategory && dropdownButton) {
                        dropdownButton.textContent = selectedCategory.name;
                        dropdownButton.setAttribute('data-selected-id', selectedCategory.categoryID);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            createToast('Failed to load categories', 'error');
        }
    }

    async handleEditProduct() {
        const nameInput = document.querySelector('input[name="productName"]');
        const descriptionInput = document.querySelector('textarea[name="description"]');
        const priceInput = document.querySelector('input[name="price"]');
        const stockInput = document.querySelector('input[name="stock"]');
        const imageInput = document.getElementById('imageInput');
        const categoryDropdown = document.getElementById('dropdownButtonTop');
        const submitButton = document.querySelector('.product-title__buttons--add');

        if (!nameInput || !descriptionInput || !priceInput || !stockInput || !categoryDropdown) {
            console.error('One or more form elements not found');
            createToast('Form elements not found', 'error');
            return;
        }

        const formData = {
            name: nameInput.value.trim(),
            description: descriptionInput.value.trim(),
            price: parseFloat(priceInput.value),
            stock: parseInt(stockInput.value),
            categoryId: categoryDropdown.getAttribute('data-selected-id'),
            imageUrl: imageInput.files[0],
            mode: 'edit'
        };

        const validation = this.controller.validateFormData(formData);
        if (!validation.isValid) {
            createToast(Object.values(validation.errors)[0], 'error');
            return;
        }

        // Check if data has changed
        const hasNameChanged = formData.name !== this.currentProduct.name;
        const hasDescriptionChanged = formData.description !== this.currentProduct.description;
        const hasPriceChanged = formData.price !== this.currentProduct.price;
        const hasStockChanged = formData.stock !== this.currentProduct.stock;
        const hasCategoryChanged = formData.categoryId !== this.currentProduct.category_ID;
        const hasImageChanged = formData.imageUrl != null;

        if (!hasNameChanged && !hasDescriptionChanged && !hasPriceChanged && 
            !hasStockChanged && !hasCategoryChanged && !hasImageChanged) {
            window.location.href = "/";
            return;
        }

        try {
            showLoading();
            this.controller.setButtonLoading(submitButton, true, 'Save Product');

            let imageUrl = this.currentProduct.image; // Keep existing image by default
            
            // Only upload new image if a file was selected
            if (formData.imageUrl) {
                imageUrl = await this.controller.handleImageUpload(formData.imageUrl);
            }

            const productData = new Product(
                formData.name,
                formData.description,
                formData.price,
                formData.stock,
                formData.categoryId,
                imageUrl
            );

            await this.controller.updateProduct(this.productId, productData);
            createToast('Product updated successfully!', 'success');
            setTimeout(() => {
                window.location.href = "/";
            }, 500);
        } catch (error) {
            console.error('Error:', error);
            createToast('Failed to update product', 'error');
        } finally {
            hideLoading();
            this.controller.setButtonLoading(submitButton, false, 'Save Product');
        }
    }

    render = async () => {
        try {
            showLoading();
            this.currentProduct = await this.controller.getProductById(this.productId);
            
            if (!this.currentProduct) {
                document.querySelector(".content").innerHTML = `
                    <div class="error-message">
                        <p>❌ Error loading product. Product not found.</p>
                    </div>`;
                createToast('Product not found', 'error');
                return;
            }

            this.currentProduct.div = this.currentProduct.status.toLowerCase().replace(/\s+/g, '-');
            
            const content = `
            <div class="product-list">
                <div class="product-title">
                    <div class="product-title-left">
                        <p class="product-title-left__name">Product</p>
                        <div class="product-title-left__breadcrumb">
                            <a href="/dashboard"><p class="product-title-left__breadcrumb--active">Dashboard</p></a>
                            <figure><img src="${caretRight}" alt="arrow right" class="product-title__icon" /></figure>
                            <a href="/"><p class="product-title-left__breadcrumb--active">Product List</p></a>
                            <figure><img src="${caretRight}" alt="arrow right" class="product-title__icon" /></figure>
                            <p class="product-title-left__breadcrumb--normal">Edit Product</p>
                        </div>   
                    </div>
                    <div class="product-title__buttons">  
                        <button class="product-title__buttons--cancel">
                            <figure class="button__icon"><img src="${cross}" alt="icon"/></figure>
                            <span class="button__text">Cancel</span>
                        </button>
                        <button class="product-title__buttons--add" id="addProduct">
                            <figure class="button__icon"><img src="${save}" alt="icon" /></figure>
                            <span class="button__text">Save product</span>
                        </button>
                    </div>
                </div>
                ${productForm({ mode: 'edit', productData: this.currentProduct })}
            </div>`;

            document.querySelector(".content").innerHTML = content;

            // Load categories after rendering the form
            await this.loadCategories();
            
            // Setup dropdowns
            dropdown('dropdown', 'dropdownButton', 'dropdownContent', 'status-text');
            dropdown('dropdowntop', 'dropdownButtonTop', 'dropdownContentTop');

            // Setup image handling
            const imageElements = {
                emptyState: document.getElementById('emptyState'),
                filledState: document.getElementById('filledState'),
                imageInputEmpty: document.getElementById('imageInputEmpty'),
                imageInputFilled: document.getElementById('imageInputFilled'),
                uploadButtons: document.querySelectorAll('.media__upload-btn'),
                previewImages: document.querySelectorAll('.preview-img'),
                frames: document.querySelectorAll('.list-image-preview'),
                deleteButtons: document.querySelectorAll('.delete-image')
            };

            this.controller.setupImageHandling(imageElements);
            this.handleEditProduct();
        } catch (error) {
            console.error("Error in render:", error);
            document.querySelector(".content").innerHTML = `
                <div class="error-message">
                    <p>❌ Error loading product.</p>
                </div>`;
            createToast('Failed to load product', 'error');
        } finally {
            hideLoading();
        }
    };
}
