import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { authService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  private postsSub: Subscription = new Subscription();
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userId: string;
  private authSubListener: Subscription = new Subscription();
  isAuthenticated = false;

  constructor(public postsService: PostsService, private authSF: authService) {}

  ngOnInit() {
    console.log('Post list component loaded');
    this.userId = this.authSF.getUserId();
    this.authSubListener = this.authSF
      .getAuthStatusListener()
      .subscribe((isAuth) => {
        console.log('triggerd in post list component');
        this.isAuthenticated = isAuth;
        this.userId = this.authSF.getUserId();
      });
    this.isAuthenticated = this.authSF.getisAuthenticated();

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postsCount: number }) => {
        this.posts = postData.posts;
        this.totalPosts = postData.postsCount;
        console.log('getPost post list ', this.posts);
      });
  }

  onDelete(id: string) {
    this.isLoading = true;
    console.log('delete called', id);
    this.postsService.deletePost(id).subscribe(
      () => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onPageChange(e: PageEvent) {
    console.log(e);
    this.postsPerPage = e.pageSize;
    this.currentPage = e.pageIndex + 1;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    if (this.authSubListener) {
      this.authSubListener.unsubscribe();
    }
  }
}
