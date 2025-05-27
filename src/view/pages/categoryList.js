import { caretRight, download, add, caretLeft, checkbox, minus, caretDown } from "./../../assets/icon";
import CategoryRow from "./../components/categoryRow";  
import searchBar from "./../components/searchBar";
import axios from "axios";
import { setupPaginationEvents } from "../../utils/setupPaginationEvents.js";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { createToast } from "../../utils/toast.js";
import { showConfirmDialog } from '../components/confirmDialog.js';
import { API_URL } from '../../config/apiurl.config.js';
import { navigate } from "../../utils/navigation";
import BaseView from "../BaseView";
import { setupSearchSync } from "../../utils/searchSync.js";

class CategoryListView extends BaseView {
    constructor() {
        super();
        this.categories = [];
        this.itemsPerPage = 6;
        this.currentPage = 1;
        this.searchQuery = '';
        this.searchTimeout = null;
        this.API_URL = API_URL;
        this.selectedCategories = new Set();
        this.currentFilter = 'all';
        
        this.init();
    }

    async init() {
        await this.fetchCategories();
        this.setupEventListeners();
        this.setupNavigationEvents();
    }

    async fetchCategories() {
        try {
            showLoading();
            const response = await axios.get(`${this.API_URL}/cate`);
            this.categories = response.data;
            this.maxPage = Math.ceil(this.categories.length / this.itemsPerPage);
            this.render();
        } catch (error) {
            console.error('Error fetching categories:', error);
            createToast('Failed to load categories', 'error');
        } finally {
            hideLoading();
        }
    }

    handleGlobalClick = async (e) => {
        // Only handle clicks if we're on the category list page
        if (!document.querySelector('.product-list')) return;

        // Add button handler
        const addButton = e.target.closest('.product-title__buttons--add');
        if (addButton && addButton.closest('.product-list')) {
            console.log('Add Category button clicked, navigating to /addcategory');
            window.location.href = '/addcategory';  // Use direct location change instead of navigate
            return;
        }

        // Edit button handler
        const editButton = e.target.closest('.product-table__edit');
        if (editButton) {
            const categoryId = editButton.getAttribute('data-id');
            if (categoryId) {
                window.location.href = `/editcategory/${categoryId}`;  // Use direct location change instead of navigate
            }
            return;
        }

        // Delete button handler
        const deleteButton = e.target.closest('.product-table__delete');
        if (deleteButton) {
            const categoryId = deleteButton.getAttribute('data-id');
            
            if (this.selectedCategories.size > 0) {
                this.handleBulkDelete();
            } else if (categoryId) {
                showConfirmDialog({
                    title: 'Delete Category',
                    message: 'Are you sure you want to delete this category?',
                    onConfirm: async () => {
                        try {
                            showLoading();
                            await axios.delete(`${this.API_URL}/cate/${categoryId}`);
                            
                            // Update data first
                            this.categories = this.categories.filter(c => c.categoryID !== categoryId);
                            
                            // Then update UI in a controlled manner
                            requestAnimationFrame(() => {
                                this.renderTableOnly();
                                createToast('Category deleted successfully', 'success');
                            });
                        } catch (error) {
                            console.error('Error deleting category:', error);
                            createToast('Failed to delete category', 'error');
                        } finally {
                            hideLoading();
                        }
                    }
                });
            }
            return;
        }
    }

    setupEventListeners() {
        this.addGlobalEventListener('click', this.handleGlobalClick);
        this.setupNavigationEvents();
        this.setupBulkActions();
        this.setupSearchListener();
    }

    setupNavigationEvents() {
        this.addGlobalEventListener('click', (e) => {
            const prevBtn = e.target.closest('#prevbtn');
            const nextBtn = e.target.closest('#nextbtn');
    
            if (prevBtn) {
                if (!prevBtn.classList.contains('disabled')) {
                    if (this.currentPage > 1) {
                        prevBtn.classList.add('clicked');
                        this.currentPage--;
                        this.renderTableOnly();
                        setTimeout(() => prevBtn.classList.remove('clicked'), 200);
                    }
                }
            }
    
            if (nextBtn) {
                if (!nextBtn.classList.contains('disabled')) {
                    if (this.currentPage < this.maxPage) {
                        nextBtn.classList.add('clicked');
                        this.currentPage++;
                        this.renderTableOnly();
                        setTimeout(() => nextBtn.classList.remove('clicked'), 200);
                    }
                }
            }
        });
    }

