import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateQrCode, addLiveStudent, endSession } from '@/store/slices/attendanceSlice';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import QRGenerator from '@/components/QRGenerator';
import AttendanceList from '@/components/AttendanceList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle2, XCircle, Clock, Download, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import socketService from '@/services/socket';

const AttendanceMonitor = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentSession, selectedClass, liveStudents } = useAppSelector((state) => state.attendance);
  const { token } = useAppSelector((state) => state.auth);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  useEffect(() => {
    if (!currentSession || !selectedClass) {
      navigate('/dashboard');
      return;
    }

    // Connect to socket
    if (token) {
      socketService.connect(token);

      // Listen for student attendance events
      socketService.on('student-marked-present', (data) => {
        const student = {
          id: data.studentId,
          name: data.name,
          rollNumber: data.rollNumber,
          email: data.email,
          markedAt: new Date().toISOString(),
          status: 'present' as const,
        };
        dispatch(addLiveStudent(student));
        toast.success(`${data.name} marked present!`);
      });
    }

    return () => {
      socketService.off('student-marked-present');
    };
  }, [currentSession, selectedClass, token, dispatch, navigate]);

  useEffect(() => {
    const present = liveStudents.filter((s) => s.status === 'present').length;
    const absent = liveStudents.filter((s) => s.status === 'absent').length;
    setPresentCount(present);
    setAbsentCount(absent);
  }, [liveStudents]);

  const handleEndSession = useCallback(() => {
    dispatch(endSession());
    socketService.disconnect();
    toast.success('Attendance session ended');
    navigate('/analytics');
  }, [dispatch, navigate]);

  const handleExport = useCallback(() => {
    toast.success('Attendance exported successfully!');
  }, []);

  if (!currentSession || !selectedClass) {
    return null;
  }

  const attendancePercentage = selectedClass.totalStudents > 0
    ? Math.round((presentCount / selectedClass.totalStudents) * 100)
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Live Attendance
            </h1>
            <p className="text-muted-foreground">
              {selectedClass.name} - {selectedClass.course} (Section {selectedClass.section})
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleEndSession} variant="destructive" size="sm">
              <StopCircle className="h-4 w-4 mr-2" />
              End Session
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedClass.totalStudents}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Present
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{presentCount}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Absent
              </CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {selectedClass.totalStudents - presentCount}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Attendance %
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendancePercentage}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* QR Code Section */}
          <div className="lg:col-span-1">
            <QRGenerator sessionId={currentSession.id} />
          </div>

          {/* Live Attendance List */}
          <div className="lg:col-span-2">
            <AttendanceList students={liveStudents} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceMonitor;
