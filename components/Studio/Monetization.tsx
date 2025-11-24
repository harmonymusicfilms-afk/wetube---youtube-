
import React, { useState } from 'react';
import { DollarSign, CheckCircle, AlertCircle, CreditCard, Gift, Briefcase, FileCheck, Lock, ChevronDown, Smartphone, PlusCircle } from '../Icons';
import Button from '../Button';
import Input from '../Input';

const Monetization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'payouts'>('overview');

  // Mock data for eligibility
  const eligibility = {
    subscribers: { current: 1204, required: 1000 },
    watchHours: { current: 3400, required: 4000 },
    twoFactor: true,
    communityGuidelines: true
  };

  const isEligible = 
    eligibility.subscribers.current >= eligibility.subscribers.required &&
    eligibility.watchHours.current >= eligibility.watchHours.required &&
    eligibility.twoFactor &&
    eligibility.communityGuidelines;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-wetube-red" /> Monetization
        </h1>
        <p className="text-gray-400">Manage your revenue streams, check eligibility, and configure payouts.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-[#3F3F3F] mb-8 overflow-x-auto">
        {['overview', 'products', 'payouts'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`py-3 px-2 font-medium text-sm capitalize border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab ? 'border-wetube-red text-white' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Become a Partner</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Earn money from your videos, get creator support, and more. 
                  {isEligible 
                    ? " You've met the requirements! Apply now to start earning." 
                    : " Track your progress towards eligibility below."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
                  {/* Subscribers Card */}
                  <div className="bg-[#121212] rounded-xl p-6 border border-[#3F3F3F]">
                    <div className="flex justify-between items-start mb-2">
                       <span className="font-bold text-lg text-white">Subscribers</span>
                       {eligibility.subscribers.current >= eligibility.subscribers.required && (
                         <CheckCircle className="w-6 h-6 text-green-500" />
                       )}
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{eligibility.subscribers.current.toLocaleString()}</div>
                    <div className="text-sm text-gray-400 mb-4">required: {eligibility.subscribers.required.toLocaleString()}</div>
                    <div className="w-full h-2 bg-[#303030] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-wetube-red rounded-full" 
                        style={{ width: `${Math.min((eligibility.subscribers.current / eligibility.subscribers.required) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Watch Hours Card */}
                  <div className="bg-[#121212] rounded-xl p-6 border border-[#3F3F3F]">
                    <div className="flex justify-between items-start mb-2">
                       <span className="font-bold text-lg text-white">Public Watch Hours</span>
                       {eligibility.watchHours.current >= eligibility.watchHours.required && (
                         <CheckCircle className="w-6 h-6 text-green-500" />
                       )}
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{eligibility.watchHours.current.toLocaleString()}</div>
                    <div className="text-sm text-gray-400 mb-4">required: {eligibility.watchHours.required.toLocaleString()}</div>
                    <div className="w-full h-2 bg-[#303030] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${Math.min((eligibility.watchHours.current / eligibility.watchHours.required) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Safety Checks */}
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-sm mb-8">
                   <div className="flex items-center gap-2 bg-[#121212] px-4 py-2 rounded-full border border-[#3F3F3F]">
                      {eligibility.twoFactor ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Lock className="w-4 h-4 text-gray-400" />}
                      <span className="text-gray-300">2-Step Verification</span>
                   </div>
                   <div className="flex items-center gap-2 bg-[#121212] px-4 py-2 rounded-full border border-[#3F3F3F]">
                      {eligibility.communityGuidelines ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                      <span className="text-gray-300">Community Guidelines</span>
                   </div>
                </div>

                <Button 
                  variant={isEligible ? 'primary' : 'secondary'} 
                  size="lg" 
                  disabled={!isEligible}
                  className="w-full max-w-xs mx-auto"
                >
                  {isEligible ? 'Apply Now' : 'Notify me when I’m eligible'}
                </Button>
             </div>
          </div>

          {/* Right Side Info */}
          <div className="space-y-6">
             <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">Partner Benefits</h3>
                <ul className="space-y-4">
                   <li className="flex items-start gap-3">
                      <div className="bg-[#2a2a2a] p-2 rounded-lg"><DollarSign className="w-5 h-5 text-green-400" /></div>
                      <div>
                         <div className="font-medium text-white">Earn from ads</div>
                         <div className="text-xs text-gray-500">Get revenue from ads played on your videos</div>
                      </div>
                   </li>
                   <li className="flex items-start gap-3">
                      <div className="bg-[#2a2a2a] p-2 rounded-lg"><Gift className="w-5 h-5 text-pink-400" /></div>
                      <div>
                         <div className="font-medium text-white">Fan Funding</div>
                         <div className="text-xs text-gray-500">Memberships, Supers, and Shopping</div>
                      </div>
                   </li>
                   <li className="flex items-start gap-3">
                      <div className="bg-[#2a2a2a] p-2 rounded-lg"><Briefcase className="w-5 h-5 text-blue-400" /></div>
                      <div>
                         <div className="font-medium text-white">Creator Support</div>
                         <div className="text-xs text-gray-500">Get 24/7 chat support</div>
                      </div>
                   </li>
                </ul>
             </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="animate-in fade-in duration-300 space-y-6">
           <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6 flex items-center justify-between">
              <div className="flex gap-4">
                 <div className="bg-[#2a2a2a] p-4 rounded-xl">
                    <DollarSign className="w-8 h-8 text-green-500" />
                 </div>
                 <div>
                    <h3 className="font-bold text-white text-lg">Watch Page Ads</h3>
                    <p className="text-gray-400 text-sm">Earn from ads on your long-form videos.</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-sm font-medium text-green-500">Active</span>
                 <Button variant="secondary" size="sm">Manage</Button>
              </div>
           </div>

           <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6 flex items-center justify-between">
              <div className="flex gap-4">
                 <div className="bg-[#2a2a2a] p-4 rounded-xl">
                    <Smartphone className="w-8 h-8 text-red-500" />
                 </div>
                 <div>
                    <h3 className="font-bold text-white text-lg">Shorts Feed Ads</h3>
                    <p className="text-gray-400 text-sm">Earn from ads between videos in the Shorts Feed.</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-sm font-medium text-gray-500">Not Setup</span>
                 <Button variant="primary" size="sm">Turn On</Button>
              </div>
           </div>

           <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6 flex items-center justify-between">
              <div className="flex gap-4">
                 <div className="bg-[#2a2a2a] p-4 rounded-xl">
                    <Gift className="w-8 h-8 text-purple-500" />
                 </div>
                 <div>
                    <h3 className="font-bold text-white text-lg">Memberships</h3>
                    <p className="text-gray-400 text-sm">Create a fan club with monthly paying members.</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-sm font-medium text-gray-500">Not Setup</span>
                 <Button variant="primary" size="sm">Get Started</Button>
              </div>
           </div>
        </div>
      )}

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left: Payment Settings */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
                 <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-wetube-red" /> How you get paid
                 </h3>
                 
                 <div className="bg-[#121212] rounded-lg p-4 border border-[#3F3F3F] flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                       </div>
                       <div>
                          <div className="font-medium text-white">Wire transfer to bank account</div>
                          <div className="text-xs text-gray-500">*****6789 • Chase Bank</div>
                       </div>
                    </div>
                    <Button variant="secondary" size="sm">Edit</Button>
                 </div>

                 <Button variant="ghost" icon={<PlusCircle className="w-4 h-4" />} className="w-full border border-dashed border-[#3F3F3F]">
                    Add payment method
                 </Button>
              </div>

              <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
                 <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-blue-500" /> Tax Information
                 </h3>
                 <div className="grid gap-4">
                    <div className="flex items-center justify-between py-2 border-b border-[#3F3F3F]">
                       <span className="text-gray-300">United States tax info</span>
                       <span className="text-green-500 text-sm font-bold bg-green-500/10 px-2 py-1 rounded">Approved</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                       <span className="text-gray-300">W-8BEN Form</span>
                       <span className="text-gray-500 text-sm">Submitted May 12, 2025</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right: Payment Schedule */}
           <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6 h-fit">
              <h3 className="font-bold text-white text-lg mb-4">Payment Schedule</h3>
              <div className="relative pl-4 border-l-2 border-[#303030] space-y-6 py-2">
                 <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-[#1F1F1F]"></div>
                    <div className="text-sm font-bold text-white">May 21 - 26</div>
                    <div className="text-xs text-gray-400">Estimated payment processed</div>
                 </div>
                 <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-600 border-2 border-[#1F1F1F]"></div>
                    <div className="text-sm font-bold text-gray-400">Jun 21 - 26</div>
                    <div className="text-xs text-gray-500">Next cycle</div>
                 </div>
              </div>
              
              <div className="mt-6 bg-[#121212] p-4 rounded-lg border border-[#3F3F3F]">
                 <div className="text-xs text-gray-500 mb-1">Payment threshold</div>
                 <div className="w-full h-1.5 bg-[#303030] rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-blue-500 w-[75%]"></div>
                 </div>
                 <div className="flex justify-between text-[10px] text-gray-400">
                    <span>$75.00</span>
                    <span>$100.00</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Monetization;
