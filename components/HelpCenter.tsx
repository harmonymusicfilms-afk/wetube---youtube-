
import React, { useState } from 'react';
import { HelpCircle, BookOpen, Shield, DollarSign, Video, Search, ChevronDown, ChevronRight } from './Icons';
import Input from './Input';

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSection, setOpenSection] = useState<string | null>('getting-started');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      items: [
        'How to create an account',
        'Uploading your first video',
        'Customizing your channel',
        'Supported video formats'
      ]
    },
    {
      id: 'monetization',
      title: 'Monetization & Payments',
      icon: DollarSign,
      items: [
        'Partner Program eligibility',
        'Setting up payments',
        'Understanding revenue analytics',
        'Tax information requirements'
      ]
    },
    {
      id: 'safety',
      title: 'Safety & Copyright',
      icon: Shield,
      items: [
        'Community Guidelines',
        'Copyright strikes explained',
        'Reporting inappropriate content',
        'Privacy settings'
      ]
    },
    {
      id: 'streaming',
      title: 'Live Streaming',
      icon: Video,
      items: [
        'How to go live',
        'Streaming software setup (OBS)',
        'Stream moderation tools',
        'Live analytics'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">How can we help you?</h1>
        <div className="max-w-xl mx-auto relative">
          <Input 
            placeholder="Search for help articles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-3 bg-[#1F1F1F] border-[#3F3F3F] focus:border-blue-500"
          />
          <Search className="w-5 h-5 text-gray-500 absolute left-3 top-[26px] -translate-y-1/2" />
        </div>
      </div>

      <div className="grid gap-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-6 hover:bg-[#2a2a2a] transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#121212] p-3 rounded-lg border border-[#3F3F3F]">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{section.title}</h3>
                  <p className="text-sm text-gray-400">{section.items.length} articles</p>
                </div>
              </div>
              {openSection === section.id ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
            </button>

            {openSection === section.id && (
              <div className="border-t border-[#3F3F3F] bg-[#121212]">
                {section.items.map((item, idx) => (
                  <button 
                    key={idx}
                    className="w-full text-left px-6 py-4 text-gray-300 hover:text-white hover:bg-[#1a1a1a] flex items-center gap-3 border-b border-[#303030] last:border-0 transition-colors"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Still need help?</h3>
        <p className="text-gray-400 mb-6">Our support team is available 24/7 to assist you with any issues.</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default HelpCenter;
