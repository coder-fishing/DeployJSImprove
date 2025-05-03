const updateImageDisplay = (productData) => {
    const emptyState = document.getElementById('emptyState');
    const filledState = document.getElementById('filledState');
    const firstImgFrame = document.getElementById('firstImgFrame');
    const secondImgFrame = document.getElementById('secondImgFrame');
    const thirdImgFrame = document.getElementById('thirdImgFrame');
    const firstImg = document.getElementById('firstImg');
    const secondImg = document.getElementById('secondImg');
    const thirdImg = document.getElementById('thirdImg');

    // Kiểm tra và cập nhật trạng thái hiển thị
    if (productData.ImageSrc?.firstImg || productData.ImageSrc?.secondImg || productData.ImageSrc?.thirdImg) {
        emptyState.classList.add('hidden');
        filledState.classList.remove('hidden');
    } else {
        emptyState.classList.remove('hidden');
        filledState.classList.add('hidden');
    }

    // Hiển thị các ảnh cụ thể
    if (productData.ImageSrc?.firstImg) {
        firstImgFrame.classList.remove('hidden');
        firstImgFrame.classList.add('block');
        firstImg.src = productData.ImageSrc.firstImg;
    }

    if (productData.ImageSrc?.secondImg) {
        secondImgFrame.classList.remove('hidden');
        secondImgFrame.classList.add('block');
        secondImg.src = productData.ImageSrc.secondImg;
    }

    if (productData.ImageSrc?.thirdImg) {
        thirdImgFrame.classList.remove('hidden');
        thirdImgFrame.classList.add('block');
        thirdImg.src = productData.ImageSrc.thirdImg;
    }
};