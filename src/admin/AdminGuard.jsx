import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { markAdminDevice } from "../lib/portfolioApi";

export default function AdminGuard() {
  const [session, setSession] = useState(undefined);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) markAdminDevice();
      setSession(data.session);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (nextSession) markAdminDevice();
      setSession(nextSession);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined)
    return (
      <div className="admin-auth-loading">Vérification de votre session</div>
    );
  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
