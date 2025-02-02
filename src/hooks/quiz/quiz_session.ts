import { useState, useEffect } from 'react';
import { message } from 'antd';
import {LecturerCourseAssignmentDetails} from "../../models/lecturer_courses.ts";
import {Quiz} from "../../models/quiz.ts";
import {CourseTopic} from "../../models/course_topic.ts";
import { quizAPI } from '../../services/quiz_services/api.ts';
import {CourseManagementService} from "../../services/course_service/api.ts";

export const useQuizManagement = (lecturerId: string) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [lecturerCourses, setLecturerCourses] = useState<LecturerCourseAssignmentDetails[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [courseTopics, setCourseTopics] = useState<CourseTopic[]>([]);

    const loadQuizzes = async () => {
        try {
            setLoading(true);
            const data = await quizAPI.getQuizByInstructorID(lecturerId);
            setQuizzes(data);
        } catch (error) {
            message.error('Failed to load quizzes');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadLecturerCourses = async () => {
        try {
            const courses = await CourseManagementService.getLecturerCourses(lecturerId);
            setLecturerCourses(courses);
        } catch (error) {
            message.error('Failed to load lecturer courses');
            console.error(error);
        }
    };

    const loadCourseTopics = async (courseId: string) => {
        try {
            const topics = await  CourseManagementService.getCourseTopics(courseId);
            setCourseTopics(topics);
        } catch (error) {
            message.error('Failed to load course topics');
            console.error(error);
        }
    };

    const createQuiz = async (values: Partial<Quiz>) => {
        try {
            const response = await quizAPI.createQuiz(values);
            if (response.success) {
                message.success('Quiz created successfully');
                loadQuizzes();
            }
            return response;
        } catch (error) {
            message.error('Failed to create quiz');
            throw error;
        }
    };

    const deleteQuiz = async (quizId: string) => {
        try {
           await quizAPI.deleteQuizByID(quizId);
            message.success('Quiz deleted successfully');
            loadQuizzes();
        } catch (error) {
            message.error('Failed to delete quiz');
            throw error;
        }
    };

    useEffect(() => {
        loadQuizzes();
        loadLecturerCourses();
    }, [lecturerId]);

    useEffect(() => {
        if (selectedCourse) {
            loadCourseTopics(selectedCourse);
        }
    }, [selectedCourse]);

    return {
        quizzes,
        loading,
        lecturerCourses,
        courseTopics,
        selectedCourse,
        setSelectedCourse,
        createQuiz,
        deleteQuiz,
        refreshQuizzes: loadQuizzes
    };
};
