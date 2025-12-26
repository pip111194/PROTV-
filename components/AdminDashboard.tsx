
import React, { useState } from 'react';
/* Added missing MoreVertical import from lucide-react */
import { 
  BarChart3, Users, Tv, Plus, Edit2, Trash2, 
  Search, Shield, CheckCircle2, TrendingUp, Package, Globe,
  MoreVertical
} from 'lucide-react';
import { IPTVChannel } from '../types';
import { MOCK_CHANNELS, PLANS } from '../constants';

const AdminDashboard: React.FC = () => {
  const [channels, setChannels] = useState<IPTVChannel[]>(MOCK_CHANNELS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'channels' | 'plans' | 'stats'>('stats');

  const stats = [
    { label: 'Active Users', value: '14,820', growth: '+18%', icon: Users, color: 'text-blue-500' },
    { label: 'Live Channels', value: channels.length.toLocaleString(), growth: 'Stable', icon: Tv, color: 'text-[#FF6B35]' },
    { label: 'Premium Subs', value: '4,210', growth: '+5%', icon: Shield, color: 'text-[#00C9A7]' }
  ];

  const handleDelete = (id: string) => {
    if (confirm('Delete this channel permanently?')) {
      setChannels(channels.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-black tracking-tight mb-2">Management Console</h2>
           <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Global Content Control</p>
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
           {['stats', 'channels', 'plans'].map(t => (
             <button key={t} onClick={() => setActiveAdminTab(t as any)} className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeAdminTab === t ? 'bg-[#FF6B35] text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}>{t}</button>
           ))}
        </div>
      </div>

      {activeAdminTab === 'stats' && (
        <div className="space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="glass-card p-10 rounded-[3rem] border-white/5 group hover:border-[#FF6B35]/30 transition-all">
                  <div className="flex items-start justify-between mb-8">
                    <div className={`p-5 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                      <stat.icon size={28} />
                    </div>
                    <span className="text-xs font-black text-green-500 px-3 py-1.5 bg-green-500/10 rounded-xl">{stat.growth}</span>
                  </div>
                  <h4 className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-1">{stat.label}</h4>
                  <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                </div>
              ))}
           </div>
           
           <div className="glass-card p-12 rounded-[4rem] border-white/5 h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                 <TrendingUp size={48} className="mx-auto text-gray-700" />
                 <p className="text-gray-600 font-black uppercase text-xs tracking-widest">Real-time Analytics Engine Active</p>
              </div>
           </div>
        </div>
      )}

      {activeAdminTab === 'channels' && (
        <div className="glass-card rounded-[3.5rem] overflow-hidden border-white/5">
          <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-2xl font-black">Channel Repository</h3>
            <div className="flex gap-4">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="text" placeholder="Search Repo..."
                    className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-6 py-2.5 focus:outline-none focus:border-[#FF6B35] transition-all text-xs font-bold"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <button className="h-11 px-6 bg-[#FF6B35] rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all"><Plus size={16}/> New</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-10 py-6">Identity</th>
                  <th className="px-10 py-6">Classification</th>
                  <th className="px-10 py-6">Stream Node</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {channels.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <img src={c.logo} className="w-10 h-10 rounded-xl object-contain bg-white/5 p-1.5" alt="" onError={(e) => e.currentTarget.src='channel-placeholder.dim_150x150.png'} />
                        <span className="font-black text-sm">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6"><span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg text-gray-400">{c.category}</span></td>
                    <td className="px-10 py-6 text-xs text-gray-600 font-mono truncate max-w-[200px]">{c.url}</td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 bg-white/5 hover:bg-blue-500 rounded-xl text-blue-500 hover:text-white transition-all"><Edit2 size={16}/></button>
                        <button onClick={() => handleDelete(c.id)} className="p-2.5 bg-white/5 hover:bg-red-500 rounded-xl text-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeAdminTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {PLANS.map(plan => (
             <div key={plan.id} className="glass-card p-10 rounded-[3rem] border-white/5 group hover:border-[#FF6B35]/40 transition-all">
                <div className="flex justify-between items-start mb-8">
                   <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center"><Package size={24} className="text-[#FF6B35]"/></div>
                   <button className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white"><MoreVertical size={16}/></button>
                </div>
                <h4 className="text-xl font-black mb-1">{plan.name}</h4>
                <p className="text-2xl font-black text-[#FF6B35] mb-6">{plan.price}</p>
                <div className="space-y-3">
                   {plan.features.slice(0, 3).map((f, i) => <div key={i} className="text-[10px] font-bold text-gray-500 flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500"/> {f}</div>)}
                </div>
             </div>
           ))}
           <button className="glass-card border-dashed border-white/10 p-10 rounded-[3rem] flex flex-col items-center justify-center gap-4 group hover:bg-white/5 transition-all text-gray-600 hover:text-[#FF6B35]">
              <Plus size={40} />
              <span className="font-black uppercase text-[10px] tracking-widest">Add New Tier</span>
           </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
