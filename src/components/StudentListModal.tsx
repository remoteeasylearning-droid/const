import React, { useState } from 'react';
import { StudentProfile, Grade } from '../types';
import { calculateStudentStats } from '../services/storageService';
import {
  Users,
  Plus,
  Trash2,
  Download,
  Upload,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';

interface StudentListModalProps {
  students: StudentProfile[];
  activeStudentId: string;
  onSelectStudent: (id: string) => void;
  onAddStudent: (grade: Grade) => void;
  onDeleteStudent: (id: string) => void;
  onUpdateStudent: (id: string, updates: Partial<StudentProfile>) => void;
  onImportStudents: (data: StudentProfile[]) => void;
}

export const StudentListModal: React.FC<StudentListModalProps> = ({
  students,
  activeStudentId,
  onSelectStudent,
  onAddStudent,
  onDeleteStudent,
  onUpdateStudent,
  onImportStudents,
}) => {
  const [filterGrade, setFilterGrade] = useState<'all' | 3 | 4>('all');
  const [newGrade, setNewGrade] = useState<Grade>(3);
  const [studentToDelete, setStudentToDelete] = useState<StudentProfile | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const filteredStudents = students.filter((s) => {
    if (filterGrade === 'all') return true;
    return s.grade === filterGrade;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `svidoctvo_nush_students_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onImportStudents(parsed);
            setImportStatus('Дані успішно імпортовано!');
            setTimeout(() => setImportStatus(null), 3000);
          } else {
            setImportStatus('Помилка: файл не містить коректного списку учнів.');
            setTimeout(() => setImportStatus(null), 4000);
          }
        } catch (err) {
          setImportStatus('Помилка читання JSON файлу.');
          setTimeout(() => setImportStatus(null), 4000);
        }
      };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-700" />
            <span>Журнал учнів класу</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Усі учні зберігаються конфіденційно під умовними позначеннями без прізвищ та імен
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export / Import buttons */}
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Експорт усіх учнів та спостережень у файл"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Резервна копія (JSON)</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Відновити</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          {/* Add Student */}
          <div className="flex items-center gap-1 bg-blue-50 p-1 rounded-lg border border-blue-200">
            <select
              value={newGrade}
              onChange={(e) => setNewGrade(parseInt(e.target.value, 10) as Grade)}
              className="text-xs font-bold text-blue-900 bg-transparent py-1 px-2 focus:outline-none"
            >
              <option value={3}>3 клас</option>
              <option value={4}>4 клас</option>
            </select>
            <button
              onClick={() => onAddStudent(newGrade)}
              className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Додати учня</span>
            </button>
          </div>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-xs font-semibold">
          {importStatus}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-fit text-xs font-semibold">
        <button
          onClick={() => setFilterGrade('all')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            filterGrade === 'all'
              ? 'bg-white text-blue-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Усі класи ({students.length})
        </button>
        <button
          onClick={() => setFilterGrade(3)}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            filterGrade === 3
              ? 'bg-white text-blue-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3 клас ({students.filter((s) => s.grade === 3).length})
        </button>
        <button
          onClick={() => setFilterGrade(4)}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            filterGrade === 4
              ? 'bg-white text-blue-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          4 клас ({students.filter((s) => s.grade === 4).length})
        </button>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((st) => {
          const stats = calculateStudentStats(st);
          const isActive = st.id === activeStudentId;

          return (
            <div
              key={st.id}
              className={`bg-white rounded-xl border p-4 transition-all relative ${
                isActive
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">
                      {st.code}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {st.grade} клас
                    </span>
                  </div>
                </div>

                {isActive ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    <UserCheck className="w-3.5 h-3.5" />
                    Поточний
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectStudent(st.id)}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    Обрати
                  </button>
                )}
              </div>

              {/* Progress */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Заповнення критеріїв:</span>
                  <span className="font-bold text-slate-800 font-mono tabular-nums">
                    {stats.completed} / {stats.total} ({stats.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.percent}%` }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs gap-2">
                <button
                  onClick={() => onSelectStudent(st.id)}
                  className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold transition-colors cursor-pointer"
                >
                  Перейти до заповнення
                </button>

                <button
                  type="button"
                  onClick={() => setStudentToDelete(st)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer border border-red-200"
                  title="Видалити учня зі списку"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Видалити зі списку</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal for Student List */}
      {studentToDelete && (
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
                  Підтвердження видалення
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Ви впевнені, що бажаєте видалити картку <strong className="text-slate-900 font-bold">«{studentToDelete.code}»</strong> ({studentToDelete.grade} клас)? Усі заповнені критерії, спостереження та педагогічні висновки для цього учня буде безповоротно видалено.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Скасувати
              </button>
              <button
                type="button"
                onClick={() => {
                  const idToDelete = studentToDelete.id;
                  setStudentToDelete(null);
                  onDeleteStudent(idToDelete);
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
    </div>
  );
};