    setupBulkActions() {
        this.addGlobalEventListener('click', (e) => {
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
                        const categoryId = allRows[index].getAttribute('data-id');
                        if (categoryId) this.selectedCategories.add(categoryId);
                    } else {
                        checkbox.classList.remove('checkactive');
                        allRows[index].classList.remove('rowactive');
                        const categoryId = allRows[index].getAttribute('data-id');
                        if (categoryId) this.selectedCategories.delete(categoryId);
                    }
                });
            }
        });
    }

    setupSearchListener() {
        const searchInput = document.querySelector('.product-list .search-bar_input');
        if (searchInput) {
            setupSearchSync(searchInput, (query) => {
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }
                
                this.searchTimeout = setTimeout(() => {
                    this.searchQuery = query;
                    this.currentPage = 1;
                    this.renderTableOnly();
                }, 300);
            });

            // Listen for header search updates
            window.addEventListener('header-search-update', (event) => {
                const query = event.detail.query;
                if (searchInput.value !== query) {
                    searchInput.value = query;
                    this.searchQuery = query;
                    this.currentPage = 1;
                    this.renderTableOnly();
                }
            });
        }
    }

    filterCategories(categories) {
        let filteredCategories = categories;
        
        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filteredCategories = categories.filter(category => {
                const nameMatch = category.name && 
                                category.name.toLowerCase().includes(query);
                const descriptionMatch = category.description && 
                                       category.description.toLowerCase().includes(query);
                return nameMatch || descriptionMatch;
            });
        }
        
        // Apply status filter
        switch (this.currentFilter) {
            case 'published':
                return filteredCategories.filter(category => category.status === 'Published');
            case 'draft':
                return filteredCategories.filter(category => category.status === 'Draft');
            case 'all':
            default:
                return filteredCategories;
        }
    }

    async handleBulkDelete() {
        if (this.selectedCategories.size === 0) return;

        showConfirmDialog({
            title: 'Delete Categories',
            message: `Are you sure you want to delete ${this.selectedCategories.size} selected categories?`,
            onConfirm: async () => {
            try {
                showLoading();
                const deletePromises = Array.from(this.selectedCategories).map(id => 
                    axios.delete(`${this.API_URL}/cate/${id}`)
                );
                    
                await Promise.all(deletePromises);
                    
                    // Update data first
                this.categories = this.categories.filter(c => !this.selectedCategories.has(c.categoryID));
                this.selectedCategories.clear();
                    
                    // Then update UI in a controlled manner
                    requestAnimationFrame(() => {
                this.renderTableOnly();
                createToast('Selected categories deleted successfully', 'success');
                    });
            } catch (error) {
                console.error('Error deleting categories:', error);
                createToast('Failed to delete some categories', 'error');
            } finally {
                hideLoading();
                }
            }
        });
    }

    getPaginatedCategories() {
        const filteredCategories = this.filterCategories(this.categories);
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return filteredCategories.slice(start, end);
    }

    renderPagination() {
        const pageNumbersContainer = document.getElementById("page-numbers");
        if (!pageNumbersContainer) return;
        
        pageNumbersContainer.innerHTML = "";

        const filteredCategories = this.filterCategories(this.categories);
        this.maxPage = Math.ceil(filteredCategories.length / this.itemsPerPage) || 1;

        // Update prev/next button states
        const prevBtn = document.querySelector('#prevbtn');
        const nextBtn = document.querySelector('#nextbtn');
        
        if (prevBtn) {
            if (this.currentPage <= 1) {
                prevBtn.classList.add('disabled');
            } else {
                prevBtn.classList.remove('disabled');
            }
        }
        
        if (nextBtn) {
            if (this.currentPage >= this.maxPage) {
                nextBtn.classList.add('disabled');
            } else {
                nextBtn.classList.remove('disabled');
            }
        }

        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(this.maxPage, startPage + 4);

        // Adjust start page if we're near the end
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement("button");
            button.classList.add("page-btn");
            if (i === this.currentPage) {
                button.classList.add("active");
            }
            button.textContent = i;
            button.addEventListener("click", () => {
                if (i !== this.currentPage) {
                    this.currentPage = i;
                    this.render();
                }
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
                
                const categoryId = rows[index].getAttribute('data-id');
                if (categoryId) {
                    if (checkbox.classList.contains('checkactive')) {
                        this.selectedCategories.add(categoryId);
                    } else {
                        this.selectedCategories.delete(categoryId);
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
                
                if (tagText === 'All Categories') {
                    this.currentFilter = 'all';
                } else if (tagText === 'Published') {
                    this.currentFilter = 'published';
                } else if (tagText === 'Draft') {
                    this.currentFilter = 'draft';
                }
                
                this.currentPage = 1;
                this.renderTableOnly();
            });
        });
    }

    renderTableOnly() {
        const paginatedCategories = this.getPaginatedCategories();
        const tableBody = document.querySelector('.product-table tbody');
        
        if (tableBody) {
            // Create temporary container and build new content
            const tempContainer = document.createElement('tbody');
            tempContainer.innerHTML = paginatedCategories.map(category => CategoryRow({ category })).join('');
            
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
                    const totalItems = this.categories.length;
                    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
                    const end = Math.min(this.currentPage * this.itemsPerPage, totalItems);
                    showingElement.textContent = `Showing ${start}-${end} from ${totalItems}`;
                }
            });
        }
      }

    render() {
        const paginatedCategories = this.getPaginatedCategories();

        // Cache DOM queries
        const content = document.querySelector("#content");
        if (!content) return;

        content.innerHTML = this.getTemplate(paginatedCategories);
        
        // Batch DOM operations
        requestAnimationFrame(() => {
            this.renderPagination();
            setupPaginationEvents();
            this.clickTable();
            this.clickTagItem();
        });
    }

    getTemplate(paginatedCategories) {
        return `
            <div class="product-list">
                <div class="product-title">
                    <div class="product-title-left">
                        <p class="product-title-left__name">Categories</p>
                        <div class="product-title-left__breadcrumb">
                            <p class="product-title-left__breadcrumb--active">Dashboard</p>
                            <figure>
                                <img src="${caretRight}" alt="arrow right" class="product-title__icon" />
                            </figure>
                            <p class="product-title-left__breadcrumb--normal">Category List</p>
                        </div>
                    </div>

                    <div class="product-title__buttons">
                        <button class="product-title__buttons--download">
                            <img src="${download}" alt="icon" class="button__icon" />
                            <span class="button__text">Export</span>
                        </button>
                        <button class="product-title__buttons--add">
                            <img src="${add}" alt="icon" class="button__icon" />
                            <span class="button__text">Add Category</span>
                        </button>
                    </div>
                </div>

                <div class="tag-add-searchbar">
                    <div class="tag-add-searchbar__tag">
                       
                    </div>
                    <div class="tag-add-searchbar__search">
                        ${searchBar("Search...")}
                    </div>
                </div>

                <table class="product-table">
                    <thead>
                        <tr>
                            <th class="product-table-header">
                                <div class="product-table-header__wrapper three">
                                    <div class="product-table-header__image">
                                        <div class="product-table-header__imageleft">
                                            <img class="product-table-header__imageleft--first" src="${checkbox}" alt="checkbox" />
                                            <img class="product-table-header__imageleft--second" src="${minus}" alt="tick"/>
                                        </div>
                                        <p class="product-table-header__name translate">Category</p>  
                                    </div> 
                                    <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                                </div>
                            </th> 
                            <th class="product-table-header">
                                <div class="product-table-header__wrapper two">
                                    <p class="product-table-header__name">Sold</p>
                                    <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                                </div> 
                            </th>
                            <th class="product-table-header">   
                                <div class="product-table-header__wrapper two">
                                    <p class="product-table-header__name">Stock</p>
                                    <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                                </div>
                            </th> 
                            <th class="product-table-header">
                                <div class="product-table-header__wrapper two">
                                    <div class="product-table-header__name">Added</div>
                                    <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                                </div>
                            </th>
                            <th class="product-table-header">
                                <div class="product-table-header__wrapper">
                                    <p class="product-table-header__name">Action</p>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginatedCategories.map(category => CategoryRow({ category })).join('')}
                    </tbody>
                </table>

                <div class="pagination">
                    <div class="pagination__showing">
                        Showing ${(this.currentPage - 1) * this.itemsPerPage + 1}-${Math.min(this.currentPage * this.itemsPerPage, this.categories.length)} from ${this.categories.length}
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
}

export default CategoryListView;
