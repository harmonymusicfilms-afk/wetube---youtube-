
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from './Button';
import Input from './Input';
import { Mail, Lock, User, Eye, EyeOff, Loader2, Smartphone, CheckCircle } from './Icons';

const AuthPage: React.FC = () => {
  const { login, register, loginWithProvider, loginWithPhone, verifyOtp } = useAuth();
  const { error, success } = useToast();
  
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Password Strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length > 6) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };
  
  const passwordStrength = getPasswordStrength(password);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      error("Please fill in all fields");
      return;
    }

    if (!isLogin && !name) {
      error("Please enter your name");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password, rememberMe);
        success("Welcome back!");
      } else {
        await register(email, password, name);
        success("Registration successful! Please check your email.");
      }
    } catch (err: any) {
      error(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
        error("Please enter a phone number");
        return;
    }
    setIsLoading(true);

    try {
        if (!showOtpInput) {
            // Step 1: Request OTP
            const { error: reqError } = await loginWithPhone(phone);
            if (reqError) throw reqError;
            setShowOtpInput(true);
            success("OTP sent to your phone");
        } else {
            // Step 2: Verify OTP
            const { error: verifyError } = await verifyOtp(phone, otp);
            if (verifyError) throw verifyError;
            success("Welcome back!");
        }
    } catch (err: any) {
        error(err.message || "Phone authentication failed");
    } finally {
        setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'discord') => {
      try {
          await loginWithProvider(provider);
      } catch (err: any) {
          error(err.message || `${provider} login failed`);
      }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
      <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 pb-0 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-7 bg-wetube-red rounded-lg flex items-center justify-center">
              <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">Wetube</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          
          {/* Auth Method Tabs */}
          {isLogin && (
            <div className="flex justify-center gap-4 mt-4 border-b border-[#3F3F3F] pb-4">
                <button 
                    onClick={() => { setAuthMethod('email'); setShowOtpInput(false); }}
                    className={`text-sm font-medium pb-1 transition-colors ${authMethod === 'email' ? 'text-white border-b-2 border-wetube-red' : 'text-gray-500'}`}
                >
                    Email
                </button>
                <button 
                    onClick={() => { setAuthMethod('phone'); setShowOtpInput(false); }}
                    className={`text-sm font-medium pb-1 transition-colors ${authMethod === 'phone' ? 'text-white border-b-2 border-wetube-red' : 'text-gray-500'}`}
                >
                    Phone
                </button>
            </div>
          )}
        </div>

        {/* Forms */}
        <div className="p-8">
            {authMethod === 'email' || !isLogin ? (
                <form onSubmit={handleEmailSubmit} className="space-y-5">
                {!isLogin && (
                    <div className="relative">
                    <Input 
                        placeholder="Full Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                    />
                    <User className="w-5 h-5 text-gray-500 absolute left-3 top-[38px] -translate-y-1/2" />
                    </div>
                )}

                <div className="relative">
                    <Input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    />
                    <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-[38px] -translate-y-1/2" />
                </div>

                <div className="relative">
                    <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    />
                    <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-[38px] -translate-y-1/2" />
                    <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                
                {!isLogin && password && (
                    <div className="flex gap-1 h-1 mt-1">
                        <div className={`flex-1 rounded-full ${passwordStrength > 0 ? 'bg-red-500' : 'bg-gray-700'}`}></div>
                        <div className={`flex-1 rounded-full ${passwordStrength > 2 ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
                        <div className={`flex-1 rounded-full ${passwordStrength > 4 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                    </div>
                )}

                {isLogin && (
                    <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300">
                        <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-wetube-red rounded" 
                        />
                        Remember me
                    </label>
                    <button type="button" className="text-wetube-red hover:underline font-medium">
                        Forgot password?
                    </button>
                    </div>
                )}

                <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full py-3 text-base mt-2"
                    isLoading={isLoading}
                >
                    {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
                </form>
            ) : (
                <form onSubmit={handlePhoneSubmit} className="space-y-5">
                    {!showOtpInput ? (
                        <div className="relative">
                            <Input 
                                type="tel"
                                placeholder="Phone Number (e.g. +15550000000)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="pl-10"
                            />
                            <Smartphone className="w-5 h-5 text-gray-500 absolute left-3 top-[38px] -translate-y-1/2" />
                        </div>
                    ) : (
                        <div className="relative">
                            <Input 
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="pl-10 tracking-widest text-center font-mono"
                                maxLength={6}
                            />
                            <CheckCircle className="w-5 h-5 text-gray-500 absolute left-3 top-[38px] -translate-y-1/2" />
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        variant="primary" 
                        className="w-full py-3 text-base mt-2"
                        isLoading={isLoading}
                    >
                        {showOtpInput ? 'Verify OTP' : 'Send Login Code'}
                    </Button>
                    {showOtpInput && (
                        <button 
                            type="button" 
                            onClick={() => setShowOtpInput(false)} 
                            className="w-full text-sm text-gray-400 hover:text-white"
                        >
                            Back to phone number
                        </button>
                    )}
                </form>
            )}

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3F3F3F]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1F1F1F] px-2 text-gray-500">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button 
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="bg-[#121212] hover:bg-[#2a2a2a] border border-[#3F3F3F] text-white rounded-lg py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-xs">G</span>
                </div>
                Google
                </button>
                <button 
                    type="button"
                    onClick={() => handleSocialLogin('github')}
                    className="bg-[#121212] hover:bg-[#2a2a2a] border border-[#3F3F3F] text-white rounded-lg py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white border border-white">
                    <span className="font-bold text-xs">GH</span>
                </div>
                Github
                </button>
            </div>
        </div>

        {/* Footer */}
        <div className="bg-[#121212] p-4 text-center border-t border-[#3F3F3F]">
          <p className="text-sm text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setAuthMethod('email');
                setEmail('');
                setPassword('');
                setName('');
              }}
              className="text-white font-bold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
