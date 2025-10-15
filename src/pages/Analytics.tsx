import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, AlertTriangle, Download, Calendar } from 'lucide-react';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock data
  const weeklyData = [
    { day: 'Mon', attendance: 87, students: 65 },
    { day: 'Tue', attendance: 92, students: 65 },
    { day: 'Wed', attendance: 85, students: 65 },
    { day: 'Thu', attendance: 90, students: 65 },
    { day: 'Fri', attendance: 88, students: 65 },
  ];

  const classData = [
    { name: 'Data Structures', avgAttendance: 89 },
    { name: 'Operating Systems', avgAttendance: 92 },
    { name: 'DBMS', avgAttendance: 87 },
    { name: 'Networks', avgAttendance: 85 },
  ];

  const attendanceDistribution = [
    { name: '90-100%', value: 45, color: 'hsl(var(--success))' },
    { name: '80-90%', value: 28, color: 'hsl(var(--primary))' },
    { name: '70-80%', value: 18, color: 'hsl(var(--warning))' },
    { name: 'Below 70%', value: 9, color: 'hsl(var(--destructive))' },
  ];

  const absentees = [
    { name: 'John Doe', rollNumber: 'CS21001', percentage: 65, missedClasses: 12 },
    { name: 'Jane Smith', rollNumber: 'CS21002', percentage: 68, missedClasses: 10 },
    { name: 'Mike Johnson', rollNumber: 'CS21003', percentage: 70, missedClasses: 9 },
    { name: 'Sarah Williams', rollNumber: 'CS21004', percentage: 72, missedClasses: 8 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Analytics & Insights
            </h1>
            <p className="text-muted-foreground">
              Comprehensive attendance reports and student engagement metrics
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overall Attendance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">88.6%</div>
              <p className="text-xs text-success mt-1">+2.3% from last week</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Students
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">228/250</div>
              <p className="text-xs text-muted-foreground mt-1">91.2% attendance rate</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 border-warning/50 bg-warning/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                At-Risk Students
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9</div>
              <p className="text-xs text-warning mt-1">Below 70% attendance</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Attendance Trends</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="classes">Class-wise</TabsTrigger>
            <TabsTrigger value="absentees">Frequent Absentees</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Weekly Attendance Trend</CardTitle>
                <CardDescription>
                  Attendance percentage over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Attendance Distribution</CardTitle>
                <CardDescription>
                  Student distribution across attendance ranges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={attendanceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={120}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {attendanceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Class-wise Attendance</CardTitle>
                <CardDescription>
                  Average attendance percentage by class
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={classData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="avgAttendance"
                      fill="hsl(var(--secondary))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="absentees" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Frequent Absentees
                </CardTitle>
                <CardDescription>
                  Students with concerning attendance patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {absentees.map((student, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-warning/10">
                          <Users className="h-5 w-5 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className={
                            student.percentage < 70
                              ? 'bg-destructive/20 text-destructive'
                              : 'bg-warning/20 text-warning'
                          }
                        >
                          {student.percentage}%
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {student.missedClasses} classes missed
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
