import mongoose, { Document, Schema } from 'mongoose';

export enum QuestionType {
    SINGLE = 'SINGLE',   // câu hỏi đơn
    PASSAGE = 'PASSAGE', // câu hỏi có đoạn văn + nhiều câu phụ
}
export interface ISubQuestion {
    question: string;
    options: string[];     // luôn có 4 đáp án
    correctAnswer: number; // index trong options[]
}
export interface IQuizQuestion {
    type: QuestionType;
    question?: string;           // chỉ dùng cho SINGLE
    options?: string[];          // chỉ dùng cho SINGLE
    correctAnswer?: number;      // chỉ dùng cho SINGLE
 
    passage?: string;            // đoạn văn (nếu type = PASSAGE)
    subQuestions?: ISubQuestion[]; // các câu hỏi phụ trong đoạn văn
}

export interface IQuiz extends Document {
    lessonId: mongoose.Types.ObjectId;
    questions: IQuizQuestion[];
    quizLimit: number; // Số lần được làm
}
const SubQuestionSchema = new Schema<ISubQuestion>(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
  },
  { _id: false }
);
const QuizQuestionSchema = new Schema<IQuizQuestion>(
  {
    type: { type: String, enum: Object.values(QuestionType), required: true },

    // SINGLE
    question: { type: String },
    options: [{ type: String }],
    correctAnswer: { type: Number },

    // PASSAGE
    passage: { type: String },
    subQuestions: [SubQuestionSchema],
  },
  { _id: false }
);

const QuizSchema = new Schema<IQuiz>(
  {
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    questions: [QuizQuestionSchema],
    quizLimit: { type: Number, required: true }, // Số lần được làm
  },
  { timestamps: true }
);

export const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);