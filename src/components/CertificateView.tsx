import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { EDUCATIONAL_AREAS } from '../data/criteriaData';
import { getAreaColor } from '../data/areaColors';
import { Printer, Copy, Check, LayoutGrid, FileSpreadsheet } from 'lucide-react';

interface CertificateViewProps {
  student: StudentProfile;
  onUpdateStudent: (id: string, updates: Partial<StudentProfile>) => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  student,
  onUpdateStudent,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'summary'>('form');
  const [tableLayout, setTableLayout] = useState<'columns' | 'classic'>('columns');

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Compile full plain text summary
  const generateTextSummary = () => {
    let text = `СВІДОЦТВО ДОСЯГНЕНЬ\n`;
    text += `Учень/учениця: ${student.code}\n`;
    text += `Клас: ${student.grade}\n\n`;

    text += `1. ХАРАКТЕРИСТИКА НАВЧАЛЬНОЇ ДІЯЛЬНОСТІ:\n`;
    const actArea = EDUCATIONAL_AREAS.find((a) => a.id === 'activity_traits');
    if (actArea?.criteria) {
      for (const crit of actArea.criteria) {
        const rec = student.records[crit.id];
        const val = rec?.teacherDecision || (rec?.isCompleted ? 'Сформовано' : '—');
        text += `• ${crit.text}: [${val}]\n`;
        if (rec?.finalCertificateText) {
          text += `  Коментар: ${rec.finalCertificateText}\n`;
        }
      }
    }

    text += `\n2. ХАРАКТЕРИСТИКА РЕЗУЛЬТАТІВ НАВЧАННЯ:\n`;
    for (const area of EDUCATIONAL_AREAS) {
      if (area.id === 'activity_traits') continue;
      text += `\n--- ${area.title.toUpperCase()} ---\n`;
      const allCriteria = [
        ...(area.criteria || []),
        ...(area.subGroups?.flatMap((sg) => sg.criteria) || []),
      ];
      for (const crit of allCriteria) {
        const rec = student.records[crit.id];
        const val = rec?.teacherDecision || '—';
        text += `• ${crit.text}: [${val}]\n`;
        if (rec?.finalCertificateText) {
          text += `  Педагогічний висновок: ${rec.finalCertificateText}\n`;
        }
      }
    }

    if (student.teacherGeneralRecommendations) {
      text += `\nРЕКОМЕНДАЦІЇ ВЧИТЕЛЯ:\n${student.teacherGeneralRecommendations}\n`;
    }
    if (student.pedagogicalCouncilDecision) {
      text += `\nРІШЕННЯ ПЕДАГОГІЧНОЇ РАДИ:\n${student.pedagogicalCouncilDecision}\n`;
    }

    return text;
  };

