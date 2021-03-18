import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { CocktailList } from '../models/cocktailList.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit {

  cocktails = [];
  cocktailsSub: Subscription;;

  currentCategoryIndex: number = 0;
  currentCategoryList : CocktailList[];
  initialValue = false;

  constructor(private cocktailService: ServicesService) {
  }

  ngOnInit(): void {
    this.cocktailsSub = this.cocktailService.getSelectedCocktails().subscribe((result: any ) => {
        this.cocktails = result;
        console.log(result);
        //this.currentCategoryList = result;
        this.getCocktails();
      });
  }


  getCocktails() {
    this.currentCategoryList = this.cocktails;
    this.initialValue = true;
    window.scrollTo(0, 0);
  }

}
