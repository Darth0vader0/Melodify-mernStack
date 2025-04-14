import MainPage from "./page/mainPage"
import RootLayout from "./layout/layout"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from "./Auth/signupPage"
import LoginPage from "./Auth/loginPage"
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/home" element={<RootLayout><MainPage /></RootLayout>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />}> </Route>
      </Routes>
    </Router>
    
     
    </>
  )
}

export default App
