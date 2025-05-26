import productForm from "../components/productForm.js";
import { caretRight, cross, save } from "./../../assets/icon";
import { dropdown } from '../../utils/dropdown.js';
import ProductController from "../../controller/ProductController.js";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { createToast } from "../../utils/toast.js";

export class addProduct {
    constructor() {
        this.controller = new ProductController();
        this.render();
    }

    setupEventListeners() {
        const saveBtn = document.getElementById('saveProductBtn');
        const cancelBtn = document.querySelector(".product-title__buttons--cancel");

        console.log('Save button found:', !!saveBtn);
        console.log('Cancel button found:', !!cancelBtn);

        if (saveBtn) {
            saveBtn.onclick = (e) => {
                e.preventDefault();
                console.log('Save button clicked');
                this.handleAddProduct();
                return false;
            };
        }

        if (cancelBtn) {
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
        console.log('Setting up dropdowns for addProduct page');
        
        // Initialize category dropdown and add click event handlers
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
        
        // Initialize status dropdown and add click event handlers
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
            
            // Then add new click handler
            newItem.addEventListener('click', () => {
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
            });
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
                return;
            }
            
            // Clear any existing hardcoded categories
            dropdownContent.innerHTML = '';
            
            // Add categories from the API
            if (categories && categories.length > 0) {
                console.log(`Adding ${categories.length} categories to dropdown`);
                
                // Add each category as a dropdown item
                categories.forEach(category => {
                    const item = document.createElement('div');
                    item.setAttribute('data-value', category.name);
                    item.setAttribute('data-id', category.categoryID);
                    item.textContent = category.name;
                    
                    // Add direct click handler
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
            } else {
                console.warn('No categories returned from API');
                // Add a default "None" option
                const noneItem = document.createElement('div');
                noneItem.setAttribute('data-value', 'None');
                noneItem.textContent = 'None';
                dropdownContent.appendChild(noneItem);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            createToast('Failed to load categories', 'error');
        } finally {
            hideLoading();
        }
    }

    async handleAddProduct() {
        console.log('handleAddProduct method called');
        
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
        
        // Get image inputs
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

        // Form validation
        if (!nameInput || !descriptionInput || !priceInput || !stockInput || !categoryDropdown || !skuInput) {
            console.error('One or more form elements not found');
            createToast('Form elements not found', 'error');
            return;
        }

        // Convert numeric values
        const discountValue = discountValueInput?.value.trim() ? parseFloat(discountValueInput.value) : 0;
        const vatAmount = vatAmountInput?.value.trim() ? parseFloat(vatAmountInput.value) : 0;

        const formData = {
            name: nameInput.value.trim(),
            description: descriptionInput.value.trim(),
            price: parseFloat(priceInput.value),
            stock: parseInt(stockInput.value),
            sku: skuInput.value.trim(),
            barcode: barcodeInput?.value.trim() || '',
            category: categoryDropdown.textContent,
            categoryId: categoryDropdown.getAttribute('data-selected-id'),
            status: statusText?.textContent || 'Draft',
            imageUrl: activeImageInput?.files[0] || null,
            previewImages: previewImages,
            discount_type: discountTypeSelect?.value || '',
            discount_value: discountValue,
            tax_class: taxClassSelect?.value || '',
            vat_amount: vatAmount,
            mode: 'create'
        };

        console.log('Form data collected successfully', formData);

        // Validate form data
        const validation = this.controller.validateProductData(formData);
        if (!validation.isValid) {
            createToast(Object.values(validation.errors)[0], 'error');
            return;
        }

        try {
            showLoading();
            this.controller.setButtonLoading(submitButton, true);

            let imageUrl = null;
            
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
                name: formData.name,
                sku: formData.sku,
                description: formData.description,
                price: formData.price,
                stock: formData.stock,
                quantity: formData.stock,
                category: formData.category,
                category_ID: formData.categoryId,
                status: formData.status,
                barcode: formData.barcode,
                added: new Date().toISOString(),
                discount_type: formData.discount_type,
                discount_value: formData.discount_value,
                tax_class: formData.tax_class,
                vat_amount: formData.vat_amount,
                ImageSrc: {
                    firstImg: imageUrl,
                    secondImg: null,
                    thirdImg: null
                }
            };

            console.log('Saving product data:', productData);
            await this.controller.saveProduct(productData);
            createToast('Product added successfully!', 'success');
            
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } catch (error) {
            console.error('Error:', error);
            createToast('Failed to add product', 'error');
        } finally {
            hideLoading();
            this.controller.setButtonLoading(submitButton, false);
        }
    }

    render = async () => {
        try {
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
                            <p class="product-title-left__breadcrumb--normal">Add Product</p>
                        </div>   
                    </div>
                    <div class="product-title__buttons">  
                        <button class="product-title__buttons--cancel">
                            <figure class="button__icon"><img src="${cross}" alt="icon"/></figure>
                            <span class="button__text">Cancel</span>
                        </button>
                        <button class="product-title__buttons--add" id="saveProductBtn" style="cursor: pointer;">
                            <figure class="button__icon"><img src="${save}" alt="icon" /></figure>
                            <span class="button__text">Add Product</span>
                        </button>
                    </div>
                </div>
                ${productForm({ mode: 'create' })}
            </div>`;

            document.querySelector(".content").innerHTML = content;

            // Setup event listeners and load categories
            setTimeout(async () => {
                // First setup event listeners
                this.setupEventListeners();
                // Then load categories
            await this.loadCategories();
                // Finally setup image handling
                this.setupProductImageHandling();
            }, 100);
        } catch (error) {
            console.error('Error rendering form:', error);
            createToast('Failed to load form', 'error');
        }
    }

    setupProductImageHandling() {
        console.log('Setting up image handling for addProduct');
            
        // Lấy tất cả các phần tử liên quan đến hình ảnh
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

        // Kiểm tra các phần tử có tồn tại không
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

        // Cấu hình tất cả các trình xử lý hình ảnh với controller
            this.controller.setupImageHandling(imageElements);
        
        // Gắn trực tiếp sự kiện onclick cho các nút Add Image
        const uploadButtons = document.querySelectorAll('.media__upload-btn');
        if (uploadButtons && uploadButtons.length > 0) {
            // Empty state button
            if (uploadButtons[0] && imageElements.imageInputEmpty) {
                console.log('Setting up direct handler for empty state Add Image button');
                uploadButtons[0].onclick = (e) => {
                    e.preventDefault();
                    console.log('Empty state Add Image button clicked directly');
                    imageElements.imageInputEmpty.click();
                    return false;
                };
            }
            
            // Filled state button
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
        
        // Ensure Save button works properly
        const saveButton = document.getElementById('saveProductBtn');
        if (saveButton) {
            saveButton.onclick = (e) => {
                e.preventDefault();
                console.log('Save button clicked directly');
                this.handleAddProduct();
                return false;
            };
        }
        
        // Setup status dropdown items
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
        statusItems.forEach(item => {
            // Add direct onclick handler
            item.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const value = item.getAttribute('data-value');
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
    }
}

export default addProduct;