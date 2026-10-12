import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StudentBar } from './components/StudentBar';
import { AreaSelector } from './components/AreaSelector';
import { CriterionCard } from './components/CriterionCard';
import { CertificateView } from './components/CertificateView';
import { StudentListModal } from './components/StudentListModal';
import { NormativeReferenceModal } from './components/NormativeReferenceModal';
import { EDUCATIONAL_AREAS } from './data/criteriaData';
import { getAreaColor } from './data/areaColors';
import {
  StudentProfile,
  CriterionRecord,
  Grade,
} from './types';
import {
  loadStudents,
  saveStudents,
  loadActiveStudentId,
  saveActiveStudentId,
  addStudent,
  deleteStudent,
  updateStudentProfile,
  saveCriterionRecord,
} from './services/storageService';
import { requestCriterionAnalysis, AnalyzePayload } from './services/analysisService';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState<StudentProfile[]>(() => loadStudents());
  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    const saved = loadActiveStudentId();
    if (saved && students.some((s) => s.id === saved)) return saved;
    return students[0]?.id || 'student_1';
  });

  const [activeTab, setActiveTab] = useState<'evaluate' | 'certificate' | 'students' | 'normative'>('evaluate');
  const [activeAreaId, setActiveAreaId] = useState<string>('activity_traits');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keep active student in sync
  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0];

  useEffect(() => {
    if (activeStudent) {
      saveActiveStudentId(activeStudent.id);
    }
  }, [activeStudent?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers for student management
  const handleSelectStudent = (id: string) => {
    setActiveStudentId(id);
    saveActiveStudentId(id);
  };

  const handleAddStudent = (grade: Grade) => {
    const newSt = addStudent(grade);
    const updated = loadStudents();
    setStudents([...updated]);
    setActiveStudentId(newSt.id);
    showToast(`Створено картку «${newSt.code}» (${newSt.grade} клас)`);
  };

  const handleDeleteStudent = (id: string) => {
    const deletedStudent = students.find((s) => s.id === id);
    const updated = deleteStudent(id);
    setStudents([...updated]);
    if (updated.length > 0) {
      const nextActive = updated.find((s) => s.id !== id) || updated[0];
      setActiveStudentId(nextActive.id);
      saveActiveStudentId(nextActive.id);
    }
    showToast(
      deletedStudent
        ? `Учня «${deletedStudent.code}» успішно видалено зі списку`
        : 'Учня успішно видалено зі списку'
    );
  };

  const handleUpdateStudent = (id: string, updates: Partial<StudentProfile>) => {
    const updated = updateStudentProfile(id, updates);
    if (updated) {
      setStudents(loadStudents());
    }
  };

  const handleImportStudents = (data: StudentProfile[]) => {
    saveStudents(data);
    setStudents(data);
    if (data.length > 0) {
      setActiveStudentId(data[0].id);
    }
    showToast('Журнал учнів успішно відновлено');
  };

  // Handler for saving a criterion record
  const handleSaveCriterionRecord = (criterionId: string, recordData: Partial<CriterionRecord>) => {
    if (!activeStudent) return;
    const updated = saveCriterionRecord(activeStudent.id, criterionId, recordData);
    if (updated) {
      setStudents(loadStudents());
    }
  };

  // Handler for running analysis via server API (or fallback)
  const handleAnalyzeCriterion = async (payload: AnalyzePayload) => {
    return await requestCriterionAnalysis(payload);
  };

  const handlePrintCertificate = () => {
    setActiveTab('certificate');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Current active area
  const currentArea = EDUCATIONAL_AREAS.find((a) => a.id === activeAreaId) || EDUCATIONAL_AREAS[0];

  // Helper for navigating between educational areas
  const currentAreaIndex = EDUCATIONAL_AREAS.findIndex((a) => a.id === activeAreaId);
  const prevArea = currentAreaIndex > 0 ? EDUCATIONAL_AREAS[currentAreaIndex - 1] : null;
  const nextArea = currentAreaIndex < EDUCATIONAL_AREAS.length - 1 ? EDUCATIONAL_AREAS[currentAreaIndex + 1] : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPrintCertificate={handlePrintCertificate}
        activeStudentCode={activeStudent?.code || ''}
        activeGrade={activeStudent?.grade || 3}
      />

      {/* Student Bar (visible in evaluation & certificate tabs) */}
      {activeStudent && (
        <StudentBar
          students={students}
          activeStudent={activeStudent}
          onSelectStudent={handleSelectStudent}
          onAddStudent={handleAddStudent}
          onUpdateStudent={handleUpdateStudent}
          onDeleteStudent={handleDeleteStudent}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'evaluate' && activeStudent && (
          <div>
            {/* Area Navigation Tabs */}
            <AreaSelector
              activeAreaId={activeAreaId}
              onSelectArea={setActiveAreaId}
              activeStudent={activeStudent}
            />

            {/* Evaluation Workspace */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
              {/* Area Title & Description with Area Background Color */}
              {(() => {
                const currentAreaColor = getAreaColor(currentArea.id);
                return (
                  <div className={`p-5 rounded-xl border-2 ${currentAreaColor.cardBorder} ${currentAreaColor.cardAccentBg} shadow-xs flex flex-wrap items-center justify-between gap-4 transition-colors`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${currentAreaColor.cardBorder} ${currentAreaColor.tabBadgeBg}`}>
                          Освітня галузь
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          Для {activeStudent.grade} класу
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 mt-1">
                        {currentArea.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      {prevArea && (
                        <button
                          onClick={() => setActiveAreaId(prevArea.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Попередня галузь</span>
                        </button>
                      )}

                      {nextArea ? (
                        <button
                          onClick={() => setActiveAreaId(nextArea.id)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg ${currentAreaColor.tabActiveBg} transition-colors cursor-pointer shadow-xs`}
                        >
                          <span>Наступна галузь</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveTab('certificate')}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Перейти до бланка свідоцтва</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* List of Criteria Cards */}
              <div className="space-y-6">
                {/* Direct Criteria */}
                {currentArea.criteria &&
                  currentArea.criteria.map((criterion) => (
                    <CriterionCard
                      key={criterion.id}
                      criterion={criterion}
                      record={activeStudent.records[criterion.id]}
                      grade={activeStudent.grade}
                      areaId={currentArea.id}
                      areaTitle={currentArea.title}
                      isActivityTrait={currentArea.isActivityTrait}
                      onSaveRecord={handleSaveCriterionRecord}
                      onAnalyze={handleAnalyzeCriterion}
                    />
                  ))}

                {/* Sub-groups Criteria (e.g. Language & Literature) */}
                {currentArea.subGroups &&
                  currentArea.subGroups.map((subGroup) => (
                    <div key={subGroup.id} className="space-y-4">
                      <div className="pt-3 pb-1 border-b border-slate-200">
                        <h3 className="text-base font-bold text-slate-900">
                          {subGroup.title}
                        </h3>
                      </div>

                      <div className="space-y-6">
                        {subGroup.criteria.map((criterion) => (
                          <CriterionCard
                            key={criterion.id}
                            criterion={criterion}
                            record={activeStudent.records[criterion.id]}
                            grade={activeStudent.grade}
                            areaId={currentArea.id}
                            areaTitle={currentArea.title}
                            subjectTitle={subGroup.title}
                            isActivityTrait={currentArea.isActivityTrait}
                            onSaveRecord={handleSaveCriterionRecord}
                            onAnalyze={handleAnalyzeCriterion}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Bottom Area Navigator */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <div>
                  {prevArea && (
                    <button
                      onClick={() => {
                        setActiveAreaId(prevArea.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Попередня: {prevArea.title.replace(' освітня галузь', '')}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('certificate')}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-700" />
                    <span>Переглянути свідоцтво</span>
                  </button>

                  {nextArea ? (
                    <button
                      onClick={() => {
                        setActiveAreaId(nextArea.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Наступна: {nextArea.title.replace(' освітня галузь', '')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('certificate')}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Фіналізувати та друкувати</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certificate View Tab */}
        {activeTab === 'certificate' && activeStudent && (
          <CertificateView
            student={activeStudent}
            onUpdateStudent={handleUpdateStudent}
          />
        )}

        {/* Student Journal Modal / Screen */}
        {activeTab === 'students' && (
          <StudentListModal
            students={students}
            activeStudentId={activeStudentId}
            onSelectStudent={(id) => {
              handleSelectStudent(id);
              setActiveTab('evaluate');
            }}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            onUpdateStudent={handleUpdateStudent}
            onImportStudents={handleImportStudents}
          />
        )}

        {/* Normative Reference Modal / Tab */}
        {activeTab === 'normative' && (
          <NormativeReferenceModal onClose={() => setActiveTab('evaluate')} />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
