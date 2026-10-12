import React from 'react';
import { BookOpen, ExternalLink, ShieldCheck, Scale, Award } from 'lucide-react';

interface NormativeReferenceModalProps {
  onClose?: () => void;
}

export const NormativeReferenceModal: React.FC<NormativeReferenceModalProps> = ({ onClose }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Нормативна та критеріальна основа оцінювання НУШ (3–4 класи)
            </h2>
            <p className="text-xs text-slate-500">
              Офіційні рекомендації Міністерства освіти і науки України
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed mt-3">
          Додаток функціонує суворо за вимогами чинних нормативних документів МОН України. Усі критерії, назви освітніх галузей та показники відповідають офіційному <strong>Примірному зразку № 2 (Додаток 3)</strong> до Методичних рекомендацій щодо оцінювання результатів навчання учнів 1-4 класів (Наказ МОН від 13.07.2021 № 813).
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <a
            href="https://mon.gov.ua"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-800 font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Офіційний сайт МОН (mon.gov.ua)</span>
          </a>
          <a
            href="https://zakon.rada.gov.ua"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-800 font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Законодавство України (zakon.rada.gov.ua)</span>
          </a>
        </div>
      </div>

      {/* Grid of Key Normative Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Card 1: Рівні результатів навчання */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-700" />
            <span>Орієнтовна рамка рівнів (В, Д, С, П)</span>
          </h3>

          <div className="space-y-2 text-slate-700">
            <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
              <span className="font-bold text-blue-900 block">В — Високий рівень:</span>
              Учень/учениця виконує завдання на продуктивно-творчому рівні у змінених умовах; самостійно аналізує, узагальнює, виявляє нестандартний підхід, володіє навичками самоконтролю.
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
              <span className="font-bold text-emerald-900 block">Д — Достатній рівень:</span>
              Виконує завдання на продуктивному рівні в аналогічних ситуаціях за алгоритмом; діє самостійно або з незначною допомогою, самостійно виправляє вказані помилки.
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100">
              <span className="font-bold text-amber-900 block">С — Середній рівень:</span>
              Виконує завдання на репродуктивному рівні у типових навчальних ситуаціях; діє за алгоритмом, потребує уточнення завдання чи звертається за допомогою вчителя.
            </div>

            <div className="p-2.5 rounded-lg bg-red-50/70 border border-red-100">
              <span className="font-bold text-red-900 block">П — Початковий рівень:</span>
              Виконує завдання на рівні копіювання зразка після детального кількаразового пояснення вчителя; потребує постійного супроводу.
            </div>
          </div>
        </div>

        {/* Card 2: Нормативи з української мови та читання */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-700" />
            <span>Кількісні орієнтири для 3 та 4 класів</span>
          </h3>

          <div className="space-y-2 text-slate-700">
            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="font-bold text-slate-900 block">Аудіювання (обсяг тексту та тест):</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>3 клас: 180–240 слів (2–2.5 хв), 6 запитань з 3 варіантами відповідей.</li>
                <li>4 клас: 260–300 слів (2.5–3 хв), 6 запитань з 4 варіантами відповідей.</li>
              </ul>
            </div>

            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="font-bold text-slate-900 block">Читання вголос (орієнтовний темп):</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>3 клас: І семестр 65–70 сл/хв, ІІ семестр 75–80 сл/хв.</li>
                <li>4 клас: І семестр 80–85 сл/хв, ІІ семестр 90–95 сл/хв.</li>
                <li className="text-[11px] text-slate-500 italic">Темп є орієнтиром поступу учня, а не єдиним засобом перевірки.</li>
              </ul>
            </div>

            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="font-bold text-slate-900 block">Диктант (обсяг слів та оцінювання):</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>3 клас: 45–50 слів (І сем), 55–60 слів (ІІ сем).</li>
                <li>4 клас: 60–65 слів (І сем), 70–75 слів (ІІ сем).</li>
                <li>Високий (1-2 негрубі помилки), Достатній (1-3), Середній (4-10), Початковий (11+).</li>
              </ul>
            </div>

            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="font-bold text-slate-900 block">Твори та перекази:</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>Переказ: 3 клас (50–70 слів), 4 клас (70–90/100 слів).</li>
                <li>Твір: 3 клас (~60 слів, 5-6 речень), 4 клас (60–80 слів, 6-7 речень).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Principles of NUSH formative evaluation */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs text-slate-700">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Ключові педагогічні принципи оцінювання НУШ</span>
        </h3>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">
              Підтримка замість вироку
            </span>
            Оцінювання є формувальним: воно виявляє індивідуальний поступ дитини, а не порівнює дітей між собою.
          </li>
          <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">
              Без механічного усереднення
            </span>
            Підсумкова оцінка за галузь не обчислюється як «середнє арифметичне» окремих балів. Кожен критерій відображає конкретне уміння.
          </li>
          <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">
              Конфіденційність та партнерство
            </span>
            Результати оцінювання є приватною інформацією учня та батьків, сприяють доброзичливому діалогу сім’ї та школи.
          </li>
        </ul>
      </div>
    </div>
  );
};
