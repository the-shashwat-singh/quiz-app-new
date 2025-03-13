import { Question } from './Question';

// 10 challenging coding-focused questions for the high stakes round
export const bonusQuestions: Question[] = [
  {
    id: 101,
    text: "What will be the output of this code?\n\n```cpp\nint arr[] = {1, 2, 3, 4, 5};\nint* p = arr;\nint* q = &arr[4];\nwhile(p < q) {\n    cout << *p << \" \";\n    p += 2;\n}\n```",
    options: [
      "1 2 3 4",
      "1 3",
      "1 3 5",
      "1 3 5 2 4"
    ],
    correctAnswer: 1,
    difficulty: "difficult",
    timeLimit: 60,
    explanation: "p starts at arr[0], increments by 2 each time. So it prints arr[0]=1, then arr[2]=3, then p becomes arr[4] which is not < q, so loop ends.",
    isBonus: true
  },
  {
    id: 102,
    text: "Which code snippet correctly swaps two numbers without using a third variable?",
    options: [
      "a = a + b; b = a - b; a = a + b;",
      "a = a + b; b = a - b; a = a - b;",
      "a = a * b; b = a / b; a = a / b;",
      "a = a ^ b; b = a ^ b; a = a ^ b;"
    ],
    correctAnswer: 1,
    difficulty: "difficult",
    timeLimit: 60,
    explanation: "The correct sequence is: a = a + b (sum in a), b = a - b (original a in b), a = a - b (original b in a)",
    isBonus: true
  },
  {
    id: 103,
    text: "What is wrong with this code?\n\n```cpp\nint factorial(int n) {\n    if(n == 0) return 1;\n    return n * factorial(n);\n}\n```",
    options: [
      "Base case is wrong",
      "Return statement should be n * factorial(n-1)",
      "Function should return long long instead of int",
      "Function should handle negative numbers"
    ],
    correctAnswer: 1,
    difficulty: "difficult",
    timeLimit: 60,
    explanation: "The recursive call factorial(n) creates infinite recursion. It should be factorial(n-1) to reach the base case.",
    isBonus: true
  },
  {
    id: 104,
    text: "What will this code print?\n\n```cpp\nint a = 5;\nint& b = a;\nint* c = &a;\n*c = 10;\nb = 15;\ncout << a << \" \" << b << \" \" << *c;\n```",
    options: [
      "5 15 10",
      "15 15 15",
      "10 10 10",
      "15 10 15"
    ],
    correctAnswer: 1,
    difficulty: "difficult",
    timeLimit: 60,
    explanation: "b is a reference to a, c points to a. When *c=10, a becomes 10. When b=15, a becomes 15. All variables refer to same memory location.",
    isBonus: true
  },
  {
    id: 105,
    text: "Find the error in this binary search implementation:\n\n```cpp\nint binarySearch(int arr[], int n, int target) {\n    int left = 0, right = n;\n    while(left < right) {\n        int mid = (left + right) / 2;\n        if(arr[mid] == target) return mid;\n        if(arr[mid] < target)\n            left = mid;\n        else\n            right = mid;\n    }\n    return -1;\n}\n```",
    options: [
      "right should be initialized to n-1",
      "left = mid should be left = mid + 1",
      "(left + right) can cause integer overflow",
      "All of the above"
    ],
    correctAnswer: 3,
    difficulty: "difficult",
    timeLimit: 60,
    explanation: "Multiple issues: 1) right should be n-1 to avoid out of bounds, 2) left=mid causes infinite loop, should be mid+1, 3) (left+right) can overflow for large arrays",
    isBonus: true
  },
  {
    id: 106,
    text: "What will be printed?\n\n```cpp\nint main() {\n    int x = 1;\n    switch(x) {\n        case 1: cout << \"One \";\n        case 2: cout << \"Two \";\n        case 3: cout << \"Three \";\n        default: cout << \"Default \";\n    }\n    return 0;\n}\n```",
    options: [
      "One",
      "One Two Three Default",
      "One Default",
      "Default"
    ],
    correctAnswer: 1,
    difficulty: "difficult",
    timeLimit: 60,
    explanation: "No break statements, so after matching case 1, execution falls through all subsequent cases (fallthrough behavior).",
    isBonus: true
  },
  {
    id: 107,
    text: "Which code correctly reverses a string in-place?\n\n```cpp\nvoid reverseString(string& str) {\n```",
    options: [
      "for(int i=0; i<str.length()/2; i++) swap(str[i], str[str.length()-i]);",
      "for(int i=0; i<str.length()/2; i++) swap(str[i], str[str.length()-i-1]);",
      "for(int i=0; i<str.length(); i++) swap(str[i], str[str.length()-i-1]);",
      "for(int i=0; i<=str.length()/2; i++) swap(str[i], str[str.length()-i-1]);"
    ],
    correctAnswer: 1,
    difficulty: "difficult",
    timeLimit: 60,
    explanation: "Option B is correct: swaps up to length/2, uses length-i-1 for correct indexing (0-based). Other options have off-by-one errors or swap too many times.",
    isBonus: true
  },
  {
    id: 108,
    text: "What's wrong with this memory management?\n\n```cpp\nclass Array {\n    int* arr;\n    int size;\npublic:\n    Array(int s) : size(s) { arr = new int[size]; }\n    Array(const Array& other) {\n        arr = other.arr;\n        size = other.size;\n    }\n};\n```",
    options: [
      "Constructor should use malloc instead of new",
      "Copy constructor creates shallow copy instead of deep copy",
      "Size should be initialized after array allocation",
      "Array should be initialized with default values"
    ],
    correctAnswer: 1,
    difficulty: "difficult",
    timeLimit: 60,
    explanation: "Copy constructor performs shallow copy (both objects point to same memory). Should be: arr = new int[size]; memcpy(arr, other.arr, size * sizeof(int));",
    isBonus: true
  },
  {
    id: 109,
    text: "What will this code output?\n\n```cpp\nint i = 5;\nint& ref = i;\ni = 6;\nint* ptr = &i;\n*ptr = 7;\nref = 8;\ncout << i << \" \" << ref << \" \" << *ptr;\n```",
    options: [
      "6 7 8",
      "8 8 8",
      "7 7 7",
      "8 7 7"
    ],
    correctAnswer: 1,
    difficulty: "difficult",
    timeLimit: 60,
    explanation: "All variables refer to same memory: ref is reference to i, ptr points to i. Final assignment ref=8 changes i to 8, affecting all variables.",
    isBonus: true
  },
  {
    id: 110,
    text: "Find the bug in this function:\n\n```cpp\nint findMax(int arr[], int n) {\n    int max = arr[0];\n    for(int i = 0; i <= n; i++)\n        if(arr[i] > max)\n            max = arr[i];\n    return max;\n}\n```",
    options: [
      "max should be initialized to 0",
      "Loop condition should be i < n",
      "Should check if arr is nullptr",
      "Should use INT_MIN as initial max value"
    ],
    correctAnswer: 1,
    difficulty: "difficult",
    timeLimit: 60,
    explanation: "Loop condition i <= n causes array out of bounds access. Array indices are 0 to n-1, so condition should be i < n.",
    isBonus: true
  }
];

