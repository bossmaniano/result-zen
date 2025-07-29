import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Users, BookOpen, UserCheck, GraduationCap } from 'lucide-react';
import { generateCredentials, GeneratedCredentials } from '@/lib/credentialsGenerator';
import { UserRole } from '@/contexts/AuthContext';
import CredentialsDisplay from './CredentialsDisplay';

interface AccountCreationFormProps {
  schoolId: string;
  onAccountCreated?: (account: any) => void;
}

const AccountCreationForm: React.FC<AccountCreationFormProps> = ({ schoolId, onAccountCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '' as UserRole | '',
    className: '', // For students and class teachers
    subject: '', // For subject teachers
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<GeneratedCredentials | null>(null);

  const roleOptions = [
    { value: 'head_teacher', label: 'Head Teacher', icon: UserCheck },
    { value: 'class_teacher', label: 'Class Teacher', icon: Users },
    { value: 'subject_teacher', label: 'Subject Teacher', icon: BookOpen },
    { value: 'student', label: 'Student', icon: GraduationCap },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({
      ...prev,
      role: role as UserRole,
      className: '',
      subject: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.role === 'student' && !formData.className) {
      toast({
        title: "Validation Error",
        description: "Please specify the class for the student",
        variant: "destructive"
      });
      return;
    }

    if (formData.role === 'class_teacher' && !formData.className) {
      toast({
        title: "Validation Error",
        description: "Please specify the class for the class teacher",
        variant: "destructive"
      });
      return;
    }

    if (formData.role === 'subject_teacher' && !formData.subject) {
      toast({
        title: "Validation Error",
        description: "Please specify the subject for the subject teacher",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate secure credentials
      const credentials = generateCredentials(formData.role, schoolId);
      
      // Create the account object
      const newAccount = {
        id: `${formData.role}_${Date.now()}`,
        name: formData.name,
        username: credentials.username,
        password: credentials.password, // In real app, this should be hashed
        role: formData.role,
        schoolId: schoolId,
        className: formData.className || undefined,
        subject: formData.subject || undefined,
        createdAt: new Date().toISOString(),
        createdBy: 'administrator' // In real app, get from current user
      };
      
      // Store in localStorage for demo purposes (use proper backend in production)
      const existingAccounts = JSON.parse(localStorage.getItem('eduSystem_accounts') || '[]');
      existingAccounts.push(newAccount);
      localStorage.setItem('eduSystem_accounts', JSON.stringify(existingAccounts));
      
      // Show the generated credentials
      setGeneratedCredentials(credentials);
      
      // Call callback if provided
      if (onAccountCreated) {
        onAccountCreated(newAccount);
      }
      
      toast({
        title: "Account Created Successfully",
        description: `${formData.role.replace('_', ' ')} account created with secure credentials.`
      });
      
      // Reset form
      setFormData({
        name: '',
        role: '' as UserRole | '',
        className: '',
        subject: '',
      });
      
    } catch (error) {
      toast({
        title: "Account Creation Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsClose = () => {
    setGeneratedCredentials(null);
  };

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Account</CardTitle>
          <CardDescription>
            Generate secure login credentials for new users
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {(formData.role === 'student' || formData.role === 'class_teacher') && (
              <div className="space-y-2">
                <Label htmlFor="className">Class *</Label>
                <Input
                  id="className"
                  name="className"
                  type="text"
                  placeholder="e.g., Grade 10A, Class 5B"
                  value={formData.className}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            {formData.role === 'subject_teacher' && (
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="e.g., Mathematics, English, Science"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Private Account Creation</p>
                  <p>A unique username and secure password will be generated automatically. The user will receive these credentials privately.</p>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              variant="highlight"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </CardContent>
        </form>
      </Card>
      
      {generatedCredentials && (
        <CredentialsDisplay 
          credentials={generatedCredentials} 
          onClose={handleCredentialsClose}
        />
      )}
    </>
  );
};

export default AccountCreationForm;