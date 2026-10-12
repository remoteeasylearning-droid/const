import { StudentProfile, CriterionRecord, Grade } from '../types';
import { EDUCATIONAL_AREAS } from '../data/criteriaData';

const STORAGE_KEY = 'nush_svidoctvo_students_v1';
const ACTIVE_STUDENT_KEY = 'nush_svidoctvo_active_student_id';

export function getAllCriteriaCount(): number {
  let count = 0;
  for (const area of EDUCATIONAL_AREAS) {
    if (area.criteria) {
      count += area.criteria.length;
    }
    if (area.subGroups) {
      for (const sg of area.subGroups) {
        count += sg.criteria.length;
      }
    }
  }
  return count;
}

export function createDefaultStudents(): StudentProfile[] {
  const defaultStudents: StudentProfile[] = [
    {
      id: 'student_1',
      code: 'Учень 1',
      grade: 3,
      pedagogicalCouncilDecision: 'Переведено до 4 класу (протокол № 12 від 28.05.2026)',
      teacherGeneralRecommendations: 'Продовжувати читати художню літературу, розвивати навички усного рахунку та брати участь у творчих проектах.',
      records: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'student_2',
      code: 'Учениця 2',
      grade: 3,
      pedagogicalCouncilDecision: 'Переведено до 4 класу (протокол № 12 від 28.05.2026)',
      teacherGeneralRecommendations: '',
      records: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'student_3',
      code: 'Учень 3',
      grade: 4,
      pedagogicalCouncilDecision: 'Переведено до 5 класу гімназії (протокол № 12 від 28.05.2026)',
      teacherGeneralRecommendations: 'Звертати увагу на самостійне планування навчального часу та розвиток критичного мислення.',
      records: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  return defaultStudents;
}

export function loadStudents(): StudentProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createDefaultStudents();
      saveStudents(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = createDefaultStudents();
      saveStudents(initial);
      return initial;
    }
    return parsed;
  } catch (e) {
    console.error('Error loading students from localStorage:', e);
    return createDefaultStudents();
  }
}

export function saveStudents(students: StudentProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Error saving students to localStorage:', e);
  }
}

export function loadActiveStudentId(): string | null {
  return localStorage.getItem(ACTIVE_STUDENT_KEY);
}

export function saveActiveStudentId(id: string): void {
  localStorage.setItem(ACTIVE_STUDENT_KEY, id);
}

export function addStudent(grade: Grade = 3): StudentProfile {
  const students = loadStudents();
  const nextNum = students.length + 1;
  const newStudent: StudentProfile = {
    id: `student_${Date.now()}`,
    code: `Учень ${nextNum}`,
    grade: grade,
    pedagogicalCouncilDecision: '',
    teacherGeneralRecommendations: '',
    records: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  students.push(newStudent);
  saveStudents(students);
  saveActiveStudentId(newStudent.id);
  return newStudent;
}

export function deleteStudent(id: string): StudentProfile[] {
  let students = loadStudents().filter((s) => s.id !== id);
  if (students.length === 0) {
    const fresh: StudentProfile = {
      id: `student_${Date.now()}`,
      code: 'Учень 1',
      grade: 3,
      records: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    students = [fresh];
  }
  saveStudents(students);
  saveActiveStudentId(students[0].id);
  return students;
}

export function updateStudentProfile(
  id: string,
  updates: Partial<Omit<StudentProfile, 'id' | 'createdAt'>>
): StudentProfile | null {
  const students = loadStudents();
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return null;

  students[index] = {
    ...students[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveStudents(students);
  return students[index];
}

export function saveCriterionRecord(
  studentId: string,
  criterionId: string,
  recordData: Partial<CriterionRecord>
): StudentProfile | null {
  const students = loadStudents();
  const index = students.findIndex((s) => s.id === studentId);
  if (index === -1) return null;

  const currentRecords = students[index].records || {};
  const existing = currentRecords[criterionId] || {
    criterionId,
    observations: '',
    independenceLevel: 'independent',
    creativeComponent: 'not_evaluated',
    updatedAt: new Date().toISOString(),
  };

  const updatedRecord: CriterionRecord = {
    ...existing,
    ...recordData,
    criterionId,
    updatedAt: new Date().toISOString(),
  };

  currentRecords[criterionId] = updatedRecord;
  students[index].records = currentRecords;
  students[index].updatedAt = new Date().toISOString();

  saveStudents(students);
  return students[index];
}

export function calculateStudentStats(student: StudentProfile) {
  const total = getAllCriteriaCount();
  const records = student.records || {};
  let completed = 0;
  let inProgress = 0;

  for (const cid in records) {
    const rec = records[cid];
    if (rec.teacherDecision || rec.isCompleted) {
      completed++;
    } else if (rec.observations?.trim() || rec.analysis) {
      inProgress++;
    }
  }

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return {
    total,
    completed,
    inProgress,
    percent,
  };
}

export function calculateAreaStats(student: StudentProfile, areaId: string) {
  const area = EDUCATIONAL_AREAS.find((a) => a.id === areaId);
  if (!area) return { total: 0, completed: 0, percent: 0 };

  const criteriaList = area.criteria || [];
  let allCriteria = [...criteriaList];
  if (area.subGroups) {
    for (const sg of area.subGroups) {
      allCriteria.push(...sg.criteria);
    }
  }

  const total = allCriteria.length;
  const records = student.records || {};
  let completed = 0;

  for (const c of allCriteria) {
    const rec = records[c.id];
    if (rec && (rec.teacherDecision || rec.isCompleted)) {
      completed++;
    }
  }

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return {
    total,
    completed,
    percent,
  };
}
