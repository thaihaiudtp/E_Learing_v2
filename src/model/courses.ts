import mongoose, { Document, Schema } from 'mongoose';

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}
export interface ICourse extends Document {
  title: string;
  description: string;
  teacherId: number;
  categoryId: number;
  slug?: string;
  price?: number;
  level?: CourseLevel;
  thumbnail?: string;
  duration?: string;
  language?: string;
  requirements?: string[];
  features?: string[];
  students: mongoose.Types.ObjectId[];
  lessons: mongoose.Types.ObjectId[];
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    teacherId: { type: Number, required: true },
    categoryId: { type: Number, required: true },
    slug: { type: String, unique: true },
    price: { type: Number, default: 0 },
    level: { type: String, enum: Object.values(CourseLevel), default: CourseLevel.BEGINNER },
    thumbnail: { type: String },
    duration: { type: String },
    language: { type: String },
    requirements: [{ type: String }],
    features: [{ type: String }],
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  },
  { timestamps: true }
);

export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
