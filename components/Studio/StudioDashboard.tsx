
import React from 'react';
import { DollarSign, Eye, User, Clock, Upload, Video, FileText, ArrowUp, ArrowDown, BarChart, Activity, CheckCircle, Users, Globe, MapPin, Download } from '../Icons';
import Button from '../Button';
import { useToast } from '../../contexts/ToastContext';

const StudioDashboard: React.FC = () => {
  const { success } = useToast();

  const handleExport = () => {
     success("Analytics report downloaded successfully!");
  };

  const StatCard = ({ title, value, subtext, icon: Icon, trend }: { title: string, value: string, subtext: string, icon: React.ElementType, trend?: 'up' | 'down' }) => (
    <div className="bg-[#1F1F1F] border border-[#3F3F3F] p-6 rounded-xl flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="p-2 bg-[#2a2a2a] rounded-lg">
           <Icon className="w-6 h-6 text-gray-300" />
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
            {trend === 'up' ? '+12%' : '-5%'}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <div className="text-2xl font-bold text-white mt-1">{value}</div>
        <div className="text-xs text-gray-500 mt-1">{subtext}</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
         <div>
            <h1 className="text-2xl font-bold text-white">Channel Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back, You! Here's what's happening with your channel.</p>
         </div>
         <div className="flex gap-3">
            <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
               Export Data
            </Button>
            <Button variant="secondary" icon={<Upload className="w-4 h-4" />}>
               Upload
            </Button>
            <Button variant="primary" icon={<Video className="w-4 h-4" />}>
               Go Live
            </Button>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
           title="Total Revenue" 
           value="$1,245.50" 
           subtext="Last 28 days" 
           icon={DollarSign} 
           trend="up"
        />
        <StatCard 
           title="Total Views" 
           value="45.2K" 
           subtext="Last 28 days" 
           icon={Eye} 
           trend="up"
        />
        <StatCard 
           title="Subscribers" 
           value="1,204" 
           subtext="+120 in last 28 days" 
           icon={User} 
           trend="up"
        />
        <StatCard 
           title="Watch Time (hrs)" 
           value="3.4K" 
           subtext="Last 28 days" 
           icon={Clock} 
           trend="down"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Main Chart Area */}
        <div className="xl:col-span-2 bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                 <BarChart className="w-5 h-5 text-wetube-red" /> Revenue Analytics
              </h3>
              <select className="bg-[#121212] border border-[#3F3F3F] rounded-lg px-3 py-1 text-sm text-gray-300">
                 <option>Last 7 days</option>
                 <option>Last 28 days</option>
                 <option>Last 90 days</option>
              </select>
           </div>
           
           {/* Mock Chart Bars */}
           <div className="h-64 flex items-end justify-between gap-2 px-2 border-b border-[#303030] pb-2">
              {[40, 65, 45, 80, 55, 90, 70, 60, 85, 75, 50, 95, 60, 70].map((h, i) => (
                 <div key={i} className="w-full bg-[#2a2a2a] hover:bg-wetube-red transition-colors rounded-t-sm relative group">
                    <div className="absolute bottom-0 left-0 right-0 bg-wetube-red/20 h-full rounded-t-sm" style={{ height: `${h}%` }}></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-wetube-red h-full rounded-t-sm opacity-80" style={{ height: `${h * 0.6}%` }}></div>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                       ${(h * 4.2).toFixed(2)}
                    </div>
                 </div>
              ))}
           </div>
           <div className="flex justify-between mt-4 text-xs text-gray-500">
              <span>May 1</span>
              <span>May 8</span>
              <span>May 15</span>
              <span>May 22</span>
           </div>
        </div>

        {/* Recent Video Performance */}
        <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
           <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Recent Video
           </h3>
           
           <div className="mb-6">
              <div className="aspect-video bg-black rounded-lg mb-3 overflow-hidden relative">
                 <img src="https://picsum.photos/seed/vid1/640/360" className="w-full h-full object-cover opacity-80" alt="Thumbnail" />
              </div>
              <h4 className="font-bold text-white line-clamp-1">Building a Clone of YouTube in 24 Hours!</h4>
              <p className="text-xs text-gray-500 mt-1">Published 2 days ago</p>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-sm text-gray-400">Ranking by views</span>
                 <span className="text-sm text-white font-bold">1 of 10</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm text-gray-400">Views</span>
                 <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-bold">1.2M</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                 </div>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm text-gray-400">Impressions CTR</span>
                 <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-bold">12.5%</span>
                    <ArrowUp className="w-3 h-3 text-green-500" />
                 </div>
              </div>
           </div>
           
           <button className="w-full mt-6 text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
              Go to video analytics
           </button>
        </div>
      </div>

      {/* Additional Analytics Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
         {/* Audience Demographics */}
         <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
            <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
               <Users className="w-5 h-5 text-purple-500" /> Audience
            </h3>
            
            <div className="flex items-center gap-8">
               {/* Pseudo-Pie Chart */}
               <div className="w-32 h-32 rounded-full border-8 border-[#2a2a2a] relative flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 border-8 border-purple-600 rounded-full border-l-transparent border-b-transparent rotate-45"></div>
                  <div className="text-center">
                     <div className="text-xs text-gray-400">Top Age</div>
                     <div className="text-lg font-bold text-white">18-24</div>
                  </div>
               </div>

               <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                     <div className="flex justify-between text-xs text-gray-400">
                        <span>Male</span>
                        <span>65%</span>
                     </div>
                     <div className="w-full h-1.5 bg-[#303030] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[65%]"></div>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <div className="flex justify-between text-xs text-gray-400">
                        <span>Female</span>
                        <span>30%</span>
                     </div>
                     <div className="w-full h-1.5 bg-[#303030] rounded-full overflow-hidden">
                        <div className="h-full bg-pink-500 w-[30%]"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Traffic Sources */}
         <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
            <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
               <Globe className="w-5 h-5 text-blue-400" /> Traffic Sources
            </h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-[#121212] rounded-lg border border-[#303030]">
                  <span className="text-sm font-medium text-white">YouTube Search</span>
                  <span className="text-sm font-bold text-blue-400">45%</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-[#121212] rounded-lg border border-[#303030]">
                  <span className="text-sm font-medium text-white">Suggested Videos</span>
                  <span className="text-sm font-bold text-purple-400">28%</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-[#121212] rounded-lg border border-[#303030]">
                  <span className="text-sm font-medium text-white">External</span>
                  <span className="text-sm font-bold text-green-400">15%</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-[#121212] rounded-lg border border-[#303030]">
                  <span className="text-sm font-medium text-white">Browse Features</span>
                  <span className="text-sm font-bold text-orange-400">12%</span>
               </div>
            </div>
         </div>
      </div>

      {/* Top Videos Table */}
      <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl overflow-hidden">
         <div className="p-6 border-b border-[#3F3F3F]">
            <h3 className="font-bold text-white text-lg">Top Performing Videos</h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-[#121212] text-gray-400 text-xs uppercase tracking-wider">
                     <th className="p-4 font-medium">Video</th>
                     <th className="p-4 font-medium">Views</th>
                     <th className="p-4 font-medium">Avg Duration</th>
                     <th className="p-4 font-medium">Revenue</th>
                  </tr>
               </thead>
               <tbody className="text-sm text-white divide-y divide-[#303030]">
                  {[1, 2, 3].map((_, i) => (
                     <tr key={i} className="hover:bg-[#2a2a2a] transition-colors">
                        <td className="p-4">
                           <div className="flex gap-3 items-center">
                              <div className="w-16 h-9 bg-gray-800 rounded overflow-hidden shrink-0">
                                 <img src={`https://picsum.photos/seed/top${i}/160/90`} className="w-full h-full object-cover" alt="Thumb" />
                              </div>
                              <div className="font-medium truncate max-w-[200px]">Building a Clone of YouTube in 24 Hours</div>
                           </div>
                        </td>
                        <td className="p-4">1.2M</td>
                        <td className="p-4">8:45</td>
                        <td className="p-4">$1,204.00</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="p-4 text-center border-t border-[#3F3F3F]">
            <button className="text-sm font-bold text-blue-400 hover:text-blue-300">See All</button>
         </div>
      </div>
    </div>
  );
};

export default StudioDashboard;
