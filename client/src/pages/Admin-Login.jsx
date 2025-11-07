import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth-context";

export const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const {
        API,
        startAdminSession,
        LogoutUser,
        canAccessAdmin,
        isLoading,
    } = useAuth();

    useEffect(() => {
        if (!isLoading && canAccessAdmin) {
            navigate("/admin/users", { replace: true });
        }
    }, [canAccessAdmin, isLoading, navigate]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const verifyAdminAccess = async (token) => {
        const response = await fetch(`${API}/api/auth/user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const body = await response.text();
            throw new Error(
                `Unable to verify admin access. Status ${response.status}. ${body.slice(
                    0,
                    100
                )}`
            );
        }

        const data = await response.json();
        if (!data?.userData?.isAdmin) {
            throw new Error("You are not authorized to access the admin dashboard.");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.extraDetails || result.message || "Login failed");
            }

            const token = result?.token;
            if (!token) {
                throw new Error("Server response is missing the authentication token.");
            }

            await verifyAdminAccess(token);

            startAdminSession(token);
            toast.success("Welcome back, admin!");
            setCredentials({ email: "", password: "" });
            navigate("/admin/users", { replace: true });
        } catch (error) {
            console.error("Admin login error", error);
            LogoutUser();
            toast.error(error.message || "Unable to sign in as admin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="section-admin-login">
            <main>
                <div className="section-registration">
                    <div className="container grid grid-two-cols">
                        <div className="registration-image">
                            <img
                                src="/images/login.png"
                                alt="Admin login"
                                width="500"
                                height="500"
                            />
                        </div>

                        <div className="registration-form">
                            <h1 className="main-heading mb-3">Admin Sign In</h1>
                            <p className="mb-3">
                                Enter your admin credentials to access the dashboard.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="admin-email">Admin Email</label>
                                    <input
                                        type="email"
                                        id="admin-email"
                                        name="email"
                                        autoComplete="off"
                                        required
                                        placeholder="admin@example.com"
                                        value={credentials.email}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="admin-password">Password</label>
                                    <input
                                        type="password"
                                        id="admin-password"
                                        name="password"
                                        autoComplete="off"
                                        required
                                        placeholder="Enter your admin password"
                                        value={credentials.password}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <br />
                                <button
                                    type="submit"
                                    className="btn btn-submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Signing in..." : "Login as Admin"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </section>
    );
};

