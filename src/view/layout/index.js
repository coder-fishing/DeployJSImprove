import navigation from './navigation';
import header from './../components/header';
const  Layout = () => {
    return ( `
        <div class="container">
            ${navigation()}
            <div class="main-right"> 
                ${header()}
                <div class="content" id="content"></div>
            </div>
        </div>
    ` );
    }
export default Layout;