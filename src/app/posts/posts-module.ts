import { NgModule } from '@angular/core';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
})
export class PostModule {}
