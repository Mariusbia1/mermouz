import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import PageLoader from "./components/PageLoader";
import Seo from "./components/Seo";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Works = lazy(() => import("./pages/Works"));
const Contact = lazy(() => import("./pages/Contact"));
const Resume = lazy(() => import("./pages/Resume"));
const AdminGuard = lazy(() => import("./admin/AdminGuard"));
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const Overview = lazy(() => import("./admin/pages/Overview"));
const ProjectsAdmin = lazy(() => import("./admin/pages/ProjectsAdmin"));
const ServicesAdmin = lazy(() => import("./admin/pages/ServicesAdmin"));
const RequestsAdmin = lazy(() => import("./admin/pages/RequestsAdmin"));
const TestimonialsAdmin = lazy(() => import("./admin/pages/TestimonialsAdmin"));
const ContentAdmin = lazy(() => import("./admin/pages/ContentAdmin"));
const SettingsAdmin = lazy(() => import("./admin/pages/SettingsAdmin"));

export default function App() {
  return (
    <BrowserRouter>
      <Seo />
      <Suspense fallback={<PageLoader />}>
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
              <Route path="testimonials" element={<TestimonialsAdmin />} />
              <Route path="content" element={<ContentAdmin />} />
              <Route path="settings" element={<SettingsAdmin />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
