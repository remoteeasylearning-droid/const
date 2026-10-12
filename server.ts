import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback rule-based analyzer in case Gemini API is unreachable or key is unset
function performRuleBasedAnalysis(reqBody: any) {
  const {
    grade,
    isActivityTrait,
    criterionText,
    observations,
    independenceLevel,
    creativeComponent,
    creativeExample,
    extraNotes,
  } = reqBody;

  const notes = (observations || '').trim();
  const hasNotes = notes.length > 0;

  if (isActivityTrait) {
    // Activity traits: Сформовано vs Формується
    let isFormed = true;
    if (independenceLevel === 'constant_support' || independenceLevel === 'with_help') {
      isFormed = false;
    }
    if (notes.toLowerCase().includes('труднощ') || notes.toLowerCase().includes('потребує допомоги') || notes.toLowerCase().includes('важко')) {
      isFormed = false;
    }
    if (independenceLevel === 'insufficient_data' && !hasNotes) {
      return {
        strengths: ['Спостереження за показником тривають'],
        difficulties: ['Потребує додаткового спостереження під час уроків'],
        independenceSummary: 'Даних недостатньо для остаточного висновку',
        creativeSummary: 'Компонент не оцінювався',
        rationale: 'Учитель не зазначив достатньо спостережень для визначення рівня сформованості.',
        complianceWithCriteria: 'Методичні рекомендації МОН №813 (Характеристика навчальної діяльності)',
        whatToClarify: 'Зверніть увагу на прояви учня у груповій або індивідуальній роботі',
        recommendedLevel: 'Недостатньо даних',
        nextSteps: [
          {
            skill: 'Розвиток навчальної діяльності',
            activity: 'Запропонувати нескладне завдання для самостійного виконання з фіксацією результату',
            teacherSupport: 'Підбадьорення та спостереження за першими кроками',
            independencePath: 'Поступовий перехід від супроводу до індивідуальної дії',
            checkProgressSign: 'Учень проявляє активність або дотримується інструкції без нагадування',
          },
        ],
        certificateTextShort: 'Виявляє інтерес до навчальної діяльності, продовжує формувати вміння.',
        certificateTextExpanded: 'Учень демонструє готовність до співпраці, навичка перебуває на етапі активного формування.',
      };
    }

    const level = isFormed ? 'Сформовано' : 'Формується';
    return {
      strengths: hasNotes ? [notes] : ['Демонструє відповідні прояви навчальної діяльності'],
      difficulties: isFormed ? [] : ['Потребує періодичного нагадування або алгоритму дій'],
      independenceSummary:
        independenceLevel === 'independent'
          ? 'Виконує самостійно'
          : independenceLevel === 'mostly_independent'
          ? 'Переважно самостійно, іноді за підказкою'
          : 'Виконує за підтримки вчителя',
      creativeSummary:
        creativeComponent === 'original_ideas'
          ? `Проявляє творчість: ${creativeExample || 'пропонує власні варіанти'}`
          : 'Творчий компонент у межах вікових вимог',
      rationale: `На основі спостережень: «${notes || 'Відповідні навчальні дії'}» та рівня самостійності.`,
      complianceWithCriteria: 'Методичні рекомендації МОН №813 (Додаток 3, Примірний зразок №2)',
      whatToClarify: '',
      recommendedLevel: level,
      nextSteps: [
        {
          skill: isFormed ? 'Підтримка та розвиток ініціативи' : 'Закріплення навички самоорганізації',
          activity: isFormed ? 'Залучати до ролі лідера або помічника у групі' : 'Використовувати візуальні пам’ятки та картки-підказки',
          teacherSupport: isFormed ? 'Створення ситуацій вибору складніших завдань' : 'Покроковий алгоритм та емоційна підтримка',
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

  // Educational outcomes: В, Д, С, П
  let level = 'Д'; // default достатній
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
  if (notesLower.includes('помилок майже немає') || notesLower.includes('бездоганно') || notesLower.includes('вільно') || notesLower.includes('відмінно')) {
    if (level === 'Д' && independenceLevel === 'independent') level = 'В';
  } else if (notesLower.includes('багато помилок') || notesLower.includes('не розуміє') || notesLower.includes('не виконує')) {
    level = 'П';
  }

  return {
    strengths: hasNotes ? [notes] : ['Володіє базовими навичками згідно з програмою'],
    difficulties: level === 'П' || level === 'С' ? ['Потребує додаткового роз’яснення складних тем та покрокового алгоритму'] : [],
    independenceSummary:
      independenceLevel === 'independent'
        ? 'Виконує навчальні завдання цілком самостійно'
        : independenceLevel === 'mostly_independent'
        ? 'Працює здебільшого самостійно, інколи звертається за уточненням'
        : independenceLevel === 'with_help'
        ? 'Потребує спрямовуючої допомоги або зразка'
        : 'Потребує постійного педагогічного супроводу',
    creativeSummary:
      creativeComponent === 'original_ideas' || creativeComponent === 'applies_new_contexts'
        ? `Виявляє творчий підхід (${creativeExample || 'застосовує знання у нових умовах'})`
        : 'Працює за зразком або алгоритмом',
    rationale: `Рівень сформованості визначено на основі зафіксованих дій: «${notes || 'виконання типових завдань'}», враховуючи ступінь самостійності.`,
    complianceWithCriteria: `Наказ МОН №813: орієнтовні рамки оцінювання для ${grade} класу.`,
    whatToClarify: level === 'Недостатньо даних' ? 'Додайте приклади виконання письмових чи усних завдань' : '',
    recommendedLevel: level,
    nextSteps: [
      {
        skill: `Вдосконалення вміння за критерієм «${criterionText}»`,
        activity:
          level === 'В'
            ? 'Виконання завдань підвищеної складності, нестандартних і творчих вправ'
            : level === 'Д'
            ? 'Тренувальні вправи на закріплення та перехід до самостійного самоконтролю'
            : level === 'С'
            ? 'Робота за алгоритмом, виконання типових завдань з опорою на зразок'
            : 'Індивідуальні завдання з покроковим розбором та наочним матеріалом',
        teacherSupport:
          level === 'В' || level === 'Д'
            ? 'Стимулювання до пояснення власного ходу міркувань'
            : 'Попереджувальний інструктаж, доброзичливі підказки, спільне виправлення помилок',
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
        ? `Учень/учениця усвідомлено виконує завдання за алгоритмом, за потреби робить самоперевірку.`
        : level === 'С'
        ? `Засвоєно основні поняття, завдання виконуються з опорою на підказку чи правило, спостерігається позитивний поступ.`
        : `Потребує уваги та індивідуального супроводу під час виконання завдань з цієї теми.`,
  };
}

// POST endpoint for analyzing criterion
app.post('/api/analyze-criterion', async (req: Request, res: Response) => {
  const reqBody = req.body;
  const {
    grade,
    isActivityTrait,
    areaTitle,
    subjectTitle,
    criterionText,
    criteriaStandard,
    observations,
    independenceLevel,
    creativeComponent,
    creativeExample,
    extraNotes,
  } = reqBody;

  // If Gemini AI client is configured, let's call Gemini 3.8 Flash
  if (ai) {
    try {
      const prompt = `
Ти — висококваліфікований український експерт-методист початкової освіти та вчитель Нової української школи (НУШ).
Твоє завдання — проаналізувати фактичні спостереження вчителя щодо учня ${grade} класу та надати обґрунтовану рекомендацію відповідно до:
1. Державного стандарту початкової освіти (Постанова КМУ).
2. Методичних рекомендацій щодо оцінювання результатів навчання учнів 1-4 класів (Наказ МОН України від 13.07.2021 №813).
3. Примірного зразка Свідоцтва досягнень №2 (Додаток 3 до наказу МОН №813).

Дані для аналізу:
- Клас: ${grade} клас
- Розділ оцінювання: ${isActivityTrait ? 'Характеристика навчальної діяльності (наскрізні уміння)' : 'Характеристика результатів навчання'}
- Освітня галузь: ${areaTitle || 'Загальна'} ${subjectTitle ? `(${subjectTitle})` : ''}
- Критерій / показник: «${criterionText}»
${criteriaStandard ? `- Офіційні нормативні орієнтири: ${criteriaStandard}` : ''}
- Спостереження вчителя: «${observations || '(не вказано або мінімальні дані)'}»
- Рівень самостійності учня: ${
        independenceLevel === 'independent'
          ? 'виконує самостійно'
          : independenceLevel === 'mostly_independent'
          ? 'виконує переважно самостійно, іноді потребує підказки'
          : independenceLevel === 'with_help'
          ? 'виконує за допомогою вчителя'
          : independenceLevel === 'constant_support'
          ? 'потребує постійної підтримки'
          : 'недостатньо даних для висновку'
      }
- Прояв творчого компонента: ${
        creativeComponent === 'original_ideas'
          ? 'самостійно пропонує оригінальні ідеї або способи виконання'
          : creativeComponent === 'applies_new_contexts'
          ? 'застосовує знання у нових ситуаціях'
          : creativeComponent === 'suggests_with_support'
          ? 'пропонує власні варіанти за певної підтримки'
          : creativeComponent === 'acts_by_sample'
          ? 'переважно діє за зразком'
          : 'цей компонент не оцінювався або немає достатніх спостережень'
      }
${creativeExample ? `- Приклад творчого прояву: «${creativeExample}»` : ''}
${extraNotes ? `- Додаткові відомості від вчителя: «${extraNotes}»` : ''}

ВАЖЛИВІ ПЕДАГОГІЧНІ ВИМОГИ:
1. Відокремлюй факти від припущень. Не вигадуй фактів, яких учитель не зазначав.
2. Для Характеристики навчальної діяльності рівень позначається ЯК «Сформовано» або «Формується».
3. Для Характеристики результатів навчання використовуй офіційні рівні: «В» (Високий), «Д» (Достатній), «С» (Середній), «П» (Початковий), або «Недостатньо даних» (якщо спостережень явно замало).
4. Самостійність аналізуй разом із правильністю та повнотою, але не як єдиний чинник.
5. Не знижуй рівень автоматично через відсутність творчості, якщо критерій не вимагає творчого компонента.
6. Рекомендації для подальшої роботи (nextSteps) мають містити 1-2 конкретні, практичні кроки: конкретна дія/вправа, підтримка вчителя, шлях до самостійності, ознака перевірки поступу. Жодних загальних фраз типу "більше читати" чи "потрібно більше працювати"!
7. Формулювання для свідоцтва мають бути професійними, доброзичливими, зрозумілими батькам і орієнтованими на поступ.

Поверни результат строго у форматі JSON згідно зі схемою.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Що вже вдається: конкретні підтверджені вміння учня',
              },
              areasForImprovement: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Що потребує вдосконалення: конкретні труднощі або нестабільні вміння',
              },
              independenceAnalysis: {
                type: Type.STRING,
                description: 'Аналіз самостійності: як учень виконує завдання і якої підтримки потребує',
              },
              creativeAnalysis: {
                type: Type.STRING,
                description: 'Творчий компонент: підтверджені прояви або констатація відсутності потреби',
              },
              rationale: {
                type: Type.STRING,
                description: 'Обґрунтування: які саме спостереження важливі для оцінювання цього критерію',
              },
              recommendedLevel: {
                type: Type.STRING,
                description: 'Орієнтовний рівень: В, Д, С, П або Сформовано / Формується / Недостатньо даних',
              },
              levelJustification: {
                type: Type.STRING,
                description: 'Коротке обґрунтування запропонованого рівня',
              },
              complianceWithCriteria: {
                type: Type.STRING,
                description: 'На які нормативні положення наказу №813 спирається аналіз',
              },
              whatToClarify: {
                type: Type.STRING,
                description: 'Яких доказів бракує або що варто уточнити (якщо є потреба)',
              },
              nextSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skill: { type: Type.STRING, description: 'Навичка або вміння для розвитку' },
                    activity: { type: Type.STRING, description: 'Конкретна навчальна дія чи вправа' },
                    teacherSupport: { type: Type.STRING, description: 'Спосіб підтримки з боку вчителя' },
                    independencePath: { type: Type.STRING, description: 'Спосіб поступового розвитку самостійності' },
                    checkProgressSign: { type: Type.STRING, description: 'Ознака, за якою можна перевірити прогрес' },
                  },
                  required: ['skill', 'activity', 'teacherSupport', 'independencePath', 'checkProgressSign'],
                },
                description: '1-2 пріоритетні наступні навчальні кроки',
              },
              certificateTextShort: {
                type: Type.STRING,
                description: 'Коротке доброзичливе формулювання для свідоцтва (1-2 речення)',
              },
              certificateTextExpanded: {
                type: Type.STRING,
                description: 'Розгорнуте педагогічне формулювання для свідоцтва чи коментаря батькам',
              },
            },
            required: [
              'strengths',
              'areasForImprovement',
              'independenceAnalysis',
              'creativeAnalysis',
              'rationale',
              'recommendedLevel',
              'levelJustification',
              'complianceWithCriteria',
              'nextSteps',
              'certificateTextShort',
              'certificateTextExpanded',
            ],
          },
        },
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      }
    } catch (err: any) {
      console.warn('Gemini API call failed or encountered error, falling back to rule engine:', err?.message);
    }
  }

  // Fallback to rule engine
  const fallback = performRuleBasedAnalysis(reqBody);
  return res.json(fallback);
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (http://localhost:${PORT})`);
  });
}

startServer();
