import searchBar from "./searchBar";
import iconAndNotification from "./iconAndNotification";

import { calendar, bell, notification, noAvt, noImg, envelop, divider, down } from "./../../assets/icon";
import avatarUser from "./avatarUser";

const header = () => {
    return ` 
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
}

export default header; 