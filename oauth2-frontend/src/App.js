import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './screens/auth/LoginPage';
import HomePage from './screens/general/HomePage';
import LoadingPage from './screens/general/LoadingPage';
import SignUpPage from './screens/auth/SignUpPage';
import VerifyEmailPage from './screens/auth/VerifyEmailPage';
import UpdatePasswordPage from './screens/settings/updateFlow/updatePasswordPage';
import UpdateUsernamePage from './screens/settings/updateFlow/updateUserNamePage';
import SettingsPage from './screens/settings/SettingsPage';
import DeleteAccountPage from './screens/profile/DeleteAccountPage';
import ForgotPasswordPage from './screens/auth/ForgotPasswordFlow/ForgotPasswordPage';
import NewPasswordPage from './screens/auth/ForgotPasswordFlow/NewPasswordPage';
import UserPage from './screens/general/UserPage';
import UploadProfilePicture from './screens/profile/UploadProfilePicture';
import VerifyPhoneNumberPage from './screens/auth/PhoneNumberFlow/VerifyPhoneNumber';
import AddPhoneNumberPage from './screens/auth/PhoneNumberFlow/AddPhoneNumber';
import ContentPage from './screens/content/ContentPage';
import FriendsPage from './screens/social/Friends';
import ChessGamePage from './chess/ChessGamePage';
import ChessWithFriendsPage from './chess/ChessWithFriendsPage';
import ChessWithComputerPage from './chess/ChessWithComputerPage';
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
          <Route path="/user-profile" element={<UserPage />}/>
          <Route path="/verify-phone-number" element={<VerifyPhoneNumberPage />}/> 
          <Route path="/add-phone-number" element={<AddPhoneNumberPage />}/>
          <Route path="/content" element={<ContentPage />}/>
          <Route path="/friends" element={<FriendsPage />}/>
          <Route path="/play-chess" element={<ChessGamePage />}/>
          <Route path="/play-chess-with-computer" element={<ChessWithComputerPage />}/>
          <Route path="/play-chess-with-friends" element={<ChessWithFriendsPage />}/>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;