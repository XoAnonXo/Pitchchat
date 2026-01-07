import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Sparkles, BarChart3, Link2, MessageSquare, FileText, Upload, Users, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { motion, AnimatePresence, useMotionValue, PanInfo } from "framer-motion";
import { BlobMorphBackground } from "@/components/backgrounds";
import type { User } from "@shared/schema";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

// Feature cards with pastel backgrounds matching landing page
const featureCards = [
  {
    id: 1,
    label: "AI Rooms",
    title: "Pitch 24/7",
    description: "Your deck answers investor questions automatically with grounded, citation-backed responses.",
    bgColor: "bg-[#DAE8FB]",
    mockup: "chat",
  },
  {
    id: 2,
    label: "Lead Capture",
    title: "Know your viewers",
    description: "Gate access with email capture. See who's interested before they reach out.",
    bgColor: "bg-[#E8E4F3]",
    mockup: "leads",
  },
  {
    id: 3,
    label: "Analytics",
    title: "Track intent",
    description: "See what investors asked, what they revisited, and where they spent time.",
    bgColor: "bg-[#EAE3D1]",
    mockup: "analytics",
  },
  {
    id: 4,
    label: "Share",
    title: "Smart links",
    description: "Track every view, control access, and see who's engaging with your pitch.",
    bgColor: "bg-[#F5F5F5]",
    mockup: "link",
  },
  {
    id: 5,
    label: "Documents",
    title: "Upload once",
    description: "Drop your deck, memo, and data room. PitchChat indexes everything.",
    bgColor: "bg-[#DAE8FB]",
    mockup: "upload",
  },
];

// Mini mockup components matching landing page style
function ChatMockup() {
  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-black px-3 py-2">
          <p className="text-[11px] text-white">What's your ARR?</p>
        </div>
      </div>
      <div className="flex justify-start">
        <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-black/10 bg-white px-3 py-2">
          <p className="text-[11px] text-black/70">$2.4M ARR, 180% YoY growth</p>
          <div className="mt-1.5 flex gap-1">
            <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[8px] font-medium text-black/50">metrics.pdf</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadsMockup() {
  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-black/10 bg-white p-3">
        <p className="text-[10px] font-semibold text-black/40 uppercase tracking-wider">Enter email to continue</p>
        <div className="mt-2 flex gap-2">
          <div className="flex-1 rounded-lg bg-black/[0.04] px-2 py-1.5">
            <span className="text-[10px] text-black/30">name@venture.com</span>
          </div>
          <div className="rounded-lg bg-black px-2 py-1.5">
            <ArrowRight className="h-3 w-3 text-white" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-black/[0.04] px-2 py-1.5">
        <Users className="h-3 w-3 text-black/40" />
        <span className="text-[10px] text-black/50">12 leads this week</span>
      </div>
    </div>
  );
}

function AnalyticsMockup() {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1 rounded-xl bg-white border border-black/10 p-2 text-center">
          <p className="text-lg font-bold text-black">47</p>
          <p className="text-[8px] text-black/40 uppercase">Views</p>
        </div>
        <div className="flex-1 rounded-xl bg-white border border-black/10 p-2 text-center">
          <p className="text-lg font-bold text-black">23</p>
          <p className="text-[8px] text-black/40 uppercase">Questions</p>
        </div>
      </div>
      <div className="rounded-xl bg-white border border-black/10 p-2">
        <p className="text-[9px] font-medium text-black/40 uppercase">Top Questions</p>
        <div className="mt-1.5 flex gap-1">
          <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[8px] text-black/60">Revenue</span>
          <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[8px] text-black/60">Team</span>
        </div>
      </div>
    </div>
  );
}

function LinkMockup() {
  return (
    <div className="space-y-2">
      <div className="rounded-xl bg-white border border-black/10 p-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-black">
            <Link2 className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-black truncate">pitch.chat/acme</p>
            <p className="text-[9px] text-black/40">Created 2 days ago</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <span className="rounded-full border border-black/10 bg-white px-2 py-1 text-[9px] text-black/50">12 views</span>
        <span className="rounded-full border border-black/10 bg-white px-2 py-1 text-[9px] text-black/50">3 leads</span>
      </div>
    </div>
  );
}

