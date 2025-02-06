import React, { useState } from 'react';
import { Tabs, Button, Drawer, Form, Input, DatePicker, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useVirtualClassesManagement } from '../../hooks/virtual_classes/hook';
import { ClassScheduler } from '../../components/virtual_classes/virtual_class';
import { virtualClassesAPI } from '../../services/virtual_classes/api';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export const VirtualClasses: React.FC<{ lecturerId: string }> = ({ lecturerId }) => {
    const {
        courseTopics,
        lecturerCourses,
        selectedCourse,
        setSelectedCourse,
    } = useVirtualClassesManagement(lecturerId);

    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState<string>('all');

    // Handle course selection change
    const handleCourseChange = (courseId: string) => {
        setSelectedCourse(courseId); // Update the selected course ID
        form.setFieldsValue({ topic_id: undefined }); // Reset the topic dropdown
    };

    const handleCreateClass = async (values: any) => {
        try {
            const [startTime, endTime] = values.timeRange;
            const classData = {
                course_id: values.course_id,
                topic_id: values.topic_id,
                title: values.title,
                description: values.description,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                created_by: lecturerId,
                is_recurring: values.isRecurring,
                recurrence_pattern: values.recurrencePattern
            };

            await virtualClassesAPI.createClass(classData);

            message.success('Virtual class scheduled successfully');
            setIsDrawerVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Failed to schedule virtual class');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Virtual Classes</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsDrawerVisible(true)}
                >
                    Schedule New Class
                </Button>
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="All Classes" key="all">
                    <ClassScheduler courseId={null} />
                </TabPane>
                {lecturerCourses.map(course => (
                    <TabPane tab={course.course_name} key={course.course_id}>
                        <ClassScheduler courseId={course.course_id} />
                    </TabPane>
                ))}
            </Tabs>

            <Drawer
                title="Schedule Virtual Class"
                visible={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
                width={500}
                footer={null}
            >
                <Form form={form} onFinish={handleCreateClass} layout="vertical">
                    <Form.Item
                        name="course_id"
                        label="Course"
                        rules={[{ required: true }]}
                    >
                        <Select
                            onChange={handleCourseChange} // Trigger course change
                            placeholder="Select a course"
                        >
                            {lecturerCourses.map(course => (
                                <Select.Option key={course.course_id} value={course.course_id}>
                                    {course.course_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="topic_id"
                        label="Topic"
                        rules={[{ required: true }]}
                    >
                        <Select
                            placeholder="Select a topic"
                            disabled={!selectedCourse} // Disable if no course is selected
                        >
                            {courseTopics.map(topic => (
                                <Select.Option key={topic.topic_id} value={topic.topic_id}>
                                    {topic.topic_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        name="timeRange"
                        label="Class Time"
                        rules={[{ required: true }]}
                    >
                        <RangePicker showTime />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Schedule Class
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};