export const dropdown = (id, btn, content, text = null) => {
    const dropdown = document.getElementById(id);
    const dropdownButton = document.getElementById(btn);
    const dropdownContent = document.getElementById(content);
    const statusText = text ? document.getElementById(text) : null;

    const items = dropdownContent.querySelectorAll('div');

    items.forEach(item => {
        item.addEventListener('click', (e) => {
            const selectedValue = e.target.getAttribute('data-value');
            const selectedId = e.target.getAttribute('data-id');
            dropdownButton.textContent = selectedValue;
            
            // Store the selected ID as a data attribute
            if (selectedId) {
                dropdownButton.setAttribute('data-selected-id', selectedId);
            }

            if (statusText) {
                statusText.textContent = selectedValue;
                const name = selectedValue.replace(/\s+/g, '-').toLowerCase();
                statusText.classList.remove('draft', 'publish', 'out-of-stock', 'stock');
                statusText.classList.add(name);
            }

            dropdownContent.style.display = 'none';
        });
    });

    dropdownButton.addEventListener('click', (e) => {
        e.preventDefault();
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdownContent.style.display = 'none';
        }
    });
};