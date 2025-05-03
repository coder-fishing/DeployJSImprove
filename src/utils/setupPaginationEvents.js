export const setupPaginationEvents = () => {
    document.querySelector("#prevbtn")?.addEventListener("click", () => {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.render();
        }
    });

    document.querySelector("#nextbtn")?.addEventListener("click", () => {
        if (this.currentPage < this.maxPage) {
            this.currentPage++;
            this.render();
        }
    });
}