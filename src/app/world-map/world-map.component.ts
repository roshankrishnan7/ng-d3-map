import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { DataModel } from '../../data/data.model';
import * as t from 'topojson';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.css']
})
export class WorldMapComponent implements OnInit, OnChanges {
  @ViewChild('map')
  private mapContainer: ElementRef;

  @Input()
  data: DataModel[];

  margin= { top: 20, right: 20, bottom: 20, left: 20}

  constructor() { }

  ngOnInit() {
    this.createMap();
  }

  ngOnChanges(): void {
    if(!this.data) { return ; }

    this.createMap();
  }

  private createMap(): void {
    d3.select('svg').remove();

    /*
    const element = this.mapContainer.nativeElement;
    const data = this.data;

    const svg = d3.select(element).append('svg')
    .attr('width', element.offsetWidth)
    .attr('height', element.offsetHeight);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

*/
    let width = 900;
    let height = 600;

    let projection = d3.geoMercator();

    let svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height);
    let path = d3.geoPath()
      .projection(projection);

      /*
    const projection = d3.geoNaturalEarth1()
    .scale(contentWidth / 1.3 / Math.PI)
    .translate([contentWidth / 2, contentHeight / 2]);
    */

    let g = svg.append('g');
    g.attr('class', 'map');

    d3.json("https://raw.githubusercontent.com/cszang/dendrobox/master/data/world-110m2.json")
    .then(function(topology: any) {
      console.log("----->", topology.feature);
      g.selectAll('path')
      .data(t.feature(topology, topology.objects.countries).features)
      .enter()
      .append('path')
      .attr('d', path);
      console.log("ending json calling1");

    });
  }
}
