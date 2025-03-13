// Client-side storage utilities using localStorage

// Helper function to safely access localStorage
const getLocalStorage = (key: string, defaultValue: string = '[]') => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
};

// Helper function to safely set localStorage
const setLocalStorage = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

// Get additional students
export const getAdditionalStudents = () => {
  return JSON.parse(getLocalStorage('additionalStudents', '[]'));
};

// Add a student
export const addServerStudent = (student: any) => {
  const students = getAdditionalStudents();
  
  // Check if student with same regNumber already exists
  if (!students.some((s: any) => s.regNumber === student.regNumber)) {
    students.push(student);
    setLocalStorage('additionalStudents', JSON.stringify(students));
    return true;
  }
  return false;
};

// Delete a student
export const deleteServerStudent = (regNumber: string) => {
  const students = getAdditionalStudents();
  const filteredStudents = students.filter((s: any) => s.regNumber !== regNumber);
  
  if (filteredStudents.length !== students.length) {
    setLocalStorage('additionalStudents', JSON.stringify(filteredStudents));
    return true;
  }
  return false;
};

// Update a student
export const updateServerStudent = (regNumber: string, name: string) => {
  const students = getAdditionalStudents();
  const student = students.find((s: any) => s.regNumber === regNumber);
  
  if (student) {
    student.name = name;
    setLocalStorage('additionalStudents', JSON.stringify(students));
    return true;
  }
  return false;
};

// Get modified student names
export const getModifiedStudents = () => {
  return JSON.parse(getLocalStorage('modifiedStudents', '{}'));
};

// Get student penalties
export const getStudentPenalties = () => {
  return JSON.parse(getLocalStorage('studentPenalties', '{}'));
};

// Get quiz results
export const getQuizResults = () => {
  return JSON.parse(getLocalStorage('quizResults', '[]'));
};

// Add a quiz result
export const addQuizResult = (result: any) => {
  const results = getQuizResults();
  
  // Check if result for this student already exists
  const existingIndex = results.findIndex((r: any) => r.regNumber === result.regNumber);
  
  if (existingIndex >= 0) {
    // Update existing result
    results[existingIndex] = result;
  } else {
    // Add new result
    results.push(result);
  }
  
  setLocalStorage('quizResults', JSON.stringify(results));
  return true;
};

// Get quiz settings
export const getQuizSettings = () => {
  return JSON.parse(getLocalStorage('quizSettings', '{"totalQuestions": 10}'));
};

// Update quiz settings
export const updateQuizSettings = (settings: any) => {
  setLocalStorage('quizSettings', JSON.stringify(settings));
  return true;
}; 