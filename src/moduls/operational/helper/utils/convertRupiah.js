const convertToRupiah =  (price) => {
    return 'Rp' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const convertToPlainRupiah =  (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export {convertToRupiah, convertToPlainRupiah}