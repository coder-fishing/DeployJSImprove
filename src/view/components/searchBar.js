import { search } from "./../../assets/icon";
const searchBar = ( placeHolder) => {
    return `
        <div class="search-bar">
            <img src="${search}" class="search-bar_icon"/>
            <input type="text" class="search-bar_input" placeholder="${placeHolder}"/>
        </div>
    `;
}
 
export default searchBar;     