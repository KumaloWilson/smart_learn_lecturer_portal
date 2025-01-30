import React from 'react';
import {
    UserOutlined,
    BookOutlined,
    FormOutlined,
    VideoCameraOutlined,
    TeamOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { Row, Col, Card, Spin, Empty } from 'antd';
import { ActivityChart } from '../../components/dashboard/activity_chart';
import { CourseProgressList } from '../../components/dashboard/course_progress';
import { StatCard } from '../../components/dashboard/stat_card';
import { TaskList } from '../../components/dashboard/task_list';
import { useDashboardData } from '../../hooks/dashboard/use_dashboard';

const LecturerDashboard: React.FC = () => {
    const { stats, courses, tasks, activities, isLoading } = useDashboardData();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spin size="large" />
            </div>
        );
    }

    if (!stats || !courses || !tasks || !activities) {
        return <Empty />;
    }

    return (
        <div className="space-y-6">
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <StatCard
                        title="Total Students"
                        value={stats.totalStudents}
                        icon={<UserOutlined />}
                        color="#1890ff"
                    />
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <StatCard
                        title="Active Courses"
                        value={stats.activeCourses}
                        icon={<BookOutlined />}
                        color="#52c41a"
                    />
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <StatCard
                        title="Pending Tasks"
                        value={stats.pendingAssignments}
                        icon={<FormOutlined />}
                        color="#faad14"
                    />
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <StatCard
                        title="Upcoming Meetings"
                        value={stats.upcomingMeetings}
                        icon={<VideoCameraOutlined />}
                        color="#722ed1"
                    />
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <StatCard
                        title="Avg. Attendance"
                        value={stats.averageAttendance}
                        icon={<TeamOutlined />}
                        color="#13c2c2"
                        suffix="%"
                    />
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <StatCard
                        title="Avg. Performance"
                        value={stats.averagePerformance}
                        icon={<CheckCircleOutlined />}
                        color="#eb2f96"
                        suffix="%"
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Course Progress" className="h-full">
                        <CourseProgressList courses={courses} />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Upcoming Tasks" className="h-full">
                        <TaskList tasks={tasks} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24}>
                    <ActivityChart activities={activities} />
                </Col>
            </Row>
        </div>
    );
};

export default LecturerDashboard;