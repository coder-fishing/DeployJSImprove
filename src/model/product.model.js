export class Product {
  constructor(
    id,
    name,
    sku,
    category,
    category_ID,
    price,
    status,
    added,
    description,
    firstImg,
    secondImg,
    thirdImg,
    discountType,
    discountValue,
    taxClass,
    vatAmount,
    barcode,
    quantity
  ) {
    this.id = id;
    this.name = name;
    this.sku = sku;
    this.category = category;
    this.category_ID = category_ID;   
    this.price = price;
    this.status = status;
    this.added = added;
    this.description = description;
    this.ImageSrc = {
      firstImg: firstImg,
      secondImg: secondImg,
      thirdImg: thirdImg
    };
    this.discountType = discountType;
    this.discountValue = discountValue;
    this.taxClass = taxClass;
    this.vatAmount = vatAmount;
    this.barcode = barcode;
    this.quantity = quantity;
  }
}
