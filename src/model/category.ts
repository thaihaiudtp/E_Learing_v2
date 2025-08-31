import mongoose, { Document, Schema } from 'mongoose';



export interface ICategory extends Document {
    title: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
