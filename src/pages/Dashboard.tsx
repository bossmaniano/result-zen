import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  ClipboardList,
  TrendingUp,
  School,
  MessageSquare,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'administrator':
        return <AdministratorDashboard />;
      case 'head_teacher':
        return <HeadTeacherDashboard />;
      case 'class_teacher':
      case 'subject_teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {getDashboardContent()}
    </DashboardLayout>
  );
};

const AdministratorDashboard = () => {
  const quickActions = [
    {
      title: 'Create User Account',
      description: 'Generate secure credentials for teachers and students',
      icon: Users,
      href: '/create-account',
      variant: 'highlight' as const
    },
    {
      title: 'School Setup',
      description: 'Configure school information and settings',
      icon: School,
      href: '/school-setup',
      variant: 'academic' as const
    },
    {
      title: 'Manage Classes',
      description: 'Create and organize classes and subjects',
      icon: Users,
      href: '/classes',
      variant: 'success' as const
    },
    {
      title: 'Student Records',
      description: 'Add and manage student information',
      icon: GraduationCap,
      href: '/students',
      variant: 'default' as const
    },
    {
      title: 'Assessment Setup',
      description: 'Create assessment types and manage scoring',
      icon: ClipboardList,
      href: '/assessments',
      variant: 'default' as const
    }
  ];

  const stats = [
    { label: 'Total Classes', value: '12', change: '+2', icon: Users },
    { label: 'Total Students', value: '480', change: '+15', icon: GraduationCap },
    { label: 'Subjects Offered', value: '8', change: '0', icon: BookOpen },
    { label: 'Active Assessments', value: '24', change: '+3', icon: ClipboardList },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Administrator Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your school's Grade 9 results system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="flex items-center p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    {stat.change !== '0' && (
                      <p className="text-xs text-green-600 font-medium">
                        {stat.change} this month
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.title} className="shadow-card hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </div>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant={action.variant} className="w-full" asChild>
                    <a href={action.href}>Get Started</a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm">New class "9A" created successfully</p>
              <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm">15 new students added to Grade 9</p>
              <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <p className="text-sm">Mathematics assessment scores updated</p>
              <span className="text-xs text-muted-foreground ml-auto">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const HeadTeacherDashboard = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Head Teacher Dashboard</h2>
      <p className="text-muted-foreground">
        Overview of school performance and management
      </p>
    </div>
    <Card className="shadow-card">
      <CardContent className="p-6">
        <p>Head Teacher dashboard content coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const TeacherDashboard = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
      <p className="text-muted-foreground">
        Manage your classes and assessments
      </p>
    </div>
    <Card className="shadow-card">
      <CardContent className="p-6">
        <p>Teacher dashboard content coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const StudentDashboard = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
      <p className="text-muted-foreground">
        View your results and academic pathway
      </p>
    </div>
    <Card className="shadow-card">
      <CardContent className="p-6">
        <p>Student dashboard content coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const DefaultDashboard = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground">
        Welcome to the Grade 9 Results System
      </p>
    </div>
    <Card className="shadow-card">
      <CardContent className="p-6">
        <p>Please contact your administrator for access.</p>
      </CardContent>
    </Card>
  </div>
);

export default Dashboard;