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
            <span className="ml-3 text-2xl font-bold text-purple-800">aivanti</span>
          </div>
          
          {/* Welcome Text */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-purple-800 mb-6">
              Welcome back!
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Access your account to manage your AI assistant, streamline workflows, and enhance customer engagement. Let's continue <strong>driving your business forward with the power of Aivanti.</strong>
            </p>
          </div>
          
          {/* Illustration */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Person illustration */}
              <div className="w-80 h-80 relative">
                {/* Person figure */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                  {/* Head */}
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 relative">
                    {/* Hair braid */}
                    <div className="absolute -right-2 top-2 w-8 h-12 bg-gray-800 rounded-full transform rotate-12"></div>
                  </div>
                  
                  {/* Body */}
                  <div className="w-20 h-24 bg-indigo-500 rounded-t-lg mb-2"></div>
                  
                  {/* Arms */}
                  <div className="absolute -left-4 top-8 w-6 h-16 bg-gray-200 rounded-full transform -rotate-12"></div>
                  <div className="absolute -right-4 top-8 w-6 h-16 bg-gray-200 rounded-full transform rotate-12"></div>
                  
                  {/* Legs */}
                  <div className="w-8 h-16 bg-gray-200 rounded-b-lg inline-block mr-2"></div>
                  <div className="w-8 h-16 bg-gray-200 rounded-b-lg inline-block"></div>
                </div>
                
                {/* Desk */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-lg shadow-lg">
                  {/* Tablet */}
                  <div className="absolute left-8 top-2 w-12 h-8 bg-white border-2 border-gray-300 rounded">
                    <div className="w-4 h-4 bg-indigo-500 rounded-full mx-auto mt-1"></div>
                  </div>
                  
                  {/* Monitor */}
                  <div className="absolute right-8 top-1 w-16 h-6 bg-black rounded">
                    <div className="w-6 h-4 bg-indigo-500 rounded mx-auto mt-1"></div>
                    <div className="text-white text-xs text-center mt-1">5 3 8 0 2</div>
                  </div>
                  
                  {/* Coffee cup */}
                  <div className="absolute left-1/2 top-1 w-3 h-4 bg-white border border-gray-300 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Terms */}
        <div className="text-sm text-gray-600">
          By signing in, you agree to AIVANTI's <span className="text-indigo-500 font-medium cursor-pointer hover:underline">Terms of Service & Privacy Policy</span>
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
