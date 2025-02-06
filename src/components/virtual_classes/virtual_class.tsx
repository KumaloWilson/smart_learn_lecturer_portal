// components/class_scheduler.tsx
import React, { useState, useEffect } from 'react';
import { Card, List, Button, Tag } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import { VirtualClass } from '../../models/virtual_class';
import { virtualClassesAPI } from '../../services/virtual_classes/api';

interface ClassSchedulerProps {
    courseId: string | null;
}

export const ClassScheduler: React.FC<ClassSchedulerProps> = ({ courseId }) => {
    const [classes, setClasses] = useState<VirtualClass[]>([]);

    useEffect(() => {
        loadClasses();
    }, [courseId]);

    const loadClasses = async () => {
        try {
            const response = await virtualClassesAPI.getVirtualClassesByCourseId(courseId!);
            const classes = await response.data;
            setClasses(classes);
        } catch (error) {
            console.error('Failed to load classes:', error);
        }
    };

    const joinClass = (classItem: VirtualClass) => {
        // Navigate to LiveClass component with class details
        window.location.href = `/virtual/live/${classItem.id}`;
    };

    return (
        <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={classes}
            renderItem={classItem => (
                <List.Item>
                    <Card title={classItem.title}>
                        <p>{classItem.description}</p>
                        <p>
                            <strong>Time: </strong>
                            {new Date(classItem.start_time).toLocaleString()}
                        </p>
                        <Tag color={
                            classItem.status === 'scheduled' ? 'blue' :
                                classItem.status === 'in-progress' ? 'green' :
                                    classItem.status === 'completed' ? 'gray' : 'red'
                        }>
                            {classItem.status}
                        </Tag>
                        <Button
                            type="primary"
                            icon={<VideoCameraOutlined />}
                            onClick={() => joinClass(classItem)}
                            disabled={classItem.status === 'completed' || classItem.status === 'cancelled'}
                        >
                            Join Class
                        </Button>
                    </Card>
                </List.Item>
            )}
        />
    );
};