// Function to get a random bonus question
export function getRandomBonusQuestion(): Question {
  const randomIndex = Math.floor(Math.random() * bonusQuestions.length);
  return { ...bonusQuestions[randomIndex] };
}

// Function to get all bonus questions
export function getAllBonusQuestions(): Question[] {
  // Get default bonus questions
  const defaultBonusQuestions = bonusQuestions.map(q => ({ ...q, isBonus: true }));
  
  // Get additional bonus questions from localStorage
  const additionalBonusQuestions = JSON.parse(localStorage.getItem('additionalBonusQuestions') || '[]');
  
  // Get modified bonus questions from localStorage
  const modifiedBonusQuestions = JSON.parse(localStorage.getItem('modifiedBonusQuestions') || '[]');
  
  // Apply modifications to default questions
  const modifiedDefaultQuestions = defaultBonusQuestions.map(defaultQuestion => {
    const modifiedQuestion = modifiedBonusQuestions.find((q: Question) => q.id === defaultQuestion.id);
    return modifiedQuestion || defaultQuestion;
  });
  
  // Combine default (with modifications) and additional questions
  return [...modifiedDefaultQuestions, ...additionalBonusQuestions];
}

// Function to add a new bonus question
export function addBonusQuestion(question: Question): void {
  // Ensure the question is marked as a bonus question
  const bonusQuestion = { ...question, isBonus: true };
  
  // Get existing additional bonus questions
  const additionalBonusQuestions = JSON.parse(localStorage.getItem('additionalBonusQuestions') || '[]');
  
  // Add the new question
  additionalBonusQuestions.push(bonusQuestion);
  
  // Save back to localStorage
  localStorage.setItem('additionalBonusQuestions', JSON.stringify(additionalBonusQuestions));
}

// Function to update a bonus question
export function updateBonusQuestion(question: Question): void {
  // Ensure the question is marked as a bonus question
  const bonusQuestion = { ...question, isBonus: true };
  
  // Check if it's a default question (ID between 101-110)
  if (bonusQuestion.id >= 101 && bonusQuestion.id <= 110) {
    // Get existing modified bonus questions
    const modifiedBonusQuestions = JSON.parse(localStorage.getItem('modifiedBonusQuestions') || '[]');
    
    // Remove any existing modification for this question
    const filteredModifications = modifiedBonusQuestions.filter((q: Question) => q.id !== bonusQuestion.id);
    
    // Add the new modification
    filteredModifications.push(bonusQuestion);
    
    // Save back to localStorage
    localStorage.setItem('modifiedBonusQuestions', JSON.stringify(filteredModifications));
  } else {
    // It's an additional question
    const additionalBonusQuestions = JSON.parse(localStorage.getItem('additionalBonusQuestions') || '[]');
    
    // Update the question
    const updatedQuestions = additionalBonusQuestions.map((q: Question) => 
      q.id === bonusQuestion.id ? bonusQuestion : q
    );
    
    // Save back to localStorage
    localStorage.setItem('additionalBonusQuestions', JSON.stringify(updatedQuestions));
  }
}

// Function to delete a bonus question
export function deleteBonusQuestion(questionId: number): void {
  // Check if it's a default question (ID between 101-110)
  if (questionId >= 101 && questionId <= 110) {
    // For default questions, we just remove any modifications
    const modifiedBonusQuestions = JSON.parse(localStorage.getItem('modifiedBonusQuestions') || '[]');
    const filteredModifications = modifiedBonusQuestions.filter((q: Question) => q.id !== questionId);
    localStorage.setItem('modifiedBonusQuestions', JSON.stringify(filteredModifications));
  } else {
    // For additional questions, we remove them completely
    const additionalBonusQuestions = JSON.parse(localStorage.getItem('additionalBonusQuestions') || '[]');
    const filteredQuestions = additionalBonusQuestions.filter((q: Question) => q.id !== questionId);
    localStorage.setItem('additionalBonusQuestions', JSON.stringify(filteredQuestions));
  }
} 