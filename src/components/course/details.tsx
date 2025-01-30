import { Tabs, Typography } from 'antd';
import type { TabsProps } from 'antd';
import { LecturerCourseAssignmentDetails } from '../../models/lecturer_courses';
import { StudentsList } from './students_list';

const { Text } = Typography;

interface CourseDetailsTabsProps {
    course: LecturerCourseAssignmentDetails;
}

export const CourseDetailsTabs: React.FC<CourseDetailsTabsProps> = ({ course }) => {
    const items: TabsProps['items'] = [
        {
            key: 'overview',
            label: 'Overview',
            children: (
                <div className="space-y-4">
                    <div>
                        <Text strong>Description:</Text>
                        <Text>{course.description}</Text>
                    </div>
                </div>
            )
        },
        {
            key: 'materials',
            label: 'Course Materials',
            children: (
                <div>
                    {/* Course materials component */}
                </div>
            )
        },
        {
            key: 'students',
            label: 'Students',
            children: (
                <StudentsList courseId={course.course_id} />
            )
        },
        {
            key: 'progress',
            label: 'Course Progress',
            children: (
                <div>
                    {/* Course progress component */}
                </div>
            )
        }
    ];

    return <Tabs items={items} />;
};
