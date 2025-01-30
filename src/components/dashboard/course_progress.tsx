import { List, Progress, } from 'antd';
import { CourseStats } from '../../models/dashboard_types';

interface CourseProgressProps {
    courses: CourseStats[];
}

export const CourseProgressList: React.FC<CourseProgressProps> = ({ courses }) => (
    <List
        itemLayout="horizontal"
        dataSource={courses}
        renderItem={(course) => (
            <List.Item>
                <List.Item.Meta
                    title={`${course.courseName} (${course.courseCode})`}
                    description={
                        <div className="flex items-center justify-between">
                            <Progress percent={course.completionRate} size="small" />
                            <div className="flex gap-4">
                                <span>Students: {course.totalStudents}</span>
                                <span>Avg. Grade: {course.averageGrade}%</span>
                            </div>
                        </div>
                    }
                />
            </List.Item>
        )}
    />
);