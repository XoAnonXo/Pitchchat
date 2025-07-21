import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/auth/forgot-password", { email });
      
      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Email sent!",
          description: "Check your inbox for password reset instructions",
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Failed to send reset email",
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
          {!isSubmitted ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-semibold text-primary-text mb-2">
                  Forgot your password?
                </h1>
                <p className="text-secondary-text">
                  Enter your email and we'll send you instructions to reset it
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="border-border"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send reset email"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/auth" className="text-sm text-secondary-text hover:text-primary-text">
                  <ArrowLeft className="inline-block w-4 h-4 mr-1" />
                  Back to sign in
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-xl font-semibold text-primary-text mb-2">
                Check your email
              </h2>
              <p className="text-secondary-text mb-6">
                We've sent password reset instructions to {email}
              </p>
              <Link href="/auth">
                <Button className="bg-black hover:bg-gray-800 text-white">
                  Back to sign in
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}