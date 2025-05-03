import productForm from "../components/productForm.js";
import { caretRight, cross, save } from "./../../assets/icon";
import { dropdown } from '../../utils/dropdown.js';
import ProductController from "../../controller/ProductController.js";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { createToast } from "../../utils/toast.js";

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
            createToast('Categories loaded successfully', 'success');
        } catch (error) {
            console.error('Error loading categories:', error);
            createToast('Failed to load categories', 'error');
        }
    }

    handleEditProduct = (product) => {
        const saveBtn = document.querySelector("#addProduct");
        const cancelBtn = document.querySelector(".product-title__buttons--cancel");

        // Set initial status
        const statusText = document.getElementById('status-text');
        const dropdownButton = document.getElementById('dropdownButton');
        if (statusText && dropdownButton) {
            const status = product.status || 'Draft';
            statusText.textContent = status;
            dropdownButton.textContent = status;
            const statusClass = status.toLowerCase().replace(/\s+/g, '-');
            statusText.className = `form-section__title-status--label-text ${statusClass}`;
        }

        saveBtn.addEventListener("click", async () => {
            try {
                showLoading();

                const images = Array.from(document.querySelectorAll(".preview-img"));
                const imageFiles = Array.from(document.querySelectorAll('input[type="file"]'))
                    .map(input => input.files[0])
                    .filter(file => file);

                const imageUrls = await this.controller.processProductImages(images, imageFiles);

                const formElements = {
                    images,
                    dropdownButton: document.getElementById("dropdownButtonTop"),
                    statusText: document.getElementById('status-text'),
                    nameInput: document.querySelector('input[name="productName"]'),
                    skuInput: document.querySelector('input[name="sku"]'),
                    priceInput: document.querySelector('input[name="basePrice"]'),
                    descriptionInput: document.querySelector('textarea[name="description"]'),
                    quantityInput: document.querySelector('input[name="quantity"]')
                };

                const productData = this.controller.getProductFormData(formElements);
                productData.ImageSrc = imageUrls;

                const validation = this.controller.validateProductData(productData);
                if (!validation.isValid) {
                    createToast(Object.values(validation.errors)[0], 'error');
                    return;
                }

                this.controller.setButtonLoading(saveBtn, true, 'Save product');
                await this.controller.updateProduct(this.productId, productData);
                createToast('Product updated successfully', 'success');
                this.controller.redirect("/");
            } catch (error) {
                console.error("Error updating product:", error);
                createToast('Failed to update product', 'error');
            } finally {
                hideLoading();
                this.controller.setButtonLoading(saveBtn, false, 'Save product');
            }
        });

        cancelBtn.addEventListener("click", () => {
            this.controller.redirect("/");
        });
    };

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
            this.handleEditProduct(this.currentProduct);
            createToast('Product loaded successfully', 'success');
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
