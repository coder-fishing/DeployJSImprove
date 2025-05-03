const navigationItemDropDown = (
  icon,
  iconHover,
  name,
  number,
  icondown,
  icondownHover,
  id  
) => { 
  return `
        <li class="navigation-item" id="${id}">
            <div class="navigation-item__image-wrapper">
                <img class="navigation-item__image" src="${icon}" alt="icon-navigation_item">
                <img class="navigation-item__image--hover" src="${iconHover}" alt="icon-navigation_item_hover">
            </div>
            <span class="navigation-item__word">${name}</span>  
            ${number > 0 ? `
            <span class="navigation-item__notification" data-number="${number}">
                <span class="navigation-item__notification--number">${number}</span>
            </span>
            ` : ''}
            <div class="navigation-item__down-wrapper">
                <img class="navigation-item__down" src="${icondown}" alt="Dropdown icon">
                <img class="navigation-item__down--hover" src="${icondownHover}" alt="Dropdown hover icon">
            </div>
        </li> 
      `;
};

export default navigationItemDropDown;
