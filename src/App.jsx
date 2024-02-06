import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import ViewProfile from "./pages/Profile/Profile/ViewProfile";
import AuthenticationPublicLayout from "./layout/AuthenticationPublicLayout";
import ManagerLayout from "./layout/ManagerLayout";
import Login from "./pages/Auth/Login";
import ChangePassword from "./pages/Auth/ChangePassword";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import PublicLayout from "./layout/PublicLayout";
import JobDetailsPublic from "./pages/JobDesk/JobDetailsPublic";
import AllStudentStatus from "./pages/Student/StudentStatus/AllStudentStatus";
import AllStudents from "./pages/Student/AllStudents";
import AllStaffs from "./pages/Staff/AllStaffs";
import ViewStudent from "./pages/Student/ViewStudent";
import ViewStudentPublic from "./pages/Student/ViewStudentPublic";
import StudentVerification from "./pages/StudentVerification/StudentVerification";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* NOT FOUND PAGE (404) */}
        <Route path="*" element={<NotFound />} />

        {/* DASHBOARD ROUTES  */}
        <Route path="/" element={<ManagerLayout />}>
          {/* DASHBOARD  */}
          {/* <Route index element={<Dashboard />} /> */}

          {/* PROFILE  */}
          <Route path="profile" element={<ViewProfile />} />

          {/* STUDENTS  */}
          <Route index element={<AllStudents />} />
          {/* <Route path="student/all-students" element={<AllStudents />} /> */}
          <Route path="student/view/:encId" element={<ViewStudent />} />

          {/* STUDENT STATUS  */}
          <Route path="student-status" element={<AllStudentStatus />} />

          {/* STAFF  */}
          <Route path="staffs" element={<AllStaffs />} />

          {/* <Route path="stuff/all-staffs" element={<AllStaffs />} /> */}
        </Route>

        {/* PUBLIC ROUTES  */}
        <Route path="/public" element={<PublicLayout />}>
          {/* STUDENT VERIFICATION  */}
          <Route
            path="student-verification"
            element={<StudentVerification />}
          />
          {/* <Route path="job-view/:encId" element={<JobDetailsPublic />} /> */}
          <Route
            path="student/view/:encId/:businessEncId"
            element={<ViewStudentPublic />}
          />
        </Route>

        {/* AUTHENTICATION RELATED ROUTES  */}
        <Route path="/auth" element={<AuthenticationPublicLayout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
