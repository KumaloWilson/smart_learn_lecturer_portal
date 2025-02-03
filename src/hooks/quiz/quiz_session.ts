// hooks/quiz/quiz_session.ts
import { useState, useEffect } from 'react';
import { message } from 'antd';
import { Quiz } from '../../models/quiz';
import { quizAPI } from '../../services/quiz_services/api';
import {LecturerCourseAssignmentDetails} from "../../models/lecturer_courses.ts";
import {CourseTopic} from "../../models/course_topic.ts";
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
            const response = await quizAPI.getQuizByInstructorID(lecturerId);
            // Ensure we're getting an array from the response
            const quizData = Array.isArray(response.data) ? response.data : [];
            setQuizzes(quizData);
        } catch (error) {
            message.error('Failed to load quizzes');
            console.error(error);
            // Initialize with empty array on error
            setQuizzes([]);
        } finally {
            setLoading(false);
        }
    };

    const loadLecturerCourses = async () => {
        try {
            const response = await CourseManagementService.getLecturerCourses(lecturerId);
            const courses = Array.isArray(response) ? response : [];
            setLecturerCourses(courses);
        } catch (error) {
            message.error('Failed to load lecturer courses');
            console.error(error);
            setLecturerCourses([]);
        }
    };

    const loadCourseTopics = async (courseId: string) => {
        try {
            const response = await CourseManagementService.getCourseTopics(courseId);
            const topics = Array.isArray(response) ? response : [];
            setCourseTopics(topics);
        } catch (error) {
            message.error('Failed to load course topics');
            console.error(error);
            setCourseTopics([]);
        }
    };

    const createQuiz = async (values: Partial<Quiz>) => {
        try {
            const requestBody = {
                ...values,
                created_by: lecturerId,
                status: 'active',
                creator_role: 'lecturer',
                learning_objectives: values.learning_objectives || [
                    `Understand ${values.topic} concepts`,
                    `Master ${values.topic} fundamentals`
                ],
                tags: [
                    values.topic?.toLowerCase(),
                    values.difficulty,
                    values.subtopic?.toLowerCase()
                ].filter(Boolean)
            };

            const response = await quizAPI.createQuiz(requestBody);
            if (response.success) {
                message.success('Quiz created successfully');
                await loadQuizzes();
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
        if (lecturerId) {
            loadQuizzes();
            loadLecturerCourses();
        }
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