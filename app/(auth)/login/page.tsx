import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
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
              Welcome back!
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Access your account to manage your AI assistant, streamline workflows, and enhance customer engagement. Let&apos;s continue <strong>driving your business forward with the power of AI Chat.</strong>
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
          By signing in, you agree to AI CHAT&apos;s <span className="text-indigo-500 font-medium cursor-pointer hover:underline">Terms of Service & Privacy Policy</span>
        </div>
      </div>
      
      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
