import { eye, trash, pencil, checkbox, checkicon, noAvt } from "../../assets/icon/index.js";
import { formatters } from "../../utils/formatters.js";

const CategoryRow = ({ category }) => {
  return (`
      <tr class="product-table__row" data-id="${category.categoryID}">
          <td class="product-table__item"> 
            <div class="product-table__name">
                <div class="product-table__name__checkbox">
                      <img src="${checkbox}" alt="checkbox" class="product-table__name__checkbox--box"/>
                      <img src="${checkicon}" alt="check" class="product-table__name__checkbox--check"/>
                  </div>   
                  <div class="product-table__container">  
                      <figure class="product-table__container--image">
                          <img src="${category.image || noAvt}" alt="product image"/>
                      </figure>    
                      <div class="product-table__container--decs">
                          <p class="product-table__container--decs--name" title="${category.name}">${formatters.formatName(category.name)}</p>
                          <p class="product-table__container--decs--variants">${category.description || ''}</p>
                      </div>  
                  </div> 
            </div>     
         </td>  

          <td class="product-table__item">
                <div class="product-table__item--sku" title="${category.sold}">${formatters.formatSKU(category.sold)}</div>
          </td>
          <td class="product-table__item">
                <div class="product-table__item--categories">${category.stock || 'undefined'}</div>
          </td>
          <td class="product-table__item">
                <div class="product-table__item--added">${formatters.formatDate(category.create_at)}</div>
          </td>
          <td class="product-table__item">
              <div class="product-table__item--buttons">
                  <a href="/editcategory/${category.categoryID}">
                        <span class="product-table__edit">
                             <img src="${pencil}" alt="pencil"/> 
                        </span>
                  </a>
                  <span class="product-table__view">
                        <img src="${eye}" alt="eye"/>
                  </span>
                  <span class="product-table__delete" data-id="${category.categoryID}">
                        <img src="${trash}" alt="trash"/>
                  </span> 
              </div>
          </td> 
      </tr>
  `);
};

export default CategoryRow;