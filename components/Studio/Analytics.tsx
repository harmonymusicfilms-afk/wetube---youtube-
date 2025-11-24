
import React, { useState } from 'react';
import { BarChart2, TrendingUp, TrendingDown, Users, Clock, Globe, DollarSign, Calendar, Filter } from '../Icons';
import Button from '../Button';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('28d');

  return (
    <div className="max-w-7xl mx-auto p-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-wetube-red" /> Advanced Analytics
          </h1>
          <p className="text-gray-400">Deep dive into your channel's performance and audience insights.</p>
        </div>
        <div className="flex gap-3 bg-[#1F1F1F] p-1 rounded-lg border border-[#3F3F3F]">
           {['7d', '28d', '90d', '365d'].map(range => (
              <button
                 key={range}
                 onClick={() => setTimeRange(range)}
                 className={`px-4 py-2 rounded font-medium text-sm transition-colors ${timeRange === range ? 'bg-[#333] text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                 {range}
              </button>
           ))}
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
           { label: 'Views', value: '1.2M', change: '+12%', icon: Users, color: 'blue' },
           { label: 'Watch Time', value: '45.2K hrs', change: '-5%', icon: Clock, color: 'purple' },
           { label: 'Subscribers', value: '+3.5K', change: '+22%', icon: TrendingUp, color: 'green' },
           { label: 'Est. Revenue', value: '$4,250.00', change: '+8%', icon: DollarSign, color: 'yellow' }
        ].map((stat, i) => (
           <div key={i} className="bg-[#1F1F1F] border border-[#3F3F3F] p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                 <div className={`bg-${stat.color}-500/20 p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                 </div>
                 <div className={`flex items-center text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {stat.change}
                 </div>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
           </div>
        ))}
      </div>

      {/* Main Graph Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         <div className="lg:col-span-2 bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-white">Views & Engagement</h3>
               <Button variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />}>Compare</Button>
            </div>
            <div className="h-80 w-full bg-[#121212] rounded-lg border border-[#303030] flex items-end justify-between p-4 gap-1">
               {/* Simulated Line Chart using CSS bars for visual effect */}
               {Array.from({ length: 30 }).map((_, i) => {
                  const height = 30 + Math.random() * 60;
                  return (
                     <div key={i} className="flex-1 bg-gradient-to-t from-wetube-red/20 to-wetube-red/80 rounded-t-sm relative group hover:from-wetube-red hover:to-red-400 transition-all" style={{ height: `${height}%` }}>
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none">
                           {Math.floor(height * 100)} views
                        </div>
                     </div>
                  );
               })}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-500">
               <span>Start of period</span>
               <span>End of period</span>
            </div>
         </div>

         {/* Realtime */}
         <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Realtime Activity</h3>
            <div className="text-4xl font-bold text-white mb-2">4,205</div>
            <div className="text-sm text-gray-400 mb-6">Views • Last 48 hours</div>
            
            <div className="space-y-4">
               {[1,2,3,4,5].map((_, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                     <span className="text-gray-300 truncate max-w-[180px]">Video Title {i+1} - Viral Hit</span>
                     <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#303030] rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500" style={{ width: `${80 - (i * 10)}%` }}></div>
                        </div>
                        <span className="text-white font-mono">{80 - (i * 10)}%</span>
                     </div>
                  </div>
               ))}
            </div>
            <Button variant="secondary" className="w-full mt-6">See More</Button>
         </div>
      </div>

      {/* Retention & Geographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Audience Retention</h3>
            <div className="bg-[#121212] p-4 rounded-lg border border-[#303030] h-64 flex items-center justify-center text-gray-500 relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transform skew-y-3 origin-bottom-left"></div>
                <div className="w-full h-full absolute inset-0 flex items-end px-4 pb-4">
                   <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                      <path d="M0,20 Q25,5 50,25 T100,30" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <path d="M0,50 L0,20 Q25,5 50,25 T100,30 L100,50 Z" fill="url(#gradient)" opacity="0.2" />
                      <defs>
                         <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="transparent" />
                         </linearGradient>
                      </defs>
                   </svg>
                </div>
                <span className="z-10 bg-black/50 px-3 py-1 rounded backdrop-blur-sm">Avg. View Duration: 4:35 (45%)</span>
            </div>
            <p className="text-xs text-gray-400 mt-4">
               The first 30 seconds determine your video's success. Try improving your hooks.
            </p>
         </div>

         <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
               <Globe className="w-5 h-5 text-blue-400" /> Top Geographies
            </h3>
            <div className="space-y-4">
               {[
                  { country: 'United States', percent: 45, flag: '🇺🇸' },
                  { country: 'India', percent: 20, flag: '🇮🇳' },
                  { country: 'United Kingdom', percent: 12, flag: '🇬🇧' },
                  { country: 'Germany', percent: 8, flag: '🇩🇪' },
                  { country: 'Canada', percent: 5, flag: '🇨🇦' },
               ].map((geo, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#121212] rounded-lg border border-[#303030]">
                     <div className="flex items-center gap-3">
                        <span className="text-xl">{geo.flag}</span>
                        <span className="text-sm font-medium text-white">{geo.country}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-[#303030] rounded-full overflow-hidden hidden sm:block">
                           <div className="h-full bg-blue-500" style={{ width: `${geo.percent}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-blue-400 w-8 text-right">{geo.percent}%</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
