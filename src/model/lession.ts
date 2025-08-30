import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  title: string;
  videoUrl: string;       // link video bài giảng
  fileUrl: string;        // tài liệu (PDF, DOCX, PPTX…)
  duration?: string;      // thời lượng video
  quiz?: mongoose.Types.ObjectId; // ref tới Quiz (optional)
}
const LessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    fileUrl: { type: String, required: true },
    duration: { type: String },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz' },
  },
  { timestamps: true }
);
export const Lesson = mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);