import { SignupForm } from '@/components/auth/signup-form'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex">
      {/* Left Section - Information */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
        <div>
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>
            <span className="ml-3 text-2xl font-bold text-purple-800">AI Chat</span>
          </div>
          
          {/* Welcome Text */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-purple-800 mb-6">
              Join AI Chat today!
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Create your account and start building powerful AI assistants that will transform your business. Get ready to <strong>unlock the full potential of AI-driven customer engagement.</strong>
            </p>
          </div>
          
          {/* Illustration */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Person illustration */}

            </div>
          </div>
        </div>
        
        {/* Terms */}
        <div className="text-sm text-gray-600">
          By creating an account, you agree to AI CHAT&apos;s <span className="text-indigo-500 font-medium cursor-pointer hover:underline">Terms of Service & Privacy Policy</span>
        </div>
      </div>
      
      {/* Right Section - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
