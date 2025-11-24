
import React, { useState } from 'react';
import { Shield, Users, Server, DollarSign, AlertCircle, Ban, CheckCircle, Gavel, Activity, FileText, Flag, ShieldCheck, Lock } from '../Icons';
import Button from '../Button';
import { useToast } from '../../contexts/ToastContext';
import { getComplianceLogs } from '../../services/compliance';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'moderation' | 'system' | 'compliance'>('overview');
  const { success, info } = useToast();
  const complianceLogs = getComplianceLogs();

  // Mock Data
  const stats = {
    users: 15420,
    activeStreams: 42,
    reportsPending: 15,
    revenue: 124500,
    serverLoad: 65
  };

  const mockUsers = [
    { id: '1', name: 'SpamBot_99', email: 'bot@spam.com', status: 'active', role: 'user', reports: 12 },
    { id: '2', name: 'John Doe', email: 'john@example.com', status: 'active', role: 'creator', reports: 0 },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com', status: 'banned', role: 'user', reports: 5 }
  ];

  const mockReports = [
    { id: '101', type: 'Video', title: 'Inappropriate Content', reporter: 'ConcernedUser', date: '10 mins ago', status: 'pending' },
    { id: '102', type: 'Comment', title: 'Hate Speech', reporter: 'ModeratorBot', date: '1 hour ago', status: 'pending' },
    { id: '103', type: 'User', title: 'Impersonation', reporter: 'RealUser', date: '2 hours ago', status: 'reviewed' }
  ];

  const handleAction = (action: string, id: string) => {
    success(`Action '${action}' applied to ID: ${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-wetube-red/20 p-3 rounded-full">
          <Shield className="w-8 h-8 text-wetube-red" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400">Platform Management & System Monitoring</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-[#3F3F3F] mb-8 overflow-x-auto">
        {['overview', 'users', 'moderation', 'system', 'compliance'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-wetube-red text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1F1F1F] border border-[#3F3F3F] p-6 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Users</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stats.users.toLocaleString()}</h3>
              </div>
              <div className="bg-[#2a2a2a] p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="bg-[#1F1F1F] border border-[#3F3F3F] p-6 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Pending Reports</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stats.reportsPending}</h3>
              </div>
              <div className="bg-[#2a2a2a] p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <div className="bg-[#1F1F1F] border border-[#3F3F3F] p-6 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                <h3 className="text-2xl font-bold text-white mt-1">${stats.revenue.toLocaleString()}</h3>
              </div>
              <div className="bg-[#2a2a2a] p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="bg-[#1F1F1F] border border-[#3F3F3F] p-6 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Active Streams</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stats.activeStreams}</h3>
              </div>
              <div className="bg-[#2a2a2a] p-3 rounded-lg">
                <Activity className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <Gavel className="w-5 h-5 text-gray-400" /> Recent Moderation Actions
               </h3>
               <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex justify-between items-center py-2 border-b border-[#303030] last:border-0">
                     <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 bg-red-900/30 rounded-full flex items-center justify-center">
                           <Ban className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                           <div className="text-sm font-medium text-white">User Banned</div>
                           <div className="text-xs text-gray-500">SpamBot_{i} was banned for spamming</div>
                        </div>
                     </div>
                     <span className="text-xs text-gray-500">{i * 5} mins ago</span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <Server className="w-5 h-5 text-gray-400" /> System Alerts
               </h3>
               <div className="space-y-4">
                  <div className="flex gap-3 items-start bg-yellow-900/10 p-3 rounded-lg border border-yellow-900/30">
                     <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                     <div>
                        <div className="text-sm font-bold text-yellow-500">High CPU Usage (Region US-East)</div>
                        <div className="text-xs text-gray-400">Server load exceeded 85% for 5 minutes.</div>
                     </div>
                  </div>
                  <div className="flex gap-3 items-start bg-green-900/10 p-3 rounded-lg border border-green-900/30">
                     <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                     <div>
                        <div className="text-sm font-bold text-green-500">Database Backup Completed</div>
                        <div className="text-xs text-gray-400">Daily snapshot saved successfully.</div>
                     </div>
                  </div>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl overflow-hidden animate-in fade-in duration-300">
          <div className="p-6 border-b border-[#3F3F3F] flex justify-between items-center">
            <h3 className="font-bold text-white text-lg">User Management</h3>
            <div className="flex gap-2">
               <input type="text" placeholder="Search users..." className="bg-[#121212] border border-[#3F3F3F] rounded px-3 py-1.5 text-sm text-white" />
               <Button variant="secondary" size="sm">Search</Button>
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#121212] text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Reports</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#303030]">
              {mockUsers.map(user => (
                <tr key={user.id} className="hover:bg-[#2a2a2a]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white">{user.name[0]}</div>
                       <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                       </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300 capitalize">{user.role}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {user.status}
                     </span>
                  </td>
                  <td className="p-4 text-gray-300">{user.reports}</td>
                  <td className="p-4 flex gap-2">
                     <button onClick={() => handleAction('Ban', user.id)} className="p-1.5 hover:bg-red-900/40 text-red-500 rounded" title="Ban User">
                        <Ban className="w-4 h-4" />
                     </button>
                     <button onClick={() => handleAction('Verify', user.id)} className="p-1.5 hover:bg-green-900/40 text-green-500 rounded" title="Verify User">
                        <CheckCircle className="w-4 h-4" />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Moderation Tab */}
      {activeTab === 'moderation' && (
        <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl overflow-hidden animate-in fade-in duration-300">
          <div className="p-6 border-b border-[#3F3F3F]">
            <h3 className="font-bold text-white text-lg">Moderation Queue</h3>
          </div>
          <div className="divide-y divide-[#303030]">
            {mockReports.map(report => (
              <div key={report.id} className="p-6 flex items-start justify-between hover:bg-[#2a2a2a] transition-colors">
                <div className="flex items-start gap-4">
                   <div className="bg-red-900/20 p-3 rounded-lg">
                      <Flag className="w-6 h-6 text-red-500" />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-xs font-bold uppercase px-2 py-0.5 bg-[#333] rounded text-gray-300">{report.type}</span>
                         <span className="text-gray-500 text-xs">• {report.date}</span>
                      </div>
                      <h4 className="font-bold text-white text-lg">{report.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">Reported by {report.reporter}</p>
                      <div className="mt-3 p-3 bg-[#121212] border border-[#303030] rounded text-sm text-gray-300 italic">
                         "This content violates community guidelines regarding harassment..."
                      </div>
                   </div>
                </div>
                <div className="flex flex-col gap-2">
                   <Button variant="primary" size="sm" onClick={() => handleAction('Remove Content', report.id)}>Remove</Button>
                   <Button variant="secondary" size="sm" onClick={() => handleAction('Ignore Report', report.id)}>Ignore</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
           <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
              <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                 <Server className="w-5 h-5 text-blue-400" /> Server Health
              </h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between mb-2 text-sm">
                       <span className="text-gray-300">CPU Usage</span>
                       <span className="text-white font-bold">65%</span>
                    </div>
                    <div className="w-full h-2 bg-[#303030] rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-[65%]"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between mb-2 text-sm">
                       <span className="text-gray-300">Memory Usage</span>
                       <span className="text-white font-bold">42%</span>
                    </div>
                    <div className="w-full h-2 bg-[#303030] rounded-full overflow-hidden">
                       <div className="h-full bg-green-500 w-[42%]"></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
              <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                 <FileText className="w-5 h-5 text-purple-400" /> System Logs
              </h3>
              <div className="space-y-2 font-mono text-xs h-48 overflow-y-auto custom-scrollbar">
                 {[1,2,3,4,5].map(i => (
                    <div key={i} className="text-gray-400 border-b border-[#303030] pb-1 mb-1">
                       <span className="text-blue-500">[INFO]</span> 2025-05-15 14:2{i}:00 - Database connection pool refreshed.
                    </div>
                 ))}
                 <div className="text-gray-400 border-b border-[#303030] pb-1 mb-1">
                    <span className="text-yellow-500">[WARN]</span> 2025-05-15 14:18:45 - High latency detected.
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
         <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="bg-[#1F1F1F] border border-[#3F3F3F] p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="bg-blue-900/30 p-2 rounded-lg"><ShieldCheck className="w-6 h-6 text-blue-400" /></div>
                     <div>
                        <div className="text-gray-400 text-xs font-bold uppercase">GDPR Status</div>
                        <div className="text-lg font-bold text-white">Compliant</div>
                     </div>
                  </div>
                  <p className="text-xs text-gray-500">Data retention policies active. Cookie consent enabled.</p>
               </div>
               
               <div className="bg-[#1F1F1F] border border-[#3F3F3F] p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="bg-green-900/30 p-2 rounded-lg"><Lock className="w-6 h-6 text-green-400" /></div>
                     <div>
                        <div className="text-gray-400 text-xs font-bold uppercase">Encryption</div>
                        <div className="text-lg font-bold text-white">AES-256</div>
                     </div>
                  </div>
                  <p className="text-xs text-gray-500">At rest and in transit (TLS 1.3)</p>
               </div>

               <div className="bg-[#1F1F1F] border border-[#3F3F3F] p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="bg-purple-900/30 p-2 rounded-lg"><FileText className="w-6 h-6 text-purple-400" /></div>
                     <div>
                        <div className="text-gray-400 text-xs font-bold uppercase">Data Exports</div>
                        <div className="text-lg font-bold text-white">12 Pending</div>
                     </div>
                  </div>
                  <p className="text-xs text-gray-500">User data portability requests</p>
               </div>
            </div>

            <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl overflow-hidden">
               <div className="p-6 border-b border-[#3F3F3F] flex justify-between items-center">
                  <h3 className="font-bold text-white text-lg">Compliance Audit Log</h3>
                  <Button variant="secondary" size="sm">Export Logs</Button>
               </div>
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-[#121212] text-gray-400 text-xs uppercase tracking-wider">
                        <th className="p-4 font-medium">Timestamp</th>
                        <th className="p-4 font-medium">Action</th>
                        <th className="p-4 font-medium">Actor</th>
                        <th className="p-4 font-medium">Details</th>
                        <th className="p-4 font-medium">Severity</th>
                     </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-[#303030]">
                     {complianceLogs.map(log => (
                        <tr key={log.id} className="hover:bg-[#2a2a2a]">
                           <td className="p-4 text-gray-400 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                           <td className="p-4 font-bold text-white">{log.action}</td>
                           <td className="p-4 text-gray-300">{log.actorId}</td>
                           <td className="p-4 text-gray-300">{log.details}</td>
                           <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                 log.severity === 'high' ? 'bg-red-500/20 text-red-500' :
                                 log.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                 'bg-blue-500/20 text-blue-500'
                              }`}>
                                 {log.severity}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}

    </div>
  );
};

export default AdminDashboard;
