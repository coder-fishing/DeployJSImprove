import navigationItem from '../components/navigationItem';
import navigationItemDropdown from '../components/navigationItemDropDown';
import {subMenu, getTotalNotifications}  from '../components/submenu';

import {
    logo, dashboard, dashboardHover, shop, shopHover, down, downHover, check, checkHover,
    folder, folderHover, comment, commentHover, calendar, calendarHover,
    user, userHover
} from './../../assets/icon';

const menuItems = [
    { name: 'Product', notification: 3, link: '/product'},
    { name: 'Categories', notification: 5, link: '/category'},
    { name: 'Orders', notification: 0, link: '#'},  
    { name: 'Customer', notification: 2, link: '#'},
  ];

const subMenuItems = menuItems.map(item => subMenu(item.name, item.notification, item.link)).join('');
const totalNotifications = getTotalNotifications();

const navigation = () => {
    return `
        <div class="navigation">
            <div class="navigation__container--logo" data-link="/">
               <div class="navigation__container--logo--wrapper">
                   <img src=${logo} alt="logo" />
                   <h1 class="navigation__container--name">Pixlab</h1>
               </div> 
            </div>       
            ${navigationItem(dashboard, dashboardHover, 'Dashboard', '/')}
            ${navigationItemDropdown(shop, shopHover, 'E-Commerce', totalNotifications, down, downHover, 'ecommerceMenu')}
            <div class="subMenuContainer" id="subMenuContainer" style="display: none;">
                ${subMenuItems}
            </div>
            ${navigationItem(check, checkHover, 'Project', '/project')}
            ${navigationItemDropdown(user, userHover, 'Contact', 0, down, downHover)}
            ${navigationItem(folder, folderHover, 'File Manager', '/files')}
            ${navigationItem(comment, commentHover, 'Chat', '/chat')}
            ${navigationItem(calendar, calendarHover, 'Calendar', '/calendar')}  
        </div>  
    `; 
};

const setupNavigation = () => {
    const ecommerceMenu = document.getElementById("ecommerceMenu");
    const subMenuContainer = document.getElementById("subMenuContainer");
    const icons = document.querySelectorAll(".navigation-item__down--hover");
    const iconnormals = document.querySelectorAll(".navigation-item__down");
    const iconnormal = iconnormals[0];
    const icon = icons[0];

    // Toggle menu khi nhấp
    if (ecommerceMenu) {
    ecommerceMenu.addEventListener("click", (event) => {
      event.stopPropagation();
      const isActive = ecommerceMenu.classList.toggle("active");
      subMenuContainer.style.display = isActive ? "block" : "none";
      icon.style.transform = isActive ? "rotate(180deg)" : "rotate(0deg)"; 
      iconnormal.style.display = isActive ? "none" : "block"; 
    });
    }
  
    // Giữ trạng thái active khi hover vào submenu
    if (subMenuContainer) {
    subMenuContainer.addEventListener("mouseenter", () => {
      ecommerceMenu.classList.add("active");
      subMenuContainer.style.display = "block";
      icon.style.transform = "rotate(180deg)";
    });
  
    // Ẩn submenu khi rời chuột, trừ khi đang active từ click
    subMenuContainer.addEventListener("mouseleave", () => {
      if (!ecommerceMenu.classList.contains("active")) {
        subMenuContainer.style.display = "none";
        icon.style.transform = "rotate(0deg)";
      }
    });
    }

    // Handle SPA navigation for all clickable items
    document.querySelectorAll("[data-link]").forEach(element => {
        element.addEventListener("click", e => {
            const link = element.getAttribute("data-link");
            if (link && link !== '#') {
                e.preventDefault();
                e.stopPropagation();
                window.history.pushState(null, null, link);
                window.dispatchEvent(new PopStateEvent('popstate'));
            }
        });
    });

    // Make navigation items clickable on the entire area
    document.querySelectorAll(".navigation-item").forEach(item => {
        item.style.cursor = 'pointer';
    });
};

// Export both the navigation template and setup function
export { navigation as default, setupNavigation };