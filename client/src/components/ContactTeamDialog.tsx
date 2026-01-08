import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Phone, Building2, Globe, User, CheckCircle } from "lucide-react";

interface ContactTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  linkSlug: string;
}

export default function ContactTeamDialog({ isOpen, onClose, conversationId, linkSlug }: ContactTeamDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company: "",
    website: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    company: "",
    website: "",
  });
  const [success, setSuccess] = useState(false);

  // Validation functions
  const validatePhone = (phone: string): string => {
    if (!phone) return "";
    // Allow international phone formats with optional + and digits/spaces/dashes
    const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return "Please enter a valid phone number";
    }
    return "";
  };

  const validateWebsite = (website: string): string => {
    if (!website) return "";
    try {
      const url = new URL(website.startsWith("http") ? website : `https://${website}`);
      if (!["http:", "https:"].includes(url.protocol)) {
        return "Please enter a valid website URL";
      }
    } catch {
      return "Please enter a valid website URL";
    }
    return "";
  };

  const validateName = (name: string): string => {
    if (!name) return "";
    if (name.length < 2) {
      return "Name must be at least 2 characters";
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      return "Name can only contain letters, spaces, hyphens, and apostrophes";
    }
    return "";
  };

  const validateCompany = (company: string): string => {
    if (!company) return "";
    if (company.length < 2) {
      return "Company name must be at least 2 characters";
    }
    return "";
  };

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch(`/api/conversations/${conversationId}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, linkSlug }),
        credentials: 'include',
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text}`);
      }
      
      return res.json();
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ name: "", phone: "", company: "", website: "" });
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit contact information",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {
      name: validateName(formData.name),
      phone: validatePhone(formData.phone),
      company: validateCompany(formData.company),
      website: validateWebsite(formData.website),
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (hasErrors) {
      return;
    }
    
    // Only submit if at least one field is filled
    if (formData.name || formData.phone || formData.company || formData.website) {
      submitMutation.mutate(formData);
    } else {
      toast({
        title: "Please provide at least one contact detail",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#FAFAFA] border border-black/8 rounded-3xl max-w-md shadow-[0_24px_80px_rgba(0,0,0,0.18)] font-sans p-0 overflow-hidden">
        {/* Header with subtle gradient */}
        <div className="px-7 pt-7 pb-5 bg-gradient-to-b from-white to-transparent">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-black tracking-tight">Contact the Team</DialogTitle>
          </DialogHeader>
        </div>

        <div className="px-7 pb-7">
          {success ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Success!</h3>
              <p className="text-black/50 max-w-[240px] mx-auto leading-relaxed text-sm">
                The team has been notified and will be in contact with you soon!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="p-4 rounded-2xl bg-white border border-black/8 shadow-sm">
                <p className="text-sm text-black/60 leading-relaxed">
                  Share your contact details so the founding team can reach out to you directly.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold text-black/80 mb-1.5 block">
                    Your Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="John Smith"
                      className={`pl-11 h-12 bg-white border-black/10 rounded-2xl text-sm focus:border-black focus:ring-black/10 transition-all placeholder:text-black/30 ${errors.name ? "border-red-500 focus:border-red-500" : ""}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium ml-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold text-black/80 mb-1.5 block">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 234 567 8900"
                      className={`pl-11 h-12 bg-white border-black/10 rounded-2xl text-sm focus:border-black focus:ring-black/10 transition-all placeholder:text-black/30 ${errors.phone ? "border-red-500 focus:border-red-500" : ""}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium ml-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="company" className="text-sm font-semibold text-black/80 mb-1.5 block">
                    Company
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="Venture Capital Inc."
                      className={`pl-11 h-12 bg-white border-black/10 rounded-2xl text-sm focus:border-black focus:ring-black/10 transition-all placeholder:text-black/30 ${errors.company ? "border-red-500 focus:border-red-500" : ""}`}
                    />
                  </div>
                  {errors.company && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium ml-1">{errors.company}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website" className="text-sm font-semibold text-black/80 mb-1.5 block">
                    Website
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://example.com"
                      className={`pl-11 h-12 bg-white border-black/10 rounded-2xl text-sm focus:border-black focus:ring-black/10 transition-all placeholder:text-black/30 ${errors.website ? "border-red-500 focus:border-red-500" : ""}`}
                    />
                  </div>
                  {errors.website && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium ml-1">{errors.website}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-12 rounded-2xl border-black/10 text-black/60 hover:bg-black/[0.04] hover:text-black font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="flex-1 h-12 rounded-2xl bg-black hover:bg-black/90 text-white font-bold shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] transition-all"
                >
                  {submitMutation.isPending ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  ) : null}
                  Submit
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
