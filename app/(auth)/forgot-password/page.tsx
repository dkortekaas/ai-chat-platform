import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export default function ForgotPasswordPage() {
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
              Forgot your password?
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              No worries! Enter your email address and we&apos;ll send you a link to reset your password. You&apos;ll be back to <strong>managing your AI assistant in no time.</strong>
            </p>
          </div>
          
          {/* Illustration */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Person illustration */}
      \
            </div>
          </div>
        </div>
        
        {/* Terms */}
        <div className="text-sm text-gray-600">
          Need help? Contact our <span className="text-indigo-500 font-medium cursor-pointer hover:underline">support team</span>
        </div>
      </div>
      
      {/* Right Section - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
