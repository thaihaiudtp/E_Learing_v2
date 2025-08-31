import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from "bcrypt";
export interface IQuizAttempt {
  quizId: mongoose.Types.ObjectId;
  attempts: number;      // số lần đã làm
  maxAttempts: number;   // số lần tối đa được phép
  scores: number[];      // điểm của từng lần
  bestScore: number;     // điểm cao nhất
}
export enum Role {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export interface IStudent extends Document {
  googleId?: string;
  full_name: string;
  email: string;
  password: string;
  avatar?: string;
  age?: number;
  role: Role;
  courses_enrolled?: mongoose.Types.ObjectId[];
  rank_now?: number;
  quizProgress?: IQuizAttempt[];
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 }, // mặc định 3 lần
    scores: [{ type: Number }],
    bestScore: { type: Number, default: 0 },
  },
  { _id: false }
);

const StudentSchema = new Schema<IStudent>(
  {
    googleId: { type: String, unique: true, sparse: true }, // sparse allows multiple null values
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    age: { type: Number },
    password: { type: String, required: true },
    courses_enrolled: [
      { type: Schema.Types.ObjectId, ref: 'Course' }
    ],
    role: { type: String, enum: Object.values(Role), default: Role.STUDENT },
    rank_now: { type: Number, default: 0 },
    quizProgress: [QuizAttemptSchema],
  },
  { timestamps: true }
);
StudentSchema.pre<IStudent>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err as unknown as Error );
  }
});

 //So sánh mật khẩu khi login
StudentSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
