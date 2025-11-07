import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [isAdminSession, setIsAdminSession] = useState(
    () => localStorage.getItem("adminSession") === "true"
  );
  const authorizationToken = token ? `Bearer ${token}` : "";

  const configuredApi = import.meta.env.VITE_APP_URI_API?.trim();
  const API = (configuredApi && configuredApi.length > 0
    ? configuredApi
    : "http://localhost:5001").replace(/\/$/, "");

  if (!configuredApi) {
    console.warn(
      "VITE_APP_URI_API is not defined. Falling back to http://localhost:5001."
    );
  }

  const ensureJsonResponse = useCallback(async (response) => {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const bodySnippet = (await response.text()).slice(0, 150);
      throw new Error(
        `Expected JSON response but received '${contentType || "unknown"}'. ` +
        `Status ${response.status} ${response.statusText}. Body preview: ${bodySnippet}`
      );
    }
    return response.json();
  }, []);

  const persistToken = useCallback((serverToken) => {
    if (serverToken) {
      setToken(serverToken);
      localStorage.setItem("token", serverToken);
    } else {
      setToken("");
      localStorage.removeItem("token");
    }
  }, []);

  const persistAdminSession = useCallback((value) => {
    setIsAdminSession(value);
    if (value) {
      localStorage.setItem("adminSession", "true");
    } else {
      localStorage.removeItem("adminSession");
    }
  }, []);

  const startUserSession = useCallback(
    (serverToken) => {
      persistToken(serverToken);
      persistAdminSession(false);
    },
    [persistAdminSession, persistToken]
  );

  const startAdminSession = useCallback(
    (serverToken) => {
      persistToken(serverToken);
      persistAdminSession(true);
    },
    [persistAdminSession, persistToken]
  );

  const clearSession = useCallback(() => {
    persistToken("");
    persistAdminSession(false);
    setUser(null);
    setServices([]);
  }, [persistAdminSession, persistToken]);

  const isLoggedIn = Boolean(token);
  console.log("isLoggedIN ", isLoggedIn);

  const LogoutUser = useCallback(() => {
    clearSession();
  }, [clearSession]);

  // JWT AUTHENTICATION - to get the currently loggedIN user data

  const userAuthentication = useCallback(async () => {
    try {
      if (!authorizationToken) {
        setUser(null);
        setIsLoading(false);
        persistAdminSession(false);
        return;
      }
      setIsLoading(true);
      const response = await fetch(`${API}/api/auth/user`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Unable to fetch user data. Status ${response.status}. Body: ${errorBody.slice(
            0,
            150
          )}`
        );
      }

      const data = await ensureJsonResponse(response);
      console.log("user data ", data.userData);
      setUser(data.userData ?? null);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data", error);
      setUser(null);
      setIsLoading(false);
      persistAdminSession(false);
    }
  }, [API, authorizationToken, ensureJsonResponse, persistAdminSession]);

  // to fetch the services data from the database
  const getServices = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/data/service`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Unable to fetch services. Status ${response.status}. Body: ${errorBody.slice(
            0,
            150
          )}`
        );
      }

      const data = await ensureJsonResponse(response);
      console.log(data.msg);
      setServices(data.msg);
    } catch (error) {
      console.error("services frontend error", error);
    }
  }, [API, ensureJsonResponse]);

  useEffect(() => {
    getServices();
    userAuthentication();
  }, [getServices, userAuthentication]);

  //please subs to thapa technical channel .. also world best js course is coming soon

  const isAdminUser = Boolean(user?.isAdmin);
  const canAccessAdmin = isAdminUser && isAdminSession;

  const ctxValue = useMemo(
    () => ({
      isLoggedIn,
      startUserSession,
      startAdminSession,
      LogoutUser,
      user,
      services,
      authorizationToken,
      isLoading,
      API,
      isAdmin: isAdminUser,
      isAdminSession,
      canAccessAdmin,
    }),
    [
      API,
      LogoutUser,
      authorizationToken,
      canAccessAdmin,
      isLoading,
      isLoggedIn,
      isAdminSession,
      services,
      startAdminSession,
      startUserSession,
      user,
      isAdminUser,
    ]
  );

  return <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>;
};
