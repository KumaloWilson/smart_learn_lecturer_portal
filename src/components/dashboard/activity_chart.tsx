import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StudentActivity } from '../../models/dashboard_types';

interface ActivityChartProps {
    activities: StudentActivity[];
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ activities }) => (
    <Card title="Student Activity Overview">
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={activities}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1890ff" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </Card>
);
