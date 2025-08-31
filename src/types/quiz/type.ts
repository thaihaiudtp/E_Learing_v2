export enum QuizQuestionType {
  SINGLE = "SINGLE",
  PASSAGE = "PASSAGE",
}

export interface ISingleQuestion {
  type: QuizQuestionType.SINGLE;
  question: string;          // Nội dung câu hỏi
  options: string[];         // Danh sách lựa chọn
  correctAnswer: number;     // Index trong mảng options
}

export interface ISubQuestion {
  question: string;          // Nội dung câu hỏi phụ
  options: string[];         // Danh sách lựa chọn
  correctAnswer: number;     // Index đúng
}
export interface IPassageQuestion {
  type: QuizQuestionType.PASSAGE;
  passage: string;           // Nội dung đoạn văn
  subQuestions: ISubQuestion[];  // Các câu hỏi liên quan
}

export type IQuizQuestion = ISingleQuestion | IPassageQuestion;
export interface IQuiz {
  lessonId: string;           // ObjectId dạng string
  quizLimit: number;          // Số lần được làm
  questions: IQuizQuestion[]; // Danh sách câu hỏi
}

