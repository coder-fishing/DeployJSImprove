import  ProductListView  from './view/pages/productList'
import CategoryListView from './view/pages/categoryList'
import  CategoryController  from './controller/CategoryController'
import  ProductController  from './controller/ProductController'
import { Router } from './router'
import { editProduct } from './view/pages/editProduct'
import addProduct from './view/pages/addProduct.js'
import addCategories from './view/pages/addCategories.js'
import editCategory from './view/pages/editCategories.js'

const routes = [
    { path: '/product', controller: ProductController, view: ProductListView },
    { path: '/', controller: ProductController, view: ProductListView },
    { path: '/editproduct/:id', controller: ProductController, view: editProduct },
    { path: '/category', controller: CategoryController, view: CategoryListView },
    { path: '/addproduct', controller: ProductController, view: addProduct },
    { path: '/addcategory', controller: CategoryController, view: addCategories },
    { path: '/editcategory/:id', controller: CategoryController, view: editCategory }
]   

// Initialize the router with the defined routes
const router = new Router(routes);

// Export the router instance for global access
window.appRouter = router;

// Listen for direct URL changes
window.addEventListener('hashchange', () => {
    const path = window.location.hash.substring(1) || '/';
    router.loadRoute(path);
});

// Handle direct browser navigation
window.addEventListener('popstate', () => {
    router.loadRoute();
});