  const handleCopySummary = async () => {
    const text = generateTextSummary();
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const activityArea = EDUCATIONAL_AREAS.find((a) => a.id === 'activity_traits');
  const subjectAreas = EDUCATIONAL_AREAS.filter((a) => a.id !== 'activity_traits');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Controls Toolbar (Screen only) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Бланк свідоцтва МОН
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'summary'
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Зведений текст формулювань
            </button>
          </div>

          {activeTab === 'form' && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold ml-2">
              <span className="text-[11px] text-slate-500 px-1 font-normal">Вигляд колонок:</span>
              <button
                onClick={() => setTableLayout('columns')}
                title="Окрема кольорова колонка для галузі та окрема для критеріїв"
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  tableLayout === 'columns'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>3 колонки (кольорові)</span>
              </button>
              <button
                onClick={() => setTableLayout('classic')}
                title="Класичний рядок заголовка галузі"
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  tableLayout === 'classic'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Класичний</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {copySuccess ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copySuccess ? 'Скопійовано!' : 'Копіювати текст'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Друкувати у PDF (А4)</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUMMARY TAB: All formulated pedagogical notes                */}
      {/* ============================================================== */}
      {activeTab === 'summary' && (
        <div className="no-print bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-lg font-bold text-slate-900">
              Зведений перелік педагогічних висновків та рекомендацій
            </h3>
            <p className="text-xs text-slate-500">
              Усі сформовані висновки за освітніми галузями для {student.code} ({student.grade} клас)
            </p>
          </div>

          <div className="space-y-6">
            {EDUCATIONAL_AREAS.map((area) => {
              const allCriteria = [
                ...(area.criteria || []),
                ...(area.subGroups?.flatMap((sg) => sg.criteria) || []),
              ];
              const filledCriteria = allCriteria.filter(
                (c) => student.records[c.id]?.finalCertificateText || student.records[c.id]?.teacherDecision
              );

              if (filledCriteria.length === 0) return null;

              return (
                <div key={area.id} className="space-y-2">
                  <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide bg-blue-50/70 p-2 rounded-md">
                    {area.title}
                  </h4>
                  <div className="space-y-2 pl-2">
                    {filledCriteria.map((c) => {
                      const rec = student.records[c.id];
                      return (
                        <div
                          key={c.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{c.text}</span>
                            <span className="px-2 py-0.5 rounded bg-blue-700 text-white font-mono text-[11px]">
                              {rec.teacherDecision || 'Опрацьовано'}
                            </span>
                          </div>
                          {rec.finalCertificateText && (
                            <p className="text-slate-700 italic pt-1">
                              «{rec.finalCertificateText}»
                            </p>
                          )}
                          {rec.analysis?.nextSteps && rec.analysis.nextSteps.length > 0 && (
                            <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 mt-1">
                              <span className="font-semibold text-slate-800">Наступний крок: </span>
                              {rec.analysis.nextSteps[0].activity}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FORM TAB: EXACT OFFICIAL MON BLANK                            */}
      {/* ============================================================== */}
      {activeTab === 'form' && (
        <div className="bg-white p-6 sm:p-10 rounded-xl border border-slate-300 shadow-sm certificate-page text-black font-sans leading-relaxed">
          {/* Official Top Reference Note */}
          <div className="text-right text-xs leading-tight mb-4 text-slate-700 print:text-black">
            <div>Додаток 3</div>
            <div>до методичних рекомендацій щодо</div>
            <div>оцінювання результатів навчання учнів</div>
            <div>1-4 класів закладів загальної середньої освіти</div>
            <div className="font-semibold mt-1">Примірний зразок № 2</div>
          </div>

          {/* Document Title */}
          <div className="text-center my-4">
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-black">
              Свідоцтво досягнень
            </h1>
            <div className="text-sm font-semibold mt-1">
              учня/учениці{' '}
              <span className="font-bold underline px-2">{student.grade}</span> класу
              <span className="text-[10px] text-slate-600 print:text-black ml-1">(3-4)</span>
            </div>
            <div className="border-b border-black pb-0.5 max-w-md mx-auto text-center font-bold text-base mt-2 min-h-[24px]">
              {student.code}
            </div>
            <div className="text-[10px] text-slate-600 print:text-black">
              (умовне позначення учня/учениці)
            </div>
          </div>

          {/* TABLE 1: ХАРАКТЕРИСТИКА НАВЧАЛЬНОЇ ДІЯЛЬНОСТІ */}
          {(() => {
            const actColor = getAreaColor('activity_traits');
            const criteriaList = activityArea?.criteria || [];

            return (
              <div className="mt-6 mb-6">
                <table className="w-full border-collapse border border-black text-xs">
                  <thead>
                    <tr>
                      {tableLayout === 'columns' ? (
                        <>
                          <th className={`border border-black p-2 text-center font-bold w-1/4 ${actColor.areaColBg}`}>
                            Освітня сфера
                          </th>
                          <th className={`border border-black p-2 text-center font-bold w-1/2 ${actColor.critColBg}`}>
                            Характеристика навчальної діяльності
                          </th>
                          <th className={`border border-black p-2 text-center font-bold w-1/4 bg-slate-100 print:bg-slate-100 text-slate-900`}>
                            Сформовано (V) / формується
                          </th>
                        </>
                      ) : (
                        <>
                          <th className={`border border-black p-2 text-center font-bold w-3/4 ${actColor.headerBg} ${actColor.headerText}`}>
                            Характеристика навчальної діяльності
                          </th>
                          <th className="border border-black p-2 text-center font-bold w-1/4 bg-slate-100 print:bg-slate-100 text-slate-900">
                            Сформовано (V) / формується
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {criteriaList.map((crit, idx) => {
                      const rec = student.records[crit.id];
                      const decision = rec?.teacherDecision;
                      let displayVal = '';
                      if (decision === 'Сформовано') {
                        displayVal = 'V';
                      } else if (decision === 'Формується') {
                        displayVal = 'формується';
                      } else if (rec?.isCompleted) {
                        displayVal = 'V';
                      }

                      return (
                        <tr key={crit.id} className="hover:opacity-95">
                          {tableLayout === 'columns' && idx === 0 && (
                            <td
                              rowSpan={criteriaList.length}
                              className={`border border-black p-3 text-center align-middle font-bold text-xs uppercase tracking-wide ${actColor.areaColBg}`}
                            >
                              Характеристика навчальної діяльності
                            </td>
                          )}

                          <td className={`border border-black p-2 text-left leading-normal ${actColor.critColBg}`}>
                            {crit.text}
                          </td>

                          <td className={`border border-black p-2 text-center font-bold font-mono text-sm ${actColor.scoreColBg}`}>
                            {displayVal}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()}

          {/* PAGE BREAK (For clean A4 printing if needed) */}
          <div className="print:page-break-after-always" />

          {/* TABLE 2: ХАРАКТЕРИСТИКА РЕЗУЛЬТАТІВ НАВЧАННЯ */}
          <div className="mt-6 mb-6">
            <table className="w-full border-collapse border border-black text-xs">
              <thead>
                <tr>
                  {tableLayout === 'columns' ? (
                    <>
                      <th className="border border-black p-2 text-center font-bold w-1/4 bg-slate-200 print:bg-slate-200 text-slate-900">
                        Освітня галузь
                      </th>
                      <th className="border border-black p-2 text-center font-bold w-1/2 bg-slate-100 print:bg-slate-100 text-slate-900">
                        Характеристика результатів навчання (критерії)
                      </th>
                      <th className="border border-black p-2 text-center font-bold w-1/4 bg-slate-200 print:bg-slate-200 text-slate-900 leading-tight">
                        Сформовано (V) / формується // Рівень (В/Д/С/П)
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="border border-black p-2 text-center font-bold w-3/4 bg-slate-200 print:bg-slate-200 text-slate-900">
                        Характеристика результатів навчання
                      </th>
                      <th className="border border-black p-2 text-center font-bold w-1/4 bg-slate-200 print:bg-slate-200 text-slate-900 leading-tight">
                        Сформовано (V) / формується // Рівень (В/Д/С/П)
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {subjectAreas.map((area) => {
                  const aColor = getAreaColor(area.id);

                  // Flatten all items for this area to calculate total rows
                  const flatItems: Array<{
                    crit: any;
                    subGroupTitle?: string;
                    isFirstOfSubGroup?: boolean;
                  }> = [];

                  if (area.subGroups) {
                    area.subGroups.forEach((sg) => {
                      sg.criteria.forEach((crit, critIdx) => {
                        flatItems.push({
                          crit,
                          subGroupTitle: sg.title,
                          isFirstOfSubGroup: critIdx === 0,
                        });
                      });
                    });
                  } else if (area.criteria) {
                    area.criteria.forEach((crit) => {
                      flatItems.push({ crit });
                    });
                  }

                  if (tableLayout === 'columns') {
                    // 3-COLUMN LAYOUT with separate column backgrounds for Area and Criteria
                    return (
                      <React.Fragment key={area.id}>
                        {flatItems.map((item, index) => {
                          const rec = student.records[item.crit.id];
                          const isFirstRow = index === 0;

                          return (
                            <tr key={item.crit.id} className="hover:opacity-95">
                              {/* Distinct Column 1: Educational Area (with area background) */}
                              {isFirstRow && (
                                <td
                                  rowSpan={flatItems.length}
                                  className={`border border-black p-3 text-center align-middle ${aColor.areaColBg}`}
                                >
                                  <div className="font-bold text-xs uppercase tracking-wide">
                                    {area.title}
                                  </div>
                                </td>
                              )}

                              {/* Distinct Column 2: Criteria (with criteria background) */}
                              <td className={`border border-black p-2 text-left leading-normal ${aColor.critColBg}`}>
                                {item.subGroupTitle && item.isFirstOfSubGroup && (
                                  <div className="font-bold text-[11px] text-slate-900 border-b border-black/20 pb-0.5 mb-1 italic">
                                    {item.subGroupTitle}
                                  </div>
                                )}
                                <div>{item.crit.text}</div>
                              </td>

                              {/* Column 3: Level / Score */}
                              <td className={`border border-black p-2 text-center font-bold font-mono text-sm ${aColor.scoreColBg}`}>
                                {rec?.teacherDecision || ''}
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  }

                  // CLASSIC 2-COLUMN LAYOUT with color headers and colored criteria rows
                  return (
                    <React.Fragment key={area.id}>
                      {/* Area Header Row with distinct color */}
                      <tr className={`${aColor.headerBg} ${aColor.headerText}`}>
                        <td
                          colSpan={2}
                          className="border border-black p-2 font-bold uppercase text-center tracking-wide text-xs"
                        >
                          {area.title}
                        </td>
                      </tr>

                      {/* Subgroups if any */}
                      {area.subGroups &&
                        area.subGroups.map((sg) => (
                          <React.Fragment key={sg.id}>
                            <tr className={`${aColor.subGroupBg} italic`}>
                              <td
                                colSpan={2}
                                className="border border-black px-3 py-1 font-semibold text-slate-900 print:text-black text-xs"
                              >
                                {sg.title}
                              </td>
                            </tr>
                            {sg.criteria.map((crit) => {
                              const rec = student.records[crit.id];
                              return (
                                <tr key={crit.id} className="hover:opacity-95">
                                  <td className={`border border-black p-2 text-left leading-normal ${aColor.critColBg}`}>
                                    {crit.text}
                                  </td>
                                  <td className={`border border-black p-2 text-center font-bold font-mono text-sm ${aColor.scoreColBg}`}>
                                    {rec?.teacherDecision || ''}
                                  </td>
                                </tr>
                              );
                            })}
                          </React.Fragment>
                        ))}

                      {/* Direct criteria if no subgroups */}
                      {area.criteria &&
                        area.criteria.map((crit) => {
                          const rec = student.records[crit.id];
                          return (
                            <tr key={crit.id} className="hover:opacity-95">
                              <td className={`border border-black p-2 text-left leading-normal ${aColor.critColBg}`}>
                                {crit.text}
                              </td>
                              <td className={`border border-black p-2 text-center font-bold font-mono text-sm ${aColor.scoreColBg}`}>
                                {rec?.teacherDecision || ''}
                              </td>
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            {/* Official Footnote */}
            <div className="mt-3 text-[10px] text-slate-700 print:text-black leading-normal">
              *У 3-4 класах підсумкове оцінювання здійснюють вербально/рівнево (за вибором закладу загальної середньої освіти): за умов використання вербальної оцінки, якщо результат навчання сформовано, його позначають <span className="font-bold">V</span>; якщо результат ще формується, позначень не роблять/за умов використання рівневої оцінки рівень результату навчання позначають буквою <span className="font-bold">В</span> (високий)/<span className="font-bold">Д</span> (достатній)/<span className="font-bold">С</span> (середній)/<span className="font-bold">П</span> (початковий).
            </div>
          </div>

          {/* Pedagogical Council Decision */}
          <div className="mt-6 space-y-4 text-xs">
            <div>
              <div className="font-bold mb-1">
                Рішення педагогічної ради про переведення до наступного класу:
              </div>
              <div className="border-b border-black pb-0.5 min-h-[22px] font-medium">
                {student.pedagogicalCouncilDecision || (
                  <span className="no-print text-slate-400 italic">
                    (введіть рішення, наприклад: Переведено до 4 класу, протокол № ...)
                  </span>
                )}
              </div>
            </div>

            {/* Teacher Recommendations */}
            <div>
              <div className="font-bold mb-1">Рекомендації вчителя:</div>
              <div className="border-b border-black pb-1 min-h-[36px] font-medium leading-relaxed">
                {student.teacherGeneralRecommendations || (
                  <span className="no-print text-slate-400 italic">
                    (індивідуальні рекомендації вчителя щодо подальшого навчання та підтримки)
                  </span>
                )}
              </div>
            </div>

            {/* Signatures: Only Teacher and Parents, NO initials or teacher surname */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold">Учитель</span>
                  <div className="w-40 border-b border-black text-center text-[10px] text-slate-500 print:text-black">
                    (підпис)
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold">Батьки / особи, що їх замінюють</span>
                  <div className="w-40 border-b border-black text-center text-[10px] text-slate-500 print:text-black">
                    (підпис)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
