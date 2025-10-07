import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import HapLogo from "../../assets/hap-logo-3.png";


 // ✅ fix alias path

interface AuthLayoutProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-subtle">
      <Card className="w-full max-w-md p-6 hero-card">
        <CardHeader className="flex flex-col items-center">
          <img src={HapLogo} alt="Hap Logo" className="h-16 w-16 object-contain mb-3" />
          <CardTitle className="text-2xl font-bold text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;
