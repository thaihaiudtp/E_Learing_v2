import mongoose, { Document, Schema } from 'mongoose';



export interface ITeacher extends Document {
    full_name: string;
    email: string;
    avatar?: string;
    age?: number;
    bio?: string;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    age: { type: Number },
    bio: { type: String },
  },
  { timestamps: true }
);

export const Teacher = mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);
