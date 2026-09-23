import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/layout/ScrollToTop.jsx'
import MainLayout from './components/layout/MainLayout.jsx'
import DashboardLayout from './components/dashboard/DashboardLayout.jsx'
import RequireAuth from './components/auth/RequireAuth.jsx'

import Home from './pages/Home.jsx'
import Features from './pages/Features.jsx'
import Solutions from './pages/Solutions.jsx'
import Pricing from './pages/Pricing.jsx'
import About from './pages/About.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import NotFound from './pages/NotFound.jsx'

import DashboardHome from './pages/dashboard/DashboardHome.jsx'
import Chat from './pages/dashboard/Chat.jsx'
import History from './pages/dashboard/History.jsx'
import Files from './pages/dashboard/Files.jsx'
import Usage from './pages/dashboard/Usage.jsx'
import Settings from './pages/dashboard/Settings.jsx'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="chat" element={<Chat />} />
            <Route path="history" element={<History />} />
            <Route path="files" element={<Files />} />
            <Route path="usage" element={<Usage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound dashboard />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}
