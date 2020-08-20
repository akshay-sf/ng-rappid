import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CollapsibleComponent } from "./collapsible/collapsible.component";
import { TreeComponent } from "./tree/tree.component";

const routes: Routes = [
  {
    path: "",
    component: TreeComponent,
  },
  {
    path: "collapsible",
    component: CollapsibleComponent,
  },
  {
    path: "**",
    redirectTo: "",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
