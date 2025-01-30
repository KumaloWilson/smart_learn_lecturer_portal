import { Form, Select, Input, DatePicker } from 'antd';
import { CourseFilters } from '../../models/course_filter';

interface CourseFiltersProps {
    onFiltersChange: (filters: CourseFilters) => void;
}

export const CourseFiltersComp: React.FC<CourseFiltersProps> = ({ onFiltersChange }) => (
    <Form layout="inline" className="mb-4">
        <Form.Item name="semester">
            <Select
                placeholder="Semester"
                style={{ width: 120 }}
                options={[
                    { label: 'Semester 1', value: '1' },
                    { label: 'Semester 2', value: '2' }
                ]}
                onChange={(value) => onFiltersChange({ semester: value })}
            />
        </Form.Item>
        <Form.Item name="academicYear">
            <DatePicker.YearPicker
                placeholder="Academic Year"
                onChange={(value) => onFiltersChange({ academicYear: value?.toString() })}
            />
        </Form.Item>
        <Form.Item name="search">
            <Input.Search
                placeholder="Search courses..."
                onSearch={(value) => onFiltersChange({ search: value })}
            />
        </Form.Item>
    </Form>
);