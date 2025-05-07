import Layout from "./../view/layout";
import { showLoading, hideLoading, forceHideLoading } from "../utils/loading";

export class Router {
    constructor(routes) {
        // Define routes with path and controller (view function)
        this.routes = routes;
        this.contentDiv = document.getElementById('content');
        this.currentView = null;
        this.loadInitialRoute();
        
        // Handle navigation
        window.addEventListener('popstate', () => this.loadRoute());
        window.addEventListener('navigation', (event) => this.loadRoute(event.detail.path));
        
        // Reset loading state when user navigates away
        window.addEventListener('beforeunload', () => {
            forceHideLoading();
        });
        
        // Set up a fallback method for direct URL navigation
        this.setupUrlChangeDetection();
    }
    
    setupUrlChangeDetection() {
        // Create a method that apps can call to navigate directly without history API
        window.directNavigate = (path) => {
            console.log('Direct navigation to:', path);
            // We'll use location.href directly for most reliable navigation
            window.location.href = path;
        };
    }

    loadInitialRoute() {
        this.loadRoute(location.pathname);
    }

    navigate(path) {
        console.log('Router navigate called with path:', path);
        // Reset loading state before navigation
        forceHideLoading();
        history.pushState({}, '', path);
        this.loadRoute(path);
    }

    getRouteParams(routePath, path) {
        // Convert route path to regex pattern
        const pattern = routePath.replace(/:\w+/g, '([^/]+)');
        const regex = new RegExp(`^${pattern}$`);
        const matches = path.match(regex);

        if (!matches) return null;

        // Extract parameter names from route path
        const paramNames = (routePath.match(/:\w+/g) || [])
            .map(param => param.substring(1));

        // Create params object
        const params = {};
        paramNames.forEach((name, index) => {
            params[name] = matches[index + 1];
        });

        return params;
    }

    async loadRoute(path = location.pathname) {
        try {
            console.log('Loading route for path:', path);
            // Reset any existing loading state
            forceHideLoading();
            showLoading();
            
            // Clean up current view if it exists
            if (this.currentView && typeof this.currentView.cleanup === 'function') {
                this.currentView.cleanup();
            }
            
            const route = this.routes.find((r) => {
                const routePath = r.path.replace(/:\w+/g, '([^/]+)');
                const regex = new RegExp(`^${routePath}$`);
                return regex.test(path);
            });

            console.log('Route found:', route ? route.path : 'not found');
            if (route) {
                // Only render layout if it's not already rendered
                if (!document.querySelector('.container')) {
                    document.querySelector("#app").innerHTML = Layout();
                }

                // Get the content container
                const content = document.querySelector("#content");
                if (content) {
                    // Get route params
                    const params = this.getRouteParams(route.path, path);
                    
                    console.log('Initializing controller and view for path:', path);
                    // Initialize controller first
                    const controller = new route.controller();
                    
                    // Initialize view with controller and params
                    const view = new route.view();
                    
                    // Set up bidirectional reference
                    controller.view = view;
                    view.controller = controller;
                    
                    // Set params if they exist
                    if (params) {
                        controller.params = params;
                        view.params = params;
                    }

                    // Store current view for cleanup
                    this.currentView = view;

                    // Render view content
                    await view.render();
                    console.log('View rendered for path:', path);
                }
            } else {
                document.querySelector("#app").innerHTML = "<h2>404 Not Found</h2>";
            }
        } catch (error) {
            console.error('Error loading route:', error);
            const content = document.querySelector("#content");
            if (content) {
                content.innerHTML = "<h2>Error loading page</h2>";
            }
        } finally {
            hideLoading();
        }
    }
}  