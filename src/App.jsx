import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/HomePage/home";
import Login from "./components/Login/login";
import Dispatch from "./components/Dispatch/dispatch";
import Ledger from "./components/Ledger/ledger";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import PrivateRoute from "./PrivateRoute";




const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<PrivateRoute>
              <Home />
            </PrivateRoute>} />
        <Route path="/dispatch" element={<Dispatch />} /> {/* Dispatch Page */}
        <Route path="/ledger" element={<Ledger />} /> {/* Dispatch Page */}

      </Routes>
    </Router>
  );
};

export default App;
