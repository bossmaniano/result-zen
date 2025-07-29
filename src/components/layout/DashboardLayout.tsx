import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GraduationCap, 
  LogOut, 
  Users, 
  BookOpen, 
  BarChart3,
  Settings,
  School,
  ClipboardList,
  MessageSquare,
  UserCheck
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
    ];

    switch (user?.role) {
      case 'administrator':
        return [
          ...baseItems,
          { icon: School, label: 'School Setup', href: '/school-setup' },
          { icon: Users, label: 'Class Management', href: '/classes' },
          { icon: GraduationCap, label: 'Student Management', href: '/students' },
          { icon: ClipboardList, label: 'Assessments', href: '/assessments' },
          { icon: BarChart3, label: 'Reports', href: '/reports' },
          { icon: MessageSquare, label: 'Comments', href: '/comments' },
          { icon: Settings, label: 'System Settings', href: '/settings' },
        ];
      case 'head_teacher':
        return [
          ...baseItems,
          { icon: Users, label: 'Classes', href: '/classes' },
          { icon: GraduationCap, label: 'Students', href: '/students' },
          { icon: BarChart3, label: 'Reports', href: '/reports' },
          { icon: MessageSquare, label: 'Comments', href: '/comments' },
        ];
      case 'class_teacher':
      case 'subject_teacher':
        return [
          ...baseItems,
          { icon: Users, label: 'My Classes', href: '/my-classes' },
          { icon: ClipboardList, label: 'Assessments', href: '/assessments' },
          { icon: MessageSquare, label: 'Comments', href: '/comments' },
        ];
      case 'student':
        return [
          ...baseItems,
          { icon: BarChart3, label: 'My Results', href: '/my-results' },
          { icon: UserCheck, label: 'My Pathway', href: '/my-pathway' },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-gradient-primary shadow-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-primary-foreground">
                  Grade 9 Results System
                </h1>
                <p className="text-xs text-primary-foreground/80 capitalize">
                  {user?.role?.replace('_', ' ')} Dashboard
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-primary-foreground">{user?.name}</p>
                <p className="text-xs text-primary-foreground/80">{user?.email}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="w-full justify-start text-left"
                      asChild
                    >
                      <a href={item.href}>
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </a>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};