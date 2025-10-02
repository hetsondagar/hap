import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


 // ✅ fix alias path

interface AuthLayoutProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="w-full max-w-md p-6 shadow-lg border border-gray-800 bg-background">
        <CardHeader className="flex flex-col items-center">
          
          <CardTitle className="text-2xl font-bold text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;
