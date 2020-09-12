import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../services/users.service'
import { SearchResult } from 'src/models/searchResultInterface';
import { User } from '../../models/userInterface';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchResult: SearchResult
  users = [] as User[]
  searchTerm = new FormControl('', Validators.required)
  pageSize = 6
  page = 1
  spin: boolean

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public usersService: UsersService) { }

  ngOnInit(): void {
  }

  /* Gets triggered when the user clicks the search button */
  searchUsers(): void {
    if (this.searchTerm.value !== '') {
      this.spin = true
      if (this.searchTerm) {
        this.usersService.searchGithubUsers(this.searchTerm.value).subscribe((res: SearchResult) => {
          if (res && res.items) {
            this.searchResult = res
            this.preparedPageData(this.searchResult.items)
          }
        })
      }
    }
  }

  /* Gets triggered when the page index or size changes */
  pageChanged(e): void {
    this.spin = true

    if (e.pageSize !== this.pageSize) {
      this.pageSize = e.pageSize
      this.paginator.firstPage()
      this.page = 1
    } else {
      this.page = e.pageIndex + 1
    }

    this.preparedPageData(this.searchResult.items)
  }

  /* Prepare the displayed data based on the page index and size */
  preparedPageData(data: User[]) {
    this.users = []
    let temp = []

    let maxLen = this.page * this.pageSize;
    let i = (this.page - 1) * this.pageSize;
    maxLen = (data.length >= maxLen) ? maxLen : data.length;

    for (; i < maxLen; i++) {
      temp.push(data[i]);
    }
    this.getFollowersCount(temp)
  }

  /* Gets the followers number of each user */
  async getFollowersCount(temp: User[]) {
    let calls = []

    temp.forEach((user: User) => {
      calls.push(
        this.usersService.getFollowersCount(user.followers_url)
          .toPromise()
          .then((data: any[]) => {
            user.followers_url = data.length == 30 ? String(data.length) + '+' : String(data.length)
          })
          .catch(err => console.log(err))
      )
    })

    await Promise.all(calls)
    this.users = temp
    this.spin = false
  }

}
