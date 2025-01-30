import { List, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { UpcomingTask } from '../../models/dashboard_types';

interface TaskListProps {
    tasks: UpcomingTask[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => (
    <List
        itemLayout="horizontal"
        dataSource={tasks}
        renderItem={(task) => (
            <List.Item
                extra={
                    <Tag color={
                        task.priority === 'high' ? 'red' :
                            task.priority === 'medium' ? 'orange' : 'green'
                    }>
                        {task.priority}
                    </Tag>
                }
            >
                <List.Item.Meta
                    title={task.title}
                    description={
                        <div className="flex items-center gap-2">
                            <ClockCircleOutlined />
                            <span>{task.dueDate}</span>
                            <Tag>{task.courseCode}</Tag>
                            <Tag>{task.type}</Tag>
                        </div>
                    }
                />
            </List.Item>
        )}
    />
);
