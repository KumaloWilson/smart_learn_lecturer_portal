import React, { useState } from 'react';
import { Tabs, Drawer, Form, message } from 'antd';
import { useVirtualClassesManagement } from '../../hooks/virtual_classes/hook';
import { ClassScheduler } from '../../components/virtual_classes/virtual_class';
import { virtualClassesAPI } from '../../services/virtual_classes/api';
import { ClassFormValues, VirtualClassForm } from '../../components/virtual_classes/virtual_class_form';
import { VirtualClassHeader } from '../../components/virtual_classes/class_tabs';

const { TabPane } = Tabs;

export const VirtualClasses: React.FC<{ lecturerId: string }> = ({ lecturerId }) => {
    const {
        courseTopics,
        lecturerCourses,
        selectedCourse,
        setSelectedCourse,
    } = useVirtualClassesManagement(lecturerId);

    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [form] = Form.useForm<ClassFormValues>();
    const [activeTab, setActiveTab] = useState<string>('all');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCourseChange = (courseId: string) => {
        setSelectedCourse(courseId);
        form.setFieldsValue({ topic_id: undefined });
    };

    const handleCreateClass = async (values: ClassFormValues) => {
        try {
            setIsSubmitting(true);
            const [startTime, endTime] = values.timeRange;

            const classData = {
                course_id: values.course_id,
                topic_id: values.topic_id,
                title: values.title,
                description: values.description?.trim() || '',
                start_time: startTime.toDate(),
                end_time: endTime.toDate(),
                created_by: lecturerId,
                is_recurring: values.isRecurring || false,
                recurrence_pattern: values.recurrencePattern
            };

            await virtualClassesAPI.createClass(classData);
            message.success('Virtual class scheduled successfully');
            setIsDrawerVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Failed to schedule virtual class');
            console.error('Error creating virtual class:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <VirtualClassHeader onNewClass={() => setIsDrawerVisible(true)} />

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
                open={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
                width={500}
                footer={null}
            >
                <VirtualClassForm
                    form={form}
                    isSubmitting={isSubmitting}
                    lecturerCourses={lecturerCourses}
                    courseTopics={courseTopics}
                    selectedCourse={selectedCourse}
                    onCourseChange={handleCourseChange}
                    onFinish={handleCreateClass}
                />
            </Drawer>
        </div>
    );
};