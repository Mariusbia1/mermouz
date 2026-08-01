import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Works from "./pages/Works";
import Contact from "./pages/Contact";
import Resume from "./pages/Resume";
import AdminGuard from "./admin/AdminGuard";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import Overview from "./admin/pages/Overview";
import ProjectsAdmin from "./admin/pages/ProjectsAdmin";
import ServicesAdmin from "./admin/pages/ServicesAdmin";
import RequestsAdmin from "./admin/pages/RequestsAdmin";
import ContentAdmin from "./admin/pages/ContentAdmin";
import SettingsAdmin from "./admin/pages/SettingsAdmin";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/works" element={<Works />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cv" element={<Resume />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="requests" element={<RequestsAdmin />} />
            <Route path="content" element={<ContentAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
