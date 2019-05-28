import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorldMapComponent } from './world-map/world-map.component';


const routes: Routes = [
  { path: '', component: WorldMapComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
