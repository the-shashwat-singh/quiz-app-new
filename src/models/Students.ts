export interface Student {
  regNumber: string;
  name: string;
  penalty?: number;
}

// Default list of students that are always available
const defaultStudents: Student[] = [
  { regNumber: "RA2411043010062", name: "BHAVISH DESAI", penalty: 0 },
  { regNumber: "RA2411043010063", name: "S S AVYUKTA", penalty: 0 },
  { regNumber: "RA2411043010064", name: "ANUSHKA RISHIVANSHI", penalty: 0 },
  { regNumber: "RA2411043010065", name: "ASHWIN SIVAKUMAR", penalty: 0 },
  { regNumber: "RA2411043010066", name: "HOTE DEVASHREE MANGESH", penalty: 0 },
  { regNumber: "RA2411043010067", name: "PADMESH GARADALA", penalty: 0 },
  { regNumber: "RA2411043010068", name: "KOLLURU VEDASAI MANASA", penalty: 0 },
  { regNumber: "RA2411043010069", name: "R MITRA", penalty: 0 },
  { regNumber: "RA2411043010070", name: "S SRIVATHS", penalty: 0 },
  { regNumber: "RA2411043010071", name: "SAMARTH R ANEGUNDI", penalty: 0 },
  { regNumber: "RA2411043010072", name: "MUKKESH M R", penalty: 0 },
  { regNumber: "RA2411043010073", name: "HARINI J", penalty: 0 },
  { regNumber: "RA2411043010074", name: "PRADYUMNA KRISHNAN", penalty: 0 },
  { regNumber: "RA2411043010075", name: "SHASHWAT SINGH", penalty: 0 },
  { regNumber: "RA2411043010076", name: "ABHISHEK KUMAR SINGH", penalty: 0 },
  { regNumber: "RA2411043010077", name: "ABHI SHIKTHA RUDRAVARAM", penalty: 0 },
  { regNumber: "RA2411043010078", name: "MOHAMMAD AMAAN KHAN", penalty: 0 },
  { regNumber: "RA2411043010079", name: "HIMANSHU GOLYA", penalty: 0 },
  { regNumber: "RA2411043010080", name: "JISHNUDEB BISWAS", penalty: 0 },
  { regNumber: "RA2411043010081", name: "BHARATH ADITHYA C A", penalty: 0 },
  { regNumber: "RA2411043010083", name: "TUSHAR RAJ", penalty: 0 },
  { regNumber: "RA2411043010084", name: "V PRANEEL", penalty: 0 },
  { regNumber: "RA2411043010085", name: "PRATIKSHYA KHANDUAL", penalty: 0 },
  { regNumber: "RA2411043010086", name: "DHARANIBALAN KARUPPIAH", penalty: 0 },
  { regNumber: "RA2411043010087", name: "TANISHA MAAN", penalty: 0 },
  { regNumber: "RA2411043010088", name: "ISHAN VERMA", penalty: 0 },
  { regNumber: "RA2411043010089", name: "VISHNU K", penalty: 0 },
  { regNumber: "RA2411043010090", name: "PRATHAM GOYAL", penalty: 0 },
  { regNumber: "RA2411043010091", name: "RETHIKA S", penalty: 0 },
  { regNumber: "RA2411043010092", name: "AKSHAT SHRIVASTAVA", penalty: 0 },
  { regNumber: "RA2411043010093", name: "ANIKETH R PRABHU", penalty: 0 },
  { regNumber: "RA2411043010094", name: "MOHIT MUSTURI", penalty: 0 },
  { regNumber: "RA2411043010096", name: "VISHAL G", penalty: 0 },
  { regNumber: "RA2411043010098", name: "KARTHIK I", penalty: 0 },
  { regNumber: "RA2411043010099", name: "MADHUMATHI V", penalty: 0 },
  { regNumber: "RA2411043010100", name: "KAVIN RAJAN PILLAY", penalty: 0 },
  { regNumber: "RA2411043010101", name: "KISHAN GV", penalty: 0 },
  { regNumber: "RA2411043010102", name: "KAVIYA SRI S", penalty: 0 },
  { regNumber: "RA2411043010103", name: "SESHAM MANYA", penalty: 0 },
  { regNumber: "RA2411043010107", name: "RITHIKA RS", penalty: 0 },
  { regNumber: "RA2411043010108", name: "CHANDAN CHAURASIA", penalty: 0 },
  { regNumber: "RA2411043010109", name: "ARGHYADEEP DAS", penalty: 0 },
  { regNumber: "RA2411043010110", name: "ABHEENAV SAHU", penalty: 0 },
  { regNumber: "RA2411043010111", name: "THARUN RAAJ P", penalty: 0 },
  { regNumber: "RA2411043010112", name: "DHAVALA ADITYA", penalty: 0 },
  { regNumber: "RA2411043010113", name: "SAI SANTHOSSH M", penalty: 0 },
  { regNumber: "RA2411043010114", name: "PREETHY K", penalty: 0 },
  { regNumber: "RA2411043010115", name: "S TARUN RAJ", penalty: 0 },
  { regNumber: "RA2411043010116", name: "ARAVINTHKRISHNA", penalty: 0 }
];

