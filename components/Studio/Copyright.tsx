
import React, { useState, useEffect } from 'react';
import { Copyright, AlertCircle, CheckCircle, FileWarning, Filter, Gavel, DollarSign, Activity } from '../Icons';
import Button from '../Button';
import { getClaims, disputeClaim } from '../../services/copyright';
import { CopyrightClaim } from '../../types';
import { useToast } from '../../contexts/ToastContext';

const CopyrightManager: React.FC = () => {
  const [claims, setClaims] = useState<CopyrightClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { success, info } = useToast();

  useEffect(() => {
    const loadClaims = async () => {
      const data = await getClaims();
      setClaims(data);
      setIsLoading(false);
    };
    loadClaims();
  }, []);

  const handleDispute = async (id: string) => {
    const reason = prompt("Please enter the reason for your dispute (e.g., Fair Use):");
    if (reason) {
      await disputeClaim(id, reason);
      setClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'disputed' } : c));
      success("Dispute submitted for review.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Copyright className="w-8 h-8 text-wetube-red" /> Copyright
        </h1>
        <p className="text-gray-400">Manage content ID claims and protect your intellectual property.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1F1F1F] border border-[#3F3F3F] p-6 rounded-xl flex items-center gap-4">
          <div className="bg-yellow-900/20 p-3 rounded-full">
            <FileWarning className="w-8 h-8 text-yellow-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{claims.filter(c => c.status === 'active').length}</div>
            <div className="text-sm text-gray-400">Active Claims</div>
          </div>
        </div>
        
        <div className="bg-[#1F1F1F] border border-[#3F3F3F] p-6 rounded-xl flex items-center gap-4">
          <div className="bg-blue-900/20 p-3 rounded-full">
            <Gavel className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{claims.filter(c => c.status === 'disputed').length}</div>
            <div className="text-sm text-gray-400">In Dispute</div>
          </div>
        </div>

        <div className="bg-[#1F1F1F] border border-[#3F3F3F] p-6 rounded-xl flex items-center gap-4">
          <div className="bg-green-900/20 p-3 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-sm text-gray-400">Strikes</div>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#3F3F3F] flex justify-between items-center">
          <h3 className="font-bold text-white text-lg">Content ID Claims</h3>
          <Button variant="secondary" size="sm" icon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading claims...</div>
        ) : claims.length === 0 ? (
          <div className="p-12 text-center">
             <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-50" />
             <p className="text-lg text-white">No copyright claims found</p>
             <p className="text-gray-500">Great job! Your content is clear.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#121212] text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Video</th>
                <th className="p-4 font-medium">Claimant</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Impact</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#303030]">
              {claims.map(claim => (
                <tr key={claim.id} className="hover:bg-[#2a2a2a] transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-white">{claim.videoTitle}</div>
                    <div className="text-xs text-gray-500">{claim.timestamp}</div>
                  </td>
                  <td className="p-4 text-gray-300">{claim.claimant}</td>
                  <td className="p-4 text-gray-300 capitalize">{claim.type}</td>
                  <td className="p-4">
                    {claim.action === 'block' && <span className="text-red-500 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Blocked</span>}
                    {claim.action === 'monetize' && <span className="text-yellow-500 font-bold flex items-center gap-1"><DollarSign className="w-3 h-3" /> Shared Revenue</span>}
                    {claim.action === 'track' && <span className="text-blue-500 font-bold flex items-center gap-1"><Activity className="w-3 h-3" /> Tracking</span>}
                  </td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        claim.status === 'active' ? 'bg-red-500/20 text-red-500' :
                        claim.status === 'disputed' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-green-500/20 text-green-500'
                     }`}>
                        {claim.status}
                     </span>
                  </td>
                  <td className="p-4">
                    {claim.status === 'active' && (
                      <Button variant="secondary" size="sm" onClick={() => handleDispute(claim.id)}>
                        Dispute
                      </Button>
                    )}
                    {claim.status === 'disputed' && (
                       <span className="text-xs text-gray-500 italic">Review pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CopyrightManager;
