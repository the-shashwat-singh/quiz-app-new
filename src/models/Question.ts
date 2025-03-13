export interface Question {
  id: string;
  text: string;
  answer_options: string[];
  correct_answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit: number;
  is_strict: boolean;
  explanation?: string;
  is_bonus: boolean;
  created_at: string;
}

// Quiz Settings interface
export interface QuizSettings {
  totalQuestions: number;
  easyTimeLimit: number;
  mediumTimeLimit: number;
  difficultTimeLimit: number;
  easyCount: number;
  mediumCount: number;
  difficultCount: number;
}

// Default quiz settings
const defaultSettings: QuizSettings = {
  totalQuestions: 15,
  easyTimeLimit: 10,
  mediumTimeLimit: 12,
  difficultTimeLimit: 15,
  easyCount: 8,
  mediumCount: 4,
  difficultCount: 3
};

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

// Get quiz settings
export const getQuizSettings = (): QuizSettings => {
  const settings = getLocalStorage('quizSettings');
  return settings ? JSON.parse(settings) : defaultSettings;
};

// Update quiz settings
export const updateQuizSettings = (settings: QuizSettings): void => {
  setLocalStorage('quizSettings', JSON.stringify(settings));
};

// Update time limits for a difficulty level
export const updateTimeLimits = (difficulty: 'easy' | 'medium' | 'difficult', timeLimit: number): void => {
  const questions = getAllQuestions();
  const additionalQuestions = JSON.parse(getLocalStorage('additionalQuestions'));
  
  // Update additional questions
  const updatedAdditionalQuestions = additionalQuestions.map((q: Question) =>
    q.difficulty === difficulty ? { ...q, time_limit: timeLimit } : q
  );
  setLocalStorage('additionalQuestions', JSON.stringify(updatedAdditionalQuestions));

  // Store modifications for default questions
  const modifiedQuestions = JSON.parse(getLocalStorage('modifiedQuestions'));
  const defaultQuestionsToModify = questions.filter(q => 
    q.difficulty === difficulty && !additionalQuestions.some((aq: Question) => aq.id === q.id)
  );
  
  defaultQuestionsToModify.forEach(q => {
    const existingMod = modifiedQuestions.find((mq: Question) => mq.id === q.id);
    if (existingMod) {
      existingMod.time_limit = timeLimit;
    } else {
      modifiedQuestions.push({ ...q, time_limit: timeLimit });
    }
  });
  
  setLocalStorage('modifiedQuestions', JSON.stringify(modifiedQuestions));
};

