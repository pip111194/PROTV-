
import React from 'react';
import { Check, Shield, Star, Zap, Users } from 'lucide-react';
import { PLANS } from '../constants';

const SubscriptionPlans: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Upgrade to Pro</h2>
        <p className="text-gray-400 max-w-xl mx-auto">Choose the plan that fits your entertainment needs. Unlock 4K streaming, Hindi dubbing, and multiscreen support.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan, idx) => (
          <div 
            key={plan.id}
            className={`glass-card rounded-[32px] p-8 flex flex-col relative transition-all duration-500 hover:scale-105 ${idx === 2 ? 'border-[#FF6B35]/50 shadow-[0_0_50px_rgba(255,107,53,0.1)]' : ''}`}
          >
            {idx === 2 && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FF6B35] rounded-full text-xs font-bold text-white uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                {idx === 0 ? <Zap className="text-blue-400" /> : idx === 1 ? <Shield className="text-[#00C9A7]" /> : <Star className="text-[#FF6B35]" />}
              </div>
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price.split('/')[0]}</span>
                <span className="text-gray-500">/{plan.price.split('/')[1]}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="p-1 rounded-full bg-green-500/10 text-green-500">
                    <Check size={14} />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${idx === 2 ? 'bg-[#FF6B35] hover:bg-[#FF8C66]' : 'bg-white/10 hover:bg-white/20'}`}>
              Select {plan.name}
            </button>
          </div>
        ))}
      </div>

      {/* Feature Matrix Header */}
      <div className="glass-card rounded-3xl p-8 overflow-hidden">
        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
          <Users size={20} className="text-[#00C9A7]" /> Feature Comparison
        </h3>
        <div className="space-y-6">
          {[
            { label: 'Cloud Recording', basic: false, standard: true, premium: true },
            { label: 'Parental Controls', basic: true, standard: true, premium: true },
            { label: 'Real-time Hindi Dubbing', basic: false, standard: false, premium: true },
            { label: 'Priority Support', basic: false, standard: true, premium: true },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-4 items-center py-2 border-b border-white/5 last:border-0">
              <span className="text-gray-400 text-sm font-medium">{row.label}</span>
              <div className="flex justify-center">{row.basic ? <Check className="text-green-500" size={18} /> : <div className="w-4 h-0.5 bg-gray-700"></div>}</div>
              <div className="flex justify-center">{row.standard ? <Check className="text-green-500" size={18} /> : <div className="w-4 h-0.5 bg-gray-700"></div>}</div>
              <div className="flex justify-center">{row.premium ? <Check className="text-green-500" size={18} /> : <div className="w-4 h-0.5 bg-gray-700"></div>}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
