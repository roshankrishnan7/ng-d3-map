import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { DataModel } from 'src/data/data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-d3';

  data: Observable<DataModel>;

  constructor(private http: HttpClient) {
    this.data = this.http.get<any>("../data/world-110m.json");
  }
}
