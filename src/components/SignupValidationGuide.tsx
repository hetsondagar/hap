import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SignupValidationGuide: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Signup Requirements</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">Quick guide to help you create your account</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Username Requirements */}
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Username</h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>3-30 characters long</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Only letters, numbers, and underscores</span>
                  </div>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Examples: </span>
                    <code className="text-blue-600 dark:text-blue-400">john_doe</code>, 
                    <code className="text-blue-600 dark:text-blue-400"> student123</code>, 
                    <code className="text-blue-600 dark:text-blue-400"> user_name</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Requirements */}
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Email</h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Must be a valid email format</span>
                  </div>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Examples: </span>
                    <code className="text-blue-600 dark:text-blue-400">john@example.com</code>, 
                    <code className="text-blue-600 dark:text-blue-400"> student@university.edu</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Password</h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>At least 6 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>One lowercase letter (a-z)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>One uppercase letter (A-Z)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>One number (0-9)</span>
                  </div>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Example: </span>
                    <code className="text-blue-600 dark:text-blue-400">MyPass123</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-amber-800 dark:text-amber-200">
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
