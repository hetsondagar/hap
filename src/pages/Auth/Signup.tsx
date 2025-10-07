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
import { DEPARTMENTS, YEARS } from "@/data/subjects";

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  department?: string;
  year?: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
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

  const validateDepartment = (value: string): string | null => {
    if (!value) return "Department is required";
    return null;
  };

  const validateYear = (value: string): string | null => {
    if (!value) return "Year is required";
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
      case 'department':
        error = validateDepartment(value);
        break;
      case 'year':
        error = validateYear(value);
        break;
    }
    setValidationErrors(prev => ({ ...prev, [field]: error || undefined }));
    return !error;
  };

  const isFormValid = () => {
    return validateUsername(username) === null && 
           validateEmail(email) === null && 
           validatePassword(password) === null &&
           validateDepartment(department) === null &&
           validateYear(year) === null;
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
      case 'department':
        setDepartment(value);
        break;
      case 'year':
        setYear(value);
        break;
    }
    
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let value = '';
    switch (field) {
      case 'username': value = username; break;
      case 'email': value = email; break;
      case 'password': value = password; break;
      case 'department': value = department; break;
      case 'year': value = year; break;
    }
    validateField(field, value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    
    // Mark all fields as touched
    setTouched({ username: true, email: true, password: true, department: true, year: true });
    
    // Validate all fields
    const usernameValid = validateField('username', username);
    const emailValid = validateField('email', email);
    const passwordValid = validateField('password', password);
    const departmentValid = validateField('department', department);
    const yearValid = validateField('year', year);
    
    if (!usernameValid || !emailValid || !passwordValid || !departmentValid || !yearValid) {
      setError("Please fix the validation errors above");
      return;
    }
    
    try {
      setLoading(true);
      const res = await authAPI.signup({ username, email, password, department, year });
      const token = res?.token || res?.data?.token;
      if (!token) throw new Error(res?.message || "Signup failed");
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify({ department, year }));
      navigate("/");
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
  const strengthColors = ['bg-destructive', 'bg-warning', 'bg-warning', 'bg-primary', 'bg-success'];

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
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Username Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Username</label>
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Enter your username" 
              className={cn(
                "bg-background text-foreground placeholder:text-muted-foreground",
                touched.username && validationErrors.username && "border-destructive focus:border-destructive",
                touched.username && !validationErrors.username && "border-success focus:border-success"
              )}
              value={username} 
              onChange={(e) => handleFieldChange('username', e.target.value)}
              onBlur={() => handleFieldBlur('username')}
            />
            {touched.username && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {validationErrors.username ? (
                  <X className="h-4 w-4 text-destructive" />
                ) : (
                  <Check className="h-4 w-4 text-success" />
                )}
              </div>
            )}
          </div>
          {touched.username && validationErrors.username && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {validationErrors.username}
            </p>
          )}
          {touched.username && !validationErrors.username && (
            <p className="text-sm text-success flex items-center gap-1">
              <Check className="h-3 w-3" />
              Username looks good!
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <div className="relative">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className={cn(
                "bg-background text-foreground placeholder:text-muted-foreground",
                touched.email && validationErrors.email && "border-destructive focus:border-destructive",
                touched.email && !validationErrors.email && "border-success focus:border-success"
              )}
              value={email} 
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
            />
            {touched.email && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {validationErrors.email ? (
                  <X className="h-4 w-4 text-destructive" />
                ) : (
                  <Check className="h-4 w-4 text-success" />
                )}
              </div>
            )}
          </div>
          {touched.email && validationErrors.email && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {validationErrors.email}
            </p>
          )}
          {touched.email && !validationErrors.email && (
            <p className="text-sm text-success flex items-center gap-1">
              <Check className="h-3 w-3" />
              Email looks good!
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password" 
              className={cn(
                "bg-background text-foreground placeholder:text-muted-foreground pr-10",
                touched.password && validationErrors.password && "border-destructive focus:border-destructive",
                touched.password && !validationErrors.password && "border-success focus:border-success"
              )}
              value={password} 
              onChange={(e) => handleFieldChange('password', e.target.value)}
              onBlur={() => handleFieldBlur('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                password.length >= 6 ? "bg-success" : "bg-muted"
              )} />
              <span className={password.length >= 6 ? "text-success" : "text-muted-foreground"}>
                At least 6 characters
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className={cn(
                "w-2 h-2 rounded-full",
                /(?=.*[a-z])/.test(password) ? "bg-success" : "bg-muted"
              )} />
              <span className={/(?=.*[a-z])/.test(password) ? "text-success" : "text-muted-foreground"}>
                One lowercase letter
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className={cn(
                "w-2 h-2 rounded-full",
                /(?=.*[A-Z])/.test(password) ? "bg-success" : "bg-muted"
              )} />
              <span className={/(?=.*[A-Z])/.test(password) ? "text-success" : "text-muted-foreground"}>
                One uppercase letter
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className={cn(
                "w-2 h-2 rounded-full",
                /(?=.*\d)/.test(password) ? "bg-success" : "bg-muted"
              )} />
              <span className={/(?=.*\d)/.test(password) ? "text-success" : "text-muted-foreground"}>
                One number
              </span>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Password strength:</span>
                <span className={cn(
                  "font-medium",
                  passwordStrength <= 2 ? "text-destructive" : 
                  passwordStrength <= 3 ? "text-warning" : "text-success"
                )}>
                  {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    passwordStrength <= 2 ? "bg-destructive" :
                    passwordStrength <= 3 ? "bg-warning" : "bg-success"
                  )}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {touched.password && validationErrors.password && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {validationErrors.password}
            </p>
          )}
          {touched.password && !validationErrors.password && (
            <p className="text-sm text-success flex items-center gap-1">
              <Check className="h-3 w-3" />
              Password meets all requirements!
            </p>
          )}
        </div>

        {/* Department Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Department</label>
          <select
            className={cn(
              "w-full px-3 py-2 border rounded-md bg-background text-foreground border-input",
              touched.department && validationErrors.department && "border-destructive focus:border-destructive",
              touched.department && !validationErrors.department && "border-success focus:border-success"
            )}
            value={department}
            onChange={(e) => handleFieldChange('department', e.target.value)}
            onBlur={() => handleFieldBlur('department')}
          >
            <option value="">Select your department</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.label}
              </option>
            ))}
          </select>
          {touched.department && validationErrors.department && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {validationErrors.department}
            </p>
          )}
          {touched.department && !validationErrors.department && (
            <p className="text-sm text-success flex items-center gap-1">
              <Check className="h-3 w-3" />
              Department selected!
            </p>
          )}
        </div>

        {/* Year Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Year</label>
          <select
            className={cn(
              "w-full px-3 py-2 border rounded-md bg-background text-foreground border-input",
              touched.year && validationErrors.year && "border-destructive focus:border-destructive",
              touched.year && !validationErrors.year && "border-success focus:border-success"
            )}
            value={year}
            onChange={(e) => handleFieldChange('year', e.target.value)}
            onBlur={() => handleFieldBlur('year')}
          >
            <option value="">Select your year</option>
            {YEARS.map((yr) => (
              <option key={yr.id} value={yr.id}>
                {yr.label}
              </option>
            ))}
          </select>
          {touched.year && validationErrors.year && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {validationErrors.year}
            </p>
          )}
          {touched.year && !validationErrors.year && (
            <p className="text-sm text-success flex items-center gap-1">
              <Check className="h-3 w-3" />
              Year selected!
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
        <Link to="/login" className="text-primary hover:opacity-80 font-medium">
          Sign in here
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
