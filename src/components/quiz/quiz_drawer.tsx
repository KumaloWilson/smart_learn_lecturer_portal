import React from 'react';
import { Drawer, Descriptions, Tag, Space, Button } from 'antd';
import {Quiz} from "../../models/quiz.ts";

interface QuizDrawerProps {
    quiz: Quiz | null;
    visible: boolean;
    onClose: () => void;
    onEdit: (quiz: Quiz) => void;
    onDelete: (quizId: string) => void;
}

export const QuizDrawer: React.FC<QuizDrawerProps> = ({
                                                          quiz,
                                                          visible,
                                                          onClose,
                                                          onEdit,
                                                          onDelete
                                                      }) => {
    if (!quiz) return null;

    return (
        <Drawer
            title="Quiz Details"
            width={640}
            open={visible}
            onClose={onClose}
            extra={
                <Space>
                    <Button onClick={() => onEdit(quiz)}>Edit Quiz</Button>
                    <Button danger onClick={() => onDelete(quiz.quiz_id)}>
                        Delete Quiz
                    </Button>
                </Space>
            }
        >
            <Descriptions column={1}>
                <Descriptions.Item label="Topic">{quiz.topic}</Descriptions.Item>
                <Descriptions.Item label="Subtopic">{quiz.subtopic}</Descriptions.Item>
                <Descriptions.Item label="Difficulty">
                    <Tag color={
                        quiz.difficulty === 'easy' ? 'green' :
                            quiz.difficulty === 'medium' ? 'orange' : 'red'
                    }>
                        {quiz.difficulty.toUpperCase()}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Questions">{quiz.total_questions}</Descriptions.Item>
                <Descriptions.Item label="Time Limit">{quiz.time_limit} minutes</Descriptions.Item>
                <Descriptions.Item label="Passing Score">{quiz.passing_score}%</Descriptions.Item>
                <Descriptions.Item label="Status">
                    <Tag color={quiz.status === 'active' ? 'green' : 'default'}>
                        {quiz.status.toUpperCase()}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Learning Objectives">
                    <ul>
                        {quiz.learning_objectives?.map((objective, index) => (
                            <li key={index}>{objective}</li>
                        ))}
                    </ul>
                </Descriptions.Item>
                <Descriptions.Item label="Tags">
                    <Space wrap>
                        {quiz.tags?.map((tag, index) => (
                            <Tag key={index}>{tag}</Tag>
                        ))}
                    </Space>
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};