import React from 'react';
import { Card, Tag, Space, Button, Tooltip } from 'antd';
import {
    ClockCircleOutlined,
    QuestionCircleOutlined,
    TrophyOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { Quiz } from '../../models/quiz';

interface QuizCardProps {
    quiz: Quiz;
    onClick?: (quiz: Quiz) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onClick }) => {

    const tags = Array.isArray(quiz.tags) ? quiz.tags : [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'green';
            case 'draft':
                return 'orange';
            case 'archived':
                return 'red';
            default:
                return 'default';
        }
    };

    return (
        <Card
            hoverable
            className="quiz-card"
            onClick={() => onClick?.(quiz)}
            extra={
                <Tag color={getStatusColor(quiz.status)}>
                    {quiz.status.toUpperCase()}
                </Tag>
            }
        >
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{quiz.topic}</h3>
                {quiz.subtopic && (
                    <p className="text-gray-600 mb-2">{quiz.subtopic}</p>
                )}
            </div>

            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space wrap>
                    <Tooltip title="Difficulty">
                        <Tag color={
                            quiz.difficulty === 'easy' ? 'green' :
                                quiz.difficulty === 'medium' ? 'orange' : 'red'
                        }>
                            {quiz.difficulty.toUpperCase()}
                        </Tag>
                    </Tooltip>

                    {tags.length > 0 && (
                        <div>
                            <Space size={[0, 4]} wrap>
                                {tags.map((tag, index) => (
                                    <Tag key={index}>{tag}</Tag>
                                ))}
                            </Space>
                        </div>
                    )}

                    <Tag color={quiz.status === 'active' ? 'green' : 'default'}>
                        {quiz.status.toUpperCase()}
                    </Tag>

                </Space>

                <Space className="mt-2" split={<span className="mx-2">|</span>}>
                    <Tooltip title="Time Limit">
                        <Space>
                            <ClockCircleOutlined />
                            {quiz.time_limit} min
                        </Space>
                    </Tooltip>

                    <Tooltip title="Number of Questions">
                        <Space>
                            <QuestionCircleOutlined />
                            {quiz.total_questions}
                        </Space>
                    </Tooltip>

                    <Tooltip title="Passing Score">
                        <Space>
                            <TrophyOutlined />
                            {quiz.passing_score}%
                        </Space>
                    </Tooltip>
                </Space>

                <Space className="mt-4 w-full justify-end">
                    <Tooltip title="View Details">
                        <Button
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick?.(quiz);
                            }}
                        >
                            View Details
                        </Button>
                    </Tooltip>
                </Space>
            </Space>
        </Card>
    );
};