import mongoose, { Document, Schema } from 'mongoose';

import slugify from 'slugify';
export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export interface ICourse extends Document {
  title: string;
  description: string;
  slug?: string;
  price?: number;
  level?: CourseLevel;
  thumbnail?: string;
  duration?: string;
  language?: string;
  requirements?: string[];
  features?: string[];
  category: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
  lessons: mongoose.Types.ObjectId[];
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, unique: true },
    price: { type: Number, default: 0 },
    level: { type: String, enum: Object.values(CourseLevel), default: CourseLevel.BEGINNER },
    thumbnail: { type: String },
    duration: { type: String },
    language: { type: String },
    requirements: [{ type: String }],
    features: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  },
  { timestamps: true }
);
CourseSchema.pre<ICourse>('save', function(next) {
  if(this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: "vi"
    });
  }
  next();
})
export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
