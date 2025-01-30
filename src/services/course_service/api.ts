import axios from "axios";
import { Course } from "../../models/course";
import { LecturerCourseAssignmentDetails } from "../../models/lecturer_courses";
import { API_BASE_URL } from "../../configs/config";


export class CourseManagementService {
    static async getLecturerCourses(lecturerId: string): Promise<LecturerCourseAssignmentDetails[]> {
        const response = await axios.get(`${API_BASE_URL}/lecturer-courses/lecturer/${lecturerId}`);
        return response.data.data;
    }

    static async getCourseDetails(courseId: string): Promise<Course> {
        const response = await axios.get(`${API_BASE_URL}/courses/${courseId}`);
        return response.data.data;
    }

    static async getLecturerCoursesBySemester(
        lecturerId: string,
        semester: string,
        academicYear: string
    ): Promise<LecturerCourseAssignmentDetails[]> {
        const response = await axios.get(
            `${API_BASE_URL}/lecturer-courses/semester/${semester}/year/${academicYear}`
        );
        return response.data.data;
    }

    // Additional service methods for proposed APIs
    static async uploadCourseMaterial(courseId: string, data: FormData): Promise<void> {
        await axios.post(`${API_BASE_URL}/courses/${courseId}/materials`, data);
    }

    static async getCourseStudents(courseId: string): Promise<unknown[]> {
        const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/students`);
        return response.data.data;
    }

    static async updateCourseProgress(courseId: string, progress: unknown): Promise<void> {
        await axios.put(`${API_BASE_URL}/courses/${courseId}/progress`, progress);
    }
}