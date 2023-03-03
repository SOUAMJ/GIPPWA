import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ClientDataService } from 'src/app/client-data.service';
import { DataService } from 'src/app/data.service';
import { IndexedDBService } from 'src/app/indexed-db.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.sass']
})
export class ResultComponent implements OnInit{
  product: any;
  model: any;
  fields: FormlyFieldConfig[] = [];
  form = new FormGroup({});
  weight: number = 0;
  @ViewChild('hiddenDiv')
  hiddenDiv!: ElementRef;
  constructor(private router: Router,
              private clientDataService: ClientDataService,
              private indexedDBService: IndexedDBService,
              private dataService: DataService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.model = navigation.extras.state['formly'].model
      this.fields = navigation.extras.state['formly'].fields
      this.product = {fields: navigation.extras.state['formly'].fields}
      this.weight=100-this.calculateWeightPercentage(this.calculateMaxWeight(),this.calculateWeight())
      this.clientDataService.updateClientData('weight', this.weight)
    }
  }
  ngOnInit(): void {
      
      //send data to server /answers
      this.indexedDBService.getItem("clientData")
      .then(data => {
        this.dataService.postData('answers', data);
      })
      .catch(error => {
        console.error('Error retrieving data from indexeddb', error);
      });

  }
  calculateWeight() {
    let totalWeight = 0;
    for (const field of this.product.fields) {
      if (field.type === 'radio' || field.type === 'select') {
        for (const option of field.templateOptions.options) {
          if (this.model[field.key] === option.value) {
            totalWeight += option.weight ?? 0;
          }
        }
      } else if (field.type === 'multicheckbox') {
        for (const option of field.templateOptions.options) {
          if (this.model[field.key]?.[option.value]) {
            totalWeight += option.weight ?? 0;
          }
        }
      }
    }
    return totalWeight;
  }


  calculateMaxWeight() {
    let maxWeight = 0;
    for (const field of this.product.fields) {
      for (const option of field.templateOptions.options) {
        maxWeight += option.weight;
      }
    }
    return maxWeight;
  }

  calculateWeightPercentage(maxWeight: number, weight: number) {
    const percentage = (weight / maxWeight) * 100;
    return Math.floor(percentage);
  }
  generatePdf() {
    const date = new Date().toISOString(); // Get the current date as a string in ISO format
    html2canvas(this.hiddenDiv.nativeElement).then((canvas)=>{
      const imgData = canvas.toDataURL('image/jpeg')
      const pdf = new jsPDF({
        orientation:'portrait'
      })
      const imageProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
  
      // Calculate the image width and height based on the aspect ratio and margins
      const marginX = 20; // Set the left and right margins to 20
      const imageWidth = pdfWidth - 2 * marginX; // Calculate the image width based on the page width and margins
      const imageHeight = (imageWidth * imageProps.height) / imageProps.width; // Calculate the image height based on the aspect ratio
  
      // Add header to every page
      const header = 'GIP Header';
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text(header, pdfWidth / 2, 15, { align: 'center' });
      pdf.line(10, 20, pdfWidth - 10, 20);
  
      // Add footer to every page
      const footer = 'GIP Footer';
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(footer, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
  
      // Add image to PDF with margins
      const imageX = marginX;
      const imageY = 30; // Set the top margin to 30
      pdf.addImage(imgData, 'PNG', imageX, imageY, imageWidth, imageHeight);
  
      pdf.save(`my-pdf-${date}.pdf`);

    })
  }
}
