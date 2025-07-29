import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import AccountCreationForm from '@/components/auth/AccountCreationForm';

const CreateAccount = () => {
  const { user } = useAuth();
  const [createdAccounts, setCreatedAccounts] = useState<any[]>([]);

  // Only administrators can access this page
  if (user?.role !== 'administrator') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              Only administrators can create user accounts.
            </p>
            <Link to="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAccountCreated = (account: any) => {
    setCreatedAccounts(prev => [account, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Create User Account</h1>
            <p className="text-muted-foreground">
              Generate secure login credentials for teachers and students
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Account Creation Form */}
          <div className="flex justify-center">
            <AccountCreationForm
              schoolId={user.schoolId || 'default_school'}
              onAccountCreated={handleAccountCreated}
            />
          </div>

          {/* Recently Created Accounts */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recently Created Accounts
                </CardTitle>
                <CardDescription>
                  Accounts created in this session
                </CardDescription>
              </CardHeader>
              <CardContent>
                {createdAccounts.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No accounts created yet. Use the form to create your first account.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {createdAccounts.map((account, index) => (
                      <div
                        key={account.id}
                        className="border rounded-lg p-4 bg-muted/30"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{account.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {account.role.replace('_', ' ').toUpperCase()}
                              {account.className && ` • Class: ${account.className}`}
                              {account.subject && ` • Subject: ${account.subject}`}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Username: {account.username}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">
                              Created {new Date(account.createdAt).toLocaleTimeString()}
                            </div>
                            <div className="mt-1">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                ✓ Credentials Generated
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-blue-800">
                  <h3 className="font-medium mb-2">Security & Privacy Notice</h3>
                  <ul className="text-sm space-y-1">
                    <li>• All accounts are created with automatically generated secure credentials</li>
                    <li>• Users cannot see or modify their login credentials</li>
                    <li>• Credentials are only displayed once during creation</li>
                    <li>• Make sure to securely share credentials with users through private channels</li>
                    <li>• Consider implementing a secure credential distribution system in production</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;