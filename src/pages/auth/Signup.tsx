import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { GraduationCap, Shield } from 'lucide-react';
import { generateCredentials, GeneratedCredentials } from '@/lib/credentialsGenerator';
import CredentialsDisplay from '@/components/auth/CredentialsDisplay';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<GeneratedCredentials | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.schoolName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate secure credentials for the administrator
      const schoolId = formData.schoolName.toLowerCase().replace(/\s+/g, '_').substring(0, 10);
      const credentials = generateCredentials('administrator', schoolId);
      
      // Store the generated credentials (in a real app, this would be saved to database)
      const adminAccount = {
        id: `admin_${Date.now()}`,
        name: formData.name,
        username: credentials.username,
        password: credentials.password, // In real app, this should be hashed
        role: 'administrator',
        schoolId: schoolId,
        schoolName: formData.schoolName,
        createdAt: new Date().toISOString()
      };
      
      // Store in localStorage for demo purposes (use proper backend in production)
      const existingAccounts = JSON.parse(localStorage.getItem('eduSystem_accounts') || '[]');
      existingAccounts.push(adminAccount);
      localStorage.setItem('eduSystem_accounts', JSON.stringify(existingAccounts));
      
      // Show the generated credentials
      setGeneratedCredentials(credentials);
      
      toast({
        title: "Administrator Account Created",
        description: "Secure login credentials have been generated. Please save them securely."
      });
      
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsClose = () => {
    setGeneratedCredentials(null);
    navigate('/login');
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-elevated border-0">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mb-2">
                <Shield className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold">Administrator Setup</CardTitle>
              <CardDescription>Create the first administrator account for your school. Secure login credentials will be generated automatically.</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Administrator Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter administrator's full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    name="schoolName"
                    type="text"
                    placeholder="Enter your school name"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Secure Account Creation</p>
                      <p>A unique username and strong password will be generated automatically for security. You'll be able to copy and save these credentials after creation.</p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  variant="highlight"
                >
                  {isLoading ? 'Creating Account...' : 'Create Administrator Account'}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      
      {generatedCredentials && (
        <CredentialsDisplay 
          credentials={generatedCredentials} 
          onClose={handleCredentialsClose}
        />
      )}
    </>
  );
};

export default Signup;