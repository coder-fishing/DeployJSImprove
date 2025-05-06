import { caretRight, download, add, caretLeft, checkbox, minus, caretDown, trash } from "./../../assets/icon";
import searchBar from "./../components/searchBar";
import ProductRow from "./../components/productRow";  
import axios from "axios";
import { setupPaginationEvents } from "../../utils/setupPaginationEvents.js";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { createToast } from "../../utils/toast.js";
import { showConfirmDialog } from '../components/confirmDialog.js';
import { API_URL } from '../../config/apiurl.config.js';
import { navigate } from "../../utils/navigation";


class ProductListView {

    constructor(products = []) {
      this.products = [];
      this.currentPage = 1;
      this.itemsPerPage = 6;
      this.maxPage = 1; 
      this.currentFilter = 'all';
      this.searchQuery = '';
      this.searchTimeout = null; // For debouncing
      this.API_URL = API_URL;
      this.selectedProducts = new Set();
      this.eventListenersInitialized = false;
  
      this.init();
    }

  async fetchProducts() {
    try {
      showLoading();
      const response = await axios.get(`${this.API_URL}/product`);
      this.products = response.data;
      this.maxPage = Math.ceil(this.products.length / this.itemsPerPage); 
      this.render();
    } catch (error) {
      console.error("Error fetching products:", error);
      createToast('Failed to load products', 'error');
    } finally {
      hideLoading();
    }
  }

  async init() {
    await this.fetchProducts();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Prevent multiple event listener registration
    if (this.eventListenersInitialized) return;
    this.eventListenersInitialized = true;

    // Global click handler
    document.addEventListener('click', (e) => {
      // Add button click handler
      const addButton = e.target.closest('.product-title__buttons--add');
      if (addButton) {
        navigate('/addproduct');
      }

      // Edit button handler
      const editButton = e.target.closest('.product-table__edit');
      if (editButton) {
        const productId = editButton.getAttribute('data-id');
        if (productId) {
          navigate(`/editproduct/${productId}`);
        }
      }

      // Delete button handler
      const deleteButton = e.target.closest('.product-table__delete');
      if (deleteButton) {
        const productId = deleteButton.getAttribute('data-id');
        
        if (this.selectedProducts.size > 0) {
          this.handleBulkDelete();
        } else if (productId) {
          showConfirmDialog({
            title: 'Delete Product',
            message: 'Are you sure you want to delete this product?',
            onConfirm: async () => {
              try {
                showLoading();
                await axios.delete(`${this.API_URL}/product/${productId}`);
                
                // Update data first
                this.products = this.products.filter(p => p.id !== productId);
                
                // Then update UI in a controlled manner
                requestAnimationFrame(() => {
                  this.renderTableOnly();
                  createToast('Product deleted successfully', 'success');
                });
              } catch (error) {
                console.error('Error deleting product:', error);
                createToast('Failed to delete product', 'error');
              } finally {
                hideLoading();
              }
            }
          });
        }
      }
    });

    // Setup search with debouncing
    const searchInput = document.querySelector('.search-bar_input');
    if (searchInput) {
      searchInput.addEventListener('input', this.debounceSearch.bind(this));
    }
  }

