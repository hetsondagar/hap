import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const SignupValidationGuide: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="space-y-3">
          <h3 className="font-semibold text-blue-900">Signup Requirements</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-800">Username:</strong>
                <ul className="ml-4 mt-1 space-y-1 text-gray-600">
                  <li>• 3-30 characters long</li>
                  <li>• Only letters, numbers, and underscores</li>
                  <li>• Examples: john_doe, student123, user_name</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-800">Email:</strong>
                <ul className="ml-4 mt-1 space-y-1 text-gray-600">
                  <li>• Must be a valid email format</li>
                  <li>• Examples: john@example.com, student@university.edu</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-800">Password:</strong>
                <ul className="ml-4 mt-1 space-y-1 text-gray-600">
                  <li>• At least 6 characters</li>
                  <li>• One lowercase letter (a-z)</li>
                  <li>• One uppercase letter (A-Z)</li>
                  <li>• One number (0-9)</li>
                  <li>• Example: MyPass123</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
            <p className="text-xs text-yellow-800">
              <strong>Tip:</strong> The form will show real-time validation as you type. 
              All fields must be valid before you can submit the form.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupValidationGuide;
