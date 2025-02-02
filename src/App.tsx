import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {
  DashboardOutlined,
  BookOutlined,
  FormOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MessageOutlined,
  BellOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
  FolderOutlined
} from "@ant-design/icons";
import { Layout, Menu, theme, Spin } from "antd";
import type { MenuProps } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";
import { useAuth } from "./hooks/auth/auth";
import LoginPage from "./views/auth/login_page";
import ProfileHeader from "./components/profile/profile_header";
import LecturerDashboard from "./views/dashboard/dashboard";
import CourseManagement from "./views/my_courses/my_courses";
import QuizList from "./views/quiz/quiz_list.tsx";

const queryClient = new QueryClient();
const { Content, Footer, Sider } = Layout;

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [breadcrumbItems, setBreadcrumbItems] = useState(['Lecturer Portal', 'Dashboard']);
  const { loading, lecturer } = useAuth();

  const items: MenuProps["items"] = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard"
    },
    {
      key: "courses",
      label: "Course Management",
      icon: <BookOutlined />,
      children: [
        { key: "mycourses", label: "My Courses", icon: <FolderOutlined /> },
        { key: "materials", label: "Course Materials", icon: <FileTextOutlined /> },
        { key: "schedule", label: "Class Schedule", icon: <CalendarOutlined /> }
      ]
    },
    {
      key: "assessments",
      icon: <FormOutlined />,
      label: "Assessments",
      children: [
        { key: "quizzes", label: "Quizzes & Tests", icon: <EditOutlined /> },
        { key: "assignments", label: "Assignments", icon: <FileTextOutlined /> },
        { key: "grading", label: "Grading", icon: <CheckCircleOutlined /> },
        { key: "exambank", label: "Question Bank", icon: <FolderOutlined /> }
      ]
    },
    {
      key: "students",
      icon: <TeamOutlined />,
      label: "Student Management",
      children: [
        { key: "attendance", label: "Attendance", icon: <ClockCircleOutlined /> },
        { key: "progress", label: "Student Progress", icon: <BarChartOutlined /> },
        { key: "feedback", label: "Provide Feedback" },
        { key: "groups", label: "Student Groups" }
      ]
    },
    {
      key: "communication",
      icon: <MessageOutlined />,
      label: "Communication",
      children: [
        { key: "announcements", label: "Announcements" },
        { key: "messages", label: "Messages" },
        { key: "forums", label: "Discussion Forums" }
      ]
    },
    {
      key: "virtual",
      icon: <VideoCameraOutlined />,
      label: "Virtual Classes",
      children: [
        { key: "meetings", label: "Schedule Meeting" },
        { key: "recordings", label: "Recordings" },
        { key: "resources", label: "Online Resources" }
      ]
    },
    {
      key: "reports",
      icon: <BarChartOutlined />,
      label: "Reports & Analytics",
      children: [
        { key: "performance", label: "Class Performance" },
        { key: "statistics", label: "Course Statistics" },
        { key: "analytics", label: "Learning Analytics" }
      ]
    },
    {
      key: "notifications",
      icon: <BellOutlined />,
      label: "Notifications"
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile"
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings"
    },
    {
      key: "help",
      icon: <QuestionCircleOutlined />,
      label: "Help & Support"
    }
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const MainContent: React.FC = () => {

    console.log(lecturer);

    const contentMap: Record<string, React.ReactNode> = {
      dashboard: <LecturerDashboard />,
      mycourses: <CourseManagement />,
      materials: <div>CourseManagement</div>,
      schedule: <div>ClassSchedule </div>,
      quizzes: <QuizList lecturerId={lecturer!.lecturer_id!}/>,
      assignments: <div>AssignmentManagement</div>,
      grading: <div>GradingDashboard </div>,
      exambank: <div>QuestionBank </div>,
      attendance: <div>AttendanceTracker</div>,
      progress: <div>StudentProgress </div>,
      feedback: <div>FeedbackManagement</div>,
      groups: <div>StudentGroups </div>,
      announcements: <div>Announcements</div>,
      messages: <div>Messages</div>,
      forums: <div>Discussion Forums</div>,
      meetings: <div>VirtualMeetings</div>,
      recordings: <div>ClassRecordings</div>,
      performance: <div>PerformanceReports</div>,
      statistics: <div>CourseStatistics</div>,
      analytics: <div>LearningAnalytics</div>,
      notifications: <div>Notifications</div>,
      profile: <div>Profile</div>,
      settings: <div>Settings</div>,
      help: <div>HelpSupport</div>
    };

    return contentMap[selectedTab] || <Spin size="large" />;
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key, keyPath }) => {
    setSelectedTab(key);

    const newBreadcrumb = ["Lecturer Portal"];
    if (keyPath.length > 1) {
      const parentKey = keyPath[1];
      const parentItem = items.find((item) => item?.key === parentKey);
      if (parentItem && "label" in parentItem) {
        newBreadcrumb.push(parentItem.label as string);
      }
    }

    const selectedItem = items.find((item) => item?.key === key);
    if (selectedItem && "label" in selectedItem) {
      newBreadcrumb.push(selectedItem.label as string);
    }

    setBreadcrumbItems(newBreadcrumb);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout style={{ minHeight: "100vh" }}>
                  <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    style={{
                      overflow: 'auto',
                      height: '100vh',
                      position: 'fixed',
                      left: 0,
                      zIndex: 999
                    }}
                  >
                    <div className="flex justify-center items-center p-4">
                      <img
                        src="/src/assets/logo.jpeg"
                        alt="Lecturer"
                        className="w-20 h-20 rounded-full border-2 border-white"
                      />
                    </div>
                    <div className="text-white text-center py-2 font-semibold">
                      {!collapsed && "Lecturer Portal"}
                    </div>
                    <Menu
                      theme="dark"
                      defaultSelectedKeys={["dashboard"]}
                      mode="inline"
                      items={items}
                      onClick={handleMenuClick}
                      selectedKeys={[selectedTab]}
                    />
                  </Sider>
                  <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
                    <ProfileHeader breadcrumbItems={breadcrumbItems} />
                    <Content style={{ margin: "24px 16px 0", overflow: 'initial' }}>
                      <div style={{
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                        borderRadius: 8,
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                      }}>
                        <Routes>
                          <Route path="/dashboard" element={<MainContent />} />
                          <Route path="/courses/*" element={<MainContent />} />
                          <Route path="/assessments/*" element={<MainContent />} />
                          <Route path="/students/*" element={<MainContent />} />
                          <Route path="/communication/*" element={<MainContent />} />
                          <Route path="/virtual/*" element={<MainContent />} />
                          <Route path="/reports/*" element={<MainContent />} />
                          <Route path="/:tab" element={<MainContent />} />
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                      </div>
                    </Content>
                    <Footer style={{
                      textAlign: "center",
                      background: colorBgContainer
                    }}>
                      LearnSmart Lecturer Portal ©{new Date().getFullYear()}
                    </Footer>
                  </Layout>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;