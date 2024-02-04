import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String
  },
  { collection: 'categories' }
);

CategorySchema.virtual('url').get(function () {
  return `/category/${this.id}`;
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
