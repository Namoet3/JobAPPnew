import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LogService } from '../services/log.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  showMemberships = false;
  showLanguages = false;
  selectedFileName: string = '';
  selectedCertificateFile: File | null = null;
  selectedCriminalRecordFile: File | null = null;
  selectedCvFile: File | null = null;
  tabStates: { [key: string]: boolean[] } = {
    jobExperiences: [],
    references: [],
    skillCertificates: [],
    memberships: [],
    languages: []
  };
  isSubmitted = false;
  isDisabled = false;

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
      if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'flex';
      } else {
        scrollTopBtn.style.display = 'none';
      }
    }
  }

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private LogService: LogService) { }

  ngOnInit(): void {
    this.LogService.logPageVisit('http://localhost:4200/user-form');
    this.userForm = this.fb.group({
      userDetails: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        birthdate: ['', Validators.required],
        birthplace: ['', Validators.required],
        gender: ['', Validators.required],
        marriageStatus: ['', Validators.required],
        nationality: ['TC', Validators.required],
        tcNo: ['', [Validators.required, Validators.pattern(/^\d{11}$/), Validators.maxLength(11)]],
        address: ['', [Validators.required, Validators.minLength(5)]],
        city: ['', Validators.required],
        district: ['', Validators.required],
        postal: ['', [Validators.required, Validators.pattern(/^\d{5}$/), Validators.maxLength(5)]],
        telNum: ['', [Validators.required, Validators.maxLength(12)]],
        email: ['', [Validators.required, Validators.email]]
      }),
      educationLevel: ['', Validators.required],
      highschool: [null, Validators.required],
      university: [null, Validators.required],
      program: [null, Validators.required],  
      graduateDate: [''],
      gpa: ['', Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      militaryStatus: ['', Validators.required],
      militaryDate: [''],
      healthStat: ['', Validators.required],
      health: [''],
      disability: [{ value: '', disabled: true }],
      criminal: ['', [Validators.required]],
      criminalDate: [''],
      criminalReason: [''],
      criminalRecordFile: [''],
      jobExperiences: this.fb.array([]),
      references: this.fb.array([]),
      skills: [''],
      skillCertificates: this.fb.array([]),
      hobbies: [''],
      memberships: this.fb.array([]),
      languages: this.fb.array([]),
      cvFile: [''],
      policy: [false, Validators.requiredTrue],
      submissionDate: [''],
    });

    this.userForm.get('userDetails.gender')?.valueChanges.subscribe(value => {
      this.toggleMilitaryForGender(value);
    });
    this.toggleMilitaryForGender(this.userForm.get('userDetails.gender')?.value);

    this.userForm.get('healthStat')?.valueChanges.subscribe(value => {
      this.toggleDisabilityDetails(value);
    });
    
    this.userForm.get('userDetails.telNum')?.valueChanges.subscribe(value => {
      this.formatPhoneNumber(value, 'userDetails.telNum');
    });

    this.userForm.get('criminal')?.valueChanges.subscribe(value => {
      this.toggleCriminalDetails(value);
    });
    this.toggleCriminalDetails(this.userForm.get('criminal')?.value);

    this.userForm.get('militaryStatus')?.valueChanges.subscribe(value => {
      this.toggleMilitaryDate(value);
    });
    this.toggleMilitaryDate(this.userForm.get('militaryStatus')?.value);

    this.userForm.get('educationLevel')?.valueChanges.subscribe(value => {
      this.updateEducationValidators(value);
    });
    this.updateEducationValidators(this.userForm.get('educationLevel')?.value);
  }

  get jobExperiences(): FormArray {
    return this.userForm.get('jobExperiences') as FormArray;
  }

  get references(): FormArray {
    return this.userForm.get('references') as FormArray;
  }

  get hobbies(): FormArray {
    return this.userForm.get('hobbies') as FormArray;
  }

  get memberships(): FormArray {
    return this.userForm.get('memberships') as FormArray;
  }

  get languages(): FormArray {
    return this.userForm.get('languages') as FormArray;
  }

  get skillCertificates(): FormArray {
    return this.userForm.get('skillCertificates') as FormArray;
  }

  formatPhoneNumber(value: string | null, controlName: string, formGroup: FormGroup = this.userForm): void {
    if (value === null) {
        return;
    }

    const phoneControl = formGroup.get(controlName);
    if (phoneControl) {
        value = value.replace(/\D/g, ''); 

        
        if (value.length === 0) {
          value = '5' + value;
        } 
        
        else if (value.length > 0 && value[0] !== '5') {
            value = '5' + value;
        } 
        
        else if (value.length > 1 && value[1] === '0') {
            value = value[0] + value.slice(2);
        } 

        
        if (value.length > 3) {
            value = value.slice(0, 3) + ' ' + value.slice(3);
        }
        if (value.length > 6) {
            value = value.slice(0, 7) + '-' + value.slice(7);
        }
        if (value.length > 12) {
            value = value.slice(0, 12);
        }

        phoneControl.setValue(value, { emitEvent: false });
    }
}

  addJob(): void {
    this.jobExperiences.push(this.fb.group({
      company: [''],
      position: [''],
      startDate: [''],
      endDate: [''],
      responsibilities: ['']
    }));
    this.tabStates['jobExperiences'].push(false);
  }

  removeJob(index: number): void {
    this.jobExperiences.removeAt(index);
    this.tabStates['jobExperiences'].splice(index, 1);
  }

  addReference() {
    if (this.references.length < 2) {
      const referenceGroup = this.fb.group({
        referenceName: [''],
        referenceCompany: [''],
        referencePhone: [''],
        referenceEmail: ['']
      });
      
      
      referenceGroup.get('referencePhone')?.valueChanges.subscribe(value => {
        this.formatPhoneNumber(value, 'referencePhone', referenceGroup);
      });

      this.references.push(referenceGroup);
      this.tabStates['references'].push(false);
    } else {
      alert('En fazla 2 referans ekleyebilirsiniz.');
    }
  }

  removeReference(index: number) {
    this.references.removeAt(index);
    this.tabStates['references'].splice(index, 1);
  }

  onCertificateFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedCertificateFile = file;
      this.skillCertificates.at(index).get('certificateFile')?.setValue(file.name);
    }
  }

  onCriminalRecordFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedCriminalRecordFile = file;
      this.userForm.get('criminalRecordFile')?.setValue(file.name);
    }
  }

  addCertificate() {
    this.skillCertificates.push(this.fb.group({
      certificateName: [''],
      certificateFile: ['']
    }));
    this.tabStates['skillCertificates'].push(false);
  }

  removeCertificate(index: number) {
    this.skillCertificates.removeAt(index);
    this.tabStates['skillCertificates'].splice(index, 1);
  }

  toggleTab(section: string, index: number): void {
    this.tabStates[section][index] = !this.tabStates[section][index];
  }

  toggleMilitaryForGender(value: string): void {
    const militaryStatus = this.userForm.get('militaryStatus');
    if (value === 'Kadın') {
      militaryStatus?.setValue('Muaf');
      militaryStatus?.disable();
    } else {
      militaryStatus?.reset();
      militaryStatus?.enable();
    }
  }

  onHealthStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.toggleDisabilityDetails(target.value);
  }

  toggleDisabilityDetails(value: string): void {
      const disabilityControl = this.userForm.get('disability');
      if (disabilityControl) {
          if (value === 'Engelli') {
              this.isDisabled = true;
              disabilityControl.enable(); 
              disabilityControl.setValidators([Validators.required]);
          } else {
              this.isDisabled = false;
              disabilityControl.clearValidators(); 
              disabilityControl.disable(); 
          }
          disabilityControl.updateValueAndValidity();
      }
  }

  updateEducationValidators(value: string): void {
    const highschool = this.userForm.get('highschool');
    const university = this.userForm.get('university');
    const program = this.userForm.get('program');

    highschool?.clearValidators();
    university?.clearValidators();
    program?.clearValidators();

    if (value === 'Lise') {
      highschool?.setValidators([Validators.required]);
    } else if (value === 'Ön-lisans' || value === 'Lisans' || value === 'Yüksek-lisans' || value === 'doktora') {
      highschool?.setValidators([Validators.required]);
      university?.setValidators([Validators.required]);
      program?.setValidators([Validators.required]);
    }

    highschool?.updateValueAndValidity();
    university?.updateValueAndValidity();
    program?.updateValueAndValidity();
  }

  toggleCriminalDetails(value: string): void {
    const criminalDate = this.userForm.get('criminalDate');
    const criminalReason = this.userForm.get('criminalReason');
    const criminalRecordFile = this.userForm.get('criminalRecordFile');
  
    if (value === 'Var') {
      criminalDate?.enable();
      criminalReason?.enable();
    } else {
      criminalDate?.disable();
      criminalDate?.reset();
      criminalReason?.disable();
      criminalReason?.reset();
    }
  }

  toggleMilitaryDate(value: string): void {
    const militaryDate = this.userForm.get('militaryDate');
    if (value === 'Yapıldı') {
      militaryDate?.enable();
    } else {
      militaryDate?.disable();
    }
  }

  addMembership(): void {
    this.showMemberships = true;
    this.memberships.push(this.fb.group({
      membershipName: ['']
    }));
  }

  removeLastMembership(): void {
    if (this.memberships.length > 0) {
      this.memberships.removeAt(this.memberships.length - 1);
      if (this.memberships.length === 0) {
        this.showMemberships = false;
      }
    }
  }

  addLanguage(): void {
    this.showLanguages = true;
    this.languages.push(this.fb.group({
      languageName: [''],
      proficiency: ['']
    }));
  }

  removeLastLanguage(): void {
    if (this.languages.length > 0) {
      this.languages.removeAt(this.languages.length - 1);
      if (this.languages.length === 0) {
        this.showLanguages = false;
      }
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('cvFile') as HTMLInputElement;
    fileInput.click();
  }
  onCvFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        const file = input.files[0];
        this.selectedCvFile = file;
        this.userForm.get('cvFile')?.setValue(file.name);  
    }
}


  
  logInvalidFields(): void {
    const invalidFields = [];
    const controls = this.userForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalidFields.push(name);
      }
    }
    console.log('Invalid fields: ', invalidFields);
  }

  submitForm(): void {
    this.isSubmitted = true;
    
    if (this.userForm.invalid) {
      this.markAllControlsAsTouched(this.userForm);
      this.scrollToTop();
      this.logInvalidFields();
      return;
    }
  
    const formData = this.userForm.getRawValue();
    formData.submissionDate = new Date().toISOString(); 
    if (this.selectedCvFile) {
      formData.cvFile = this.selectedCvFile.name;
  }
  if (formData.gpa) {
    formData.gpa = formData.gpa.toString();
}
  
    
    formData.userDetails.birthdate = this.convertToUtc(formData.userDetails.birthdate);
    formData.graduateDate = this.convertToUtc(formData.graduateDate);
    formData.militaryDate = this.convertToUtc(formData.militaryDate);
    formData.criminalDate = this.convertToUtc(formData.criminalDate);
  
    formData.jobExperiences.forEach((job: any) => {
      job.startDate = this.convertToUtc(job.startDate);
      job.endDate = this.convertToUtc(job.endDate);
    });
  
    const uploadPromises = [];
  
    // Upload CV file
    // if (this.selectedCvFile) {
    //   uploadPromises.push(this.uploadFileToServer(this.selectedCvFile, 'cv').then((fileName: string) => {
    //     formData.cvFile = fileName;
    //   }));
    // }
  
    
    if (this.selectedCriminalRecordFile) {
      uploadPromises.push(this.uploadFileToServer(this.selectedCriminalRecordFile, 'criminalRecord').then((fileName: string) => {
        formData.criminalRecordFile = fileName;
      }));
    }
  
    
    if (formData.skillCertificates && formData.skillCertificates.length > 0) {
      formData.skillCertificates.forEach((certificate: any, index: number) => {
        if (certificate.selectedFile) {
          uploadPromises.push(this.uploadFileToServer(certificate.selectedFile, `certificate_${index}`).then((fileName: string) => {
            certificate.certificateFile = fileName; 
          }));
        }
      });
    }
  
    console.log('Form Data:', formData);
  
    Promise.all(uploadPromises).then(() => {
      this.http.post<any>('https://localhost:5231/api/User', formData).subscribe(
        (response: any) => {
          alert('Başvurunuz Başarıyla Gönderildi!');
          this.router.navigate(['/success']);
        },
        (error: HttpErrorResponse) => {
          console.error('Error:', error);
          let errorMsg = error.message;
          if (error.error.errors) {
            errorMsg = Object.entries(error.error.errors).map(([key, value]) => `${key}: ${value}`).join('\n');
          }
          alert(errorMsg);
        }
      );
    }).catch((error) => {
      console.error('File upload failed', error);
      alert('File upload failed, form submission canceled.');
    });
  }

  uploadFileToServer(file: File, fileType: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('fileType', fileType);
  
    return this.http.post<any>('https://localhost:5231/api/user/upload', formData).toPromise();
  }

  private convertToUtc(date: string | null): string | null {
    if (!date) return null;
    const utcDate = new Date(date);
    return utcDate.toISOString();
  }

  private markAllControlsAsTouched(group: FormGroup | FormArray): void {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllControlsAsTouched(control);
      }
    });
  }
}
