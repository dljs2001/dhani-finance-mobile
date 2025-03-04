import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LockIcon, UserIcon } from 'lucide-react';

const Index = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(userId, password);
      navigate(userId === '9899654695' ? '/admin' : '/user');
    } catch (error) {
      console.error('Login error:', error);
      // Toast is already shown in the AuthContext
    }
  };

  const handleSignUp = () => {
    toast({
      title: "Coming Soon",
      description: "Sign-up feature will be available soon!",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom,_#0f0c29,_#302b63,_#24243e)] px-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <img
            src="/assets/images/dmi_dhani_logo.png"
            alt="Dhani Finance Logo"
            className="mx-auto h-20 w-auto mb-8 animate-float"
          />
        </div>

        <Card className="bg-[linear-gradient(to_bottom,_#24243e,_#302b63,_#0f0c29)] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl font-medium text-center text-white font-lobster text-glow animate-float">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-5 w-5 text-white/70" />
                  <Input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-3 h-5 w-5 text-white/70" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignUp}
                className="text-sm text-white/90 hover:text-white hover:bg-white/10"
              >
                Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;