export interface LessonRequest {
    course: string,
    title: string,
    videoUrl: string,
    fileUrl: string,
    duration: string,
    quiz?: string,
}