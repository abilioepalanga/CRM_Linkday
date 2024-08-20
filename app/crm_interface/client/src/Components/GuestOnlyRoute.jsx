import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
function GuestOnlyRoute() {
	const notAuthenticated = !useIsAuthenticated();
	return notAuthenticated ? <Outlet /> : <Navigate to="/home" />;
}

export default GuestOnlyRoute;
