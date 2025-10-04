import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import HapLogo from "../../assets/hap-logo-3.png"; // 👈 add your logo here
import { authAPI } from "@/lib/api";
import { Eye, EyeOff, Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import SignupValidationGuide from "@/components/SignupValidationGuide";

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Validation functions
  const validateUsername = (value: string): string | null => {
    if (!value) return "Username is required";
    if (value.length < 3) return "Username must be at least 3 characters";
    if (value.length > 30) return "Username must be less than 30 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Username can only contain letters, numbers, and underscores";
    return null;
  };

  const validateEmail = (value: string): string | null => {
    if (!value) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return null;
  };

  const validatePassword = (value: string): string | null => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    if (!/(?=.*[a-z])/.test(value)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(value)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(value)) return "Password must contain at least one number";
    return null;
  };

  const validateField = (field: string, value: string) => {
    let error: string | null = null;
    switch (field) {
      case 'username':
        error = validateUsername(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
    }
    setValidationErrors(prev => ({ ...prev, [field]: error || undefined }));
    return !error;
  };

  const isFormValid = () => {
    return validateUsername(username) === null && 
           validateEmail(email) === null && 
           validatePassword(password) === null;
  };

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
    }
    
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, field === 'username' ? username : field === 'email' ? email : password);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    
    // Mark all fields as touched
    setTouched({ username: true, email: true, password: true });
    
    // Validate all fields
    const usernameValid = validateField('username', username);
    const emailValid = validateField('email', email);
    const passwordValid = validateField('password', password);
    
    if (!usernameValid || !emailValid || !passwordValid) {
      setError("Please fix the validation errors above");
      return;
    }
    
    try {
      setLoading(true);
      const res = await authAPI.signup({ username, email, password });
      const token = res?.token || res?.data?.token;
      if (!token) throw new Error(res?.message || "Signup failed");
      localStorage.setItem("token", token);
      navigate("/flashcards");
    } catch (e: any) {
      console.error('Signup error:', e);
      if (e?.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = e.response.data.errors;
        const newErrors: ValidationErrors = {};
        backendErrors.forEach((err: any) => {
          if (err.path === 'username') newErrors.username = err.msg;
          if (err.path === 'email') newErrors.email = err.msg;
          if (err.path === 'password') newErrors.password = err.msg;
        });
        setValidationErrors(newErrors);
        setError("Please fix the validation errors above");
      } else {
        setError(e?.response?.data?.message || e?.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[!@#$%^&*])/.test(password)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <AuthLayout
      title={
        <div className="flex items-center gap-2">
          <img src={HapLogo} alt="Hap Logo" className="h-20 w-20 object-contain" />
          <span>Sign Up</span>
        </div>
      }
    >
      <SignupValidationGuide />
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Username Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Enter your username" 
              className={cn(
                "bg-background dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400",
                touched.username && validationErrors.username && "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400",
                touched.username && !validationErrors.username && "border-green-500 dark:border-green-400 focus:border-green-500 dark:focus:border-green-400"
              )}
              value={username} 
              onChange={(e) => handleFieldChange('username', e.target.value)}
              onBlur={() => handleFieldBlur('username')}
            />
            {touched.username && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {validationErrors.username ? (
                  <X className="h-4 w-4 text-red-500 dark:text-red-400" />
                ) : (
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
                )}
              </div>
            )}
          </div>
          {touched.username && validationErrors.username && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {validationErrors.username}
            </p>
          )}
          {touched.username && !validationErrors.username && (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Username looks good!
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <div className="relative">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className={cn(
                "bg-background dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400",
                touched.email && validationErrors.email && "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400",
                touched.email && !validationErrors.email && "border-green-500 dark:border-green-400 focus:border-green-500 dark:focus:border-green-400"
              )}
              value={email} 
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
            />
            {touched.email && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {validationErrors.email ? (
                  <X className="h-4 w-4 text-red-500 dark:text-red-400" />
                ) : (
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
                )}
              </div>
            )}
          </div>
          {touched.email && validationErrors.email && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {validationErrors.email}
            </p>
          )}
          {touched.email && !validationErrors.email && (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Email looks good!
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password" 
              className={cn(
                "bg-background dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 pr-10",
                touched.password && validationErrors.password && "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400",
                touched.password && !validationErrors.password && "border-green-500 dark:border-green-400 focus:border-green-500 dark:focus:border-green-400"
              )}
              value={password} 
              onChange={(e) => handleFieldChange('password', e.target.value)}
              onBlur={() => handleFieldBlur('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Password Requirements */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className={cn(
                "w-2 h-2 rounded-full",
                password.length >= 6 ? "bg-green-500 dark:bg-green-400" : "bg-gray-300 dark:bg-gray-600"
              )} />
              <span className={password.length >= 6 ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}>
                At least 6 characters
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className={cn(
                "w-2 h-2 rounded-full",
                /(?=.*[a-z])/.test(password) ? "bg-green-500 dark:bg-green-400" : "bg-gray-300 dark:bg-gray-600"
              )} />
              <span className={/(?=.*[a-z])/.test(password) ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}>
                One lowercase letter
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className={cn(
                "w-2 h-2 rounded-full",
                /(?=.*[A-Z])/.test(password) ? "bg-green-500 dark:bg-green-400" : "bg-gray-300 dark:bg-gray-600"
              )} />
              <span className={/(?=.*[A-Z])/.test(password) ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}>
                One uppercase letter
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className={cn(
                "w-2 h-2 rounded-full",
                /(?=.*\d)/.test(password) ? "bg-green-500 dark:bg-green-400" : "bg-gray-300 dark:bg-gray-600"
              )} />
              <span className={/(?=.*\d)/.test(password) ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}>
                One number
              </span>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Password strength:</span>
                <span className={cn(
                  "font-medium",
                  passwordStrength <= 2 ? "text-red-600 dark:text-red-400" : 
                  passwordStrength <= 3 ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"
                )}>
                  {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    strengthColors[passwordStrength - 1] || "bg-gray-300 dark:bg-gray-600"
                  )}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {touched.password && validationErrors.password && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {validationErrors.password}
            </p>
          )}
          {touched.password && !validationErrors.password && (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Password meets all requirements!
            </p>
          )}
        </div>

        <Button 
          disabled={loading || !isFormValid()} 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Creating account...
            </div>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
      
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign in here
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
