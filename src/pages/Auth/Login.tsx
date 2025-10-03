import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import HapLogo from "../../assets/hap-logo-3.png"; // 👈 add your logo here

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Integrate real authentication. On success, redirect to dashboard
    navigate("/analytics");
  };

  return (
    <AuthLayout
      title={
        <div className="flex items-center gap-2">
          <img src={HapLogo} alt="Hap Logo" className="h-20 w-20 object-contain" />
          <span>Login</span>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input type="email" placeholder="Email" className="bg-background" />
        <Input type="password" placeholder="Password" className="bg-background" />
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Login</Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
