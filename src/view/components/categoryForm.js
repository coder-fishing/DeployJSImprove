import { picture } from "./../../assets/icon";

function categoryForm(props = { mode: 'create', categoryData: {} }) {
    const mode = props.mode || 'create';
    const categoryData = props.categoryData || {};

    return (`
        <div class="category-form">
            <div class="thumbnail">
                <h3 class="thumbnail__title">Thumbnail</h3>
                <p class="thumbnail__subtitle">Photo</p> 
                
                <div class="thumbnail__upload-area" id="emptyState" style="display: ${mode === 'edit' && categoryData.image ? 'none' : 'flex'}">
                    <div class="thumbnail__upload-icon">
                        <figure class="thumbnail__upload-icon--image">
                            <img src="${picture}" alt="upload"/>
                        </figure>
                    </div>  
                    <p class="thumbnail__upload-text">Drag and drop image here, or click add image</p>
                    <input type="file" id="imageInput" class="thumbnail__file-input" accept="image/*" hidden>
                    <button class="thumbnail__add-btn">
                        <p class="thumbnail__add-btn--text">Add Image</p>
                    </button>
                </div>     
 
                <div class="thumbnail__preview" id="previewState" style="display: ${mode === 'edit' && categoryData.image ? 'block' : 'none'}">
                    <img id="previewImage" src="${categoryData.image || ''}" alt="category thumbnail"/>
                    <div class="thumbnail__preview-remove">×</div>
                </div>  
            </div>   

            <div class="general-info">
                <h2 class="general-info__title">General Information</h2>
                
                <div class="general-info__form">
                    <div class="form-field">
                        <label class="form-field__label">Category Name</label>
                        <input 
                            type="text" 
                            class="form-field__input" 
                            placeholder="Type category name here..." 
                            name="categoryName" 
                            value="${categoryData.name || ''}"
                        />
                    </div>
                    <div class="form-field">
                        <label class="form-field__label">Description</label>
                        <textarea 
                            class="form-field__textarea" 
                            placeholder="Type description here..." 
                            name="description"
                        >${categoryData.description || ''}</textarea>
                    </div>
                </div>
            </div>
        </div>
    `);
}

export default categoryForm;
