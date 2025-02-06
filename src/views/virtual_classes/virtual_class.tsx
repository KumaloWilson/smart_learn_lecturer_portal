import React, { useState, } from 'react';
import { Tabs, Button, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useVirtualClassesManagement } from '../../hooks/virtual_classes/hook';
import { ClassScheduler } from '../../components/virtual_classes/virtual_class';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export const VirtualClasses: React.FC<{ lecturerId: string }> = ({ lecturerId }) => {
    const {
        lecturerCourses,
    } = useVirtualClassesManagement(lecturerId);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState<string>('all');

    const handleCreateClass = async (values: any) => {
        try {
            const [startTime, endTime] = values.timeRange;
            const classData = {
                course_id: values.courseId,
                topic_id: values.topicId,
                title: values.title,
                description: values.description,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                created_by: lecturerId,
                is_recurring: values.isRecurring,
                recurrence_pattern: values.recurrencePattern
            };

            // Call API to create class
            await fetch('/api/virtual/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(classData)
            });

            message.success('Virtual class scheduled successfully');
            setIsModalVisible(false);
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
                    onClick={() => setIsModalVisible(true)}
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

            <Modal
                title="Schedule Virtual Class"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleCreateClass} layout="vertical">
                    <Form.Item
                        name="courseId"
                        label="Course"
                        rules={[{ required: true }]}
                    >
                        <Select>
                            {lecturerCourses.map(course => (
                                <Select.Option key={course.course_id} value={course.course_id}>
                                    {course.course_name}
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
            </Modal>
        </div>
    );
};

