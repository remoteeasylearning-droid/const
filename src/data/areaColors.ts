export interface AreaColorConfig {
  id: string;
  name: string;
  // Certificate table colors for distinct column backgrounds
  areaColBg: string; // Background for "Освітня галузь" column
  critColBg: string; // Background for "Критерії" column
  scoreColBg: string; // Background for "Рівень" column
  headerBg: string; // Background for table header/banner
  headerText: string;
  subGroupBg: string;
  rowBg: string;
  cellScoreBg: string;
  // UI Tabs & Header colors
  tabActiveBg: string;
  tabActiveText: string;
  tabBadgeBg: string;
  tabBadgeText?: string;
  cardBorder: string;
  cardAccentBg: string;
}

export const AREA_COLORS: Record<string, AreaColorConfig> = {
  activity_traits: {
    id: 'activity_traits',
    name: 'Характеристика діяльності',
    areaColBg: 'bg-indigo-100 print:bg-indigo-100 text-indigo-950 font-bold',
    critColBg: 'bg-indigo-50/50 print:bg-indigo-50/40 text-slate-900',
    scoreColBg: 'bg-white print:bg-white text-indigo-950 font-bold',
    headerBg: 'bg-indigo-200/90 print:bg-indigo-200',
    headerText: 'text-indigo-950',
    subGroupBg: 'bg-indigo-100/70 print:bg-indigo-100',
    rowBg: 'bg-indigo-50/35 print:bg-indigo-50/30',
    cellScoreBg: 'bg-white print:bg-white',
    tabActiveBg: 'bg-indigo-700 text-white',
    tabActiveText: 'text-indigo-900',
    tabBadgeBg: 'bg-indigo-100 text-indigo-800',
    cardBorder: 'border-indigo-300',
    cardAccentBg: 'bg-indigo-50/60',
  },
  language_literature: {
    id: 'language_literature',
    name: 'Мовно-літературна',
    areaColBg: 'bg-sky-100 print:bg-sky-100 text-sky-950 font-bold',
    critColBg: 'bg-sky-50/50 print:bg-sky-50/40 text-slate-900',
    scoreColBg: 'bg-white print:bg-white text-sky-950 font-bold',
    headerBg: 'bg-sky-200/90 print:bg-sky-200',
    headerText: 'text-sky-950',
    subGroupBg: 'bg-sky-100/70 print:bg-sky-100',
    rowBg: 'bg-sky-50/35 print:bg-sky-50/30',
    cellScoreBg: 'bg-white print:bg-white',
    tabActiveBg: 'bg-sky-700 text-white',
    tabActiveText: 'text-sky-900',
    tabBadgeBg: 'bg-sky-100 text-sky-800',
    cardBorder: 'border-sky-300',
    cardAccentBg: 'bg-sky-50/60',
  },
  mathematics: {
    id: 'mathematics',
    name: 'Математична',
    areaColBg: 'bg-amber-100 print:bg-amber-100 text-amber-950 font-bold',
    critColBg: 'bg-amber-50/50 print:bg-amber-50/40 text-slate-900',
    scoreColBg: 'bg-white print:bg-white text-amber-950 font-bold',
    headerBg: 'bg-amber-200/90 print:bg-amber-200',
    headerText: 'text-amber-950',
    subGroupBg: 'bg-amber-100/70 print:bg-amber-100',
    rowBg: 'bg-amber-50/35 print:bg-amber-50/30',
    cellScoreBg: 'bg-white print:bg-white',
    tabActiveBg: 'bg-amber-600 text-white',
    tabActiveText: 'text-amber-900',
    tabBadgeBg: 'bg-amber-100 text-amber-900',
    cardBorder: 'border-amber-300',
    cardAccentBg: 'bg-amber-50/60',
  },
  science: {
    id: 'science',
    name: 'Природнича',
    areaColBg: 'bg-emerald-100 print:bg-emerald-100 text-emerald-950 font-bold',
    critColBg: 'bg-emerald-50/50 print:bg-emerald-50/40 text-slate-900',
    scoreColBg: 'bg-white print:bg-white text-emerald-950 font-bold',
    headerBg: 'bg-emerald-200/90 print:bg-emerald-200',
    headerText: 'text-emerald-950',
    subGroupBg: 'bg-emerald-100/70 print:bg-emerald-100',
    rowBg: 'bg-emerald-50/35 print:bg-emerald-50/30',
    cellScoreBg: 'bg-white print:bg-white',
    tabActiveBg: 'bg-emerald-700 text-white',
    tabActiveText: 'text-emerald-900',
    tabBadgeBg: 'bg-emerald-100 text-emerald-800',
    cardBorder: 'border-emerald-300',
    cardAccentBg: 'bg-emerald-50/60',
  },
  social_civic: {
    id: 'social_civic',
    name: 'Соціальна і громадянська',
    areaColBg: 'bg-rose-100 print:bg-rose-100 text-rose-950 font-bold',
    critColBg: 'bg-rose-50/50 print:bg-rose-50/40 text-slate-900',
    scoreColBg: 'bg-white print:bg-white text-rose-950 font-bold',
    headerBg: 'bg-rose-200/90 print:bg-rose-200',
    headerText: 'text-rose-950',
    subGroupBg: 'bg-rose-100/70 print:bg-rose-100',
    rowBg: 'bg-rose-50/35 print:bg-rose-50/30',
    cellScoreBg: 'bg-white print:bg-white',
    tabActiveBg: 'bg-rose-700 text-white',
    tabActiveText: 'text-rose-900',
    tabBadgeBg: 'bg-rose-100 text-rose-800',
    cardBorder: 'border-rose-300',
    cardAccentBg: 'bg-rose-50/60',
  },
  technology: {
    id: 'technology',
    name: 'Технологічна',
    areaColBg: 'bg-orange-100 print:bg-orange-100 text-orange-950 font-bold',
    critColBg: 'bg-orange-50/50 print:bg-orange-50/40 text-slate-900',
    scoreColBg: 'bg-white print:bg-white text-orange-950 font-bold',
    headerBg: 'bg-orange-200/90 print:bg-orange-200',
    headerText: 'text-orange-950',
    subGroupBg: 'bg-orange-100/70 print:bg-orange-100',
    rowBg: 'bg-orange-50/35 print:bg-orange-50/30',
    cellScoreBg: 'bg-white print:bg-white',
    tabActiveBg: 'bg-orange-600 text-white',
    tabActiveText: 'text-orange-900',
    tabBadgeBg: 'bg-orange-100 text-orange-900',
    cardBorder: 'border-orange-300',
    cardAccentBg: 'bg-orange-50/60',
  },
  informatics: {
    id: 'informatics',
    name: 'Інформатична',
    areaColBg: 'bg-teal-100 print:bg-teal-100 text-teal-950 font-bold',
    critColBg: 'bg-teal-50/50 print:bg-teal-50/40 text-slate-900',
    scoreColBg: 'bg-white print:bg-white text-teal-950 font-bold',
    headerBg: 'bg-teal-200/90 print:bg-teal-200',
    headerText: 'text-teal-950',
    subGroupBg: 'bg-teal-100/70 print:bg-teal-100',
    rowBg: 'bg-teal-50/35 print:bg-teal-50/30',
    cellScoreBg: 'bg-white print:bg-white',
    tabActiveBg: 'bg-teal-700 text-white',
    tabActiveText: 'text-teal-900',
    tabBadgeBg: 'bg-teal-100 text-teal-800',
    cardBorder: 'border-teal-300',
    cardAccentBg: 'bg-teal-50/60',
  },
  arts: {
    id: 'arts',
    name: 'Мистецька',
    areaColBg: 'bg-purple-100 print:bg-purple-100 text-purple-950 font-bold',
    critColBg: 'bg-purple-50/50 print:bg-purple-50/40 text-slate-900',
    scoreColBg: 'bg-white print:bg-white text-purple-950 font-bold',
    headerBg: 'bg-purple-200/90 print:bg-purple-200',
    headerText: 'text-purple-950',
    subGroupBg: 'bg-purple-100/70 print:bg-purple-100',
    rowBg: 'bg-purple-50/35 print:bg-purple-50/30',
    cellScoreBg: 'bg-white print:bg-white',
    tabActiveBg: 'bg-purple-700 text-white',
    tabActiveText: 'text-purple-900',
    tabBadgeBg: 'bg-purple-100 text-purple-800',
    cardBorder: 'border-purple-300',
    cardAccentBg: 'bg-purple-50/60',
  },
  physical_education: {
    id: 'physical_education',
    name: 'Фізкультурна',
    areaColBg: 'bg-lime-100 print:bg-lime-100 text-lime-950 font-bold',
    critColBg: 'bg-lime-50/50 print:bg-lime-50/40 text-slate-900',
    scoreColBg: 'bg-white print:bg-white text-lime-950 font-bold',
    headerBg: 'bg-lime-200/90 print:bg-lime-200',
    headerText: 'text-lime-950',
    subGroupBg: 'bg-lime-100/70 print:bg-lime-100',
    rowBg: 'bg-lime-50/35 print:bg-lime-50/30',
    cellScoreBg: 'bg-white print:bg-white',
    tabActiveBg: 'bg-lime-700 text-white',
    tabActiveText: 'text-lime-900',
    tabBadgeBg: 'bg-lime-100 text-lime-900',
    cardBorder: 'border-lime-300',
    cardAccentBg: 'bg-lime-50/60',
  },
};

export function getAreaColor(areaId: string): AreaColorConfig {
  return (
    AREA_COLORS[areaId] || {
      id: areaId,
      name: 'Галузь',
      areaColBg: 'bg-slate-100 text-slate-900 font-bold',
      critColBg: 'bg-slate-50 text-slate-900',
      scoreColBg: 'bg-white text-slate-900 font-bold',
      headerBg: 'bg-slate-200',
      headerText: 'text-slate-900',
      subGroupBg: 'bg-slate-100',
      rowBg: 'bg-white',
      cellScoreBg: 'bg-slate-50',
      tabActiveBg: 'bg-blue-700 text-white',
      tabActiveText: 'text-blue-900',
      tabBadgeBg: 'bg-slate-200 text-slate-800',
      cardBorder: 'border-slate-300',
      cardAccentBg: 'bg-slate-50',
    }
  );
}
