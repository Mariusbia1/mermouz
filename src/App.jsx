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
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/works" element={<Works />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cv" element={<Resume />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
