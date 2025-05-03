import { eye, trash, pencil, checkbox, checkicon, noAvt } from "../../assets/icon/index.js";
import { formatters } from "../../utils/formatters.js";

const ProductRow = ({ product }) => {
  return (`
      <tr class="product-table__row" data-id="${product.id}">
          <td class="product-table__item"> 
            <div class="product-table__name">
                <div class="product-table__name__checkbox">
                      <img src="${checkbox}" alt="checkbox" class="product-table__name__checkbox--box"/>
                      <img src="${checkicon}" alt="check" class="product-table__name__checkbox--check"/>
                  </div>   
                  <div class="product-table__container">  
                      <figure class="product-table__container--image">
                          <img src="${product.ImageSrc?.firstImg || noAvt}" alt="product image"/>
                      </figure>    
                      <div class="product-table__container--decs">
                          <p class="product-table__container--decs--name" title="${product.name}">${formatters.formatName(product.name)}</p>
                          <p class="product-table__container--decs--variants">${product.variants || ''}</p>
                      </div>  
                  </div> 
            </div>     
         </td>  

          <td class="product-table__item">
                <div class="product-table__item--sku" title="${product.sku}">${formatters.formatSKU(product.sku)}</div>
          </td>
          <td class="product-table__item">
                <div class="product-table__item--categories">${product.category || 'undefined'}</div>
          </td>
          <td class="product-table__item">
                <div class="product-table__item--stock">${formatters.formatStock(product.quantity)}</div>
          </td> 
          <td class="product-table__item">
                <div class="product-table__item--price">${formatters.formatPrice(product.price)}</div>
          </td> 
          <td class="product-table__item">
                  <div class="product-table__item--status">
                        <div class="product-table__item--status-${(product.status || '').replace(/\s+/g, '-').toLowerCase()}">
                              <p class="product-table__item--status-${(product.status || '').replace(/\s+/g, '-').toLowerCase()}-text">${product.status || 'Unknown'}</p>
                        </div>
                  </div> 
          </td>
   
          <td class="product-table__item">
                <div class="product-table__item--added">${formatters.formatDate(product.added)}</div>
          </td>
          <td class="product-table__item">
              <div class="product-table__item--buttons">
                  <a href="/editproduct/${product.id}">
                        <span class="product-table__edit">
                             <img src="${pencil}" alt="pencil"/> 
                        </span>
                  </a>
                  <span class="product-table__view">
                        <img src="${eye}" alt="eye"/>
                  </span>
                  <span class="product-table__delete" data-id="${product.id}">
                        <img src="${trash}" alt="trash"/>
                  </span> 
              </div>
          </td> 
      </tr>
  `);
};

export default ProductRow;