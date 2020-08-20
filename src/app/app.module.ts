import { NgModule } from "@angular/core";
import {
  MatButtonModule,
  MatMenuModule,
  MatSelectModule,
  MatSliderModule,
} from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CollapsibleComponent } from "./collapsible/collapsible.component";
import { TreeComponent } from "./tree/tree.component";
import { TreeService } from "./tree/tree.service";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [AppComponent, CollapsibleComponent, TreeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatSelectModule,
    MatSliderModule,
    FormsModule,
  ],
  providers: [TreeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
