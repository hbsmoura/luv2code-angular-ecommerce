import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

    constructor() { }

    getCreditCardMonths(startMonth: number): Observable<number[]> {
        let data = [...Array(13 - startMonth).keys()].map(x => x + startMonth)

        return of(data)
    }

    getCreditCardYears(): Observable<number[]> {
        const startYear = new Date().getFullYear()

        return of([...Array(11).keys()].map(x => x + startYear))
    }
}
