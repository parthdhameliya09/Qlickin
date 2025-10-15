import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { setClasses, selectClass, startSession } from '@/store/slices/attendanceSlice';
import { logout } from '@/store/slices/authSlice';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Calendar, TrendingUp, Clock, Activity } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { classes } = useAppSelector((state) => state.attendance);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Simulate fetching classes
    const mockClasses = [
      { id: '1', name: 'Data Structures', course: 'CSE-301', section: 'A', totalStudents: 65 },
      { id: '2', name: 'Operating Systems', course: 'CSE-401', section: 'B', totalStudents: 58 },
      { id: '3', name: 'Database Management', course: 'CSE-302', section: 'A', totalStudents: 72 },
      { id: '4', name: 'Computer Networks', course: 'CSE-402', section: 'C', totalStudents: 55 },
    ];

    setTimeout(() => {
      dispatch(setClasses(mockClasses));
      setLoading(false);
    }, 800);
  }, [user, dispatch, navigate]);

  const handleStartAttendance = (classData: any) => {
    dispatch(selectClass(classData));
    const newSession = {
      id: Date.now().toString(),
      classId: classData.id,
      date: new Date().toISOString(),
      startTime: new Date().toLocaleTimeString(),
      isActive: true,
      students: [],
    };
    dispatch(startSession(newSession));
    toast.success(`Started attendance for ${classData.name}`);
    navigate('/attendance');
  };

  const stats = [
    {
      title: 'Total Classes',
      value: classes.length.toString(),
      icon: BookOpen,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Total Students',
      value: classes.reduce((sum, c) => sum + c.totalStudents, 0).toString(),
      icon: Users,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      title: "Today's Sessions",
      value: '3',
      icon: Calendar,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Avg Attendance',
      value: '87%',
      icon: TrendingUp,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Start taking attendance for your classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
                ))
              ) : (
                classes.map((classData) => (
                  <Card
                    key={classData.id}
                    className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer group"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {classData.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {classData.course} - Section {classData.section}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-secondary/20">
                          <Users className="h-3 w-3 mr-1" />
                          {classData.totalStudents}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => handleStartAttendance(classData)}
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                        size="sm"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Start Attendance
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest attendance sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { class: 'Data Structures', time: '2 hours ago', attendance: '62/65', percentage: 95 },
                { class: 'Operating Systems', time: '1 day ago', attendance: '55/58', percentage: 95 },
                { class: 'Database Management', time: '2 days ago', attendance: '68/72', percentage: 94 },
              ].map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{session.class}</p>
                      <p className="text-sm text-muted-foreground">{session.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{session.attendance}</p>
                    <Badge
                      variant="secondary"
                      className={
                        session.percentage >= 90
                          ? 'bg-success/20 text-success'
                          : 'bg-warning/20 text-warning'
                      }
                    >
                      {session.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
