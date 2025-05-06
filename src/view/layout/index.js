import navigation, { setupNavigation } from './navigation';
import header from './../components/header';

const Layout = () => {
    const template = `
        <div class="container">
            ${navigation()}
            <div class="main-right"> 
                ${header()}
                <div class="content" id="content"></div>
            </div>
        </div>
    `;

    // Setup navigation after rendering
    setTimeout(() => {
        setupNavigation();
    }, 0);

    return template;
};

export default Layout;