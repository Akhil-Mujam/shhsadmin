import React from 'react'
import Circular from './Admin/Components/Circular'
import MarksUpload from './Teacher/Component/MarksUpload'
import Unauthorized from './Common/Unauthorized'
import LoginPage from './Auth/Login'
import Logout from './Auth/Logout'
import DashboardLayout from './Common/DashboardLayout'
import ProtectedRoute from './Common/ProtectedRoute'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./Context/UserContext";
import Notifications from './Admin/Components/Notifications'
import StudentDetails from './Admin/Components/StudentDetails'
import TeacherDetails from './Admin/Components/TeacherDetails'
import AttendanceUpload from './Teacher/Component/AttendanceUpload'
import ViewMarks from './Teacher/Component/ViewMarks'
import ViewAttendance from './Teacher/Component/ViewAttendance'
import ViewStudentAttendance from './Student/Components/ViewStudentAttendance'
import ViewStudentAttendanceByTeacher from './Teacher/Component/ViewStudentAttendanceByCTeacher'
import StudentMarks from './Student/Components/StudentMarks'


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            {/* Public Routes  for all dev3elopment*/}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/logout" element={<Logout />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Admin Routes */}
              <Route
                path="notifications"
                element={
                  <ProtectedRoute requiredRole={["Admin"]}>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="student-details"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <StudentDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="teacher-details"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <TeacherDetails />
                  </ProtectedRoute>
                }
              />
             <Route
              path="circular"
              element={
                <ProtectedRoute requiredRole={["Admin", "ClassTeacher"]}>
                  <Circular />
                </ProtectedRoute>
              }
            />

              {/* Teacher Routes */}
              <Route
                path="attendance-upload"
                element={
                  <ProtectedRoute requiredRole="Teacher">
                    <AttendanceUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="marks-upload"
                element={
                  <ProtectedRoute requiredRole="Teacher">
                    <MarksUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="view-marks"
                element={
                  <ProtectedRoute requiredRole="Teacher">
                    <ViewMarks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="view-attendance"
                element={
                  <ProtectedRoute requiredRole="Teacher">
                    <ViewAttendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="view-CT-attendance"
                element={
                  <ProtectedRoute requiredRole="Teacher">
                    <ViewStudentAttendanceByTeacher/>
                  </ProtectedRoute>
                }
              />

              {/* <Route
                path="*"
                element={
                  <ProtectedRoute requiredRole="ClassTeacher">
                    <Routes>
                      <Route path="attendance-upload" element={<AttendanceUpload />} />
                      <Route path="marks-upload" element={<MarksUpload />} />
                      <Route path="view-marks" element={<ViewMarks />} />
                      <Route path="view-attendance" element={<ViewAttendance />} />
                      <Route path="view-CT-attendance" element={<ViewStudentAttedanceByCTeacher />} />
                    </Routes>
                  </ProtectedRoute>
                }
              /> */}

              {/* Student Routes */}
              <Route
                path="view-student-attendance"
                element={
                  <ProtectedRoute requiredRole="Student">
                    <ViewStudentAttendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="Student-Marks"
                element={
                  <ProtectedRoute requiredRole="Student">
                    <StudentMarks />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Unauthorized />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
