import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/HomePage/home";
import Dispatch from "./components/Dispatch/dispatch";
import Ledger from "./components/Ledger/ledger";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dispatch" element={<Dispatch />} /> {/* Dispatch Page */}
        <Route path="/ledger" element={<Ledger />} /> {/* Dispatch Page */}

      </Routes>
    </Router>
  );
};

export default App;
