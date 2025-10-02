import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import HapLogo from "../../assets/hap-logo-3.png"; // 👈 add your logo here

const Signup: React.FC = () => {
  return (
    <AuthLayout
      title={
        <div className="flex items-center gap-2">
          <img src={HapLogo} alt="Hap Logo" className="h-20 w-20 object-contain" />
          <span>Sign Up</span>
        </div>
      }
    >
      <form className="space-y-4">
        <Input type="text" placeholder="Full Name" className="bg-background" />
        <Input type="email" placeholder="Email" className="bg-background" />
        <Input type="password" placeholder="Password" className="bg-background" />
        <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign Up</Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
