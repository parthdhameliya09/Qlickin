import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { updateStudentStatus } from '@/store/slices/attendanceSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, CheckCircle2, XCircle, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  markedAt?: string;
  status: 'present' | 'absent';
}

interface AttendanceListProps {
  students: Student[];
}

const AttendanceList = ({ students }: AttendanceListProps) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (studentId: string, currentStatus: 'present' | 'absent') => {
    const newStatus = currentStatus === 'present' ? 'absent' : 'present';
    dispatch(updateStudentStatus({ id: studentId, status: newStatus }));
    toast.success(`Status updated to ${newStatus}`);
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card className="border-border/50 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Live Attendance List
        </CardTitle>
        <CardDescription>
          {students.length} student{students.length !== 1 ? 's' : ''} marked present
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Student List */}
        <ScrollArea className="flex-1 pr-4">
          {filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-muted mb-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium mb-1">
                {students.length === 0 ? 'Waiting for students' : 'No students found'}
              </p>
              <p className="text-sm text-muted-foreground">
                {students.length === 0
                  ? 'Students will appear here as they scan the QR code'
                  : 'Try a different search term'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student, index) => (
                <div
                  key={student.id}
                  className="
                    group flex items-center justify-between p-4 rounded-lg 
                    border border-border/50 hover:border-primary/50 
                    bg-gradient-to-r from-transparent to-transparent
                    hover:from-primary/5 hover:to-secondary/5
                    transition-all duration-300
                    animate-in slide-in-from-top-2
                  "
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{student.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{student.rollNumber}</span>
                        {student.markedAt && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {getTimeAgo(student.markedAt)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={
                        student.status === 'present'
                          ? 'bg-success/20 text-success border-success/30'
                          : 'bg-destructive/20 text-destructive border-destructive/30'
                      }
                    >
                      {student.status === 'present' ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Present
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Absent
                        </>
                      )}
                    </Badge>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleToggleStatus(student.id, student.status)}
                    >
                      Toggle
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Summary */}
        {students.length > 0 && (
          <div className="pt-4 border-t border-border/50">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="text-2xl font-bold text-success">
                  {students.filter(s => s.status === 'present').length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Present</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                <div className="text-2xl font-bold">
                  {students.filter(s => s.status === 'absent').length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Absent</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceList;
