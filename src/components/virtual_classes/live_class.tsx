import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Alert, Button } from 'antd';
import { virtualClassesAPI } from '../../services/virtual_classes/api';
import type { VirtualClass } from '../../models/virtual_class';
import { JitsiMeeting } from './jitsi_meeting';

export const LiveClass: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();
    const [classData, setClassData] = useState<VirtualClass | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadClassData = async () => {
            try {
                if (!classId) {
                    throw new Error('Class ID is required');
                }

                const response = await virtualClassesAPI.getVirtualClassesByClassId(classId);
                const virtualClass = response.data;

                if (!virtualClass) {
                    throw new Error('Class not found');
                }

                // Check if class is active
                const now = new Date();
                const startTime = new Date(virtualClass.start_time);
                const endTime = new Date(virtualClass.end_time);

                if (now < startTime) {
                    throw new Error('Class has not started yet');
                }

                if (now > endTime) {
                    throw new Error('Class has ended');
                }

                if (virtualClass.status === 'cancelled') {
                    throw new Error('Class has been cancelled');
                }

                setClassData(virtualClass);

                // Update class status to in-progress if needed
                if (virtualClass.status === 'scheduled') {
                    await virtualClassesAPI.updateClassStatus(classId, 'in-progress');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadClassData();
    }, [classId]);

    const handleError = (error: Error) => {
        setError(error.message);
        // Optionally navigate back after a delay
        setTimeout(() => navigate('/virtual/classes'), 5000);
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                action={
                    <Button type="primary" onClick={() => navigate('/virtual/classes')}>
                        Back to Classes
                    </Button>
                }
            />
        );
    }

    if (!classData) {
        return (
            <Alert
                message="Error"
                description="Class data not found"
                type="error"
                showIcon
                action={
                    <Button type="primary" onClick={() => navigate('/virtual/classes')}>
                        Back to Classes
                    </Button>
                }
            />
        );
    }

    return (
        <JitsiMeeting
            roomName={`virtual-class-${classId}`}
            displayName="Lecturer" // You might want to pass this as a prop
            onError={handleError}
        />
    );
};