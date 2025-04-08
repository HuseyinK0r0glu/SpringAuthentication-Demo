import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './screens/LoginPage';
import HomePage from './screens/HomePage';
import LoadingPage from './screens/LoadingPage';
import SignUpPage from './screens/SignUpPage';
import VerifyEmailPage from './screens/VerifyEmailPage';
import UpdatePasswordPage from './screens/updateFlow/updatePasswordPage';
import UpdateUsernamePage from './screens/updateFlow/updateUserNamePage';
import SettingsPage from './screens/SettingsPage';
import DeleteAccountPage from './screens/DeleteAccountPage';
import ForgotPasswordPage from './screens/ForgotPasswordFlow/ForgotPasswordPage';
import NewPasswordPage from './screens/ForgotPasswordFlow/NewPasswordPage';
import UploadProfilePicture from './screens/UploadProfilePicture';
import { Navbar } from './Navbar';
import { Provider as UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar/>
        {/* Switch change to Routes for react 6*/}
        <Routes>
          {/* Redirect "/" to "/login" */}
          <Route path="/" element={<Navigate to="/home" />} />

          <Route path="/settings" element={<SettingsPage />}/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify" element={<VerifyEmailPage />}/>
          <Route path="/update-username" element={<UpdateUsernamePage />}/>
          <Route path="/update-password" element={<UpdatePasswordPage />}/>
          <Route path="/delete-account" element={<DeleteAccountPage />}/>
          <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
          <Route path="/new-password" element={<NewPasswordPage />}/>
          <Route path="/upload-profile-picture" element={<UploadProfilePicture />}/>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;