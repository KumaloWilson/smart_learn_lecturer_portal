import React, {useEffect} from 'react';
import {Form, Select, Modal} from 'antd';
import {CourseTopic} from "../../models/course_topic.ts";
import {LecturerCourseAssignmentDetails} from "../../models/lecturer_courses.ts";
import {Quiz} from "../../models/quiz.ts";

interface QuizFormProps {
    visible: boolean,
    onCancel: () => void,
    onSubmit: (values: Partial<Quiz>) => Promise<void>,
    initialValues?: Partial<Quiz>,
    lecturerCourses: LecturerCourseAssignmentDetails[],
    courseTopics: CourseTopic[],
    selectedCourse: string,
    onCourseChange: (courseId: string) => void,
}

export const QuizForm: React.FC<QuizFormProps> = ({
                                                      visible,
                                                      onCancel,
                                                      onSubmit,
                                                      lecturerCourses,
                                                      courseTopics,
                                                      selectedCourse,
                                                      onCourseChange,
                                                      initialValues
                                                  }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [visible, initialValues, form]);

    return (
        <Modal
            title={initialValues ? "Edit Quiz" : "Create Quiz"}
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                initialValues={initialValues}
            >
                <Form.Item
                    name="course_id"
                    label="Course"
                    rules={[{required: true}]}
                >
                    <Select
                        placeholder="Select course"
                        onChange={onCourseChange}
                    >
                        {lecturerCourses.map(course => (
                            <Select.Option key={course.course_id} value={course.course_id}>
                                {course.course_name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="subtopic"
                    label="Topic"
                    rules={[{required: true}]}
                >
                    <Select placeholder="Select topic">
                        {courseTopics.map(topic => (
                            <Select.Option key={topic.topic_id} value={topic.topic_name}>
                                {topic.topic_name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Add other form fields */}
            </Form>
        </Modal>
    );
};

