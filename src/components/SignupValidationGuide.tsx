import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SignupValidationGuide: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Signup Requirements</h3>
            <p className="text-sm text-muted-foreground">Quick guide to help you create your account</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary hover:bg-primary/10"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Username Requirements */}
          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-success/20 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-2">Username</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    <span>3-30 characters long</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    <span>Only letters, numbers, and underscores</span>
                  </div>
                  <div className="mt-2 p-2 bg-muted rounded text-xs">
                    <span className="text-muted-foreground">Examples: </span>
                    <code className="text-primary">john_doe</code>, 
                    <code className="text-primary"> student123</code>, 
                    <code className="text-primary"> user_name</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Requirements */}
          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-success/20 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-2">Email</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    <span>Must be a valid email format</span>
                  </div>
                  <div className="mt-2 p-2 bg-muted rounded text-xs">
                    <span className="text-muted-foreground">Examples: </span>
                    <code className="text-primary">john@example.com</code>, 
                    <code className="text-primary"> student@university.edu</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-success/20 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-2">Password</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    <span>At least 6 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    <span>One lowercase letter (a-z)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    <span>One uppercase letter (A-Z)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    <span>One number (0-9)</span>
                  </div>
                  <div className="mt-2 p-2 bg-muted rounded text-xs">
                    <span className="text-muted-foreground">Example: </span>
                    <code className="text-primary">MyPass123</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="p-1 bg-warning/20 rounded">
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-sm text-foreground">
                  <strong>Pro Tip:</strong> The form shows real-time validation as you type. 
                  All fields must be valid before you can submit.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupValidationGuide;
