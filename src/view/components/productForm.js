import { caretDown ,  picture } from "./../../assets/icon";
function productForm({ mode = 'create', productData = {} }) {
    return ( 
    `<div class="product-form">
        <div class="product-form__body-left">
            <div class="form-section form-section--general">
                <h3 class="form-section__title">General Information</h3>
                <div class="form-section__field">
                    <p class="form-section__field--name">Product Name</p>
                    <input class="form-section__field--input" type="text" placeholder="Type product name here..." name="productName" value="${productData.name || ''}">
                </div>
                <div class="form-section__field"> 
                    <p class="form-section__field--name">Product Description</p>
                    <textarea class="form-section__field--textarea" placeholder="Type product description here..." name="description">${productData.description || ''}</textarea>
                </div>  
            </div>          
       
            <div class="form-section form-section--media">
                <h3 class="form-section__title">Media</h3>
                <div class="form-section__field">  
                    <p class="form-section__field--name">Photo</p> 
                    <div class="media__upload-area upload-empty" id="emptyState" style="display: ${mode === 'edit' && productData.ImageSrc?.firstImg ? 'none' : 'flex'}">
                        <figure class="media__upload-area--figure" id="productImageArea">
                            <img src="${picture}" alt="product-image" class="media__upload-area--img" id="productImage">
                        </figure>
                        <p class="media__upload-text">Drag and drop image here, or click add image</p>
                        <input type="file" id="imageInputEmpty" accept="image/*" style="display: none;">
                        <button class="media__upload-btn">Add Image</button>
                    </div>   
    
                    <div class="media__upload-area upload-filled" id="filledState" style="display: ${mode === 'edit' && productData.ImageSrc?.firstImg ? 'flex' : 'none'}">
                        <div class="media_upload-area list-image">
                            <figure class="list-image-preview" style="display: ${productData.ImageSrc?.firstImg ? 'block' : 'none'}">
                                <img src="${productData.ImageSrc?.firstImg || ''}" alt="product-image" class="preview-img" id="previewImg">
                                <div class="delete-image" data-index="0">×</div>
                            </figure>
                            <figure class="list-image-preview" style="display: ${productData.ImageSrc?.secondImg && productData.ImageSrc?.secondImg.includes('cloudinary') ? 'block' : 'none'}">
                                <img src="${productData.ImageSrc?.secondImg || ''}" alt="product-image" class="preview-img">
                                <div class="delete-image" data-index="1">×</div>
                            </figure>
                            <figure class="list-image-preview" style="display: ${productData.ImageSrc?.thirdImg && productData.ImageSrc?.thirdImg.includes('cloudinary') ? 'block' : 'none'}">
                                <img src="${productData.ImageSrc?.thirdImg || ''}" alt="product-image" class="preview-img">
                                <div class="delete-image" data-index="2">×</div>
                            </figure>
                        </div> 
                        <p class="media__upload-text">Drag and drop image here, or click add image</p>
                        <input type="file" id="imageInputFilled" accept="image/*" style="display: none;">
                        <button class="media__upload-btn">Add Image</button>
                    </div>                 
                </div>
            </div>          
    
            <div class="form-section form-section--pricing">
                <h3 class="form-section__title">Pricing</h3>
                <div class="form-section__field">
                    <p class="form-section__field--name">Base Price</p>
                    <input class="form-section__field--input" type="text" placeholder="$ Type base price here..." name="basePrice" value="${productData.price || ''}">
                </div>
                <div class="form-section__split">       
                    <div class="form-section__field">
                        <p class="form-section__field--name">Discount Type</p>
                        <select class="form-section__field--input" name="discountType">
                            <option value="no-discount" ${!productData.discount_type || productData.discount_type === 'no-discount' ? 'selected' : ''}>No Discount</option>
                            <option value="percentage" ${productData.discount_type === 'percentage' ? 'selected' : ''}>Percentage</option>
                        </select>  
                    </div>  
                    <div class="form-section__field">
                        <p class="form-section__field--name">Discount Percentage %</p>
                        <input class="form-section__field--input" type="text" placeholder="Type discount percentage..." name="discountPercentage" value="${productData.discount_value || ''}">
                    </div>
                </div>
                <div class="form-section__split">
                    <div class="form-section__field">
                        <p class="form-section__field--name">Tax Class</p>
                        <select class="form-section__field--input" name="taxClass">
                            <option value="tax-free" ${!productData.tax_class || productData.tax_class === 'tax-free' ? 'selected' : ''}>Tax Free</option>
                            <option value="vat" ${productData.tax_class === 'vat' ? 'selected' : ''}>VAT</option>
                        </select>
                    </div>
                    <div class="form-section__field">
                        <p class="form-section__field--name">VAT Amount</p>
                        <input class="form-section__field--input" type="text" placeholder="Type VAT amount..." name="vatAmount" value="${productData.vat_amount || ''}">
                    </div>
                </div>     
            </div>
    
            <div class="form-section form-section--inventory">
                <h3 class="form-section__title">Inventory</h3>
                <div class="field_container">
                    <div class="form-section__field">
                        <p class="form-section__field--name">SKU</p>
                        <input class="form-section__field--input" type="text" placeholder="Type product SKU here..." name="sku" value="${productData.sku || ''}">
                    </div>
                    <div class="form-section__field">
                        <p class="form-section__field--name">Barcode</p>
                        <input class="form-section__field--input" type="text" placeholder="Product barcode..." name="barcode" value="${productData.barcode || ''}">
                    </div>
                    <div class="form-section__field">
                        <p class="form-section__field--name">Quantity</p>
                        <input class="form-section__field--input" type="text" placeholder="Type product quantity here..." name="quantity" value="${productData.quantity || ''}">
                    </div> 
                </div>
            </div>
        </div>
        <div class="product-form__body-right">
            <div class="form-section">
                <span>Category</span>
                <div class="form-section__field">
                    <div class="form-section__field--name">Product Category</div> 
                </div>
                <div class="dropdown" id="dropdowntop">
                    <div class="dropdown-group">
                        <div class="dropbtn" id="dropdownButtonTop">${productData.category || 'None'}</div>
                        <img src="${caretDown}" alt="caret-down" class="caret-down"/>
                    </div>
                    <div class="dropdown-content" id="dropdownContentTop">
                        <div data-value="Bag & Pouch">Bag & Pouch</div>
                        <div data-value="Watch">Watch</div>
                        <div data-value="Audio">Audio</div>
                        <div data-value="Shoes">Shoes</div>
                        <div data-value="Accessories">Accessories</div>
                        <div data-value="Mouse">Mouse</div>
                        <div data-value="Keyboard">Keyboard</div>
                    </div>
                </div>            
            </div>  
            <div class="form-section"> 
                <div class="form-section__title">
                    <span class="form-section__title-status">Status</span> 
                    <div class="form-section__title-status--label">                       
                        <p class="form-section__title-status--label-text ${productData.div} || draft " id="status-text">${productData.status || 'Draft'}</p>                         
                    </div>  
                </div> 
                <div class="form-section__field">
                    <p class="form-section__field--name">Product Status</p>             
                </div> 
                <div class="dropdown" id="dropdown">
                    <div class="dropdown-group">
                        <div class="dropbtn" id="dropdownButton">${productData.status || 'Draft'}</div>
                        <img src="${caretDown}" alt="caret-down" class="caret-down"/>
                    </div>
                    <div class="dropdown-content" id="dropdownContent">
                        <div data-value="Draft">Draft</div>
                        <div data-value="Published">Published</div>
                        <div data-value="Out of Stock">Out of Stock</div>
                        <div data-value="Low Stock">Low Stock</div>
                    </div>
                </div>
            </div> 
        </div>
    </div >`
     )
} 


export default productForm;
