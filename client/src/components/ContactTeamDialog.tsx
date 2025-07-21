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
}

export default function ContactTeamDialog({ isOpen, onClose, conversationId }: ContactTeamDialogProps) {
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
        body: JSON.stringify(data),
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
      <DialogContent className="bg-white rounded-2xl border-gray-200 shadow-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Contact the Team</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600">
              The team has been notified and will be in contact with you soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <p className="text-sm text-gray-600 mb-4">
              Share your contact details so the founding team can reach out to you directly. All fields are optional.
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Your Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="John Smith"
                  className={`border-gray-300 focus:border-black ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  WhatsApp/Telegram Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 234 567 8900"
                  className={`border-gray-300 focus:border-black ${errors.phone ? "border-red-500" : ""}`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Company
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Venture Capital Inc."
                  className={`border-gray-300 focus:border-black ${errors.company ? "border-red-500" : ""}`}
                />
                {errors.company && (
                  <p className="text-sm text-red-500 mt-1">{errors.company}</p>
                )}
              </div>

              <div>
                <Label htmlFor="website" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://example.com"
                  className={`border-gray-300 focus:border-black ${errors.website ? "border-red-500" : ""}`}
                />
                {errors.website && (
                  <p className="text-sm text-red-500 mt-1">{errors.website}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="flex-1 bg-black hover:bg-gray-800 text-white"
              >
                {submitMutation.isPending ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}