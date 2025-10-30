import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
const MAIN_LOGO = '/assets/logo.png';
import { authAPI } from "@/lib/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const res = await authAPI.login({ email, password });
      const token = res?.token || res?.data?.token;
      if (!token) throw new Error(res?.message || "Login failed");
      localStorage.setItem("token", token);

      // Store user info including department and year
      const userData = res?.data?.user || res?.user;
      if (userData) {
        localStorage.setItem("userId", String(userData.id || userData._id));
        localStorage.setItem("username", userData.username);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ department: userData.department, year: userData.year })
        );
      }

      navigate("/");
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex items-center justify-center">
            <img
              src={MAIN_LOGO}
              alt="HAP Logo"
              className="h-16 w-auto object-contain -mt-2"
              style={{ objectFit: "contain" }}
            />
          </div>
          <span className="mt-4 font-bold text-2xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow">
          Login
        </span>
        </div>
      }
    >
      <form className="space-y-4 animate-ember-fade" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-destructive animate-ember-pulse">{error}</p>}
        <Input
          type="email"
          placeholder="Email"
          className="bg-background text-foreground placeholder:text-muted-foreground"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          className="bg-background text-foreground placeholder:text-muted-foreground"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          disabled={loading}
          type="submit"
          className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold btn-power animate-ember-shimmer"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
