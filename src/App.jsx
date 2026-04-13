import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ClientDashboard from "./pages/client/ClientDashboard";
import PostGig from "./pages/client/PostGig";
import ManageGigs from "./pages/client/ManageGigs";
import ViewBids from "./pages/client/ViewBids";
import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import BrowseGigs from "./pages/freelancer/BrowseGigs";
import PlaceBid from "./pages/freelancer/PlaceBid";
import MyBids from "./pages/freelancer/MyBids";
import ProtectedRoute from "./components/ProtectedRoute";
import SubmitWork from "./pages/freelancer/SubmitWork";
import ReviewWork from "./pages/client/ReviewWork";
import LeaveFeedback from "./pages/client/LeaveFeedback";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Client routes */}
        <Route path="/client/dashboard" element={<ProtectedRoute allowedRole="client"><ClientDashboard /></ProtectedRoute>} />
        <Route path="/client/post-gig" element={<ProtectedRoute allowedRole="client"><PostGig /></ProtectedRoute>} />
        <Route path="/client/gigs" element={<ProtectedRoute allowedRole="client"><ManageGigs /></ProtectedRoute>} />
        <Route path="/client/gigs/:gigId/bids" element={<ProtectedRoute allowedRole="client"><ViewBids /></ProtectedRoute>} />

        {/* Freelancer routes */}
        <Route path="/freelancer/dashboard" element={<ProtectedRoute allowedRole="freelancer"><FreelancerDashboard /></ProtectedRoute>} />
        <Route path="/freelancer/browse" element={<ProtectedRoute allowedRole="freelancer"><BrowseGigs /></ProtectedRoute>} />
        <Route path="/freelancer/gigs/:gigId/bid" element={<ProtectedRoute allowedRole="freelancer"><PlaceBid /></ProtectedRoute>} />
        <Route path="/freelancer/bids" element={<ProtectedRoute allowedRole="freelancer"><MyBids /></ProtectedRoute>} />

        <Route path="/freelancer/gigs/:gigId/submit" element={
        <ProtectedRoute allowedRole="freelancer"><SubmitWork /></ProtectedRoute>} />
        <Route path="/client/gigs/:gigId/review" element={
        <ProtectedRoute allowedRole="client"><ReviewWork /></ProtectedRoute>} />
        <Route path="/client/gigs/:gigId/feedback" element={
         <ProtectedRoute allowedRole="client"><LeaveFeedback /></ProtectedRoute>} />
      
      </Routes>
    </BrowserRouter>
  );
}