import React from 'react';
import { Card, Tag, Typography, Space } from 'antd';
import { LecturerCourseAssignmentDetails } from '../../models/lecturer_courses';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface CourseCardProps {
    course: LecturerCourseAssignmentDetails;
    onClick: (course: LecturerCourseAssignmentDetails) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => (
    <Card
        hoverable
        onClick={() => onClick(course)}
        className="h-full"
    >
        <Space direction="vertical" className="w-full">
            <Space align="center" className="w-full justify-between">
                <Text strong>{course.course_code}</Text>
                <Tag color={course.role === 'primary' ? 'blue' : 'green'}>
                    {course.role}
                </Tag>
            </Space>
            <Text className="text-lg font-medium">{course.course_name}</Text>
            <Space className="mt-2">
                <ClockCircleOutlined /> <Text>Semester {course.semester}</Text>
                <Text>|</Text>
                <Text>{course.academic_year}</Text>
            </Space>
        </Space>
    </Card>
);