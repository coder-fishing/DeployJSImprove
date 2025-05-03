import navigationItem from '../components/navigationItem';
import navigationItemDropdown from '../components/navigationItemDropDown';
import {subMenu, getTotalNotifications}  from '../components/submenu';

import {
    logo, dashboard, dashboardHover, shop, shopHover, down, downHover, check, checkHover,
    folder, folderHover, comment, commentHover, calendar, calendarHover,
    user, userHover
} from './../../assets/icon';

 
const menuItems = [
    { name: 'Product', notification: 3 ,link: 'product'},
    { name: 'Categories', notification: 5 ,link: 'category'},
    { name: 'Orders', notification: 0 , link: '#'},  
    { name: 'Customer', notification: 2 , link: '#'},
  ];
const subMenuItems = menuItems.map( item =>  subMenu(item.name,item.notification,item.link)).join('')
const totalNotifications =  getTotalNotifications()

const navigation = () => {
    return `
        <div class="navigation">
            <div class="navigation__container--logo">
               <div class="navigation__container--logo--wrapper">
                   <img src=${logo} alt="logo" />
                   <h1 class="navigation__container--name">Pixlab</h1>
               </div> 
            </div>       
            ${navigationItem(dashboard, dashboardHover, 'Dashboard')}
            ${navigationItemDropdown(shop, shopHover, 'E-Commerce', totalNotifications, down, downHover, 'ecommerceMenu')}
            <div class="subMenuContainer" id="subMenuContainer" style="display: none;">
                ${subMenuItems}
            </div>
            ${navigationItem(check, checkHover, 'Project')}
            ${navigationItemDropdown(user, userHover, 'Contact', 0, down, downHover)}
            ${navigationItem(folder, folderHover, 'File Manager')}
            ${navigationItem(comment, commentHover, 'Chat')}
            ${navigationItem(calendar, calendarHover, 'Calendar')}  
        </div>  
    `; 
};
document.addEventListener("DOMContentLoaded", () => {
    const ecommerceMenu = document.getElementById("ecommerceMenu");
    const subMenuContainer = document.getElementById("subMenuContainer");
    const icons = document.querySelectorAll(".navigation-item__down--hover");
    const iconnormals = document.querySelectorAll(".navigation-item__down");
    const iconnormal = iconnormals[0]
    const icon = icons[0];
    // Toggle menu khi nhấp
    ecommerceMenu.addEventListener("click", (event) => {
      event.stopPropagation();
      const isActive = ecommerceMenu.classList.toggle("active");
      subMenuContainer.style.display = isActive ? "block" : "none";
      icon.style.transform = isActive ? "rotate(180deg)" : "rotate(0deg)"; 
      iconnormal.style.display = isActive ? "none" : "block"; 
    });
  
    // Giữ trạng thái active khi hover vào submenu
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
  });

export default navigation;