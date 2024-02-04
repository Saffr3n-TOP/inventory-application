import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, minLength: 1 },
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
  },
  { collection: 'items' }
);

ItemSchema.virtual('priceFormatted').get(function () {
  return this.price.toFixed(2);
});

ItemSchema.virtual('url').get(function () {
  return `/item/${this.id}`;
});

const Item = mongoose.model('Item', ItemSchema);
export default Item;
