export interface LessonRequest {
    course: string,
    title: string,
    description?: string,
    videoUrl: string,
    fileUrl: string,
    duration: string,
    quiz?: string,
}