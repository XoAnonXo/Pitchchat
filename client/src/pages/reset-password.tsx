import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation, useRoute } from "wouter";
import { Lock, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [, params] = useRoute("/reset-password/:token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const token = params?.token;

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid link",
        description: "This password reset link is invalid",
        variant: "destructive",
      });
      setLocation("/auth");
    }
  }, [token, toast, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/auth/reset-password", {
        token,
        password,
      });
      
      if (response.ok) {
        setIsReset(true);
        toast({
          title: "Password reset successful!",
          description: "You can now sign in with your new password",
        });
        setTimeout(() => {
          setLocation("/auth");
        }, 3000);
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Failed to reset password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card p-8 rounded-xl shadow-soft border border-border">
          {!isReset ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-semibold text-primary-text mb-2">
                  Reset your password
                </h1>
                <p className="text-secondary-text">
                  Enter your new password below
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="border-border"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset password"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-primary-text mb-2">
                Password reset successful!
              </h2>
              <p className="text-secondary-text">
                Redirecting to sign in page...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}