  debounceSearch(e) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.searchQuery = e.target.value;
      this.currentPage = 1;
      this.renderTableOnly();
    }, 300);
  }

  setupNavigationEvents() {
    document.addEventListener('click', (e) => {
        const prevBtn = e.target.closest('#prevbtn');
        const nextBtn = e.target.closest('#nextbtn');

        if (prevBtn) {
            if (this.currentPage > 1) {
                this.currentPage -= 1;
                this.renderTableOnly();
            }
        }

        if (nextBtn) {
            if (this.currentPage < this.maxPage) {
                this.currentPage += 1;
                this.renderTableOnly();
            }
        }
    });
  }

  setupBulkActions() {
    document.addEventListener('click', (e) => {
      const headerCheckbox = e.target.closest('.product-table-header__imageleft--first');
      if (headerCheckbox) {
        const allCheckboxes = document.querySelectorAll('.product-table__name__checkbox--check');
        const allRows = document.querySelectorAll('.product-table__row');
        
        const isHeaderChecked = headerCheckbox.classList.contains('checked');
        headerCheckbox.classList.toggle('checked');
        
        allCheckboxes.forEach((checkbox, index) => {
          if (!isHeaderChecked) {
            checkbox.classList.add('checkactive');
            allRows[index].classList.add('rowactive');
            const productId = allRows[index].getAttribute('data-id');
            if (productId) this.selectedProducts.add(productId);
          } else {
            checkbox.classList.remove('checkactive');
            allRows[index].classList.remove('rowactive');
            const productId = allRows[index].getAttribute('data-id');
            if (productId) this.selectedProducts.delete(productId);
          }
        });
      }
    });
  }

  async handleBulkDelete() {
    if (this.selectedProducts.size === 0) return;

    showConfirmDialog({
      title: 'Delete Products',
      message: `Are you sure you want to delete ${this.selectedProducts.size} selected products?`,
      onConfirm: async () => {
        try {
          showLoading();
          const deletePromises = Array.from(this.selectedProducts).map(id => 
            axios.delete(`${this.API_URL}/product/${id}`)
          );
          
          await Promise.all(deletePromises);
          
          // Update data first
          this.products = this.products.filter(p => !this.selectedProducts.has(p.id));
          this.selectedProducts.clear();
          
          // Then update UI in a controlled manner
          requestAnimationFrame(() => {
            this.renderTableOnly();
            createToast('Selected products deleted successfully', 'success');
          });
        } catch (error) {
          console.error('Error deleting products:', error);
          createToast('Failed to delete some products', 'error');
        } finally {
          hideLoading();
        }
      }
    });
  }

  getPaginatedProducts() {
    const filteredProducts = this.filterProducts(this.products);
    
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return filteredProducts.slice(start, end);
  }

  filterProducts(products) {
    let filteredProducts = products;
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filteredProducts = products.filter(product => {
        const nameMatch = product.name && typeof product.name === 'string' && 
                         product.name.toLowerCase().includes(query);       
        const skuMatch = product.sku && typeof product.sku === 'string' && 
                        product.sku.toLowerCase().includes(query);       
        const categoryMatch = product.category && typeof product.category === 'string' && 
                             product.category.toLowerCase().includes(query);        
        return nameMatch || skuMatch || categoryMatch;
      });
    }
    
    switch (this.currentFilter) {
      case 'all':
        return filteredProducts;
      case 'published':
        return filteredProducts.filter(product => product.status === 'Published');
      case 'low-stock':
        return filteredProducts.filter(product => product.status === 'Out of Stock');
      case 'draft':
        return filteredProducts.filter(product => product.status === 'Draft');
      default:
        return filteredProducts;
    }
  }

  renderPagination() {
    const pageNumbersContainer = document.getElementById("page-numbers");
    pageNumbersContainer.innerHTML = "";

    const filteredProducts = this.filterProducts(this.products);
    this.maxPage = Math.ceil(filteredProducts.length / this.itemsPerPage) || 1;

    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.maxPage, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      const button = document.createElement("button");
      button.classList.add("page-btn");
      if (i === this.currentPage) button.classList.add("active");
      button.textContent = i;
      button.addEventListener("click", () => {
        this.currentPage = i;
        this.render();
      });
      pageNumbersContainer.appendChild(button);
    }

    if (endPage < this.maxPage) {
      const dots = document.createElement("div");
      dots.textContent = "...";
      dots.classList.add("dots");
      pageNumbersContainer.appendChild(dots);
    }
  }

  clickTable = () => {
    const checkboxes = document.querySelectorAll('.product-table__name__checkbox--check');
    const rows = document.querySelectorAll(".product-table__row");

    checkboxes.forEach((checkbox, index) => {
      checkbox.addEventListener('click', () => {
        checkbox.classList.toggle('checkactive');
        rows[index].classList.toggle('rowactive');
        
        const productId = rows[index].getAttribute('data-id');
        if (productId) {
          if (checkbox.classList.contains('checkactive')) {
            this.selectedProducts.add(productId);
          } else {
            this.selectedProducts.delete(productId);
          }
        }
      });
    });
  } 

  clickTagItem = () => {
    const tags = document.querySelectorAll('.tag-add-searchbar__tag--item');
    tags.forEach(tag => {
      tag.addEventListener('click', () => {
        tags.forEach(t => t.classList.remove('item-active'));
        tag.classList.toggle('item-active');
        
        const tagText = tag.querySelector('.tag-add-searchbar__tag--item-element').textContent;
        
        if (tagText === 'All Products') {
          this.currentFilter = 'all';
        } else if (tagText === 'Published') {
          this.currentFilter = 'published';
        } else if (tagText === 'Low Stock') {
          this.currentFilter = 'low-stock';
        } else if (tagText === 'Draft') {
          this.currentFilter = 'draft';
        }
        
        this.currentPage = 1;
        
        this.renderTableOnly();
      });
    });
  };
  
  render() {
    const filteredProducts = this.filterProducts(this.products);
    this.maxPage = Math.ceil(filteredProducts.length / this.itemsPerPage) || 1;
    const paginatedProducts = this.getPaginatedProducts();

    // Cache DOM queries
    const content = document.querySelector("#content");
    if (!content) return;

    content.innerHTML = this.getTemplate(paginatedProducts, filteredProducts);
    
    // Batch DOM operations
    requestAnimationFrame(() => {
      this.renderPagination();
      setupPaginationEvents();
      this.clickTable();
      this.clickTagItem();
    });
  }

  getTemplate(paginatedProducts, filteredProducts) {
    return `
      <div class="product-list">
        <div class="product-title">
          <div class="product-title-left">
            <p class="product-title-left__name">Product</p>
            <div class="product-title-left__breadcrumb">
              <p class="product-title-left__breadcrumb--active">Dashboard</p>
              <figure>
                <img src="${caretRight}" alt="arrow right" class="product-title__icon" />
              </figure>
              <p class="product-title-left__breadcrumb--normal">Product List</p>
            </div>
          </div>
          <div class="product-title__buttons">
            <button class="product-title__buttons--download">
              <img src="${download}" alt="icon" class="button__icon" />
              <span class="button__text">Export</span>
            </button>
            <button class="product-title__buttons--add">
              <img src="${add}" alt="icon" class="button__icon" />
              <span class="button__text">Add product</span>
            </button>
          </div>
        </div>
 
        <div class="tag-add-searchbar"> 
          <div class="tag-add-searchbar__tag">
            <div class="tag-add-searchbar__tag--item">
              <span class="tag-add-searchbar__tag--item-element">All Products</span>
            </div>
            <div class="tag-add-searchbar__tag--item">
              <span class="tag-add-searchbar__tag--item-element">Published</span>
            </div> 
            <div class="tag-add-searchbar__tag--item">
              <span class="tag-add-searchbar__tag--item-element">Low Stock</span>
            </div>
            <div class="tag-add-searchbar__tag--item">
              <span class="tag-add-searchbar__tag--item-element">Draft</span>
            </div>
          </div>
          <div class="tag-add-searchbar__search">
            ${searchBar("Search product. . .")}
          </div>
        </div>

        <table class="product-table">
          <thead>
          <tr>
            <th class="product-table-header">
              <div class="product-table-header__wrapper three">
              <div class="product-table-header__image">
                  <div class="product-table-header__imageleft">
                      <img class="product-table-header__imageleft--first" src="${checkbox}" alt="checkbox"/>
                      <img class="product-table-header__imageleft--second" src="${minus}" alt="tick/">
                  </div>
                  <p class="product-table-header__name translate">Product</p>  
              </div> 
              <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                    </div>
                </th> 
        
                <th class="product-table-header">
                    <div class="product-table-header__wrapper"><p class="product-table-header__name">SKU</p></div>
                </th>
        
                <th class="product-table-header">   
                    <div class="product-table-header__wrapper"><p class="product-table-header__name">Category</p></div>
                </th> 
              
                <th class="product-table-header">
                   <div class="product-table-header__wrapper two">
              <div class="product-table-header__name">Stock</div>
              <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                   </div>
                </th>
         
                <th  class="product-table-header">
                    <div class="product-table-header__wrapper two">
              <div class="product-table-header__name">Price</div>
              <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                    </div>
                </th> 
        
                <th class="product-table-header">
                    <div class="product-table-header__wrapper two">
              <p class="product-table-header__name">Status</p>
              <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                    </div>
                </th>
        
                <th class="product-table-header">
                    <div class="product-table-header__wrapper two">
              <p class="product-table-header__name">Added</p>
              <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                    </div>
                </th>
        
                <th class="product-table-header">
                   <div class="product-table-header__wrapper"> <p class="product-table-header__name">Action</p></div>
                </th>
            </tr>
          </thead>
          <tbody>
            ${paginatedProducts.map(product => ProductRow({ product })).join('')}
          </tbody>
        </table>

        <div class="pagination">
          <div class="pagination__showing">
            Showing ${(this.currentPage - 1) * this.itemsPerPage + 1}-${Math.min(this.currentPage * this.itemsPerPage, filteredProducts.length)} from ${filteredProducts.length}
          </div>
          <div class="pagination__button">
            <div class="pagination__button-caret-left" id="prevbtn">
              <figure class="image"><img src="${caretLeft}" alt="caret left" /></figure>
            </div>
            <div class="pagination__button-page-number" id="page-numbers"></div>
            <div class="pagination__button-caret-right" id="nextbtn">
              <figure class="image"><img src="${caretLeft}" alt="caret right" /></figure>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderTableOnly() {
    const filteredProducts = this.filterProducts(this.products);
    this.maxPage = Math.ceil(filteredProducts.length / this.itemsPerPage) || 1;
    
    if (this.currentPage > this.maxPage) {
      this.currentPage = this.maxPage;
    }
    
    const paginatedProducts = this.getPaginatedProducts();
    const tableBody = document.querySelector('.product-table tbody');
    
    if (tableBody) {
      // Create temporary container and build new content
      const tempContainer = document.createElement('tbody');
      tempContainer.innerHTML = paginatedProducts.map(product => ProductRow({ product })).join('');
      
      // Update DOM in a single operation
      requestAnimationFrame(() => {
        // Replace old tbody with new one
        tableBody.parentNode.replaceChild(tempContainer, tableBody);
        
        // Update pagination and reinitialize click handlers
        this.renderPagination();
        this.clickTable();
        
        // Update showing count
        const showingElement = document.querySelector('.pagination__showing');
        if (showingElement) {
          const totalItems = filteredProducts.length;
          const start = (this.currentPage - 1) * this.itemsPerPage + 1;
          const end = Math.min(this.currentPage * this.itemsPerPage, totalItems);
          showingElement.textContent = `Showing ${start}-${end} from ${totalItems}`;
        }
      });
    }
  }
}

  
export default ProductListView;
