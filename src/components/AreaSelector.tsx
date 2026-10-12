import React from 'react';
import { EDUCATIONAL_AREAS } from '../data/criteriaData';
import { getAreaColor } from '../data/areaColors';
import { StudentProfile } from '../types';
import { calculateAreaStats } from '../services/storageService';
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface AreaSelectorProps {
  activeAreaId: string;
  onSelectArea: (areaId: string) => void;
  activeStudent: StudentProfile;
}

export const AreaSelector: React.FC<AreaSelectorProps> = ({
  activeAreaId,
  onSelectArea,
  activeStudent,
}) => {
  return (
    <div className="no-print bg-slate-100/80 border-b border-slate-200 overflow-x-auto scrollbar-thin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center gap-1.5 min-w-max">
          {EDUCATIONAL_AREAS.map((area, index) => {
            const stats = calculateAreaStats(activeStudent, area.id);
            const isActive = activeAreaId === area.id;
            const isAllCompleted = stats.total > 0 && stats.completed === stats.total;
            const areaColor = getAreaColor(area.id);

            return (
              <button
                key={area.id}
                onClick={() => onSelectArea(area.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white shadow-xs border-2 ' + areaColor.cardBorder
                    : 'text-slate-700 hover:bg-white/70 hover:text-slate-900 border border-transparent'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? areaColor.tabActiveBg
                      : isAllCompleted
                      ? 'bg-emerald-600 text-white'
                      : areaColor.tabBadgeBg
                  }`}
                >
                  {isAllCompleted ? '✓' : index === 0 ? 'Х' : index}
                </span>

                <span className={`font-medium ${isActive ? areaColor.tabActiveText : 'text-slate-800'}`}>
                  {area.isActivityTrait ? 'Характеристика діяльності' : area.title.replace(' освітня галузь', '').replace(' освітні галузі', '')}
                </span>

                <span
                  className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-sm ${
                    isAllCompleted
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {stats.completed}/{stats.total}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
