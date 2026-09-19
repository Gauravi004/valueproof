'use client';

import React, { useState } from 'react';
import { Hammer, Sparkles, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { RenovationScenario } from '@/types/valuation';
import { formatINR } from '@/lib/currency';
import { calculateRenovationScenario } from '@/lib/api';

interface RenovationSimulatorProps {
  initialScenario?: RenovationScenario | null;
  currentEstimatedValue: number;
  areaSqft: number;
  currentCondition: string;
}

export const RenovationSimulator: React.FC<RenovationSimulatorProps> = ({
  initialScenario,
  currentEstimatedValue,
  areaSqft,
  currentCondition,
}) => {
  const [scope, setScope] = useState<string>('full_interior');
  const [customCost, setCustomCost] = useState<string>('');
  const [scenario, setScenario] = useState<RenovationScenario | null>(initialScenario || null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async (selectedScope: string, costVal?: string) => {
    setLoading(true);
    try {
      const cCost = costVal && parseFloat(costVal) > 0 ? parseFloat(costVal) : null;
      const res = await calculateRenovationScenario(
        currentEstimatedValue,
        areaSqft,
        selectedScope,
        cCost,
        currentCondition
      );
      setScenario(res);
    } catch (err) {
      console.error('Renovation simulation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const onScopeChange = (newScope: string) => {
    setScope(newScope);
    handleSimulate(newScope, customCost);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Hammer className="w-5 h-5 text-emerald-400" />
            <span>Renovation Scenario & ROI Simulator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Model potential capital deployment, value uplift, and projected equity gain.
          </p>
        </div>

        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          Illustrative Projection
        </span>
      </div>

      {/* Scope Selector Tabs */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'full_interior', label: 'Full Interior' },
          { id: 'kitchen_and_bath', label: 'Kitchen & Bath' },
          { id: 'exterior_and_paint', label: 'Exterior Elevation' },
          { id: 'structural_overhaul', label: 'Civil Overhaul' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onScopeChange(item.id)}
            className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
              scope === item.id
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Simulation Result Waterfall */}
      {scenario && (
        <div className="mt-5 space-y-4">
          <p className="text-xs text-slate-300 font-medium italic">
            &ldquo;{scenario.scope_description}&rdquo;
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Box 1: Current Value */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 block uppercase">
                Current Valuation
              </span>
              <span className="text-base font-bold text-slate-200 font-mono">
                {formatINR(scenario.current_estimated_value)}
              </span>
            </div>

            {/* Box 2: Renovation Cost */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-medium text-amber-400 block uppercase">
                Projected Cost
              </span>
              <span className="text-base font-bold text-amber-400 font-mono">
                {formatINR(scenario.renovation_cost)}
              </span>
            </div>

            {/* Box 3: Potential Post-Value */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 block uppercase">
                Potential Post-Value
              </span>
              <span className="text-base font-bold text-slate-100 font-mono">
                {formatINR(scenario.potential_post_renovation_value)}
              </span>
            </div>

            {/* Box 4: Potential Net Gain */}
            <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/50">
              <span className="text-[11px] font-bold text-emerald-400 block uppercase">
                Potential Net Gain
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  +{formatINR(scenario.potential_net_gain)}
                </span>
                <span className="text-xs font-semibold text-emerald-300">
                  ({scenario.roi_percentage}% ROI)
                </span>
              </div>
            </div>
          </div>

          {/* Explicit Non-Guaranteed Scenario Disclaimer */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-start space-x-2 text-[11px] text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p>{scenario.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};
