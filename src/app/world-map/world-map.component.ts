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

    let width = 900;
    let height = 600;

    let link = {type: "LineString", coordinates: [[30, 90], [40, -74]]}

    let projection = d3.geoMercator()
    .scale(85)
    .translate([width/2, height/2*1.3]);

    let svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height);
    let path = d3.geoPath()
      .projection(projection);

    let g = svg.append('g');
    g.attr('class', 'map');

    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .then(function(topology: any) {
      g.selectAll("path")
      .data(topology.features)
      .enter().append("path")
            .attr("fill", "#b8b8b8")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#fff")
            .style("stroke-width", 0);
            g.append("path")
            .attr("d", path(link))
            .style("fill", "none")
            .style("stroke", "orange")
            .style("stroke-width", 7)
            .style("z-index", 10);        
    });

    
  }
}
