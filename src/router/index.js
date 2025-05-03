import  Layout  from "./../view/layout";

export class Router {
    constructor(routes) {
        // Define routes with path and controller (view function)
        this.routes = routes     
        this.contentDiv = document.getElementById('content');
        this.loadInitialRoute();
        window.addEventListener('popstate', () => this.loadRoute());
    }
 

    loadInitialRoute() {  
        this.loadRoute(location.pathname);
    } 

    navigate(path) {
        history.pushState({}, '', path);
        this.loadRoute(path); 
    }
    loadRoute(path = location.pathname) {
        const route = this.routes.find((r) => {
            const routePath = r.path.replace(/:\w+/g, '([^/]+)');
            const regex = new RegExp(`^${routePath}$`);
            return regex.test(path);
        });
        if (route) {
          document.querySelector("#app").innerHTML = Layout();
           new route.controller(new route.view());
        } else {
          document.getElementById("app").innerHTML = "<h2>404 Not Found</h2>";
        }
    }
}  