// Helper function to safely access localStorage
export const getLocalStorage = (key: string, defaultValue: string = '[]') => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
};

// Helper function to safely set localStorage
export const setLocalStorage = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

// Get all students (both default and additional)
export const getAllStudents = (): Student[] => {
  const additionalStudents = JSON.parse(getLocalStorage('additionalStudents', '[]'));
  return [...defaultStudents, ...additionalStudents];
};

// Add a new student (only for additional students)
export const addStudent = (student: Student): boolean => {
  const allStudents = getAllStudents();
  if (allStudents.some(s => s.regNumber === student.regNumber)) {
    return false;
  }

  const additionalStudents = JSON.parse(getLocalStorage('additionalStudents', '[]'));
  additionalStudents.push(student);
  setLocalStorage('additionalStudents', JSON.stringify(additionalStudents));
  return true;
};

// Delete a student (only from additional students)
export const deleteStudent = (regNumber: string): boolean => {
  if (defaultStudents.some(s => s.regNumber === regNumber)) {
    return false; // Cannot delete default students
  }

  const additionalStudents = JSON.parse(getLocalStorage('additionalStudents', '[]'));
  const updatedStudents = additionalStudents.filter((s: Student) => s.regNumber !== regNumber);
  setLocalStorage('additionalStudents', JSON.stringify(updatedStudents));
  return true;
};

// Get student name by registration number
export const getStudentName = async (regNumber: string): Promise<string> => {
  // First check default students
  const defaultStudent = defaultStudents.find(s => s.regNumber === regNumber);
  if (defaultStudent) {
    // Check if there's a modified name for this default student
    const modifiedStudents = JSON.parse(getLocalStorage('modifiedStudents', '{}'));
    if (modifiedStudents[regNumber]) {
      return modifiedStudents[regNumber];
    }
    return defaultStudent.name;
  }
  
  // Then check additional students in localStorage
  const additionalStudents = JSON.parse(getLocalStorage('additionalStudents', '[]'));
  const additionalStudent = additionalStudents.find((s: Student) => s.regNumber === regNumber);
  
  if (additionalStudent) {
    return additionalStudent.name;
  }
  
  // If not found locally, try to fetch from the server
  try {
    if (typeof window !== 'undefined') {
      const response = await fetch('/api/students');
      if (response.ok) {
        const students = await response.json();
        const student = students.find((s: Student) => s.regNumber === regNumber);
        if (student) {
          // Save to localStorage for future use
          const additionalStudents = JSON.parse(getLocalStorage('additionalStudents', '[]'));
          if (!additionalStudents.some((s: Student) => s.regNumber === student.regNumber)) {
            additionalStudents.push(student);
            setLocalStorage('additionalStudents', JSON.stringify(additionalStudents));
          }
          return student.name;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching student data from server:', error);
  }
  
  return 'Unknown Student';
};

// Synchronous version for backward compatibility
export const getStudentNameSync = (regNumber: string): string => {
  // First check default students
  const defaultStudent = defaultStudents.find(s => s.regNumber === regNumber);
  if (defaultStudent) {
    // Check if there's a modified name for this default student
    const modifiedStudents = JSON.parse(getLocalStorage('modifiedStudents', '{}'));
    if (modifiedStudents[regNumber]) {
      return modifiedStudents[regNumber];
    }
    return defaultStudent.name;
  }
  
  // Then check additional students
  const additionalStudents = JSON.parse(getLocalStorage('additionalStudents', '[]'));
  const additionalStudent = additionalStudents.find((s: Student) => s.regNumber === regNumber);
  
  return additionalStudent ? additionalStudent.name : 'Unknown Student';
};

// Apply penalty to a student
export const applyPenalty = (regNumber: string, penalty: number): boolean => {
  const allStudents = getAllStudents();
  const student = allStudents.find(s => s.regNumber === regNumber);
  
  if (!student) return false;

  // For default students, store penalties separately
  if (defaultStudents.some(s => s.regNumber === regNumber)) {
    const penalties = JSON.parse(getLocalStorage('studentPenalties', '{}'));
    penalties[regNumber] = penalty;
    setLocalStorage('studentPenalties', JSON.stringify(penalties));
    return true;
  }

  // For additional students, update their record directly
  const additionalStudents = JSON.parse(getLocalStorage('additionalStudents', '[]'));
  const updatedStudents = additionalStudents.map((s: Student) => 
    s.regNumber === regNumber ? { ...s, penalty } : s
  );
  setLocalStorage('additionalStudents', JSON.stringify(updatedStudents));
  return true;
};

// Get student's penalty
export const getStudentPenalty = (regNumber: string): number => {
  // Check penalties storage first
  const penalties = JSON.parse(getLocalStorage('studentPenalties', '{}'));
  if (regNumber in penalties) {
    return penalties[regNumber];
  }

  // Check additional students
  const additionalStudents = JSON.parse(getLocalStorage('additionalStudents', '[]'));
  const student = additionalStudents.find((s: Student) => s.regNumber === regNumber);
  return student?.penalty || 0;
}; 