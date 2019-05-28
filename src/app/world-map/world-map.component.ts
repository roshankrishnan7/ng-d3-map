import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { DataModel } from '../../data/data.model';

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

  margin = { top: 20, right: 20, bottom: 20, left: 20 }

  constructor() { }

  ngOnInit() {
    this.createMap();
  }

  ngOnChanges(): void {
    if (!this.data) { return; }

    this.createMap();
  }

  private async createMap(): Promise<void> {

    const dataGeo = await d3.json("https://raw.githubusercontent.com/roshankrishnan7/ng-d3-map/master/src/data/world.geojson");
    const dataPath = await d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_connectionmap.csv");

    this.generateMapPath(dataGeo, dataPath);

  }

   generateMapPath( dataGeo, data) {
    d3.select('svg').remove();

    let width = 900;
    let height = 600;

    let projection = d3.geoMercator()
      .scale(85)
      .translate([width / 2, height / 2 * 1.3]);

    let svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height);
    let path = d3.geoPath()
      .projection(projection);

    let g = svg.append('g');
    g.attr('class', 'map');

    // Reformat the list of link. Note that columns in csv file are called long1, long2, lat1, lat2
    var link = []
    data.forEach(function (row) {
      let source = [+row.long1, +row.lat1]
      let target = [+row.long2, +row.lat2]
      let topush = { type: "LineString", coordinates: [source, target] }
      link.push(topush)
    })

    // Draw the map
    svg.append("g")
      .selectAll("path")
      .data(dataGeo.features)
      .enter().append("path")
      .attr("fill", "#b8b8b8")
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      .style("stroke", "#fff")
      .style("stroke-width", 0)

    // Add the path
    svg.selectAll("myPath")
      .data(link)
      .enter()
      .append("path")
      .attr("d", function (d) { return path(d) })
      .style("fill", "none")
      .style("stroke", "#69b3a2")
      .style("stroke-width", 2)

  };

}
