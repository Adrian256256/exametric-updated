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
  title: "Computer Knowledge Assessment",
  description: "A written and audio-based test consisting of 44 standard and control questions.",
  sets: {
    section1_standard: {
      title: "Section 1: Written - Standard",
      questions: {
        Q1: { id: "Q1", type: "blank", question: "What does the acronym RAM stand for?", answer: "", options: [] },
        Q2: { id: "Q2", type: "blank", question: "What is an IP address, and what is it used for?", answer: "", options: [] },
        Q3: { id: "Q3", type: "blank", question: "What is an operating system (OS)?", answer: "", options: [] },
        Q4: { id: "Q4", type: "blank", question: "What is the Internet?", answer: "", options: [] },
        Q5: { id: "Q5", type: "blank", question: "What is the main role of hardware in a computer?", answer: "", options: [] },
        Q6: { id: "Q6", type: "blank", question: "What is a network protocol?", answer: "", options: [] },
        Q7: { id: "Q7", type: "blank", question: "What is a compiler, and what does it do?", answer: "", options: [] },
        Q8: { id: "Q8", type: "blank", question: "What are the four main principles of object-oriented programming (OOP)?", answer: "", options: [] },
        Q9: { id: "Q9", type: "blank", question: "What is a LAN (Local Area Network)?", answer: "", options: [] },
        Q10: { id: "Q10", type: "blank", question: "What is the main purpose of cache memory?", answer: "", options: [] },
        Q11: { id: "Q11", type: "blank", question: "What is the smallest unit of data in a computer?", answer: "", options: [] }
      }
    },
    section1_control: {
      title: "Section 1: Written - Control",
      questions: {
        Q1: { id: "Q1", type: "blank", question: "What is the main function of RAM in a computer system?", answer: "", options: [] },
        Q2: { id: "Q2", type: "blank", question: "What are the two most common versions (formats) of IP addresses?", answer: "", options: [] },
        Q3: { id: "Q3", type: "blank", question: "What is the primary purpose of an operating system?", answer: "", options: [] },
        Q4: { id: "Q4", type: "blank", question: "How does a computer connect to and access the Internet?", answer: "", options: [] },
        Q5: { id: "Q5", type: "blank", question: "What component connects the hardware and the software so they can work together?", answer: "", options: [] },
        Q6: { id: "Q6", type: "blank", question: "Give three common examples of network protocols.", answer: "", options: [] },
        Q7: { id: "Q7", type: "blank", question: "What type of computer program translates source code into machine code?", answer: "", options: [] },
        Q8: { id: "Q8", type: "blank", question: "What is the difference between method overloading and method overriding in OOP?", answer: "", options: [] },
        Q9: { id: "Q9", type: "blank", question: "What is a VLAN (Virtual Local Area Network)?", answer: "", options: [] },
        Q10: { id: "Q10", type: "blank", question: "Where is cache memory typically located in a computer system?", answer: "", options: [] },
        Q11: { id: "Q11", type: "blank", question: "What is a byte made up of?", answer: "", options: [] }
      }
    },
    section2_standard: {
      title: "Section 2: Audio - Standard",
      questions: {
        Q1: { id: "Q1", type: "audio", question: "What is DRAM and how does it work?", tts_text: "What is DRAM and how does it work?", options: [], answer: "" },
        Q2: { id: "Q2", type: "audio", question: "What is a MAC address and what is its purpose?", tts_text: "What is a MAC address and what is its purpose?", options: [], answer: "" },
        Q3: { id: "Q3", type: "audio", question: "Why is the operating system important for a computer?", tts_text: "Why is the operating system important for a computer?", options: [], answer: "" },
        Q4: { id: "Q4", type: "audio", question: "What is the World Wide Web?", tts_text: "What is the World Wide Web?", options: [], answer: "" },
        Q5: { id: "Q5", type: "audio", question: "What is the main role of software in a computer?", tts_text: "What is the main role of software in a computer?", options: [], answer: "" },
        Q6: { id: "Q6", type: "audio", question: "What does the HTTP protocol do?", tts_text: "What does the HTTP protocol do?", options: [], answer: "" },
        Q7: { id: "Q7", type: "audio", question: "What is an interpreter and what does it do?", tts_text: "What is an interpreter and what does it do?", options: [], answer: "" },
        Q8: { id: "Q8", type: "audio", question: "What is the difference between inheritance and encapsulation?", tts_text: "What is the difference between inheritance and encapsulation?", options: [], answer: "" },
        Q9: { id: "Q9", type: "audio", question: "What is a WAN (Wide Area Network)?", tts_text: "What is a WAN (Wide Area Network)?", options: [], answer: "" },
        Q10: { id: "Q10", type: "audio", question: "What is a cache hit?", tts_text: "What is a cache hit?", options: [], answer: "" },
        Q11: { id: "Q11", type: "audio", question: "What is the typical size of an int data type?", tts_text: "What is the typical size of an int data type?", options: [], answer: "" }
      }
    },
    section2_control: {
      title: "Section 2: Audio - Control",
      questions: {
        Q1: { id: "Q1", type: "audio", question: "What is SRAM and how does it work?", tts_text: "What is SRAM and how does it work?", options: [], answer: "" },
        Q2: { id: "Q2", type: "audio", question: "Describe the typical format of a MAC address.", tts_text: "Describe the typical format of a MAC address.", options: [], answer: "" },
        Q3: { id: "Q3", type: "audio", question: "What are the main differences between Windows and Linux operating systems?", tts_text: "What are the main differences between Windows and Linux operating systems?", options: [], answer: "" },
        Q4: { id: "Q4", type: "audio", question: "What is the difference between the Internet and the World Wide Web?", tts_text: "What is the difference between the Internet and the World Wide Web?", options: [], answer: "" },
        Q5: { id: "Q5", type: "audio", question: "What does ISA stand for?", tts_text: "What does ISA stand for?", options: [], answer: "" },
        Q6: { id: "Q6", type: "audio", question: "What does HTTPS do and how does it differ from HTTP?", tts_text: "What does HTTPS do and how does it differ from HTTP?", options: [], answer: "" },
        Q7: { id: "Q7", type: "audio", question: "What is the difference between a compiler and an interpreter?", tts_text: "What is the difference between a compiler and an interpreter?", options: [], answer: "" },
        Q8: { id: "Q8", type: "audio", question: "What is the difference between inheritance and encapsulation?", tts_text: "What is the difference between inheritance and encapsulation?", options: [], answer: "" },
        Q9: { id: "Q9", type: "audio", question: "What is a VPN (Virtual Private Network)?", tts_text: "What is a VPN (Virtual Private Network)?", options: [], answer: "" },
        Q10: { id: "Q10", type: "audio", question: "What is a cache miss?", tts_text: "What is a cache miss?", options: [], answer: "" },
        Q11: { id: "Q11", type: "audio", question: "What is the typical size of a double data type?", tts_text: "What is the typical size of a double data type?", options: [], answer: "" }
      }
    }
  }
};
