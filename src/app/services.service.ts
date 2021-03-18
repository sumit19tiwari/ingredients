import { Injectable } from '@angular/core';
import { baseUrl } from './app.config';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { map, tap, mergeMap } from 'rxjs/operators';
import { Data } from './models/data.model';
import { CocktailList } from './models/cocktailList.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  categoriesUrl = baseUrl + 'list.php?c=list';
  cocktailsUrl = baseUrl + 'filter.php?c=';

  private selectedCategories: BehaviorSubject<any> = new BehaviorSubject(
    []
  );
  currentlySelected = this.selectedCategories.asObservable();

  constructor(private http: HttpClient) {}

  getCategories(): Observable<String[]> {
    return this.http.get(this.categoriesUrl).pipe(
      map((res:any) => res['drinks'].map((c:any) => c['strCategory'])),
      tap((data) => this.selectedCategories.next(data))
    );
  }

  selectCategories(categories: String[]) {
    this.selectedCategories.next(categories);
  }


  private getCocktailsByCategory(category:any): Observable<Data[]> {
    return this.http.get(`${this.cocktailsUrl}${category}`).pipe(
      map((res: any) => {
        if (!res) {
          return [];
        }
        return res['drinks'].map((c: any) =>
          Object.assign(
            {},
            { name: c['strDrink'], thumbnail: c['strDrinkThumb'] }
          )
        );
      })
    );
  }

  getSelectedCocktails(): Observable<CocktailList[]> {
    return this.currentlySelected.pipe(
      mergeMap((categories:any) => {
        return forkJoin(
          ...categories.map((c:any) => this.getCocktailsByCategory(c))
        ).pipe(
          map((cocktails) =>
            cocktails.map((c:any, i:any) =>
              Object.assign({}, { category: categories[i], drinks: c })
            )
          )
        );
      })
    );
  }
}
