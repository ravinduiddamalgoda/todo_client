import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./AuthProvider";

export function AuthGuard({children}: any) {
    let authPayload = useContext(AuthContext);
    // check if user exists
    if (!authPayload || !authPayload.token) {
        return <Navigate to="/login" />
    }
    return <>{children}</>
}

export function GuestGuard({children}: any) {
    let authPayload = useContext(AuthContext);
    // check if user exists
    if (authPayload && authPayload.token) {
        return <Navigate to="/app" />
    }
    return <>{children}</>
}