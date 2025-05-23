import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  toastMessage: string = '';
  isDarkMode = false;


  users = [
    { email: 'john@example.com', password: '1234' },
    { email: 'emadsara1511@gmail.com', password: '1234' },
    { email: 'alice@example.com', password: 'abcd' }
  ];

  constructor(private fb: FormBuilder, private router: Router,private themeService: ThemeService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendOTP() {
    const email = this.forgotForm.value.email;
    const user = this.users.find(u => u.email === email);

    if (user) {
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('resetEmail', email);
      localStorage.setItem('resetOTP', generatedOTP);
      this.toastMessage = `Your OTP is: ${generatedOTP}`;
      setTimeout(() => {
        this.router.navigate(['/verify-otp']);
      }, 2000);
    } else {
      this.toastMessage = 'Email not found!';
    }
  }
  ngOnInit() {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }
}
