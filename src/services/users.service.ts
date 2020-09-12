import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { SearchResult } from '../models/searchResultInterface'
import { User } from '../models/userInterface'
import { environment } from '../environments/environment'
import { mergeMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userSearchAPI = environment.userSearchAPI

  constructor(public http: HttpClient) {}
  
  searchGithubUsers(query: string): Observable<SearchResult> {
    let url = this.userSearchAPI + "?q=" + query
    const headers = new HttpHeaders({
      "Accept": "application/vnd.github.v3+json"
    })
    return this.http.get<SearchResult>(url, {headers})
  }

  // searchGithubUsers(query: string): Observable<any> {
  //   let url = this.userSearchAPI + "?q=" + query
  //   return this.http.get<SearchResult>(url).pipe(mergeMap(res => {
  //     return res.items.map((user: User) => this.http.get(user.followers_url))
  //   }))
  // }

  getFollowersCount(url: string): Observable<any[]> {
    return this.http.get<any[]>(url)
  }
  getReposCount(url: string): Observable<any[]> {
    return this.http.get<any[]>(url)
  }
}
