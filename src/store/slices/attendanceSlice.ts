import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  markedAt?: string;
  status: 'present' | 'absent';
}

interface Class {
  id: string;
  name: string;
  course: string;
  section: string;
  totalStudents: number;
}

interface AttendanceSession {
  id: string;
  classId: string;
  date: string;
  startTime: string;
  isActive: boolean;
  qrCode?: string;
  students: Student[];
}

interface AttendanceState {
  classes: Class[];
  selectedClass: Class | null;
  currentSession: AttendanceSession | null;
  sessions: AttendanceSession[];
  liveStudents: Student[];
}

const initialState: AttendanceState = {
  classes: [],
  selectedClass: null,
  currentSession: null,
  sessions: [],
  liveStudents: [],
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setClasses: (state, action: PayloadAction<Class[]>) => {
      state.classes = action.payload;
    },
    selectClass: (state, action: PayloadAction<Class>) => {
      state.selectedClass = action.payload;
    },
    startSession: (state, action: PayloadAction<AttendanceSession>) => {
      state.currentSession = action.payload;
    },
    updateQrCode: (state, action: PayloadAction<string>) => {
      if (state.currentSession) {
        state.currentSession.qrCode = action.payload;
      }
    },
    addLiveStudent: (state, action: PayloadAction<Student>) => {
      const exists = state.liveStudents.find(s => s.id === action.payload.id);
      if (!exists) {
        state.liveStudents.unshift(action.payload);
      }
    },
    updateStudentStatus: (state, action: PayloadAction<{ id: string; status: 'present' | 'absent' }>) => {
      const student = state.liveStudents.find(s => s.id === action.payload.id);
      if (student) {
        student.status = action.payload.status;
      }
    },
    endSession: (state) => {
      if (state.currentSession) {
        state.sessions.unshift(state.currentSession);
        state.currentSession = null;
        state.liveStudents = [];
      }
    },
    clearLiveStudents: (state) => {
      state.liveStudents = [];
    },
  },
});

export const {
  setClasses,
  selectClass,
  startSession,
  updateQrCode,
  addLiveStudent,
  updateStudentStatus,
  endSession,
  clearLiveStudents,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