function UploadMockup() {
  return (
    <div className="space-y-2">
      <div className="rounded-xl border-2 border-dashed border-black/15 bg-white/50 p-3 text-center">
        <Upload className="mx-auto h-4 w-4 text-black/30" />
        <p className="mt-1 text-[9px] text-black/40">Drop files here</p>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 rounded-lg bg-white border border-black/10 px-2 py-1.5">
          <FileText className="h-3 w-3 text-red-500" />
          <span className="text-[10px] text-black/60 flex-1">Deck.pdf</span>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white border border-black/10 px-2 py-1.5">
          <FileText className="h-3 w-3 text-blue-500" />
          <span className="text-[10px] text-black/60 flex-1">Financials.xlsx</span>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
        </div>
      </div>
    </div>
  );
}

const mockupComponents: Record<string, React.FC> = {
  chat: ChatMockup,
  leads: LeadsMockup,
  analytics: AnalyticsMockup,
  link: LinkMockup,
  upload: UploadMockup,
};

// Swipeable Card Carousel Component
function FeatureCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const dragY = useMotionValue(0);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featureCards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold) {
      setActiveIndex((prev) => (prev + 1) % featureCards.length);
    } else if (info.offset.y > threshold) {
      setActiveIndex((prev) => (prev - 1 + featureCards.length) % featureCards.length);
    }
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  }, []);

  // Handle scroll wheel
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.feature-carousel')) return;

      e.preventDefault();
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        if (e.deltaY > 30) {
          setActiveIndex((prev) => (prev + 1) % featureCards.length);
        } else if (e.deltaY < -30) {
          setActiveIndex((prev) => (prev - 1 + featureCards.length) % featureCards.length);
        }
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 8000);
      }, 50);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="feature-carousel relative h-[520px] w-full flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        {featureCards.map((card, index) => {
          const offset = index - activeIndex;
          const normalizedOffset = ((offset % featureCards.length) + featureCards.length) % featureCards.length;
          const displayOffset = normalizedOffset > featureCards.length / 2
            ? normalizedOffset - featureCards.length
            : normalizedOffset;

          const isActive = index === activeIndex;
          const scale = isActive ? 1 : 0.88 - Math.abs(displayOffset) * 0.04;
          const y = displayOffset * 75;
          const opacity = isActive ? 1 : Math.max(0.4, 0.8 - Math.abs(displayOffset) * 0.2);
          const zIndex = featureCards.length - Math.abs(displayOffset);

          const MockupComponent = mockupComponents[card.mockup];

          return (
            <motion.div
              key={card.id}
              className="absolute w-full max-w-[420px] cursor-grab active:cursor-grabbing"
              initial={{ scale: 0.8, y: 100, opacity: 0 }}
              animate={{
                scale,
                y,
                opacity,
                zIndex,
                rotateX: displayOffset * -2,
              }}
              exit={{ scale: 0.8, y: -100, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              drag={isActive ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={isActive ? handleDragEnd : undefined}
              style={{ y: isActive ? dragY : y }}
              whileTap={isActive ? { scale: 0.98 } : {}}
            >
              {/* Card with pastel background */}
              <div className={`
                ${card.bgColor} rounded-[32px] p-7
                shadow-xl shadow-black/10
                transition-all duration-300
                ${isActive ? 'ring-2 ring-black/10' : ''}
              `}>
                {/* Label */}
                <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/40">
                  PitchChat
                </div>

                {/* Title */}
                <h3 className="mt-2 font-inter-tight text-[26px] font-semibold tracking-tight text-black">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-[14px] leading-relaxed text-black/55">
                  {card.description}
                </p>

                {/* Mini mockup */}
                <div className="mt-5">
                  <MockupComponent />
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Progress indicators */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
        {featureCards.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 8000);
            }}
            className={`
              h-1.5 rounded-full transition-all duration-300
              ${index === activeIndex
                ? 'w-6 bg-black'
                : 'w-1.5 bg-black/30 hover:bg-black/50'}
            `}
          />
        ))}
      </div>

      {/* Swipe hint */}
      <motion.div
        className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-black/40 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Swipe to explore
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  usePageTitle('Sign In');
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  useEffect(() => {
    void import("@/pages/dashboard");
  }, []);

  // Redirect if already authenticated
  if (!isLoading && isAuthenticated) {
    setLocation("/");
    return null;
  }

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const primeBootstrapCache = (user: User) => {
    queryClient.setQueryData(["/api/bootstrap"], {
      user,
      projects: [],
      analytics: {
        totalQuestions: 0,
        activeLinks: 0,
        monthlyCost: 0,
      },
      conversations: [],
    });
    queryClient.setQueryData(["/api/projects"], []);
    queryClient.setQueryData(["/api/analytics"], {
      totalQuestions: 0,
      activeLinks: 0,
      monthlyCost: 0,
    });
    queryClient.setQueryData(["/api/conversations"], []);
  };

  const handleAuthSuccess = (user: User, isNewSignup: boolean) => {
    queryClient.setQueryData(["/api/auth/user"], user);
    if (isNewSignup && typeof window !== "undefined") {
      sessionStorage.setItem("pc_onboarding", "1");
      primeBootstrapCache(user);
    } else {
      primeBootstrapCache(user);
      void queryClient.invalidateQueries({ queryKey: ["/api/bootstrap"] });
    }
    setLocation("/");
  };

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
    },
    onSuccess: (user: User) => {
      handleAuthSuccess(user, false);
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const res = await apiRequest("POST", "/api/auth/register", data);
      return res.json();
    },
    onSuccess: (user: User) => {
      handleAuthSuccess(user, true);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Unable to create account",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  const onLoginSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-section-gray">
        <Loader2 className="h-8 w-8 animate-spin text-black/30" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - Light panel matching landing page hero */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-section-gray">
        {/* Blob morph background like landing page hero */}
        <BlobMorphBackground />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-14">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-10 h-10 rounded-xl border border-black/10 bg-white flex items-center justify-center shadow-[0_1px_0_rgba(0,0,0,0.06)]">
              <Logo size="lg" className="p-1.5" />
            </div>
            <span className="font-inter-tight text-[15px] font-semibold tracking-tight text-black">PitchChat</span>
          </motion.div>

          {/* Feature Cards Carousel */}
          <div className="flex-1 flex items-center justify-center py-8">
            <FeatureCarousel />
          </div>

          {/* Bottom tagline */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-black/40 text-sm">
              Trusted by 500+ founders raising their next round
            </p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - Clean white form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
              <Logo size="lg" variant="white" className="p-1.5" />
            </div>
            <span className="text-black font-semibold text-xl tracking-tight">PitchChat</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight mb-3">
              {activeTab === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-black/50 text-lg">
              {activeTab === "login"
                ? "Sign in to access your pitch rooms"
                : "Start converting investors today"}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-8">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "login"
                  ? "bg-white text-black shadow-sm"
                  : "text-black/50 hover:text-black/70"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "register"
                  ? "bg-white text-black shadow-sm"
                  : "text-black/50 hover:text-black/70"
              }`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black/70 text-sm font-medium">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="you@company.com"
                              type="email"
                              className="h-14 px-5 rounded-2xl border-gray-200 bg-gray-50/50 text-black placeholder:text-black/30 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black/70 text-sm font-medium">Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your password"
                              type="password"
                              className="h-14 px-5 rounded-2xl border-gray-200 bg-gray-50/50 text-black placeholder:text-black/30 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Link href="/forgot-password" className="text-sm text-black/50 hover:text-black transition-colors">
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 rounded-2xl bg-black hover:bg-gray-800 text-white font-semibold text-base shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/25 transition-all hover:-translate-y-0.5"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black/70 text-sm font-medium">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="you@company.com"
                              type="email"
                              className="h-14 px-5 rounded-2xl border-gray-200 bg-gray-50/50 text-black placeholder:text-black/30 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black/70 text-sm font-medium">Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Create a password"
                              type="password"
                              className="h-14 px-5 rounded-2xl border-gray-200 bg-gray-50/50 text-black placeholder:text-black/30 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black/70 text-sm font-medium">Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Confirm your password"
                              type="password"
                              className="h-14 px-5 rounded-2xl border-gray-200 bg-gray-50/50 text-black placeholder:text-black/30 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full h-14 rounded-2xl bg-black hover:bg-gray-800 text-white font-semibold text-base shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/25 transition-all hover:-translate-y-0.5"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-black/40">or continue with</span>
            </div>
          </div>

          {/* Google OAuth */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-14 rounded-2xl border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-semibold transition-all"
            onClick={() => window.location.href = "/api/auth/google"}
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          {/* Terms */}
          <p className="mt-8 text-center text-sm text-black/40">
            By continuing, you agree to our{" "}
            <a href="#" className="text-black/60 hover:text-black underline">Terms</a>
            {" "}and{" "}
            <a href="#" className="text-black/60 hover:text-black underline">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
