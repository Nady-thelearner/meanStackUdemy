import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';
import { enviroment } from '../enviroments/enviroment';

const BACKEND_URL = enviroment.apiUrl +'/posts/';
@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postsCount: number }>();

  constructor(private http: HttpClient, private route: Router) {}

  getPosts(pageSize: number, currentPage: number) {
    const queryParams = `?pageSize=${pageSize}&currentPage=${currentPage}`;
    console.log('Get Post caled');
    this.http
      .get<{ message: string; posts: any; postCount: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            postCount: postData.postCount,
          };
        })
      )
      .subscribe((postData) => {
        console.log('get all post', postData);
        this.posts = postData.posts;
        console.log('another on post', this.posts);
        this.postsUpdated.next({
          posts: [...this.posts],
          postsCount: postData.postCount,
        });
      });
  }

  getPost(id: string) {
    const url = BACKEND_URL + id;
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(url);
    //{ ...this.posts.find((p) => p.id === id) }
  }

  getPostUpdateListener() {
    console.log('subject triggered');
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    // const post: Post = { id: '', title: title, content: content };
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        console.log('Post add message--->', responseData.message);
        this.route.navigate(['/']);
      });
  }

  deletePost(id: string) {
    const url = BACKEND_URL + id;
    console.log('url', url);
    return this.http.delete(url);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      console.log('inside if', image);
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image as string,
        creator: null,
      };
    }
    const post = { id: id, title: title, content: content };
    const url = BACKEND_URL + id;
    this.http.put(url, postData).subscribe((message) => {
      console.log('messageee', message);
      this.route.navigate(['/']);
    });
  }
}
