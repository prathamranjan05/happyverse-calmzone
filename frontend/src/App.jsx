import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import PortalBackground from "./components/potalbackground";
import Landing from "./components/Landing";
import Dashboard from "./components/dashboard";
import CalmZone from "./components/CalmZone";
import "./App.css";

export default function App() {
  return (
    <Router>
      {/* Portal background - always visible */}
      <PortalBackground />
      
      {/* Content overlay */}
      <div className="app-content">
        <Suspense fallback={
          <div className="loading-wrapper">
            <div className="portal-loader">
              <div className="ring"></div>
              <div className="ring"></div>
              <div className="ring"></div>
              <div className="progress-text">✨</div>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calm-zone" element={<CalmZone />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}