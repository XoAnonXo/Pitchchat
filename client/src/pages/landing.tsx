import { Button } from "@/components/ui/button";
import { Upload, MessageSquare, Share2, BarChart3, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";

export default function Landing() {
  const { user } = useAuth();

  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">PitchChat</span>
            </div>
            
            <Button 
              className="bg-black hover:bg-gray-800 text-white rounded-xl"
              onClick={() => window.location.href = "/auth"}
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn Documents Into
              <span className="block text-black">AI Pitch Rooms</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Upload. Chat. Share. Track investor engagement in real-time.
            </p>
            <Button 
              size="lg" 
              className="bg-black hover:bg-gray-800 text-white rounded-xl px-8 py-6 text-lg"
              onClick={() => window.location.href = "/auth"}
            >
              Start Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works - Visual Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Upload</h3>
              <p className="text-sm text-gray-600">PDFs, PPTX, XLSX, DOCX</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Chat</h3>
              <p className="text-sm text-gray-600">AI answers from your docs</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Share</h3>
              <p className="text-sm text-gray-600">Send secure links to investors</p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Track</h3>
              <p className="text-sm text-gray-600">See engagement analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features - Minimal Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Built for Founders</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="font-semibold text-gray-900 mb-4">Instant Answers</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-black mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">AI reads all your documents</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-black mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Has full context awareness</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-black mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Powered by OpenAI models</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="font-semibold text-gray-900 mb-4">Investor Ready</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-black mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Shareable pitch links</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-black mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Email-gated access</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-black mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">24/7 availability</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="font-semibold text-gray-900 mb-4">Full Analytics</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-black mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Track all conversations</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-black mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Engagement metrics</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-black mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Weekly email reports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to impress investors?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join founders using AI to handle investor questions 24/7
          </p>
          <Button 
            size="lg" 
            className="bg-black hover:bg-gray-800 text-white rounded-xl px-8 py-6 text-lg"
            onClick={() => window.location.href = "/api/login"}
          >
            Create Your Pitch Room <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">PitchChat</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2025 PitchChat. Built for founders, by founders.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}