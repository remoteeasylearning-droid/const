import React, { useState, useEffect } from 'react';
import {
  CriterionItem,
  CriterionRecord,
  CriterionAnalysis,
  IndependenceLevel,
  CreativeComponentLevel,
  AchievementLevel,
  ActivityTraitStatus,
  Grade,
} from '../types';
import { getAreaColor } from '../data/areaColors';
import {
  Sparkles,
  Save,
  Check,
  HelpCircle,
  AlertCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Clock,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface CriterionCardProps {
  criterion: CriterionItem;
  record?: CriterionRecord;
  grade: Grade;
  areaId?: string;
  areaTitle: string;
  subjectTitle?: string;
  isActivityTrait?: boolean;
  onSaveRecord: (criterionId: string, recordData: Partial<CriterionRecord>) => void;
  onAnalyze: (payload: any) => Promise<CriterionAnalysis>;
}

export const CriterionCard: React.FC<CriterionCardProps> = ({
  criterion,
  record,
  grade,
  areaId,
  areaTitle,
  subjectTitle,
  isActivityTrait = false,
  onSaveRecord,
  onAnalyze,
}) => {
  const areaColor = getAreaColor(areaId || 'activity_traits');
  const [observations, setObservations] = useState(record?.observations || '');
  const [independenceLevel, setIndependenceLevel] = useState<IndependenceLevel>(
    record?.independenceLevel || 'mostly_independent'
  );
  const [creativeComponent, setCreativeComponent] = useState<CreativeComponentLevel>(
    record?.creativeComponent || 'not_evaluated'
  );
  const [creativeExample, setCreativeExample] = useState(record?.creativeExample || '');
  const [extraNotes, setExtraNotes] = useState(record?.extraNotes || '');

  // Analysis state
  const [analysis, setAnalysis] = useState<CriterionAnalysis | undefined>(record?.analysis);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Final decision state
  const [teacherDecision, setTeacherDecision] = useState<
    AchievementLevel | ActivityTraitStatus | 'Недостатньо даних' | undefined
  >(record?.teacherDecision);
  const [teacherComment, setTeacherComment] = useState(record?.teacherComment || '');
  const [isPostponed, setIsPostponed] = useState(record?.isPostponed || false);

  // Certificate text
  const [textMode, setTextMode] = useState<'short' | 'expanded'>('short');
  const [certificateText, setCertificateText] = useState(
    record?.finalCertificateText || record?.analysis?.certificateTextShort || ''
  );
  const [copySuccess, setCopySuccess] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Sync state if record updates externally
  useEffect(() => {
    if (record) {
      setObservations(record.observations || '');
      setIndependenceLevel(record.independenceLevel || 'mostly_independent');
      setCreativeComponent(record.creativeComponent || 'not_evaluated');
      setCreativeExample(record.creativeExample || '');
      setExtraNotes(record.extraNotes || '');
      setAnalysis(record.analysis);
      setTeacherDecision(record.teacherDecision);
      setTeacherComment(record.teacherComment || '');
      setIsPostponed(record.isPostponed || false);
      if (record.finalCertificateText) {
        setCertificateText(record.finalCertificateText);
      } else if (record.analysis?.certificateTextShort) {
        setCertificateText(record.analysis.certificateTextShort);
      }
    }
  }, [record?.criterionId]);

  // Handle Save
  const handleSave = () => {
    onSaveRecord(criterion.id, {
      observations,
      independenceLevel,
      creativeComponent,
      creativeExample,
      extraNotes,
      analysis,
      teacherDecision,
      teacherComment,
      isPostponed,
      finalCertificateText: certificateText,
      isCompleted: !!teacherDecision && !isPostponed,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Handle Analyze
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await onAnalyze({
        grade,
        isActivityTrait,
        areaId: criterion.id,
        areaTitle,
        subjectTitle,
        criterionId: criterion.id,
        criterionText: criterion.text,
        criteriaStandard: criterion.officialStandardNotes,
        observations,
        independenceLevel,
        creativeComponent,
        creativeExample,
        extraNotes,
      });

      setAnalysis(result);
      if (!teacherDecision) {
        setTeacherDecision(result.recommendedLevel);
      }
      const initialText = textMode === 'short' ? result.certificateTextShort : result.certificateTextExpanded;
      setCertificateText(initialText);

      // Auto-save after analysis
      onSaveRecord(criterion.id, {
        observations,
        independenceLevel,
        creativeComponent,
        creativeExample,
        extraNotes,
        analysis: result,
        teacherDecision: teacherDecision || result.recommendedLevel,
        finalCertificateText: initialText,
        isCompleted: true,
      });
    } catch (err: any) {
      setAnalysisError(err?.message || 'Не вдалося виконати аналіз');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle text mode (short vs expanded)
  const handleChangeTextMode = (mode: 'short' | 'expanded') => {
    setTextMode(mode);
    if (analysis) {
      const newText = mode === 'short' ? analysis.certificateTextShort : analysis.certificateTextExpanded;
      setCertificateText(newText);
      onSaveRecord(criterion.id, {
        finalCertificateText: newText,
      });
    }
  };

  // Copy text to clipboard
  const handleCopyText = async () => {
    if (!certificateText) return;
    try {
      await navigator.clipboard.writeText(certificateText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const isCompleted = !!teacherDecision && !isPostponed;

  return (
    <div
      className={`bg-white rounded-xl border-2 transition-all ${
        isCompleted
          ? 'border-emerald-400 shadow-xs'
          : isPostponed
          ? 'border-amber-300'
          : `${areaColor.cardBorder} shadow-xs`
      }`}
    >
      {/* Card Header with subtle area color */}
      <div className={`p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-4 ${areaColor.cardAccentBg} rounded-t-[10px]`}>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${areaColor.cardBorder} ${areaColor.tabBadgeBg}`}>
              {areaTitle.replace(' освітня галузь', '').replace(' освітні галузі', '')}
            </span>
            {subjectTitle && (
              <span className="text-xs text-slate-600 font-semibold bg-white/80 px-2 py-0.5 rounded-sm border border-slate-200">
                {subjectTitle}
              </span>
            )}
            {isCompleted && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm flex items-center gap-1">
                <Check className="w-3 h-3" />
                Опрацьовано: {teacherDecision}
              </span>
            )}
            {isPostponed && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Рішення відкладено
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {criterion.text}
          </h3>

          {criterion.shortDescription && (
            <p className="text-xs sm:text-sm text-slate-600">
              {criterion.shortDescription}
            </p>
          )}

          {criterion.officialStandardNotes && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <BookOpen className="w-3 h-3 text-slate-400" />
              <span>Нормативна основа: {criterion.officialStandardNotes}</span>
            </div>
          )}

          {criterion.gradeSpecificNotes && criterion.gradeSpecificNotes[grade] && (
            <div className="text-[11px] text-indigo-700 bg-indigo-50/70 px-2 py-1 rounded-md mt-1 inline-block">
              Особливість для {grade} класу: {criterion.gradeSpecificNotes[grade]}
            </div>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
          title={isExpanded ? 'Згорнути картку' : 'Розгорнути картку'}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Card Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-5">
          {/* Section B: Observations Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>Конкретні спостереження вчителя</span>
                <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">
                Короткі факти без шаблонів
              </span>
            </div>

            <textarea
              rows={3}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Що саме учень знає, розуміє або вміє робити? Наведи конкретний приклад виконання завдання, застосування знань чи подолання труднощів (наприклад: «Самостійно розв’язує типові задачі, у задачах на два кроки потребує допомоги»)..."
              className="w-full text-sm border border-slate-300 rounded-lg p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />

            {/* Quick sample chips */}
            {criterion.sampleObservations && criterion.sampleObservations.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-medium">
                  Швидкі підказки:
                </span>
                {criterion.sampleObservations.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!observations.trim()) {
                        setObservations(sample);
                      } else {
                        setObservations(`${observations}. ${sample}`);
                      }
                    }}
                    className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-md transition-colors border border-slate-200 text-left cursor-pointer"
                  >
                    + {sample}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid of Independence & Creative Component */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Section V: Independence Level */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-2">
                Рівень самостійності учня
              </label>
              <div className="space-y-1.5">
                {[
                  { value: 'independent', label: 'Виконує самостійно' },
                  {
                    value: 'mostly_independent',
                    label: 'Виконує переважно самостійно, іноді потребує підказки',
                  },
                  { value: 'with_help', label: 'Виконує за допомогою вчителя' },
                  { value: 'constant_support', label: 'Потребує постійної підтримки' },
                  { value: 'insufficient_data', label: 'Недостатньо даних для висновку' },
                ].map((item) => (
                  <label
                    key={item.value}
                    className={`flex items-start gap-2 p-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                      independenceLevel === item.value
                        ? 'bg-blue-100/70 text-blue-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-200/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`independence_${criterion.id}`}
                      value={item.value}
                      checked={independenceLevel === item.value}
                      onChange={() => setIndependenceLevel(item.value as IndependenceLevel)}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section G: Creative Component */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-2">
                  Прояв творчого компонента
                </label>
                <div className="space-y-1.5">
                  {[
                    {
                      value: 'original_ideas',
                      label: 'Самостійно пропонує оригінальні ідеї / способи',
                    },
                    {
                      value: 'applies_new_contexts',
                      label: 'Застосовує знання у нових ситуаціях',
                    },
                    {
                      value: 'suggests_with_support',
                      label: 'Пропонує власні варіанти за певної підтримки',
                    },
                    {
                      value: 'acts_by_sample',
                      label: 'Переважно діє за зразком',
                    },
                    {
                      value: 'not_evaluated',
                      label: 'Не оцінювався або немає достатніх спостережень',
                    },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className={`flex items-start gap-2 p-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                        creativeComponent === item.value
                          ? 'bg-blue-100/70 text-blue-900 font-semibold'
                          : 'text-slate-700 hover:bg-slate-200/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`creative_${criterion.id}`}
                        value={item.value}
                        checked={creativeComponent === item.value}
                        onChange={() => setCreativeComponent(item.value as CreativeComponentLevel)}
                        className="mt-0.5 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {creativeComponent !== 'not_evaluated' && creativeComponent !== 'acts_by_sample' && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <input
                    type="text"
                    value={creativeExample}
                    onChange={(e) => setCreativeExample(e.target.value)}
                    placeholder="Приклад творчого прояву (за бажанням)"
                    className="w-full text-xs bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section Ґ: Extra Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Додаткові відомості (динаміка, типові помилки, умови)
            </label>
            <input
              type="text"
              value={extraNotes}
              onChange={(e) => setExtraNotes(e.target.value)}
              placeholder="наприклад: «Швидко виправляє описки під час самоперевірки»"
              className="w-full text-xs border border-slate-200 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Зберегти спостереження</span>
              </button>

              {savedSuccess && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Збережено
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={handleRunAnalysis}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAnalyzing ? 'Аналізуємо спостереження...' : 'Проаналізувати та сформувати рекомендації'}</span>
              </button>
            </div>
          </div>

          {analysisError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* STAGE 1, 2, 3: ANALYSIS & RECOMMENDATIONS DISPLAY             */}
          {/* ============================================================== */}
          {analysis && (
            <div className="mt-5 space-y-4 pt-4 border-t border-slate-200">
              {/* STAGE 1: Structure of Analysis */}
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-[11px] flex items-center justify-center font-bold">
                      1
                    </span>
                    Результати аналізу спостережень
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Нормативна рамка МОН №813
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-800 block mb-1">
                      ✓ Що вже вдається (підтверджені вміння):
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                      {analysis.strengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-amber-800 block mb-1">
                      ▲ Що потребує вдосконалення (труднощі):
                    </span>
                    {analysis.areasForImprovement && analysis.areasForImprovement.length > 0 ? (
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        {analysis.areasForImprovement.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-slate-500 italic">
                        Труднощів не зафіксовано або вміння сформовано надійно
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                  <div className="bg-white p-2.5 rounded-md border border-slate-200">
                    <span className="font-semibold text-slate-800">Самостійність: </span>
                    {analysis.independenceAnalysis}
                  </div>
                  <div className="bg-white p-2.5 rounded-md border border-slate-200">
                    <span className="font-semibold text-slate-800">Творчий компонент: </span>
                    {analysis.creativeAnalysis}
                  </div>
                </div>

                <div className="text-xs bg-blue-50/60 p-2.5 rounded-md border border-blue-100 text-slate-800">
                  <span className="font-semibold text-blue-900">Педагогічне обґрунтування: </span>
                  {analysis.rationale}
                </div>

                {analysis.whatToClarify && (
                  <div className="text-xs bg-amber-50 p-2.5 rounded-md border border-amber-200 text-amber-900 flex items-start gap-1.5">
                    <HelpCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <span className="font-semibold">Що варто уточнити: </span>
                      {analysis.whatToClarify}
                    </div>
                  </div>
                )}
              </div>

              {/* STAGE 2: Level Recommendation with Required Disclaimer */}
              <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-[11px] flex items-center justify-center font-bold">
                      2
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Орієнтовний рівень досягнень
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">Запропоновано помічником:</span>
                    <span className="px-3 py-1 rounded-md text-sm font-bold bg-blue-700 text-white shadow-xs">
                      {analysis.recommendedLevel}
                    </span>
                  </div>
                </div>

                {/* CRITICAL REQUIRED NOTICE */}
                <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      Це рекомендація ШІ, а не остаточне оцінювання. Остаточне рішення ухвалює вчитель.
                    </span>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Ви можете погодитися з пропозицією або вибрати інший рівень за власним педагогічним розсудом.
                    </p>
                  </div>
                </div>

                {/* Teacher's Level Selector Controls */}
                <div className="pt-1">
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Оберіть остаточне рішення вчителя:
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {isActivityTrait ? (
                      // Options for learning activity traits: Сформовано vs Формується
                      ['Сформовано', 'Формується'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => {
                            setTeacherDecision(lvl as ActivityTraitStatus);
                            setIsPostponed(false);
                            onSaveRecord(criterion.id, {
                              teacherDecision: lvl as ActivityTraitStatus,
                              isPostponed: false,
                              isCompleted: true,
                            });
                          }}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            teacherDecision === lvl && !isPostponed
                              ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {lvl === 'Сформовано' ? '✓ Сформовано (V)' : '○ Формується'}
                        </button>
                      ))
                    ) : (
                      // Options for educational outcomes: В, Д, С, П
                      [
                        { id: 'В', title: 'В (Високий)' },
                        { id: 'Д', title: 'Д (Достатній)' },
                        { id: 'С', title: 'С (Середній)' },
                        { id: 'П', title: 'П (Початковий)' },
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => {
                            setTeacherDecision(lvl.id as AchievementLevel);
                            setIsPostponed(false);
                            onSaveRecord(criterion.id, {
                              teacherDecision: lvl.id as AchievementLevel,
                              isPostponed: false,
                              isCompleted: true,
                            });
                          }}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            teacherDecision === lvl.id && !isPostponed
                              ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {lvl.title}
                        </button>
                      ))
                    )}

                    {/* Button: Postpone decision */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsPostponed(true);
                        onSaveRecord(criterion.id, {
                          isPostponed: true,
                          isCompleted: false,
                        });
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        isPostponed
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Відкласти рішення
                    </button>
                  </div>
                </div>

                {/* Optional Teacher Comment on Level */}
                <div className="pt-1">
                  <input
                    type="text"
                    value={teacherComment}
                    onChange={(e) => {
                      setTeacherComment(e.target.value);
                      onSaveRecord(criterion.id, { teacherComment: e.target.value });
                    }}
                    placeholder="Педагогічний коментар до оцінки (за потреби)..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* STAGE 3: Actionable Next Steps (1-2 priority steps) */}
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-[11px] flex items-center justify-center font-bold">
                      3
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Рекомендації для подальшої роботи (персоналізований поступ)
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Пріоритетні навчальні кроки
                  </span>
                </div>

                <div className="space-y-2.5">
                  {analysis.nextSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1.5"
                    >
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                        <span>Навичка для розвитку: {step.skill}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-0.5">
                        <div>
                          <span className="font-semibold text-slate-800">Конкретна дія/вправа: </span>
                          {step.activity}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">Підтримка вчителя: </span>
                          {step.teacherSupport}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">Шлях до самостійності: </span>
                          {step.independencePath}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">Ознака перевірки прогресу: </span>
                          {step.checkProgressSign}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STAGE 4: Automated Certificate Text Formulation */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-[11px] flex items-center justify-center font-bold">
                      4
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Формулювання для свідоцтва досягнень
                    </h4>
                  </div>

                  {/* Mode switcher: Short vs Expanded */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
                    <button
                      type="button"
                      onClick={() => handleChangeTextMode('short')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                        textMode === 'short'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Короткий варіант
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeTextMode('expanded')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                        textMode === 'expanded'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Розгорнутий
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={2}
                    value={certificateText}
                    onChange={(e) => {
                      setCertificateText(e.target.value);
                      onSaveRecord(criterion.id, {
                        finalCertificateText: e.target.value,
                      });
                    }}
                    className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="absolute right-2 bottom-3 p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-md transition-colors"
                    title="Скопіювати формулювання"
                  >
                    {copySuccess ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Текст доброзичливий, орієнтований на результат та зрозумілий батькам</span>
                  {copySuccess && (
                    <span className="text-emerald-600 font-semibold">
                      Скопійовано в буфер обміну!
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
