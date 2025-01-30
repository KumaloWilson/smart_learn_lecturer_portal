import React, { useState, } from 'react';
import { Row, Col, Modal, Empty, Spin } from 'antd';
import { useQuery } from 'react-query';
import { CourseCard } from '../../components/course/card';
import { CourseDetailsTabs } from '../../components/course/details';
import { CourseFilters as CourseFiltersType } from '../../models/course_filter';
import { LecturerCourseAssignmentDetails } from '../../models/lecturer_courses';
import { CourseManagementService } from '../../services/course_service/api';
import { CourseFiltersComp } from '../../components/course/filters';
import { useAuth } from '../../hooks/auth/auth';

const CourseManagement: React.FC = () => {
    const [filters, setFilters] = useState<CourseFiltersType>({});
    const [selectedCourse, setSelectedCourse] = useState<LecturerCourseAssignmentDetails | null>(null);
    const { lecturer } = useAuth();

    const { data: courses, isLoading } = useQuery(
        ['lecturerCourses', lecturer?.lecturer_id, filters],
        () => CourseManagementService.getLecturerCourses(lecturer!.lecturer_id)
    );

    if (isLoading) {
        return <Spin size="large" />;
    }

    return (
        <div className="space-y-6">
            <CourseFiltersComp onFiltersChange={setFilters} />

            {courses?.length === 0 ? (
                <Empty description="No courses found" />
            ) : (
                <Row gutter={[16, 16]}>
                    {courses?.map((course) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={course.assignment_id}>
                            <CourseCard
                                course={course}
                                onClick={(course) => setSelectedCourse(course)}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            <Modal
                title={selectedCourse?.course_name}
                open={!!selectedCourse}
                onCancel={() => setSelectedCourse(null)}
                width={800}
                footer={null}
            >
                {selectedCourse && <CourseDetailsTabs course={selectedCourse} />}
            </Modal>
        </div>
    );
};

export default CourseManagement;