// Default questions covering C++ basics, OOP, and Data Structures
export const defaultQuestions: Question[] = [
  // Easy Level Questions (1-10)
  {
    id: "1",
    text: "Which of the following best describes an array?",
    answer_options: [
      "A data structure that stores elements in contiguous memory locations",
      "A structure that allows dynamic resizing",
      "A collection of nodes connected by pointers",
      "A non-sequential storage structure"
    ],
    correct_answer: "A data structure that stores elements in contiguous memory locations",
    difficulty: "easy",
    time_limit: 20,
    is_strict: true,
    explanation: "An array is a data structure that stores elements in contiguous (adjacent) memory locations, allowing for efficient access by index.",
    is_bonus: false,
    created_at: "2024-04-01T12:00:00"
  },
  {
    id: "2",
    text: "Which data structure follows the Last In First Out (LIFO) principle?",
    answer_options: [
      "Queue",
      "Stack",
      "Linked list",
      "Tree"
    ],
    correct_answer: "Stack",
    difficulty: "easy",
    time_limit: 20,
    is_strict: true,
    explanation: "A stack follows LIFO principle where the last element added is the first one to be removed.",
    is_bonus: false,
    created_at: "2024-04-01T12:00:00"
  },
  {
    id: "3",
    text: "In a binary search tree (BST), the left subtree of a node contains values that are:",
    answer_options: [
      "Greater than the node",
      "Equal to the node",
      "Less than the node",
      "Randomly organized"
    ],
    correct_answer: "Less than the node",
    difficulty: "easy",
    time_limit: 20,
    is_strict: true,
    explanation: "In a BST, all values in the left subtree must be less than the node's value. This property helps in efficient searching.",
    is_bonus: false,
    created_at: "2024-04-01T12:00:00"
  },
  {
    id: "4",
    text: "Which C++ keyword is used to include a standard library header file?",
    answer_options: [
      "import",
      "include",
      "require",
      "using"
    ],
    correct_answer: "include",
    difficulty: "easy",
    time_limit: 20,
    is_strict: true,
    explanation: "The #include preprocessor directive is used to include header files in C++.",
    is_bonus: false,
    created_at: "2024-04-01T12:00:00"
  },
  {
    id: "5",
    text: "What is the primary purpose of a C++ namespace?",
    answer_options: [
      "To allocate memory dynamically",
      "To avoid naming conflicts",
      "To speed up program execution",
      "To provide runtime error handling"
    ],
    correct_answer: "To avoid naming conflicts",
    difficulty: "easy",
    time_limit: 20,
    is_strict: true,
    explanation: "Namespaces provide a way to avoid naming conflicts by creating a scope where identifiers can be placed.",
    is_bonus: false,
    created_at: "2024-04-01T12:00:00"
  },
  {
    id: "6",
    text: "Which operator is used for output in C++?",
    answer_options: [
      ">>",
      "<<",
      "=>",
      "=="
    ],
    correct_answer: "<<",
    correctAnswer: 1,
    difficulty: "easy",
    timeLimit: 20,
    explanation: "The << operator is used for output in C++, typically with cout for console output.",
    isStrict: true
  },
  {
    id: 7,
    text: "Which data structure is most suitable for implementing a breadth-first search (BFS) in graphs?",
    options: [
      "Stack",
      "Queue",
      "Tree",
      "Array"
    ],
    correctAnswer: 1,
    difficulty: "easy",
    timeLimit: 20,
    explanation: "A queue is used in BFS to maintain the order of vertices to be visited, ensuring level-by-level traversal.",
    isStrict: true
  },
  {
    id: 8,
    text: "What is the primary role of a constructor in a C++ class?",
    options: [
      "To destroy an object",
      "To initialize an object",
      "To overload an operator",
      "To allocate heap memory only"
    ],
    correctAnswer: 1,
    difficulty: "easy",
    timeLimit: 20,
    explanation: "A constructor is called when an object is created and is responsible for initializing the object's members.",
    isStrict: true
  },
  {
    id: 9,
    text: "Which programming paradigm organizes code into classes and objects?",
    options: [
      "Procedural programming",
      "Functional programming",
      "Object-oriented programming",
      "Logical programming"
    ],
    correctAnswer: 2,
    difficulty: "easy",
    timeLimit: 20,
    explanation: "Object-oriented programming (OOP) is a programming paradigm based on the concept of objects containing data and code.",
    isStrict: true
  },
  {
    id: 10,
    text: "In C++, a pointer is defined as:",
    options: [
      "A variable that stores a memory address",
      "A function that returns a variable",
      "A method for sorting data",
      "An operator that increments values"
    ],
    correctAnswer: 0,
    difficulty: "easy",
    timeLimit: 20,
    explanation: "A pointer is a variable that stores the memory address of another variable.",
    isStrict: true
  },

  // Medium Level Questions (11-20)
  {
    id: 11,
    text: "In a singly linked list, each node typically contains:",
    options: [
      "Only the data element",
      "Data and a pointer to the next node",
      "Data and an index value",
      "Pointers to both previous and next nodes"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    timeLimit: 25,
    explanation: "A singly linked list node contains the data and a pointer/reference to the next node in the sequence.",
    isStrict: false
  },
  {
    id: 12,
    text: "Which of the following is NOT a type of tree traversal?",
    options: [
      "In-order",
      "Pre-order",
      "Post-order",
      "Side-order"
    ],
    correctAnswer: 3,
    difficulty: "medium",
    timeLimit: 25,
    explanation: "The standard tree traversal methods are in-order, pre-order, and post-order. Side-order is not a valid tree traversal method.",
    isStrict: false
  },
  {
    id: 13,
    text: "What is the time complexity of accessing an element in an array by its index?",
    options: [
      "O(1)",
      "O(n)",
      "O(log n)",
      "O(n²)"
    ],
    correctAnswer: 0,
    difficulty: "medium",
    timeLimit: 25,
    explanation: "Array access by index is O(1) because it uses direct memory addressing.",
    isStrict: true
  },
  {
    id: 14,
    text: "Which operator is used in C++ to allocate memory dynamically?",
    options: [
      "new",
      "malloc",
      "alloc",
      "create"
    ],
    correctAnswer: 0,
    difficulty: "medium",
    timeLimit: 25,
    explanation: "The new operator is used for dynamic memory allocation in C++.",
    isStrict: true
  },
  {
    id: 15,
    text: "What is the primary difference between a stack and a queue?",
    options: [
      "Stack uses FIFO while queue uses LIFO",
      "Stack uses LIFO while queue uses FIFO",
      "Both use FIFO",
      "Both use LIFO"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    timeLimit: 25,
    explanation: "A stack uses LIFO (Last In First Out) while a queue uses FIFO (First In First Out).",
    isStrict: true
  },
  {
    id: 16,
    text: "In C++ exception handling, which keyword is used to capture an exception?",
    options: [
      "try",
      "throw",
      "catch",
      "handle"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    timeLimit: 25,
    explanation: "The catch keyword is used to capture and handle exceptions in C++.",
    isStrict: false
  },
  {
    id: 17,
    text: "In graph theory, what is a vertex?",
    options: [
      "A connection between two nodes",
      "A node or point in the graph",
      "The weight assigned to an edge",
      "A cycle in the graph"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    timeLimit: 25,
    explanation: "A vertex is a fundamental unit (node or point) of a graph structure.",
    isStrict: false
  },
  {
    id: 18,
    text: "Which concept in C++ allows functions with the same name to perform different tasks based on parameters?",
    options: [
      "Inheritance",
      "Function overloading",
      "Encapsulation",
      "Abstraction"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    timeLimit: 25,
    explanation: "Function overloading allows multiple functions with the same name but different parameters.",
    isStrict: true
  },
  {
    id: 19,
    text: "What does the 'virtual' keyword in C++ enable?",
    options: [
      "Static binding",
      "Dynamic binding (runtime polymorphism)",
      "Multiple inheritance",
      "Template instantiation"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    timeLimit: 25,
    explanation: "The virtual keyword enables dynamic binding, allowing runtime polymorphism through virtual function calls.",
    isStrict: false
  },
  {
    id: 20,
    text: "Which data structure is most commonly used to implement recursion?",
    options: [
      "Array",
      "Queue",
      "Stack",
      "Tree"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    timeLimit: 25,
    explanation: "A stack is used to implement recursion, storing function calls and their local variables.",
    isStrict: true
  },

  // Difficult Level Questions (21-30)
  {
    id: 21,
    text: "In a complete binary tree implemented using an array (0-based indexing), what is the index of the left child of the node at index i?",
    options: [
      "2i + 1",
      "2i",
      "2i - 1",
      "2i + 2"
    ],
    correctAnswer: 0,
    difficulty: "difficult",
    timeLimit: 30,
    explanation: "For 0-based indexing, the left child of a node at index i is at 2i + 1.",
    isStrict: true
  },
  {
    id: 22,
    text: "In an AVL tree, what does the balance factor of a node represent?",
    options: [
      "The difference between the heights of its left and right subtrees",
      "The sum of the heights of its left and right subtrees",
      "The total number of children the node has",
      "The difference between the number of nodes in its subtrees"
    ],
    correctAnswer: 0,
    difficulty: "difficult",
    timeLimit: 30,
    explanation: "The balance factor in an AVL tree is the height of the left subtree minus the height of the right subtree.",
    isStrict: false
  },
  {
    id: 23,
    text: "When converting an infix expression to postfix using a stack, what rule is applied regarding operator precedence?",
    options: [
      "Operators with higher precedence are pushed onto the stack before lower precedence ones",
      "Operators are output immediately regardless of precedence",
      "All operators are pushed in the order they appear",
      "Lower precedence operators are always output before higher precedence ones"
    ],
    correctAnswer: 0,
    difficulty: "difficult",
    timeLimit: 30,
    explanation: "Higher precedence operators are pushed onto the stack before lower precedence ones to maintain correct evaluation order.",
    isStrict: false
  },
  {
    id: 24,
    text: "Why is C++ considered suitable for systems programming?",
    options: [
      "It supports only high-level programming",
      "It compiles into efficient machine code and supports low-level manipulation",
      "It is an interpreted language that simplifies debugging",
      "It does not support pointers, reducing complexity"
    ],
    correctAnswer: 1,
    difficulty: "difficult",
    timeLimit: 30,
    explanation: "C++ is suitable for systems programming because it generates efficient machine code and allows low-level memory manipulation.",
    isStrict: true
  },
  {
    id: 25,
    text: "What is one disadvantage of function overloading in C++?",
    options: [
      "It leads to increased memory consumption",
      "It requires name mangling by the compiler",
      "It decreases code readability",
      "It prevents the use of recursion"
    ],
    correctAnswer: 1,
    difficulty: "difficult",
    timeLimit: 30,
    explanation: "Function overloading requires name mangling by the compiler to create unique identifiers for each overloaded function.",
    isStrict: false
  },
  {
    id: 26,
    text: "What is the main purpose of using templates in C++?",
    options: [
      "To enforce strict type constraints",
      "To allow functions and classes to work with generic types",
      "To support multiple inheritance",
      "To enable dynamic memory allocation"
    ],
    correctAnswer: 1,
    difficulty: "difficult",
    timeLimit: 30,
    explanation: "Templates enable generic programming by allowing functions and classes to work with any data type.",
    isStrict: true
  },
  {
    id: 27,
    text: "Which algorithm is most commonly used to find the shortest path in a weighted graph?",
    options: [
      "Depth-first search (DFS)",
      "Breadth-first search (BFS)",
      "Dijkstra's algorithm",
      "Prim's algorithm"
    ],
    correctAnswer: 2,
    difficulty: "difficult",
    timeLimit: 30,
    explanation: "Dijkstra's algorithm is specifically designed to find the shortest path in a weighted graph.",
    isStrict: false
  },
  {
    id: 28,
    text: "What is the primary difference between stack memory and heap memory in C++?",
    options: [
      "Stack memory is used for dynamic allocation, while heap memory is for static allocation",
      "Heap memory is automatically managed, whereas stack memory must be managed manually",
      "Stack memory is used for automatic storage (local variables) and heap memory for dynamic allocation",
      "There is no significant difference between them"
    ],
    correctAnswer: 2,
    difficulty: "difficult",
    timeLimit: 30,
    explanation: "Stack memory is used for automatic storage duration variables (local variables), while heap memory is used for dynamic allocation.",
    isStrict: true
  },
  {
    id: 29,
    text: "Which C++ feature enforces encapsulation by restricting direct access to class data members?",
    options: [
      "Inheritance",
      "Virtual functions",
      "Access specifiers (private, protected, public)",
      "Operator overloading"
    ],
    correctAnswer: 2,
    difficulty: "difficult",
    timeLimit: 30,
    explanation: "Access specifiers (private, protected, public) control access to class members, enforcing encapsulation.",
    isStrict: true
  },
  {
    id: 30,
    text: "In graph theory, what defines a cycle in a graph?",
    options: [
      "A path that visits every vertex exactly once",
      "A path that starts and ends at the same vertex without repeating edges",
      "A sequence of vertices with no repeated vertices",
      "A subgraph with maximum connectivity"
    ],
    correctAnswer: 1,
    difficulty: "difficult",
    timeLimit: 30,
    explanation: "A cycle is a path that starts and ends at the same vertex without repeating any edges along the way.",
    isStrict: false
  }
];

// Default bonus questions pool
const bonusQuestions: Question[] = [
  {
    id: 101,
    text: "Identify the error in the following code:\n\nint main() {\n  int arr[5] = {1, 2, 3, 4, 5};\n  for(int i = 0; i <= 5; i++) {\n    cout << arr[i] << \" \";\n  }\n  return 0;\n}",
    options: [
      "The array initialization is incorrect",
      "The loop condition should be i < 5, not i <= 5",
      "The cout statement is missing the std:: namespace",
      "The return statement is unnecessary"
    ],
    correctAnswer: 1,
    difficulty: "difficult",
    timeLimit: 20,
    isBonus: true,
    explanation: "The error is in the loop condition. Arrays in C++ are zero-indexed, so a 5-element array has indices 0 through 4. The condition i <= 5 allows i to reach 5, which is out of bounds for the array. This causes undefined behavior, typically accessing memory that doesn't belong to the array. The correct condition should be i < 5."
  },
  {
    id: 102,
    text: "What will be the output of the following code?\n\nint x = 5;\nint y = x++;\nint z = ++x;\ncout << x << \" \" << y << \" \" << z;",
    options: [
      "5 5 6",
      "6 5 7",
      "7 5 7",
      "7 6 7"
    ],
    correctAnswer: 2,
    difficulty: "difficult",
    timeLimit: 20,
    isBonus: true,
    explanation: "This question tests understanding of pre-increment and post-increment operators. Initially x = 5. Then y = x++ assigns 5 to y and increments x to 6 (post-increment). Next, z = ++x increments x to 7 first, then assigns 7 to z (pre-increment). So the final values are x = 7, y = 5, and z = 7, which outputs '7 5 7'."
  },
  {
    id: 103,
    text: "Fill in the correct pseudocode to implement a binary search algorithm:\n\nfunction binarySearch(arr, target):\n    left = 0\n    right = length(arr) - 1\n    while left <= right:\n        mid = ____________________\n        if arr[mid] == target:\n            return mid\n        else if arr[mid] < target:\n            left = ____________________\n        else:\n            right = ____________________\n    return -1",
    options: [
      "mid = (left + right) / 2; left = mid; right = mid;",
      "mid = (left + right) / 2; left = mid + 1; right = mid - 1;",
      "mid = left + (right - left) / 2; left = mid + 1; right = mid - 1;",
      "mid = left + (right - left) / 2; left = mid + 1; right = mid;"
    ],
    correctAnswer: 2,
    difficulty: "difficult",
    timeLimit: 20,
    isBonus: true,
    explanation: "The correct implementation of binary search uses mid = left + (right - left) / 2 to avoid integer overflow that could occur with (left + right) / 2. When the target is greater than the middle element, we search the right half by setting left = mid + 1. When the target is less than the middle element, we search the left half by setting right = mid - 1."
  },
  {
    id: 104,
    text: "What is wrong with this code snippet?\n\nclass Resource {\npublic:\n    Resource() { data = new int[100]; }\n    ~Resource() { delete data; }\nprivate:\n    int* data;\n};",
    options: [
      "The constructor should use malloc instead of new",
      "The destructor should use delete[] for array deallocation, not delete",
      "The data member should be declared as int data[100]",
      "The destructor is unnecessary since C++ has garbage collection"
    ],
    correctAnswer: 1,
    difficulty: "difficult",
    timeLimit: 20,
    isBonus: true,
    explanation: "The error is in the destructor. When deallocating arrays in C++, you must use delete[] operator, not delete. Using delete for an array causes undefined behavior, typically only deallocating the first element and leaking memory for the rest. The correct destructor should be ~Resource() { delete[] data; }."
  },
  {
    id: 105,
    text: "Identify the time complexity of the following algorithm:\n\nfor(int i = 0; i < n; i++) {\n    for(int j = i; j < n; j++) {\n        // Constant time operation\n    }\n}",
    options: [
      "O(n)",
      "O(n log n)",
      "O(n²)",
      "O(2ⁿ)"
    ],
    correctAnswer: 2,
    difficulty: "difficult",
    timeLimit: 20,
    isBonus: true,
    explanation: "This is a nested loop where the inner loop runs (n-i) times for each iteration of the outer loop. The total number of operations is: (n) + (n-1) + (n-2) + ... + 1 = n(n+1)/2, which simplifies to O(n²) in Big O notation. This is a quadratic time complexity algorithm."
  }
];

// Get all questions from local storage
export const getAllQuestions = (): Question[] => {
  const additionalQuestions = JSON.parse(getLocalStorage('additionalQuestions'));
  const modifiedQuestions = JSON.parse(getLocalStorage('modifiedQuestions'));
  
  // Combine default questions with additional and modified questions
  const allQuestions = [...defaultQuestions];
  
  // Apply modifications
  modifiedQuestions.forEach((mod: Question) => {
    const index = allQuestions.findIndex(q => q.id === mod.id);
    if (index !== -1) {
      allQuestions[index] = { ...allQuestions[index], ...mod };
    }
  });
  
  // Add additional questions
  allQuestions.push(...additionalQuestions);
  
  return allQuestions;
};

// Get random questions
export function getRandomQuestions(totalQuestions: number = 10): Question[] {
  const allQuestions = getAllQuestions();
  const shuffled = shuffleArray([...allQuestions]);
  return shuffled.slice(0, totalQuestions);
}

// Get a random bonus question
export const getRandomBonusQuestion = (): Question => {
  const bonusQuestions = getAllQuestions().filter(q => q.isBonus);
  return bonusQuestions[Math.floor(Math.random() * bonusQuestions.length)];
};

// Helper function to shuffle array
const shuffleArray = (array: Question[]): Question[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Export questions for backward compatibility
export const questions = getRandomQuestions(); 