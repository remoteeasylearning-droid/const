import {
  CriterionAnalysis,
  Grade,
  IndependenceLevel,
  CreativeComponentLevel,
} from '../types';

export interface AnalyzePayload {
  grade: Grade;
  isActivityTrait?: boolean;
  areaId: string;
  areaTitle: string;
  subjectTitle?: string;
  criterionId: string;
  criterionText: string;
  criteriaStandard?: string;
  observations: string;
  independenceLevel: IndependenceLevel;
  creativeComponent: CreativeComponentLevel;
  creativeExample?: string;
  extraNotes?: string;
}

export async function requestCriterionAnalysis(
  payload: AnalyzePayload
): Promise<CriterionAnalysis> {
  try {
    const res = await fetch('/api/analyze-criterion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data: CriterionAnalysis = await res.json();
    return data;
  } catch (error) {
    console.warn('Network request to /api/analyze-criterion failed, using client-side fallback:', error);
    return getClientFallbackAnalysis(payload);
  }
}

function getClientFallbackAnalysis(payload: AnalyzePayload): CriterionAnalysis {
  const {
    grade,
    isActivityTrait,
    criterionText,
    observations,
    independenceLevel,
    creativeComponent,
    creativeExample,
  } = payload;

  const notes = (observations || '').trim();
  const hasNotes = notes.length > 0;

  if (isActivityTrait) {
    let isFormed = true;
    if (independenceLevel === 'constant_support' || independenceLevel === 'with_help') {
      isFormed = false;
    }
    const notesLower = notes.toLowerCase();
    if (notesLower.includes('труднощ') || notesLower.includes('важко') || notesLower.includes('потребує допомоги')) {
      isFormed = false;
    }

    if (independenceLevel === 'insufficient_data' && !hasNotes) {
      return {
        strengths: ['Спостереження за показником тривають'],
        areasForImprovement: ['Потрібно зафіксувати конкретні дії під час уроків'],
        independenceAnalysis: 'Даних недостатньо для остаточного висновку',
        creativeAnalysis: 'Компонент не оцінювався',
        rationale: 'Учитель не зазначив достатньо фактів для підтвердження рівня сформованості.',
        complianceWithCriteria: 'Методичні рекомендації МОН №813 (Характеристика навчальної діяльності)',
        whatToClarify: 'Додайте приклади роботи у групі або самостійного виконання',
        recommendedLevel: 'Недостатньо даних',
        levelJustification: 'Бракує фактичних спостережень',
        nextSteps: [
          {
            skill: 'Формування навички навчальної діяльності',
            activity: 'Запропонувати практичне завдання з покроковим планом дій',
            teacherSupport: 'Підбадьорення та спостереження за автономністю учня',
            independencePath: 'Поступове зменшення кількості нагадувань',
            checkProgressSign: 'Учень проявляє активність та дотримується інструкції без нагадування',
          },
        ],
        certificateTextShort: 'Виявляє інтерес до навчальної діяльності, продовжує формувати навичку.',
        certificateTextExpanded: 'Учень демонструє готовність до співпраці, навичка перебуває на етапі активного формування під керівництвом учителя.',
      };
    }

    const level = isFormed ? 'Сформовано' : 'Формується';
    return {
      strengths: hasNotes ? [notes] : ['Демонструє відповідні прояви навчальної діяльності'],
      areasForImprovement: isFormed ? [] : ['Потребує періодичного нагадування або алгоритму дій'],
      independenceAnalysis:
        independenceLevel === 'independent'
          ? 'Виконує самостійно'
          : independenceLevel === 'mostly_independent'
          ? 'Переважно самостійно, іноді за підказкою'
          : 'Виконує за підтримки вчителя',
      creativeAnalysis:
        creativeComponent === 'original_ideas'
          ? `Проявляє творчість: ${creativeExample || 'пропонує власні варіанти'}`
          : 'Творчий компонент у межах норми',
      rationale: `На основі спостережень: «${notes || 'Відповідні навчальні дії'}» та рівня самостійності.`,
      complianceWithCriteria: 'Методичні рекомендації МОН №813 (Додаток 3, Примірний зразок №2)',
      whatToClarify: '',
      recommendedLevel: level,
      levelJustification: isFormed ? 'Дії виконуються впевнено і самостійно' : 'Потребує спрямовуючої підтримки дорослого',
      nextSteps: [
        {
          skill: isFormed ? 'Підтримка ініціативи та лідерства' : 'Закріплення навички самоорганізації',
          activity: isFormed ? 'Залучати до ролі консультанта або лідера мікрогрупи' : 'Використовувати візуальні пам’ятки та картки-підказки',
          teacherSupport: isFormed ? 'Створення ситуацій вибору складніших завдань' : 'Покроковий алгоритм дій та емоційне заохочення',
          independencePath: 'Зменшення кількості нагадувань',
          checkProgressSign: 'Впевнене виконання навчальних дій у типових ситуаціях',
        },
      ],
      certificateTextShort: isFormed
        ? `Впевнено демонструє уміння: ${criterionText.toLowerCase()}.`
        : `Продовжує розвивати уміння: ${criterionText.toLowerCase()}.`,
      certificateTextExpanded: isFormed
        ? `Учень/учениця успішно виявляє самостійність та відповідальність у діяльності, пов’язаній із цим умінням.`
        : `Учень/учениця робить перші впевнені кроки, потребує доброзичливого супроводу для повної автономності.`,
    };
  }

  // Educational outcomes
  let level: 'В' | 'Д' | 'С' | 'П' | 'Недостатньо даних' = 'Д';
  if (independenceLevel === 'independent') {
    if (creativeComponent === 'original_ideas' || creativeComponent === 'applies_new_contexts') {
      level = 'В';
    } else {
      level = 'Д';
    }
  } else if (independenceLevel === 'mostly_independent') {
    level = 'Д';
  } else if (independenceLevel === 'with_help') {
    level = 'С';
  } else if (independenceLevel === 'constant_support') {
    level = 'П';
  } else if (independenceLevel === 'insufficient_data' && !hasNotes) {
    level = 'Недостатньо даних';
  }

  const notesLower = notes.toLowerCase();
  if (notesLower.includes('помилок майже немає') || notesLower.includes('бездоганно') || notesLower.includes('вільно')) {
    if (level === 'Д' && independenceLevel === 'independent') level = 'В';
  } else if (notesLower.includes('багато помилок') || notesLower.includes('не розуміє') || notesLower.includes('не виконує')) {
    level = 'П';
  }

  return {
    strengths: hasNotes ? [notes] : ['Володіє базовими навичками за критерієм'],
    areasForImprovement: level === 'П' || level === 'С' ? ['Потребує додаткового роз’яснення та роботи за алгоритмом'] : [],
    independenceAnalysis:
      independenceLevel === 'independent'
        ? 'Виконує навчальні завдання цілком самостійно'
        : independenceLevel === 'mostly_independent'
        ? 'Працює здебільшого самостійно, інколи звертається за уточненням'
        : independenceLevel === 'with_help'
        ? 'Потребує спрямовуючої допомоги або зразка'
        : 'Потребує постійного педагогічного супроводу',
    creativeAnalysis:
      creativeComponent === 'original_ideas' || creativeComponent === 'applies_new_contexts'
        ? `Виявляє творчий підхід (${creativeExample || 'застосовує знання у нових умовах'})`
        : 'Працює за зразком або алгоритмом',
    rationale: `Рівень сформованості визначено на основі зафіксованих дій: «${notes || 'виконання типових завдань'}», враховуючи ступінь самостійності.`,
    complianceWithCriteria: `Наказ МОН №813: орієнтовні рамки оцінювання для ${grade} класу.`,
    whatToClarify: level === 'Недостатньо даних' ? 'Додайте приклади виконання письмових чи усних робіт' : '',
    recommendedLevel: level,
    levelJustification:
      level === 'В'
        ? 'Високий рівень: самостійність, правильність та прояв ініціативи'
        : level === 'Д'
        ? 'Достатній рівень: володіє навичкою за алгоритмом із високою самостійністю'
        : level === 'С'
        ? 'Середній рівень: виконує завдання переважно за допомогою або зразком'
        : level === 'П'
        ? 'Початковий рівень: потребує постійної уваги та спрощених завдань'
        : 'Недостатньо спостережень для визначення рівня',
    nextSteps: [
      {
        skill: `Розвиток уміння за показником «${criterionText}»`,
        activity:
          level === 'В'
            ? 'Виконання завдань підвищеної складності, творчих проєктів та нестандартних задач'
            : level === 'Д'
            ? 'Тренувальні вправи на закріплення та перехід до регулярного самоконтролю'
            : level === 'С'
            ? 'Робота за алгоритмом, виконання типових завдань з опорою на картку-зразок'
            : 'Індивідуальні завдання з покроковим розбором та наочним матеріалом',
        teacherSupport:
          level === 'В' || level === 'Д'
            ? 'Стимулювання до обґрунтування власного способу дій'
            : 'Попереджувальний інструктаж, доброзичливі підказки, спільний аналіз помилок',
        independencePath: 'Поступове зменшення кількості навідних запитань',
        checkProgressSign: 'Зниження потреби в підказках та зростання правильності виконання робіт',
      },
    ],
    certificateTextShort:
      level === 'В'
        ? `Впевнено і самостійно застосовує вміння: ${criterionText.toLowerCase()}.`
        : level === 'Д'
        ? `Успішно володіє вмінням: ${criterionText.toLowerCase()}, діє переважно самостійно.`
        : level === 'С'
        ? `Опановує вміння: ${criterionText.toLowerCase()}, успішно виконує типові завдання за зразком.`
        : `Потребує підтримки у формуванні вміння: ${criterionText.toLowerCase()}.`,
    certificateTextExpanded:
      level === 'В'
        ? `Демонструє глибоке розуміння та здатність застосовувати знання у змінених умовах, виявляє ініціативу.`
        : level === 'Д'
        ? `Учень/учениця усвідомлено виконує завдання за алгоритмом, за потреби здійснює самоперевірку.`
        : level === 'С'
        ? `Засвоєно основні поняття, завдання виконуються з опорою на підказку чи правило, спостерігається позитивний поступ.`
        : `Потребує додаткової уваги та індивідуального супроводу під час виконання завдань з цієї теми.`,
  };
}
