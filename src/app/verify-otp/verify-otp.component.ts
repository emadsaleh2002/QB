import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent {
  otpValues: string[] = Array(6).fill('');
  otpInvalid = false;
  toastMessage = '';
  isDarkMode = false;
  constructor(private router: Router,private themeService: ThemeService) {}

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    // مسح محتوى الحقل يدويًا
    input.value = '';

    if (value.length === 1) {
      this.otpValues[index] = value;

      setTimeout(() => {
        const nextInput = document.getElementById('otp' + (index + 1)) as HTMLInputElement;
        nextInput?.focus();
      }, 0);
    } else if (value.length > 1) {
      const chars = value.split('');
      for (let iOffset = 0; iOffset < chars.length && index + iOffset < 6; iOffset++) {
        this.otpValues[index + iOffset] = chars[iOffset];
        const currentInput = document.getElementById('otp' + (index + iOffset)) as HTMLInputElement;
        if (currentInput) currentInput.value = chars[iOffset];
      }

      setTimeout(() => {
        const nextInput = document.getElementById('otp' + Math.min(index + chars.length, 5)) as HTMLInputElement;
        nextInput?.focus();
      }, 0);
    } else {
      this.otpValues[index] = '';
    }
  }


  onOtpKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      // لو الخانة الحالية فاضية
      if (input.value === '') {
        if (index > 0) {
          this.otpValues[index - 1] = '';

          // ننتظر لحظة ثم نرجّع الكارسر للخانة السابقة
          setTimeout(() => {
            const prevInput = document.getElementById('otp' + (index - 1)) as HTMLInputElement;
            if (prevInput) {
              prevInput.focus();
              prevInput.value = '';
            }
          }, 0);
        }
      } else {
        // لو الخانة فيها قيمة، امسحها فقط
        this.otpValues[index] = '';
        input.value = '';
      }

      // منع السلوك الافتراضي لتفادي مشاكل التنقل التلقائي
      event.preventDefault();
    }
  }


  verifyOTP() {
    const entered = this.otpValues.join('');
    const stored = localStorage.getItem('resetOTP');

    if (entered === stored) {
      this.router.navigate(['/reset-password']);
    } else {
      this.otpInvalid = true;
      this.toastMessage = 'Invalid OTP!';
    }
  }
  ngOnInit() {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }
}
