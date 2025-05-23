import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent {
  subjects: string[] = ["Math", "History", "English","Science"];
  topics: { [key: string]: string[] } = {
    Math: ["Algebra", "Calculus", "Geometry"],
    Science: ["Physics", "Chemistry", "Biology"],
    History: ["Ancient", "Medieval", "Modern"],
    English: ["Grammar", "Literature", "Writing"]
  };
  questionTypes: string[] = ["True/False", "MCQ", "Complete", "Open"];
  difficultyLevels: string[] = ["All", "Easy", "Medium", "Hard"];
  questionStatuses: string[] = ["All", "Wrong", "Unanswered"];

  selectedSubject: string = "";
  selectedTopic: string = "";
  selectedType: string = "";
  selectedDifficulty: string = "All";
  selectedStatus: string = "All";
  email: string = "";
  numberOfQuestions: number = 5; // default value
  availableQuestionCounts: number[] = [5, 10, 15, 20, 25];
  availableTopics: string[] = [];
  isDarkMode = false;

  questions = [
    { id: 1, img: "Q1.png", question: "", answer: "c", type: "MCQ", subject: "Math", topic: "Algebra", difficulty: "Easy" },
    { id: 2, img: "book2.png", question: "", answer: "b", type: "MCQ", subject: "Math", topic: "Algebra", difficulty: "Easy" },
    { id: 3, img: "book1.png", question: "", answer: "a", type: "MCQ", subject: "Math", topic: "Algebra", difficulty: "Medium" },
    { id: 4, img: "book3.png", question: "", answer: "d", type: "MCQ", subject: "Math", topic: "Algebra", difficulty: "Easy" },
    { id: 5, img: "Q2.png", question: "", answer: "a", type: "MCQ", subject: "Science", topic: "Physics", difficulty: "Medium" },
    { id: 6, img: "Q3.png", question: "", answer: "false", type: "True/False", subject: "History", topic: "Ancient", difficulty: "Hard" },
    { id: 6, img: "Q3.png", question: "three", answer: "true", type: "True/False", subject: "History", topic: "Ancient", difficulty: "Hard" },
    { id: 6, img: "Q3.png", question: "three", answer: "true", type: "True/False", subject: "History", topic: "Ancient", difficulty: "Hard" },
    { id: 6, img: "Q3.png", question: "three", answer: "true", type: "True/False", subject: "History", topic: "Ancient", difficulty: "Hard" },
    { id: 7, img: "Q4.png", question: "four", answer: "bea", type: "Complete", subject: "English", topic: "Grammar", difficulty: "Easy" },
    { id: 8, img: "Q4.png", question: "five", answer: "sea", type: "Complete", subject: "English", topic: "Grammar", difficulty: "Easy" },
    { id: 8, img: "Q4.png", question: "five", answer: "river", type: "Complete", subject: "English", topic: "Grammar", difficulty: "Easy" },
    { id: 8, img: "Q4.png", question: "five", answer: "lion", type: "Complete", subject: "English", topic: "Grammar", difficulty: "Easy" },
    { id: 9, img: "Q4.png", question: "six", answer: "b", type: "Open", subject: "English", topic: "Grammar", difficulty: "Easy" },
    { id: 10, img: "Q4.png", question: "six", answer: "b", type: "Open", subject: "English", topic: "Grammar", difficulty: "Easy" },
    { id: 11, img: "Q4.png", question: "six", answer: "b", type: "Open", subject: "English", topic: "Grammar", difficulty: "Easy" },
    { id: 12, img: "Q4.png", question: "six", answer: "b", type: "Open", subject: "English", topic: "Grammar", difficulty: "Easy" },
      // MCQ: image only
    { id: 13, img: "Q1.png", question: "", answer: "c", type: "MCQ", subject: "Math", topic: "Algebra", difficulty: "Easy" },
    { id: 14, img: "book2.png", question: "", answer: "b", type: "MCQ", subject: "Math", topic: "Algebra", difficulty: "Easy" },
    { id: 15, img: "book1.png", question: "", answer: "a", type: "MCQ", subject: "Math", topic: "Algebra", difficulty: "Medium" },
    { id: 16, img: "book3.png", question: "", answer: "d", type: "MCQ", subject: "Math", topic: "Algebra", difficulty: "Easy" },

      // True/False: text only
    { id: 17, img: "", question: "The sun is a star.", answer: "true", type: "True/False", subject: "Science", topic: "Physics", difficulty: "Easy" },
    { id: 18, img: "", question: "Water boils at 90°C.", answer: "false", type: "True/False", subject: "Science", topic: "Physics", difficulty: "Medium" },

      // Complete: text only
    { id: 18, img: "", question: "The capital of France is ___", answer: "Paris", type: "Complete", subject: "History", topic: "Ancient", difficulty: "Easy" },
    { id: 19, img: "", question: "___ is the process of water turning into vapor.", answer: "Evaporation", type: "Complete", subject: "Science", topic: "Physics", difficulty: "Medium" },

      // Open: image only
    { id: 20, img: "", question: "how old you are?", answer: "b", type: "Open", subject: "English", topic: "Grammar", difficulty: "Hard" },
    { id: 21, img: "", question: "what is your name?", answer: "a", type: "Open", subject: "English", topic: "Grammar", difficulty: "Medium" }
    ];

  constructor(private router: Router,private themeService: ThemeService){}

  onSubjectChange() {
    this.selectedTopic = "All"; // اختياري: يبدأ بـ All
    this.selectedType = "";
    this.email = localStorage.getItem('email') || '';

    if (this.selectedSubject && this.topics[this.selectedSubject]) {
      this.availableTopics = ['All', ...this.topics[this.selectedSubject]];
    } else {
      this.availableTopics = ['All'];
    }
  }
  customSearchTopic(term: string, item: any): boolean {
    return item.toLowerCase().startsWith(term.toLowerCase());
  }
  continue() {
    this.email = localStorage.getItem('email') || '';

    const requestData = {
      subject: this.selectedSubject,
      topic: this.selectedTopic === 'All' ? '' : this.selectedTopic,
      type: this.selectedType,
      difficulty: this.selectedDifficulty,
      status: this.selectedStatus,
      email: this.email
    };

    let filteredQuestions = this.questions.filter(q =>
      q.subject === requestData.subject &&
      (requestData.topic === '' || q.topic === requestData.topic) &&
      q.type === requestData.type &&
      (requestData.difficulty === "All" || q.difficulty === requestData.difficulty)
    );

    if (this.numberOfQuestions > 0 && this.numberOfQuestions < filteredQuestions.length) {
      filteredQuestions = filteredQuestions.slice(0, this.numberOfQuestions);
    }

    this.router.navigate(['/question-display'], {
      state: {
        questions: filteredQuestions,
        requestData: requestData
      }
    });
  }

  customSearch(term: string, item: any) {
    return item.toLowerCase().startsWith(term.toLowerCase()); // البحث باستخدام أول حرف فقط
  }
  ngOnInit() {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }


}
