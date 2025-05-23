import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-admin-subjects',
  templateUrl: './admin-subjects.component.html',
  styleUrls: ['./admin-subjects.component.css']
})
export class AdminSubjectsComponent implements OnInit {
   subjects: any[] = [];           // full subject objects
   subjectNames: string[] = [];    // just names

  topics: { [key: string]: string[] } = {
    Math: ['Algebra', 'Geometry'],
    Science: ['Physics', 'Biology'],
    History: ['Ancient', 'Modern']
  };
  isDarkMode = false;
  constructor(private router: Router,private themeService: ThemeService , private http:HttpClient , private authservice : AuthService) {}

  newSubject: string = '';
  searchText: string = '';
  errorMessage: string = '';

   addSubject() {
    const trimmed = this.newSubject.trim();
    const normalizedNew = trimmed.toLowerCase().replace(/\s+/g, '');

    if (!trimmed) {
      this.errorMessage = 'Subject name is required.';
      return;
    }

    const exists = this.subjectNames.some(subject =>
      subject.toLowerCase().replace(/\s+/g, '') === normalizedNew
    );

    if (exists) {
      this.errorMessage = 'This subject already exists.';
      return;
    }

    const token = localStorage.getItem('authToken'); // ✅ Make sure this is set

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log(headers);

    const body = {
      name: trimmed
      // Optionally add "description": '...' here
    };

    this.http.post<any>(`${this.authservice.baseUrl}/api/subjects`, body, { headers })
      .subscribe({
        next: (response) => {
          if (response.success) {
           this.reloadComponent();
          } else {
            this.errorMessage = 'Failed to add subject. Please try again.';
          }
        },
        error: (error) => {
          console.error('Add Subject Error:', error);
          this.errorMessage = error.error?.message || 'An error occurred.';
        }
      });
  }

    // reload the component after add or delete subjects
    reloadComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  deleteSubject(index: number) {
    const token = localStorage.getItem('authToken'); // ✅ Make sure this is set

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const subjectId=this.subjects[index]._id;
    console.log(subjectId);

    this.http.delete<any>(`${this.authservice.baseUrl}/api/subjects/${subjectId}`, { headers }).subscribe({
    next: (res) => {
      if (res.success) {
        // حذف من الواجهة بعد نجاح الحذف من السيرفر
       this.reloadComponent();
      } else {
        this.errorMessage = 'Failed to delete subject.';
      }
    },
    error: (err) => {
      console.error('Delete Subject Error:', err);
      this.errorMessage = err.error?.message || 'An error occurred.';
    }
  });
    // const subjectToDelete = this.subjects[index];
    // const subjectTopics = this.topics[subjectToDelete];
    // const username = localStorage.getItem('username') || 'UnknownUser';

    // this.subjects.splice(index, 1);
    // delete this.topics[subjectToDelete];

    // // ✅ Send to backend or log it
    // const deleteData = {
    //   username: username,
    //   subject: subjectToDelete
    // };
    // console.log('Subject to be sent to backend (DELETE):', JSON.stringify(deleteData));
  }


  filteredSubjects(): string[] {
    const term = this.searchText.trim().toLowerCase();
    return this.subjectNames.filter(subject =>
      subject.toLowerCase().startsWith(term)
    );
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  ngOnInit() {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });

    this.http.get<any>(`${this.authservice.baseUrl}/api/subjects`)
      .subscribe(response => {
        if (response.success) {
          this.subjects = response.data;
          this.subjectNames = response.data.map((subject: any) => subject.name);
        }
      }, error => {
        console.error('Error fetching subjects:', error);
      });
  }

  }



