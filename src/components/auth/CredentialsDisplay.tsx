import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Copy, Eye, EyeOff, Shield } from 'lucide-react';
import { GeneratedCredentials } from '@/lib/credentialsGenerator';

interface CredentialsDisplayProps {
  credentials: GeneratedCredentials;
  onClose: () => void;
}

const CredentialsDisplay: React.FC<CredentialsDisplayProps> = ({ credentials, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Credentials have been copied to your clipboard."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please copy manually.",
        variant: "destructive"
      });
    }
  };

  const credentialsText = `Username: ${credentials.username}\nPassword: ${credentials.password}\nRole: ${credentials.role}${credentials.schoolId ? `\nSchool ID: ${credentials.schoolId}` : ''}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-elevated border-0">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mb-2">
            <Shield className="h-8 w-8 text-accent-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Account Created Successfully</CardTitle>
          <CardDescription>
            Save these credentials securely. They will not be shown again.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg border-2 border-dashed border-primary/20">
            <div className="space-y-3">
              <div>
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="username"
                    value={credentials.username}
                    readOnly
                    className="bg-background"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(credentials.username)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    readOnly
                    className="bg-background"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(credentials.password)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Role</Label>
                <Input
                  value={credentials.role.replace('_', ' ').toUpperCase()}
                  readOnly
                  className="bg-background mt-1"
                />
              </div>
              
              {credentials.schoolId && (
                <div>
                  <Label className="text-sm font-medium">School ID</Label>
                  <Input
                    value={credentials.schoolId}
                    readOnly
                    className="bg-background mt-1"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => copyToClipboard(credentialsText)}
              variant="outline"
              className="flex-1"
              disabled={copied}
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy All'}
            </Button>
            <Button
              onClick={onClose}
              variant="highlight"
              className="flex-1"
            >
              Continue
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              ⚠️ Make sure to save these credentials securely before continuing
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CredentialsDisplay;