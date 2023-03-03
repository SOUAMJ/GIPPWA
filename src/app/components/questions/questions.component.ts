import { Component, Renderer2, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SharedDataService } from 'src/app/shareddata.service';
import { ClientDataService } from 'src/app/client-data.service';
import { GeolocationService } from 'src/app/geolocation.service';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.sass']
})
export class QuestionsComponent implements OnInit {
  fields: FormlyFieldConfig[] = [];
  form = new FormGroup({});
  model = {};
  data: any;
  products: any;
  currentIndex = 0;
  loading = true;
  location: any;
  error: string | undefined;
  submit = false;

  constructor(private router: Router,
    private renderer: Renderer2,
    private sharedDataService: SharedDataService,
    private route: ActivatedRoute,
    private clientDataService: ClientDataService,
    private geolocationService: GeolocationService,
    private dataService: DataService) { }



  ngOnInit(): void {// get data from service
    const productIdFromRoute = this.route.snapshot.paramMap.get('productId')
    this.sharedDataService.data$.subscribe(data => {
      if (data && data.length > 0) {
        this.data = data;
        this.products = this.data[0].json.products;
        for (let elem in this.products) {
          if (productIdFromRoute == this.products[elem].name) {
            this.fields = this.products[elem].fields
          }
        }
        this.setClassToAll("d-none")
      }
    });
    
    this.geolocationService.getCurrentPosition()
      .then(pos => {
        this.location = pos;
        this.clientDataService.updateClientData('geoloc', this.location);
      })
      .catch(error => {
        this.error = error;
        this.clientDataService.updateClientData('geoloc', this.error);
      });
    setTimeout(() => {
      this.start()
      //function to trigger after 0.6 second here once everything should be initialized
    }, 600);

  }

  result(){
    const formly = {fields: this.fields,
                    model: this.model}
    this.router.navigate(["/result"],{state :{formly}})
  }
  

  setClassToAll(className: string) {
    const formlyFields = document.querySelectorAll('formly-field');
    for (let i = 0; i < formlyFields.length; i++) {
      this.renderer.addClass(formlyFields[i], className);
    }
  }
  removeClassToAll(className: string) {
    const formlyFields = document.querySelectorAll('formly-field');
    for (let i = 0; i < formlyFields.length; i++) {
      this.renderer.removeClass(formlyFields[i], className);
    }
  }
  setClass(index: number) {
    const formlyFields = document.querySelectorAll('formly-field');

    if ((0 <= index) && index < document.querySelectorAll('formly-field').length) {
      this.renderer.removeClass(formlyFields[index], "d-none")
    }
    if (index > 1) {
      this.renderer.addClass(formlyFields[index - 1], "d-none")
    }
    if (index < formlyFields.length - 1) {
      this.renderer.addClass(formlyFields[index + 1], "d-none")
    }

  }



  onSubmit(model: any) {//TODO send this data to server with infos from user
    console.log(this.products)
    this.renderer.addClass(document.getElementById("submit"), "d-none")
    this.renderer.addClass(document.getElementById("hiddenDiv"), "d-none")
    this.renderer.removeClass(document.getElementById("result"), "d-none")
    this.renderer.addClass(document.getElementById("previous"), "d-none")
    this.clientDataService.updateClientData('questions', this.model)
    this.clientDataService.updateClientData('versionName', this.data[0].versionName)
    this.clientDataService.updateClientData('dateLocal', Date.now())
    this.clientDataService.updateClientData('seller', localStorage.getItem('username'))
    this.clientDataService.updateClientData('product', this.route.snapshot.paramMap.get('productId'))
    this.submit = true
  }
  //Take all formly-field html element hides them, except the parent and iterate with each call to show the next and hide the previous or the other way around
  start() {
    this.setClassToAll("d-none")
    this.renderer.removeClass(document.querySelector('formly-field'), "d-none")
    this.next()
  }
  next() {
    this.showNavBtn()
    if (this.currentIndex < document.querySelectorAll('formly-field').length) {
      this.currentIndex += 1
      this.setClass(this.currentIndex)
      if (this.currentIndex == document.querySelectorAll('formly-field').length) {
        this.removeClassToAll("d-none")
      }
    }
  }
  previous() {
    this.showNavBtn()
    this.renderer.addClass(document.getElementById("submit"), "d-none")
    if (this.currentIndex > 1) {
      this.currentIndex -= 1
      this.setClass(this.currentIndex)
    }
  }
  showNavBtn() { //This is called every time currentIndex is modified
    const prev = this.currentIndex !== 0;
    const next = this.currentIndex !== document.querySelectorAll('formly-field').length - 1;
    const submit = this.currentIndex == document.querySelectorAll('formly-field').length - 1;

    this.renderer[prev ? 'removeClass' : 'addClass'](document.getElementById('previous'), 'd-none');
    this.renderer[next ? 'removeClass' : 'addClass'](document.getElementById('next'), 'd-none');
    this.renderer[submit ? 'removeClass' : 'addClass'](document.getElementById('submit'), 'd-none');
  }
}


