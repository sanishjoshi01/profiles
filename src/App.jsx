import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="container mx-auto">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profiles" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
