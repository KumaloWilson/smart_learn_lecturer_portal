import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {Button, Spin, Tabs} from 'antd';
import { useQuizManagement } from '../../hooks/quiz/quiz_session';
import { Quiz } from '../../models/quiz';
import {QuizGrid} from "../../components/quiz/quiz_grid.tsx";
import {QuizDrawer} from "../../components/quiz/quiz_drawer.tsx";
import {QuizForm} from "../../components/quiz/quiz_form.tsx";
const { TabPane } = Tabs;

const QuizList: React.FC<{ lecturerId: string }> = ({ lecturerId }) => {
    const {
        quizzes,
        loading,
        lecturerCourses,
        courseTopics,
        selectedCourse,
        setSelectedCourse,
        createQuiz,
        deleteQuiz,
    } = useQuizManagement(lecturerId);

    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

    const handleCreateQuiz = async (values: Partial<Quiz>) => {
        await createQuiz(values);
        setFormVisible(false);
    };

    const handleEditQuiz = (quiz: Quiz) => {
        setEditingQuiz(quiz);
        setFormVisible(true);
        setDrawerVisible(false);
    };

    const handleDeleteQuiz = async (quizId: string) => {
        await deleteQuiz(quizId);
        setDrawerVisible(false);
    };

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setFormVisible(true)}
                style={{ marginBottom: 16 }}
            >
                Create Quiz
            </Button>

            <Tabs defaultActiveKey="all">
                <TabPane tab="All Quizzes" key="all">
                    <QuizGrid
                        quizzes={quizzes}
                        onQuizClick={(quiz) => {
                            setSelectedQuiz(quiz);
                            setDrawerVisible(true);
                        }}
                    />
                </TabPane>
                {lecturerCourses.map(course => (
                    <TabPane tab={course.course_name} key={course.course_id}>
                        <QuizGrid
                            quizzes={quizzes.filter(quiz => quiz.course_id === course.course_id)}
                            onQuizClick={(quiz) => {
                                setSelectedQuiz(quiz);
                                setDrawerVisible(true);
                            }}
                        />
                    </TabPane>
                ))}
            </Tabs>

            <QuizDrawer
                quiz={selectedQuiz}
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                onEdit={handleEditQuiz}
                onDelete={handleDeleteQuiz}
            />

            <QuizForm
                visible={formVisible}
                onCancel={() => {
                    setFormVisible(false);
                    setEditingQuiz(null);
                }}
                onSubmit={handleCreateQuiz}
                initialValues={editingQuiz!}
                lecturerCourses={lecturerCourses}
                courseTopics={courseTopics}
                selectedCourse={selectedCourse}
                onCourseChange={setSelectedCourse}
            />
        </>
    );
};


export default QuizList;
