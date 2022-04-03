import { Component } from '@angular/core';
import { CountService } from '../services/count.service';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-menuTab',
  templateUrl: 'menu-tab.page.html',
  styleUrls: ['menu-tab.page.scss']
})
export class MenuTabPage {

  constructor(public countService: CountService, public photoService: PhotoService) {}
  
  public currentSearch = '';
  private modelsImage = 
  [
    {
        "name" : "Caixas",
        "value" : "box"
    },
    {
      "name" : "Teclas do Teclado",
      "value" : "keyboard"
     },
     {
      "name" : "Buracos",
      "value" : "hole"
     },
     {
      "name" : "Computadores",
      "value" : "computer"
     },
     {
      "name" : "Folhas de arvore",
      "value" : "leath"
     }
  ]
  public currentItem = this.modelsImage;
  
  ngOnInit (){

  }

  public updateFilter(){
    
     if (this.currentSearch === '') {
       this.currentItem = this.modelsImage;
     } else {
       const lowerCase = this.currentSearch.toLowerCase();
       this.currentItem = this.modelsImage.filter((item) =>
         item.name.toLowerCase().includes(lowerCase)
       );
     }
    }
  
 
    public async addNewToGallery(){
      await this.photoService.addNewToGallery();
     }
  
}
