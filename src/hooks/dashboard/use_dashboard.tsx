import { useQuery } from 'react-query';
import { DashboardStats, CourseStats, UpcomingTask, StudentActivity } from '../../models/dashboard_types';

export const useDashboardData = () => {
    const { data: stats, isLoading: statsLoading } = useQuery('dashboardStats',
        () => Promise.resolve<DashboardStats>({
            totalStudents: 450,
            activeCourses: 6,
            pendingAssignments: 12,
            upcomingMeetings: 3,
            averageAttendance: 85,
            averagePerformance: 78
        })
    );

    const { data: courses, isLoading: coursesLoading } = useQuery('coursesStats',
        () => Promise.resolve<CourseStats[]>([
            {
                courseName: "Advanced Web Development",
                courseCode: "CS401",
                totalStudents: 120,
                averageGrade: 82,
                completionRate: 75
            },
            // Add more sample courses...
        ])
    );

    const { data: tasks, isLoading: tasksLoading } = useQuery('upcomingTasks',
        () => Promise.resolve<UpcomingTask[]>([
            {
                id: "1",
                title: "Grade Midterm Papers",
                dueDate: "2025-02-01",
                type: "assignment",
                courseCode: "CS401",
                priority: "high"
            },
            // Add more sample tasks...
        ])
    );

    const { data: activities, isLoading: activitiesLoading } = useQuery('studentActivities',
        () => Promise.resolve<StudentActivity[]>([
            { type: "Course Access", count: 2500, percentage: 85 },
            { type: "Assignment Submissions", count: 850, percentage: 75 },
            { type: "Forum Participation", count: 420, percentage: 45 },
            { type: "Quiz Attempts", count: 650, percentage: 68 }
        ])
    );

    return {
        stats,
        courses,
        tasks,
        activities,
        isLoading: statsLoading || coursesLoading || tasksLoading || activitiesLoading
    };
};
