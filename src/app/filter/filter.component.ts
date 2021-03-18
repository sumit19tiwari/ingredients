import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {

  categoriesData: any =[];
  categoriesSub: any = [];
  selectedFilter: any = [];


  loading: boolean = false;
  active: boolean = false;

  constructor(
    private categoryService: ServicesService,
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.categoriesSub = this.categoryService
      .getCategories()
      .subscribe((categoryList) => {
        this.categoriesData = categoryList;
        this.selectedFilter = categoryList;
        for (let i = 0; i < this.categoriesData.length; ++i) {
          this.categoriesData[i] = {
            value: this.categoriesData[i],
            checked: true
          };
        }
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }

  toggleFilter() {
    this.active = !this.active;
  }


  filterItems(){
    let selectedCategory =[];
    for(var i =0; i< this.selectedFilter.length ; i++){
      if(this.selectedFilter[i].checked){
        selectedCategory.push(this.selectedFilter[i].value);
      }
    }
    this.categoryService.selectCategories(selectedCategory);
  }

}
