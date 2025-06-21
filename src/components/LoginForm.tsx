
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted with:', { email, password });
    setIsLoading(true);
    
    try {
      const loginResult = login(email, password);
      console.log('Login result:', loginResult);
      
      if (loginResult) {
        toast({
          title: "Success",
          description: "Logged in successfully"
        });
        console.log('Navigating to dashboard...');
        navigate('/dashboard');
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials. Try admin@example.com with admin123 or user@example.com with user123",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg border-2 border-red-100">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
        <p className="text-gray-600 mt-2">Sign in to access the dashboard</p>
        <div className="text-sm text-gray-500 mt-3 p-3 bg-gray-50 rounded-md">
          <p className="font-medium mb-1">Demo Credentials:</p>
          <p>Admin: admin@example.com / admin123</p>
          <p>User: user@example.com / user123</p>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Enter your email" 
              className="h-11"
              required 
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter your password" 
              className="h-11"
              required 
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 h-11 text-base font-medium mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
