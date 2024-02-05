import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    price: { type: Number, min: 0, required: true },
    stock: { type: Number, min: 0, required: true },
    image: String
  },
  { collection: 'items' }
);

ItemSchema.virtual('priceFormatted').get(function () {
  return this.price % Math.floor(this.price) !== 0
    ? this.price.toFixed(2)
    : this.price;
});

ItemSchema.virtual('url').get(function () {
  return `/item/${this.id}`;
});

const Item = mongoose.model('Item', ItemSchema);
export default Item;
