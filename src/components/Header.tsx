import React from 'react';
import { BookOpen, FileText, Users, Award, Printer, HelpCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'evaluate' | 'certificate' | 'students' | 'normative';
  setActiveTab: (tab: 'evaluate' | 'certificate' | 'students' | 'normative') => void;
  onPrintCertificate: () => void;
  activeStudentCode: string;
  activeGrade: 3 | 4;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onPrintCertificate,
  activeStudentCode,
  activeGrade,
}) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                  Свідоцтво досягнень
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  НУШ {activeGrade} клас
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Автоматизований помічник оцінювання за наказом МОН №813
              </p>
            </div>
          </div>

          {/* Navigation links (Clean typography, whitespace-nowrap) */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('evaluate')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'evaluate'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Оцінювання</span>
            </button>

            <button
              onClick={() => setActiveTab('certificate')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'certificate'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Бланк свідоцтва</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'students'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Учні класу</span>
            </button>

            <button
              onClick={() => setActiveTab('normative')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'normative'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden md:inline">Нормативна база</span>
            </button>
          </nav>

          {/* Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onPrintCertificate}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors shadow-xs whitespace-nowrap cursor-pointer"
              title="Відкрити друк бланка (A4 / PDF)"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Друк у PDF (МОН №2)</span>
              <span className="sm:hidden">Друк</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
