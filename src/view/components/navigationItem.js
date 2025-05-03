const navigationItem = (icon, iconHover, name) => {
  return `
    <li class="navigation-item">
      <div class="navigation-item__image-wrapper">
        <img class="navigation-item__image" src="${icon}" alt="icon-navigation_item">
        <img class="navigation-item__image--hover" src="${iconHover}" alt="icon-navigation_item_hover">
      </div>
      <span class="navigation-item__word">${name}</span>  
    </li>  
    
  `;
};

export default navigationItem;
