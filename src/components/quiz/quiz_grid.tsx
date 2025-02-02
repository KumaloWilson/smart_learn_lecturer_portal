import {Col, Row} from "antd";
import {Quiz} from "../../models/quiz.ts";
import {QuizCard} from "./quiz_card.tsx";

export const QuizGrid: React.FC<{
    quizzes: Quiz[];
    onQuizClick: (quiz: Quiz) => void;
}> = ({ quizzes, onQuizClick }) => (
    <Row gutter={[16, 16]}>
        {quizzes.map(quiz => (
            <Col xs={24} sm={12} md={8} key={quiz.quiz_id}>
                <QuizCard quiz={quiz} onClick={() => onQuizClick(quiz)} />
            </Col>
        ))}
    </Row>
);
