import React from 'react';
import { Card, Statistic } from 'antd';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    prefix?: string | React.ReactNode;
    suffix?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, prefix, suffix }) => (
    <Card bordered={false} className="h-full">
        <div className="flex items-center justify-between">
            <div style={{ color }} className="text-2xl">
                {icon}
            </div>
            <Statistic
                title={title}
                value={value}
                prefix={prefix}
                suffix={suffix}
                valueStyle={{ color }}
            />
        </div>
    </Card>
);
