import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import CreateGroup from "./Pages/CreateGroup";
axios.defaults.withCredentials = true; // Enable sending cookies with requests

function App() {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/group" element={<CreateGroup />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
