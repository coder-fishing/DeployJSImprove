// Utility to handle synchronized search across components
const SEARCH_KEY = 'global_search_query';

export const setGlobalSearch = (query) => {
    localStorage.setItem(SEARCH_KEY, query);
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('global-search-update', { 
        detail: { query } 
    }));
};

export const getGlobalSearch = () => {
    return localStorage.getItem(SEARCH_KEY) || '';
};

export const setupSearchSync = (inputElement, onSearchCallback) => {
    // Set initial value if exists
    const savedQuery = getGlobalSearch();
    if (savedQuery) {
        inputElement.value = savedQuery;
        onSearchCallback(savedQuery);
    }

    // Listen for changes from other components
    window.addEventListener('global-search-update', (event) => {
        const query = event.detail.query;
        if (inputElement.value !== query) {
            inputElement.value = query;
            onSearchCallback(query);
        }
    });

    // Update when this input changes
    inputElement.addEventListener('input', (e) => {
        const query = e.target.value;
        setGlobalSearch(query);
        onSearchCallback(query);
    });
}; 