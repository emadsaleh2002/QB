import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-admin-deleted-question',
  templateUrl: './admin-deleted-question.component.html',
  styleUrls: ['./admin-deleted-question.component.css']
})
export class AdminDeletedQuestionComponent {
  constructor(private router: Router,private themeService: ThemeService) {}

  // Subjects and Topics
  subjects = [
    { name: 'Math' },
    { name: 'Science' },
    { name: 'History' }
  ];

  topics: { [key: string]: string[] } = {
    Math: ['Algebra', 'Geometry'],
    Science: ['Physics', 'Biology'],
    History: ['Ancient', 'Modern']
  };

  // Questions
  questions = [
    { id: '1', subject: 'Math', topic: 'Algebra', text: 'What is 2 + 2?' },
    { id: '2', subject: 'Math', topic: 'Algebra', image: 'assets/img/Q2.png' },
    { id: '3', subject: 'Science', topic: 'Physics', text: 'Define velocity.' },
    { id: '4', subject: 'Science', topic: 'Biology', image: 'assets/img/book1.png' },
    { id: '5', subject: 'History', topic: 'Ancient', text: 'Who built the pyramids?' },
    { id: '6', subject: 'History', topic: 'Modern', image: 'assets/img/Q6.png' },
    { id: '7', subject: 'History', topic: 'Modern', text: 'When did WWII start?' },
    { id: '8', subject: 'History', topic: 'Modern', text: 'Who was Churchill?' },
    { id: '9', subject: 'History', topic: 'Modern', image: 'assets/img/Q8.png' },
  ];

  // State
  selectedSubject: any = null;
  selectedTopic: string = '';
  filteredQuestions: any[] = [];
  message = '';
  isDarkMode = false;


  // Custom search (first letter only)
  customSearchSubject(term: string, item: any): boolean {
    return item.name.toLowerCase().startsWith(term.toLowerCase());
  }

  customSearchTopic(term: string, item: any): boolean {
    return item.toLowerCase().startsWith(term.toLowerCase());
  }

  // Handlers
  onSubjectChange() {
    this.selectedTopic = '';
    this.filteredQuestions = [];
  }

  onTopicChange() {
    if (!this.selectedSubject || !this.selectedTopic) return;

    this.filteredQuestions = this.questions.filter(
      q => q.subject === this.selectedSubject.name && q.topic === this.selectedTopic
    );
  }

  deleteQuestion(id: string) {
    this.message = `Question [${id}] deleted successfully!`;
    this.filteredQuestions = this.filteredQuestions.filter(q => q.id !== id);
    this.questions = this.questions.filter(q => q.id !== id);
  }

  goBack() {
    this.router.navigate(['/admin/questions']);
  }
  ngOnInit() {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }
}
