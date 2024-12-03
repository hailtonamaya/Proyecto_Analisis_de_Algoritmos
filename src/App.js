
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hailton from "./pages/Hailton.jsx";
import Steve from "./pages/Steve.jsx";
import Ricardo from "./pages/Ricardo.jsx";
import Jose from "./pages/Jose.jsx";

function App() {
  return (
    <Router>
        <Routes>
          <Route>
            <Route path="/hailton" element={<Hailton />} />
            <Route path="/steve" element={<Steve />} />
            <Route path="/ricardo" element={<Ricardo />} />
            <Route path="/jose" element={<Jose />} />
          </Route>
          
        </Routes>

    </Router>
  );
}

export default App;
