import searchBar from "./searchBar";
import iconAndNotification from "./iconAndNotification";
import { setupSearchSync } from "../../utils/searchSync.js";
import { calendar, bell, notification, noAvt, noImg, envelop, divider, down } from "./../../assets/icon";
import avatarUser from "./avatarUser";

const header = () => {
    const template = ` 
    <div class="header">
        ${searchBar('Search')}
        ${iconAndNotification(calendar, 6)}   
        ${iconAndNotification(bell, 8)}
        ${iconAndNotification(envelop, 9)}
        ${iconAndNotification(noImg, 0)}
        <img src="${divider}" alt="divider" class="header-divider">
        ${avatarUser()}
    </div>     
    `;

    // Setup search sync after rendering
    setTimeout(() => {
        const headerSearchInput = document.querySelector('.header .search-bar_input');
        if (headerSearchInput) {
            setupSearchSync(headerSearchInput, (query) => {
                // Dispatch a custom event that other components can listen to
                window.dispatchEvent(new CustomEvent('header-search-update', { 
                    detail: { query } 
                }));
            });
        }
    }, 0);

    return template;
}

export default header; 