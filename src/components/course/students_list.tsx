import React, { useState } from 'react';
import { Table, Tag, Space, Button, Tooltip, Input, Progress } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { StudentCourseEnrollmentDetails } from '../../models/student_course_enrollment';
import { CourseManagementService } from '../../services/course_service/api';
interface StudentsListProps {
    courseId: string;
}

export const StudentsList: React.FC<StudentsListProps> = ({ courseId }) => {
    const [searchText, setSearchText] = useState('');

    const { data: students, isLoading } = useQuery<StudentCourseEnrollmentDetails[]>(
        ['courseStudents', courseId],
        () => CourseManagementService.getCourseStudents(courseId)
    );

    const getAttendanceColor = (percentage?: number) => {
        if (!percentage) return 'normal';
        if (percentage >= 80) return 'success';
        if (percentage >= 60) return 'normal';
        return 'exception';
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            enrolled: 'green',
            withdrawn: 'red',
            completed: 'blue',
            failed: 'orange'
        };
        return colors[status] || 'default';
    };

    const columns: ColumnsType<StudentCourseEnrollmentDetails> = [
        {
            title: 'Student',
            dataIndex: 'registration_number',
            key: 'registration_number',
            render: (_, record) => (
                <Space>
                    <UserOutlined />
                    <div>
                        <div>{`${record.first_name} ${record.middle_name || ''} ${record.last_name}`}</div>
                        <div className="text-xs text-gray-500">{record.registration_number}</div>
                    </div>
                </Space>
            ),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search student"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                        >
                            Search
                        </Button>
                        <Button onClick={() => clearFilters?.()} size="small">
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: filtered => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Attendance',
            key: 'attendance',
            render: (_, record) => (
                <Tooltip title={`${record.attendance_percentage || 0}% Attendance`}>
                    <Progress
                        percent={record.attendance_percentage || 0}
                        size="small"
                        status={getAttendanceColor(record.attendance_percentage)}
                        className="w-24"
                    />
                </Tooltip>
            )
        },
        {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
            render: (grade) => grade || 'N/A'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Tag>
            ),
            filters: [
                { text: 'Enrolled', value: 'enrolled' },
                { text: 'Withdrawn', value: 'withdrawn' },
                { text: 'Completed', value: 'completed' },
                { text: 'Failed', value: 'failed' }
            ],
            onFilter: (value, record) => record.status === value
        },
        {
            title: 'Retake',
            dataIndex: 'is_retake',
            key: 'is_retake',
            render: (isRetake) => (
                isRetake ?
                    <CheckCircleOutlined className="text-green-500" /> :
                    <CloseCircleOutlined className="text-gray-400" />
            )
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Input
                    placeholder="Search students..."
                    prefix={<SearchOutlined />}
                    className="w-64"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Space>
                    <Button type="primary">Export List</Button>
                    <Button>Manage Attendance</Button>
                </Space>
            </div>

            <Table<StudentCourseEnrollmentDetails>
                columns={columns}
                dataSource={students}
                loading={isLoading}
                rowKey="enrollment_id"
                pagination={{
                    total: students?.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} students`
                }}
                scroll={{ x: true }}
                expandable={{
                    expandedRowRender: (record) => (
                        <div className="p-4 space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">Recent Attendance</h4>
                                <div className="space-y-2">
                                    {record.attendance_records.slice(0, 5).map((record) => (
                                        <div key={record.attendance_id} className="flex justify-between items-center">
                                            <span>{new Date(record.class_date).toLocaleDateString()}</span>
                                            <Tag color={record.status === 'present' ? 'green' : 'red'}>
                                                {record.status.toUpperCase()}
                                            </Tag>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">Progress Overview</h4>
                                <div className="space-y-2">
                                    {record.progress_records.map((progress) => (
                                        <div key={progress.progress_id} className="flex justify-between items-center">
                                            <span>Mastery Level</span>
                                            <Progress
                                                percent={progress.mastery_level}
                                                size="small"
                                                className="w-48"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }}
            />
        </div>
    );
};