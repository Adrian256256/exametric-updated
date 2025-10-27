export interface Question {
  id: string;
  type: "blank" | "audio";
  question: string;
  answer: string;
  options: string[];
  tts_text?: string;
}

export interface QuestionSet {
  title: string;
  questions: Record<string, Question>;
}

export interface ExamData {
  title: string;
  description: string;
  sets: Record<string, QuestionSet>;
}


export const examData: ExamData = {
  title: "Computer Science Objective Test",
  description: "Objective questions for computer science fundamentals.",
  sets: {
    main: {
      title: "Main Section",
      questions: {
        Q1: { id: "Q1", type: "audio", question: "How many bits are there in one byte?", answer: "8", options: ["8", "eight"], tts_text: "How many bits are there in one byte?" },
        Q2: { id: "Q2", type: "blank", question: "Which data structure operates on a First In First Out basis?", answer: "Queue", options: ["Queue"] },
        Q3: { id: "Q3", type: "blank", question: "Which data structure operates on a Last In First Out basis?", answer: "Stack", options: ["Stack"] },
        Q4: { id: "Q4", type: "audio", question: "What is the Big O time complexity of binary search?", answer: "O(log n)", options: ["O(log n)", "O(logn)"], tts_text: "What is the Big O time complexity of binary search?" },
        Q5: { id: "Q5", type: "blank", question: "What is the Big O time complexity of linear search?", answer: "O(n)", options: ["O(n)"] },
        Q6: { id: "Q6", type: "blank", question: "Which layer of the OSI model handles routing and IP addressing?", answer: "Network layer", options: ["Network layer"] },
        Q7: { id: "Q7", type: "audio", question: "Which layer of the OSI model ensures reliable data delivery?", answer: "Transport layer", options: ["Transport layer"], tts_text: "Which layer of the OSI model ensures reliable data delivery?" },
        Q8: { id: "Q8", type: "blank", question: "Which device connects multiple computers within the same network and forwards packets based on MAC addresses?", answer: "Switch", options: ["Switch"] },
        Q9: { id: "Q9", type: "blank", question: "Which network device forwards packets based on IP addresses?", answer: "Router", options: ["Router"] },
        Q10: { id: "Q10", type: "audio", question: "Which logic gate outputs true only when all inputs are true?", answer: "AND gate", options: ["AND gate", "AND"], tts_text: "Which logic gate outputs true only when all inputs are true?" },
        Q11: { id: "Q11", type: "blank", question: "Which logic gate outputs true when at least one input is true?", answer: "OR gate", options: ["OR gate", "OR"] },
        Q12: { id: "Q12", type: "blank", question: "Which logic gate outputs the opposite of its input?", answer: "NOT gate", options: ["NOT gate", "NOT"] },
        Q13: { id: "Q13", type: "audio", question: "Which component performs arithmetic and logical operations in the CPU?", answer: "ALU", options: ["ALU", "Arithmetic Logic Unit"], tts_text: "Which component performs arithmetic and logical operations in the CPU?" },
        Q14: { id: "Q14", type: "blank", question: "Which CPU component controls data flow between CPU and other parts?", answer: "Control Unit", options: ["Control Unit"] },
        Q15: { id: "Q15", type: "blank", question: "Which type of memory is non-volatile and retains data when power is off?", answer: "ROM", options: ["ROM", "Read Only Memory"] },
        Q16: { id: "Q16", type: "audio", question: "Which type of memory is volatile and temporarily stores data during execution?", answer: "RAM", options: ["RAM", "Random Access Memory"], tts_text: "Which type of memory is volatile and temporarily stores data during execution?" },
        Q17: { id: "Q17", type: "blank", question: "What is the smallest unit of data in computing?", answer: "Bit", options: ["Bit"] },
        Q18: { id: "Q18", type: "blank", question: "What is the binary representation of the decimal number 5?", answer: "101", options: ["101"] },
        Q19: { id: "Q19", type: "audio", question: "How many bytes make up a kilobyte (in base 2)?", answer: "1024", options: ["1024"], tts_text: "How many bytes make up a kilobyte in base 2?" },
        Q20: { id: "Q20", type: "blank", question: "Which scheduling algorithm executes the shortest job next?", answer: "Shortest Job First", options: ["Shortest Job First", "SJF"] },
        Q21: { id: "Q21", type: "blank", question: "Which scheduling algorithm gives each process equal CPU time in cycles?", answer: "Round Robin", options: ["Round Robin"] },
        Q22: { id: "Q22", type: "audio", question: "Which data structure is used to implement function call management in memory?", answer: "Stack", options: ["Stack"], tts_text: "Which data structure is used to implement function call management in memory?" },
        Q23: { id: "Q23", type: "blank", question: "Which data structure is best for breadth-first search?", answer: "Queue", options: ["Queue"] },
        Q24: { id: "Q24", type: "blank", question: "Which data structure is best for depth-first search?", answer: "Stack", options: ["Stack"] },
        Q25: { id: "Q25", type: "audio", question: "Which algorithm is used to find the shortest path in a weighted graph?", answer: "Dijkstra's algorithm", options: ["Dijkstra's algorithm", "Dijkstra algorithm"], tts_text: "Which algorithm is used to find the shortest path in a weighted graph?" },
        Q26: { id: "Q26", type: "blank", question: "Which algorithm is used for sorting using divide and conquer?", answer: "Merge Sort", options: ["Merge Sort"] },
        Q27: { id: "Q27", type: "blank", question: "Which data structure uses nodes connected by edges?", answer: "Graph", options: ["Graph"] },
        Q28: { id: "Q28", type: "audio", question: "Which type of database uses tables, rows, and columns?", answer: "Relational database", options: ["Relational database"], tts_text: "Which type of database uses tables, rows, and columns?" },
        Q29: { id: "Q29", type: "blank", question: "What SQL command is used to remove all records from a table but keep the structure?", answer: "TRUNCATE", options: ["TRUNCATE"] },
        Q30: { id: "Q30", type: "blank", question: "Which SQL clause is used to filter results based on conditions?", answer: "WHERE", options: ["WHERE"] },
        Q31: { id: "Q31", type: "audio", question: "Which data type in C language stores true or false values?", answer: "bool", options: ["bool", "boolean"], tts_text: "Which data type in C language stores true or false values?" },
        Q32: { id: "Q32", type: "blank", question: "Which keyword in C++ is used to create a class instance?", answer: "new", options: ["new"] },
        Q33: { id: "Q33", type: "blank", question: "Which OOP concept allows using the same function name with different arguments?", answer: "Function overloading", options: ["Function overloading", "Overloading"] },
        Q34: { id: "Q34", type: "audio", question: "Which OOP concept allows a subclass to use methods of its superclass?", answer: "Inheritance", options: ["Inheritance"], tts_text: "Which OOP concept allows a subclass to use methods of its superclass?" },
        Q35: { id: "Q35", type: "blank", question: "Which OOP concept hides implementation details from the user?", answer: "Encapsulation", options: ["Encapsulation"] },
        Q36: { id: "Q36", type: "blank", question: "Which keyword in Java is used to inherit a class?", answer: "extends", options: ["extends"] },
        Q37: { id: "Q37", type: "audio", question: "Which command in Linux lists files and directories?", answer: "ls", options: ["ls"], tts_text: "Which command in Linux lists files and directories?" },
        Q38: { id: "Q38", type: "blank", question: "Which command in Linux is used to change the current directory?", answer: "cd", options: ["cd"] },
        Q39: { id: "Q39", type: "blank", question: "Which protocol is used for secure file transfer over SSH?", answer: "SFTP", options: ["SFTP", "Secure File Transfer Protocol"] },
        Q40: { id: "Q40", type: "audio", question: "Which port number is used by HTTPS?", answer: "443", options: ["443"], tts_text: "Which port number is used by HTTPS?" },
        Q41: { id: "Q41", type: "blank", question: "Which port number is used by HTTP?", answer: "80", options: ["80"] },
        Q42: { id: "Q42", type: "audio", question: "Which data structure uses hierarchical parent-child relationships?", answer: "Tree", options: ["Tree"], tts_text: "Which data structure uses hierarchical parent-child relationships?" }
      }
    }
  }
};
