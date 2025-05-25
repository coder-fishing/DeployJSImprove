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

    setupEventListeners() {
        // Use ID selector for save button and class selector for cancel button
        const saveBtn = document.getElementById('saveProductBtn');
        const cancelBtn = document.querySelector(".product-title__buttons--cancel");

        console.log('Save button found by ID:', !!saveBtn);
        console.log('Cancel button found:', !!cancelBtn);

        if (saveBtn) {
            // Add direct onclick handler instead of addEventListener
            saveBtn.onclick = (e) => {
                e.preventDefault();
                console.log('Save button clicked via ID selector');
                this.handleEditProduct();
                return false;
            };
        }

        if (cancelBtn) {
            // Add direct onclick handler instead of addEventListener
            cancelBtn.onclick = (e) => {
                e.preventDefault();
                console.log('Cancel button clicked');
                window.location.href = "/";
                return false;
            };
        }

        // Setup dropdowns right away to ensure they work
        this.setupDropdowns();
    }

    setupDropdowns() {
        console.log('Setting up dropdowns for editProduct page');
        
        // Initialize category dropdown
        dropdown('dropdowntop', 'dropdownButtonTop', 'dropdownContentTop');
        this.setupDropdownItemHandlers('dropdownContentTop', 'dropdownButtonTop');
        
        // Add direct onclick handler to the category dropdown button
        const categoryButton = document.getElementById('dropdownButtonTop');
        const categoryContent = document.getElementById('dropdownContentTop');
        if (categoryButton && categoryContent) {
            categoryButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                categoryContent.style.display = categoryContent.style.display === 'none' ? 'block' : 'none';
            };
        }
        
        // Initialize status dropdown
        dropdown('dropdown', 'dropdownButton', 'dropdownContent', 'status-text');
        this.setupDropdownItemHandlers('dropdownContent', 'dropdownButton', 'status-text');
        
        // Add direct onclick handler to the status dropdown button
        const statusButton = document.getElementById('dropdownButton');
        const statusContent = document.getElementById('dropdownContent');
        if (statusButton && statusContent) {
            statusButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                statusContent.style.display = statusContent.style.display === 'none' ? 'block' : 'none';
            };
        }
    }
    
    setupDropdownItemHandlers(contentId, buttonId, statusTextId = null) {
        const dropdownContent = document.getElementById(contentId);
        const dropdownButton = document.getElementById(buttonId);
        const statusText = statusTextId ? document.getElementById(statusTextId) : null;
        
        if (!dropdownContent || !dropdownButton) {
            console.error(`Dropdown elements not found: content=${!!dropdownContent}, button=${!!dropdownButton}`);
            return;
        }
        
        console.log(`Setting up dropdown handlers for ${contentId}`);
        
        // Add click handlers to dropdown items
        const items = dropdownContent.querySelectorAll('div');
        items.forEach(item => {
            // First remove any existing click handlers
            const newItem = item.cloneNode(true);
            if (item.parentNode) {
                item.parentNode.replaceChild(newItem, item);
            }
            
            // Then add new click handler with direct onclick
            newItem.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const value = newItem.getAttribute('data-value');
                const id = newItem.getAttribute('data-id');
                
                console.log(`Dropdown item selected: ${value}${id ? ', ID: ' + id : ''}`);
                
                // Update button text
                dropdownButton.textContent = value;
                
                // Store selected ID if available
                if (id) {
                    dropdownButton.setAttribute('data-selected-id', id);
                }
                
                // Also update status text if applicable
                if (statusText) {
                    statusText.textContent = value;
                    
                    // Update status class
                    const statusClass = value.toLowerCase().replace(/\s+/g, '-');
                    statusText.className = `form-section__title-status--label-text ${statusClass}`;
                }
                
                // Hide the dropdown
                dropdownContent.style.display = 'none';
            };
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdownContent.contains(e.target) && !dropdownButton.contains(e.target)) {
                dropdownContent.style.display = 'none';
            }
        });
    }

    async loadCategories() {
        try {
            showLoading();
            const categories = await this.controller.getCategories();
            const dropdownContent = document.getElementById('dropdownContentTop');
            const dropdownButton = document.getElementById('dropdownButtonTop');
            
            if (!dropdownContent || !dropdownButton) {
                console.error('Category dropdown elements not found:', {
                    content: !!dropdownContent,
                    button: !!dropdownButton
                });
                hideLoading();
                return;
            }
            
            // Clear any existing categories
            dropdownContent.innerHTML = '';
            
            if (categories && categories.length > 0) {
                console.log(`Adding ${categories.length} categories to dropdown`);
                
                // Add each category as a dropdown item
                categories.forEach(category => {
                    const item = document.createElement('div');
                    item.setAttribute('data-value', category.name);
                    item.setAttribute('data-id', category.categoryID);
                    item.textContent = category.name;
                    
                    // Add direct onclick handler
                    item.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log(`Selected category: ${category.name}, ID: ${category.categoryID}`);
                        
                        // Update dropdown button
                        dropdownButton.textContent = category.name;
                        dropdownButton.setAttribute('data-selected-id', category.categoryID);
                        
                        // Hide dropdown
                        dropdownContent.style.display = 'none';
                    };
                    
                    // Add to dropdown content
                    dropdownContent.appendChild(item);
                });
                
                // Set initial category if product exists
                if (this.currentProduct && this.currentProduct.category_ID) {
                    const selectedCategory = categories.find(cat => cat.categoryID === this.currentProduct.category_ID);
                    if (selectedCategory) {
                        dropdownButton.textContent = selectedCategory.name;
                        dropdownButton.setAttribute('data-selected-id', selectedCategory.categoryID);
                    }
                }
            } else {
                console.warn('No categories returned from API');
                // Add a default "None" option
                const noneItem = document.createElement('div');
                noneItem.setAttribute('data-value', 'None');
                noneItem.textContent = 'None';
                
                // Add direct onclick handler to None option
                noneItem.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdownButton.textContent = 'None';
                    dropdownButton.removeAttribute('data-selected-id');
                    dropdownContent.style.display = 'none';
                };
                
                dropdownContent.appendChild(noneItem);
            }
            
            // Make sure the dropdown button has a direct onclick handler
            dropdownButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle dropdown visibility
                dropdownContent.style.display = 
                    dropdownContent.style.display === 'none' ? 'block' : 'none';
            };
        } catch (error) {
            console.error('Error loading categories:', error);
            createToast('Failed to load categories', 'error');
        } finally {
            hideLoading();
        }
    }

    async handleEditProduct() {
        console.log('handleEditProduct method called');
        
        const nameInput = document.querySelector('input[name="productName"]');
        const descriptionInput = document.querySelector('textarea[name="description"]');
        const priceInput = document.querySelector('input[name="basePrice"]');
        const stockInput = document.querySelector('input[name="quantity"]');
        const skuInput = document.querySelector('input[name="sku"]');
        const barcodeInput = document.querySelector('input[name="barcode"]');
        const discountTypeSelect = document.querySelector('select[name="discountType"]');
        const discountValueInput = document.querySelector('input[name="discountValue"]');
        const taxClassSelect = document.querySelector('select[name="taxClass"]');
        const vatAmountInput = document.querySelector('input[name="vatAmount"]');
        
        const imageInputEmpty = document.getElementById('imageInputEmpty');
        const imageInputFilled = document.getElementById('imageInputFilled');
        const activeImageInput = imageInputFilled && imageInputFilled.files.length > 0 ? imageInputFilled : imageInputEmpty;
        
        const previewImages = document.querySelectorAll('.preview-img');
        
        const categoryDropdown = document.getElementById('dropdownButtonTop');
        const statusText = document.getElementById('status-text');
        const submitButton = document.querySelector('.product-title__buttons--add');

        console.log('Form fields:', {
            name: nameInput?.value,
            description: descriptionInput?.value,
            price: priceInput?.value,
            stock: stockInput?.value,
            category: categoryDropdown?.textContent,
            imageFiles: activeImageInput?.files?.length || 0,
            discountType: discountTypeSelect?.value,
            discountValue: discountValueInput?.value,
            taxClass: taxClassSelect?.value,
            vatAmount: vatAmountInput?.value
        });

        if (!nameInput || !descriptionInput || !priceInput || !stockInput || !categoryDropdown) {
            console.error('One or more form elements not found', {
                nameInput: !!nameInput,
                descriptionInput: !!descriptionInput,
                priceInput: !!priceInput,
                stockInput: !!stockInput,
                categoryDropdown: !!categoryDropdown
            });
            createToast('Form elements not found', 'error');
            return;
        }

        const formData = {
            name: nameInput.value.trim(),
            description: descriptionInput.value.trim(),
            price: parseFloat(priceInput.value),
            stock: parseInt(stockInput.value),
            categoryId: categoryDropdown.getAttribute('data-selected-id'),
            category: categoryDropdown.textContent,
            sku: skuInput ? skuInput.value.trim() : this.currentProduct.sku,
            barcode: barcodeInput?.value.trim() || this.currentProduct.barcode || '',
            status: statusText?.textContent || this.currentProduct.status || 'Draft',
            imageUrl: activeImageInput?.files[0] || null,
            previewImages: previewImages,
            discountType: discountTypeSelect?.value || this.currentProduct.discountType || 'no-discount',
            discountValue: discountValueInput?.value.trim() || this.currentProduct.discountValue || '0',
            taxClass: taxClassSelect?.value || this.currentProduct.taxClass || 'tax-free',
            vatAmount: vatAmountInput?.value.trim() || this.currentProduct.vatAmount || '0',
            mode: 'edit'
        };

        console.log('Form data collected successfully', formData);

        const validation = this.controller.validateProductData(formData);
        if (!validation.isValid) {
            createToast(Object.values(validation.errors)[0], 'error');
            return;
        }

        const hasNameChanged = formData.name !== this.currentProduct.name;
        const hasDescriptionChanged = formData.description !== this.currentProduct.description;
        const hasPriceChanged = formData.price !== this.currentProduct.price;
        const hasStockChanged = formData.stock !== this.currentProduct.stock;
        const hasCategoryChanged = formData.categoryId !== this.currentProduct.category_ID;
        const hasDiscountTypeChanged = formData.discountType !== this.currentProduct.discountType;
        const hasDiscountValueChanged = formData.discountValue !== this.currentProduct.discountValue;
        const hasTaxClassChanged = formData.taxClass !== this.currentProduct.taxClass;
        const hasVatAmountChanged = formData.vatAmount !== this.currentProduct.vatAmount;
        const hasImageChanged = activeImageInput?.files?.length > 0;
        const hasStatusChanged = formData.status !== this.currentProduct.status;

        if (!hasNameChanged && !hasDescriptionChanged && !hasPriceChanged && 
            !hasStockChanged && !hasCategoryChanged && !hasImageChanged && !hasStatusChanged &&
            !hasDiscountTypeChanged && !hasDiscountValueChanged && !hasTaxClassChanged && !hasVatAmountChanged) {
            window.location.href = "/";
            return;
        }

        try {
            showLoading();
            this.controller.setButtonLoading(submitButton, true, 'Save Product');

            let imageUrl = this.currentProduct.ImageSrc?.firstImg;
            
            if (activeImageInput?.files?.length > 0) {
                console.log('Uploading new image');
                imageUrl = await this.controller.handleImageUpload(activeImageInput.files[0]);
            } else {
                const validPreviewImage = Array.from(previewImages).find(img => 
                    img.src && img.src.includes('cloudinary') && img.style.display !== 'none'
                );
                
                if (validPreviewImage) {
                    console.log('Using existing preview image');
                    imageUrl = validPreviewImage.src;
                }
            }

            console.log('Image URL:', imageUrl);
            
            const productData = {
                id: this.productId,
                name: formData.name,
                sku: formData.sku || this.currentProduct.sku || "",
                category: formData.category,
                category_ID: formData.categoryId,
                price: formData.price,
                status: formData.status,
                added: this.currentProduct.added || new Date().toISOString(),
                description: formData.description,
                ImageSrc: {
                    firstImg: imageUrl,
                    secondImg: this.currentProduct.ImageSrc?.secondImg || null,
                    thirdImg: this.currentProduct.ImageSrc?.thirdImg || null
                },
                stock: formData.stock,
                quantity: formData.stock,
                barcode: formData.barcode,
                discount_type: formData.discountType,
                discount_value: formData.discountValue,
                tax_class: formData.taxClass,
                vat_amount: formData.vatAmount
            };

            console.log('Product data to update:', productData);
            await this.controller.updateProduct(this.productId, productData);
            createToast('Product updated successfully!', 'success');
            
            console.log("Redirecting to product list page in 1 second");
            
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
            
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

            this.currentProduct.div = this.currentProduct.status?.toLowerCase().replace(/\s+/g, '-') || 'draft';
            
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
                        <button class="product-title__buttons--add" id="saveProductBtn" style="cursor: pointer;">
                            <figure class="button__icon"><img src="${save}" alt="icon" /></figure>
                            <span class="button__text">Save product</span>
                        </button>
                    </div>
                </div>
                ${productForm({ mode: 'edit', productData: this.currentProduct })}
            </div>`;

            document.querySelector(".content").innerHTML = content;

            setTimeout(async () => {
                this.setupEventListeners();
                await this.loadCategories();
                this.setupProductImageHandling();
            }, 100);
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

    setupProductImageHandling() {
        console.log('Setting up image handling for editProduct');
            
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

        console.log('Image elements found:', {
            emptyState: !!imageElements.emptyState,
            filledState: !!imageElements.filledState,
            imageInputEmpty: !!imageElements.imageInputEmpty,
            imageInputFilled: !!imageElements.imageInputFilled,
            uploadButtons: imageElements.uploadButtons?.length || 0,
            previewImages: imageElements.previewImages?.length || 0,
            frames: imageElements.frames?.length || 0,
            deleteButtons: imageElements.deleteButtons?.length || 0
        });

        this.controller.setupImageHandling(imageElements);
        
        const uploadButtons = document.querySelectorAll('.media__upload-btn');
        if (uploadButtons && uploadButtons.length > 0) {
            if (uploadButtons[0] && imageElements.imageInputEmpty) {
                console.log('Setting up direct handler for empty state Add Image button');
                uploadButtons[0].onclick = (e) => {
                    e.preventDefault();
                    console.log('Empty state Add Image button clicked directly');
                    imageElements.imageInputEmpty.click();
                    return false;
                };
            }
            
            if (uploadButtons.length > 1 && uploadButtons[1] && imageElements.imageInputFilled) {
                console.log('Setting up direct handler for filled state Add Image button');
                uploadButtons[1].onclick = (e) => {
                    e.preventDefault();
                    console.log('Filled state Add Image button clicked directly');
                    imageElements.imageInputFilled.click();
                    return false;
                };
            }
        }
        
        const saveButton = document.getElementById('saveProductBtn');
        if (saveButton) {
            saveButton.onclick = (e) => {
                e.preventDefault();
                console.log('Save button clicked directly');
                this.handleEditProduct();
                return false;
            };
        }
        
        this.setupStatusDropdownItems();
    }
    
    setupStatusDropdownItems() {
        const dropdownContent = document.getElementById('dropdownContent');
        const dropdownButton = document.getElementById('dropdownButton');
        const statusText = document.getElementById('status-text');
        
        if (!dropdownContent || !dropdownButton || !statusText) {
            console.error('Status dropdown elements not found:', {
                content: !!dropdownContent,
                button: !!dropdownButton,
                statusText: !!statusText
            });
            return;
        }
        
        console.log('Setting up status dropdown items');
        
        // Get all status items
        const statusItems = dropdownContent.querySelectorAll('div');
        statusItems.forEach((item, index) => {
            // Clone the item to remove any existing event handlers
            const newItem = item.cloneNode(true);
            if (item.parentNode) {
                item.parentNode.replaceChild(newItem, item);
            }
            
            // Use direct onclick handler
            newItem.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const value = newItem.getAttribute('data-value') || newItem.textContent;
                console.log(`Selected status: ${value}`);
                
                // Update dropdown button
                dropdownButton.textContent = value;
                
                // Update status text and class
                statusText.textContent = value;
                const statusClass = value.toLowerCase().replace(/\s+/g, '-');
                statusText.className = `form-section__title-status--label-text ${statusClass}`;
                
                // Hide dropdown
                dropdownContent.style.display = 'none';
            };
        });
        
        // Make sure dropdown button has direct onclick
        dropdownButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
        };
    }
}

export default editProduct;
