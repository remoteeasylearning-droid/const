import React, { useState } from 'react';
import { StudentProfile, Grade } from '../types';
import { calculateStudentStats } from '../services/storageService';
import {
  User,
  Plus,
  Sliders,
  ChevronDown,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface StudentBarProps {
  students: StudentProfile[];
  activeStudent: StudentProfile;
  onSelectStudent: (id: string) => void;
  onAddStudent: (grade: Grade) => void;
  onUpdateStudent: (id: string, updates: Partial<StudentProfile>) => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentBar: React.FC<StudentBarProps> = ({
  students,
  activeStudent,
  onSelectStudent,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const stats = calculateStudentStats(activeStudent);

  return (
    <>
      <div className="no-print bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left section: Student selection & Grade switch */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Student Selector */}
              <div className="relative inline-block text-left">
                <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/70 rounded-lg p-1 transition-colors">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 pl-2">
                    Учень:
                  </span>
                  <select
                    value={activeStudent.id}
                    onChange={(e) => onSelectStudent(e.target.value)}
                    className="bg-white border border-slate-200 text-slate-800 text-sm font-semibold rounded-md py-1 px-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {students.map((s) => {
                      const sStats = calculateStudentStats(s);
                      return (
                        <option key={s.id} value={s.id}>
                          {s.code} ({s.grade} клас) — {sStats.percent}%
                        </option>
                      );
                    })}
                  </select>

                  <button
                    onClick={() => onAddStudent(activeStudent.grade)}
                    className="p-1 text-slate-600 hover:text-blue-700 hover:bg-white rounded-md transition-colors cursor-pointer"
                    title="Додати нового учня"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-white rounded-md transition-colors cursor-pointer"
                    title="Видалити поточного учня зі списку"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Grade Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => onUpdateStudent(activeStudent.id, { grade: 3 })}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    activeStudent.grade === 3
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  3 клас
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStudent(activeStudent.id, { grade: 4 })}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    activeStudent.grade === 4
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  4 клас
                </button>
              </div>

              {/* Student code settings toggle button */}
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  isSettingsOpen
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Позначення учня</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    isSettingsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Direct "Видалити учня зі списку" button */}
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                title="Видалити поточного учня зі списку"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Видалити учня зі списку</span>
              </button>
            </div>

            {/* Right section: Progress bar */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-medium text-slate-500">
                  Заповнено показників
                </div>
                <div className="text-sm font-bold text-slate-800 font-mono tabular-nums">
                  {stats.completed} з {stats.total} ({stats.percent}%)
                </div>
              </div>

              <div className="w-32 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Collapsible Student Settings Box */}
          {isSettingsOpen && (
            <div className="mt-3 pt-3 border-t border-slate-200 bg-slate-50/70 p-3 rounded-lg">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="max-w-xs flex-1">
                  <label className="block font-semibold text-slate-700 mb-1 text-xs flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Умовне позначення учня (без персональних даних)
                  </label>
                  <input
                    type="text"
                    value={activeStudent.code}
                    onChange={(e) =>
                      onUpdateStudent(activeStudent.id, { code: e.target.value })
                    }
                    placeholder="наприклад: Учень 1"
                    className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="self-end mb-1">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-red-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Видалити учня зі списку</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal (Pure React, works reliably in iframes) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Видалити учня зі списку?
                </h3>
                <p className="text-xs text-slate-500">
                  Підтвердження дії
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Ви впевнені, що бажаєте видалити картку <strong className="text-slate-900 font-bold">«{activeStudent.code}»</strong> ({activeStudent.grade} клас)? Усі заповнені критерії, спостереження та педагогічні висновки для цього учня буде безповоротно видалено.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Скасувати
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setIsSettingsOpen(false);
                  onDeleteStudent(activeStudent.id);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Так, видалити учня</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
