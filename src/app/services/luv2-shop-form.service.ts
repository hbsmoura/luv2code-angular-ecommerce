import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

    private countriesUrl = 'http://localhost:8080/api/countries'
    private statesUrl = 'http://localhost:8080/api/states'

    constructor(private httpClient: HttpClient) { }

    getCountries(): Observable<Country[]> {
        return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
            map(response => response._embedded.countries)
        )
    }

    getStates(conutryCode: string): Observable<State[]> {
        const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${conutryCode}`
        return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
            map(response => response._embedded.states)
        )
    }

    getCreditCardMonths(startMonth: number): Observable<number[]> {
        let data = [...Array(13 - startMonth).keys()].map(x => x + startMonth)

        return of(data)
    }

    getCreditCardYears(): Observable<number[]> {
        const startYear = new Date().getFullYear()

        return of([...Array(11).keys()].map(x => x + startYear))
    }
}

interface GetResponseCountries {
    _embedded: {
        countries: Country[]
    }
}

interface GetResponseStates {
    _embedded: {
        states: State[]
    }
}
