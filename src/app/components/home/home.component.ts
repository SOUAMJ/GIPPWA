import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientFormService } from 'src/app/client-form.service';
import { ClientDataService } from 'src/app/client-data.service';
import { DataService } from 'src/app/data.service';
import { SharedDataService } from 'src/app/shareddata.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  form: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phoneNumber: new FormControl(''),
    vatNumber: new FormControl(''),});
  submitted = false;
  data: any

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private clientFormService: ClientFormService,
    private clientDataService: ClientDataService,
    private dataService: DataService,
    private sharedDataService: SharedDataService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    this.dataService.getData('questions')
    this.sharedDataService.data$.subscribe(data=>{
      this.data=data
    })
    this.form = this.formBuilder.group( // Some validators for our client form data
      {
        firstName: ['', Validators.required],
        lastName: ['',[Validators.required,]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
        vatNumber: ['', [Validators.required,]],
      }
    );
  }
  get f(): { [key: string]: AbstractControl } { //For ease of use in template
    return this.form.controls;
  }
  onSubmit(): void {
    this.submitted = true;
    this.clientDataService.updateClientData('personalInfo',this.form.value)
    if (this.form.invalid) {
      console.log("INVALID")
    }else{
      this.clientFormService.addForm(this.form.value)
      this.router.navigate(["/products"],{state :this.form.value})
    }

    console.log(JSON.stringify(this.form.value, null, 2));
  }
  onReset(): void {
    this.submitted = false;
    
    this.form.reset();
  }
  onFormSelected(form: FormData) {
    this.form.setValue({...form}) 
  }
  isConnected(){
    console.log("test")
  }
}