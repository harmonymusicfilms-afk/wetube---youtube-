
import React, { useState } from 'react';
import { User, Shield, BellRing, Link, Lock, Smartphone, Globe, Trash2, FileDown, CheckCircle } from './Icons';
import Button from './Button';
import Input from './Input';
import { useUser } from '../contexts/AuthContext';
import { downloadUserData } from '../services/compliance';
import { useToast } from '../contexts/ToastContext';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');
  const user = useUser();
  const { success } = useToast();

  const handleDownloadData = () => {
     if (user) {
        downloadUserData(user);
        success("Your data export has started downloading.");
     }
  };

  const MenuItem = ({ id, label, icon: Icon }: { id: string; label: string; icon: React.ElementType }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-left ${
        activeTab === id ? 'bg-[#2a2a2a] text-white font-medium' : 'text-gray-400 hover:bg-[#1F1F1F] hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          <MenuItem id="account" label="Account" icon={User} />
          <MenuItem id="privacy" label="Privacy" icon={Shield} />
          <MenuItem id="notifications" label="Notifications" icon={BellRing} />
          <MenuItem id="connected" label="Connected Apps" icon={Link} />
        </div>

        {/* Content Area */}
        <div className="bg-[#1F1F1F] rounded-2xl border border-[#3F3F3F] p-8 min-h-[500px]">
          {activeTab === 'account' && (
             <div className="space-y-8 animate-in fade-in duration-300">
               <div>
                 <h2 className="text-xl font-bold text-white mb-1">Profile Information</h2>
                 <p className="text-gray-400 text-sm mb-6">Update your personal details</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Input label="First Name" defaultValue="Demo" />
                   <Input label="Last Name" defaultValue="User" />
                   <Input label="Email" defaultValue="user@example.com" />
                   <Input label="Phone" placeholder="+1 (555) 000-0000" />
                 </div>
               </div>

               <div className="border-t border-[#3F3F3F] pt-8">
                 <h2 className="text-xl font-bold text-white mb-1">Security</h2>
                 <p className="text-gray-400 text-sm mb-6">Manage your password and 2FA</p>
                 
                 <div className="flex items-center justify-between bg-[#121212] p-4 rounded-xl border border-[#3F3F3F] mb-4">
                   <div className="flex items-center gap-4">
                      <div className="bg-[#2a2a2a] p-2 rounded-full">
                        <Lock className="w-5 h-5 text-wetube-red" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Password</div>
                        <div className="text-xs text-gray-500">Last changed 3 months ago</div>
                      </div>
                   </div>
                   <Button variant="secondary" size="sm">Update</Button>
                 </div>

                 <div className="flex items-center justify-between bg-[#121212] p-4 rounded-xl border border-[#3F3F3F]">
                   <div className="flex items-center gap-4">
                      <div className="bg-[#2a2a2a] p-2 rounded-full">
                        <Smartphone className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Two-Factor Authentication</div>
                        <div className="text-xs text-gray-500">Add an extra layer of security</div>
                      </div>
                   </div>
                   <Button variant="primary" size="sm">Enable</Button>
                 </div>
               </div>
             </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-white">Privacy Settings</h2>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between py-3 border-b border-[#3F3F3F]">
                   <div>
                     <div className="font-medium text-white">Keep all my subscriptions private</div>
                     <div className="text-xs text-gray-500">Other users won't see who you subscribe to</div>
                   </div>
                   <div className="w-12 h-6 bg-wetube-red rounded-full relative cursor-pointer">
                     <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                   </div>
                 </div>

                 <div className="flex items-center justify-between py-3 border-b border-[#3F3F3F]">
                   <div>
                     <div className="font-medium text-white">Keep all my saved playlists private</div>
                     <div className="text-xs text-gray-500">Only you can see your playlists</div>
                   </div>
                   <div className="w-12 h-6 bg-[#3F3F3F] rounded-full relative cursor-pointer">
                     <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full shadow-sm"></div>
                   </div>
                 </div>
              </div>

              <div className="mt-8 pt-8 border-t border-[#3F3F3F]">
                 <h2 className="text-xl font-bold text-white mb-4">Your Data</h2>
                 <div className="bg-[#121212] p-4 rounded-xl border border-[#3F3F3F]">
                    <div className="flex items-start gap-4">
                       <div className="bg-[#2a2a2a] p-2 rounded-lg">
                          <FileDown className="w-6 h-6 text-blue-400" />
                       </div>
                       <div className="flex-1">
                          <h3 className="font-bold text-white">Download your data</h3>
                          <p className="text-sm text-gray-400 mt-1 mb-4">
                             Get a copy of your data including videos, comments, and account activity. 
                             This helps you comply with GDPR data portability rights.
                          </p>
                          <Button variant="secondary" size="sm" onClick={handleDownloadData} icon={<FileDown className="w-4 h-4" />}>
                             Request Export
                          </Button>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
             <div className="space-y-6 animate-in fade-in duration-300">
               <h2 className="text-xl font-bold text-white">Notifications</h2>
               <div className="bg-[#121212] rounded-xl p-4 border border-[#3F3F3F]">
                  <h3 className="font-bold text-sm text-gray-300 mb-4 uppercase tracking-wider">Email Notifications</h3>
                  <div className="space-y-4">
                    {['Subscription activity', 'Recommended videos', 'Activity on my channel', 'Replies to my comments'].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                         <input type="checkbox" defaultChecked className="accent-wetube-red w-4 h-4 rounded" />
                         <span className="text-white text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
               </div>
             </div>
          )}

          {activeTab === 'connected' && (
             <div className="space-y-6 animate-in fade-in duration-300">
               <h2 className="text-xl font-bold text-white">Connected Apps</h2>
               <div className="grid gap-4">
                  <div className="flex items-center justify-between bg-[#121212] p-4 rounded-xl border border-[#3F3F3F]">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">G</div>
                        <div>
                           <div className="font-medium text-white">Google</div>
                           <div className="text-xs text-green-500">Connected</div>
                        </div>
                     </div>
                     <Button variant="ghost" size="sm">Disconnect</Button>
                  </div>
                  <div className="flex items-center justify-between bg-[#121212] p-4 rounded-xl border border-[#3F3F3F]">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#5865F2] rounded-lg flex items-center justify-center font-bold text-white">D</div>
                        <div>
                           <div className="font-medium text-white">Discord</div>
                           <div className="text-xs text-gray-500">Not Connected</div>
                        </div>
                     </div>
                     <Button variant="secondary" size="sm">Connect</Button>
                  </div>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
