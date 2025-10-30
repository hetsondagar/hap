import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import hapLogo from "../../assets/hap-logo-3.png";
import HapLogo from '../../assets/hap-logo.png';


 // ✅ fix alias path

interface AuthLayoutProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <div 
      className="relative flex items-center justify-center min-h-screen pt-24 pb-16 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      {/* Subtle dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      <Card className="relative w-full max-w-md p-6 hero-card">
        <CardHeader className="flex flex-col items-center">
          {/* <img src={hapLogo} alt="Hap Logo" className="h-16 w-16 object-contain mb-3" /> */}
          <CardTitle className="text-2xl font-bold text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;
