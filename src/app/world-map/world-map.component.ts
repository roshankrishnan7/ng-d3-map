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
    const dataPath = await d3.csv("https://raw.githubusercontent.com/roshankrishnan7/ng-d3-map/master/src/data/city-coordinates.csv");
    const dataCity = await d3.json("https://raw.githubusercontent.com/roshankrishnan7/ng-d3-map/master/src/data/city.json");

    this.generateMapPath(dataGeo, dataPath, dataCity);

  }

  generateMapPath(dataGeo, data, city) {
    d3.select('svg').remove();

    let width = 900;
    let height = 600;

    let projection = d3.geoMercator()
      .scale(200)
      .translate([width / 2, height / 2 * 1.3]);

    let path = d3.geoPath()
      .projection(projection);

    let svg = d3.select('#map').append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)
        }));

      var tooltip = d3.select("#tooltip") 
      .attr("class", "tooltip")       
      .style("opacity", 0);

    let g = svg.append('g');
    g.attr('class', 'map');


    // Reformat the list of link. Note that columns in csv file are called long1, long2, lat1, lat2
    var link = [];
    data.forEach(function (row) {
      let source = [+row.long1, +row.lat1]
      let target = [+row.long2, +row.lat2]
      let topush = { type: "LineString", coordinates: [source, target] }
      link.push(topush)
    });


    // Draw the map
    g
      .selectAll("path")
      .data(dataGeo.features)
      .enter().append("path")
      .attr("fill", "#b8b8b8")
      .attr("d", d3.geoPath()
        .projection(projection
          .center([-92.1193, 32.5093])
          .scale(300))
      )
      .style("stroke", "#fff")
      .style("stroke-width", 0)
/*
    // Add the path
    svg.selectAll("myPath")
      .data(link)
      .enter()
      .append("path")
      .attr("d", function (d) { return path(d) })
      .style("fill", "none")
      .style("stroke", "#69b3a2")
      .style("stroke-width", 2)

      */
//Add city
      let hue = 0;
      city.map(function(d) {  // Create an object for holding dataset
        hue += 0.36                // Create property for each circle, give it value from color
        d.color = 'hsl(' + hue + ', 100%, 50%)';
      });

      g.selectAll('circle')
      .data(city)
      .enter()
      .append('circle')
      .attr('cx', function(d: any) {
        if(d.location) {
          return projection([d.location.longitude, d.location.latitude])[0];
        }
      })
      .attr('cy', function(d: any) {
        if(d.location) {
          return projection([d.location.longitude, d.location.latitude])[1];
        }
      })
      .attr('r', 5)
      .style('fill', function(d: any) {
        return d.color;
      })
      .on('mouseover', function(d: any) {
        d3.select(this).style('fill', 'black'); 
        d3.select('#name').text(d.name);
        d3.select('#description').text(d.description);
        d3.select('#tooltip')
          .style('left', (d3.event.pageX + 20) + 'px')
          .style('top', (d3.event.pageY - 80) + 'px')
          .style('display', 'block')
          .style('opacity', 0.8)
      })
      //Add Event Listeners | mouseout
      .on('mouseout', function(d: any) { 
        d3.select(this).style('fill', d.color);
        d3.select('#tooltip')
          .style('display', 'none');
      });


  };

}
