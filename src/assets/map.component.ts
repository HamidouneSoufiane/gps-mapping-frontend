import { Component, AfterViewInit, OnInit } from '@angular/core';
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { ArchiveService } from './Archive.service';
import { Archive } from './Archive';
import { HttpErrorResponse } from '@angular/common/http';


const iconRetinaUrl = './assets/marker-icon-2x.png';
const iconUrl = './assets/marker-icon.png';
const shadowUrl = './assets/marker-shadow.png';
const iconDefault = L.icon({
iconRetinaUrl,
iconUrl,
shadowUrl,
iconSize: [25, 41],
iconAnchor: [12, 41],
popupAnchor: [1, -34],
tooltipAnchor: [16, -28],
shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;
const myIcon = L.icon({
  iconUrl: "assets/location.png",
  iconSize: [40, 40] }); 
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit,OnInit {
  map: any;
  
  public archive!: Archive[];
  constructor(private as : ArchiveService) { }
  ngOnInit(): void {
   
  }
  ngAfterViewInit(): void {
       this.createMap();
  }

    createMap(){
    
      this.map = L.map('map', {
        center: [35.62224166666667,10.737660000000002],
        zoom: 13
      });
      const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 12,
        maxZoom: 17,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });
  
      mainLayer.addTo(this.map);
      

    }

    public track(){
      var paths = new Array();
      this.as.getpaths().subscribe(
        (response: Archive[])=>{
         var i=0;
          for(let r of response){
            //console.table(r.latitude);
            paths.push([r.latitude,r.longitude]);
          }
         var size = paths.length;
          var Start_marker = L.marker([paths[0][0], paths[0][1]]).addTo(this.map).bindPopup("<b>Start</b>").openPopup();
          var End_marker = L.marker([paths[size -1][0], paths[size -1][1]]).addTo(this.map).bindPopup("<b>End</b>");
          var line = L.polyline(paths, { color: "red", weight: 6, smoothFactor: 0.5 }).addTo(this.map);
          this.map.fitBounds(line.getBounds());
          var Moving_marker = L.marker([paths[0][0], paths[0][1]],{icon: myIcon}).addTo(this.map);
          var i = 0;
          var id = setInterval(function(){
              if(i < size)
              {
                Moving_marker.setLatLng(new L.LatLng(paths[i][0], paths[i][1]));
              }else{
                clearInterval(id);
              }
          i++}, 200);
        },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
      )
      // for (let a of this.arc){
      //   //console.log(a.latitude);
      //   console.log(a);
      // }
      
     // var Start_marker = L.marker([paths[0][0], paths[0][1]]).addTo(this.map).bindPopup("<b>Start</b>").openPopup();
     
     // var line = L.polyline(paths as [number, number][], { color: "red", weight: 6, smoothFactor: 0.5 }).addTo(this.map);
    //  this.map.fitBounds(line.getBounds());
      // var End_marker = L.marker([paths[size-1][0], paths[size-1][1]]).addTo(this.map).bindPopup("<b>End</b>");
      // var Moving_marker = L.marker([paths[0][0], paths[0][1]],{icon: myIcon}).addTo(this.map);
      // var i = 0;
      // var id = setInterval(function(){
      //     if(i < size)
      //     {
      //       Moving_marker.setLatLng(new L.LatLng(paths[i][0], paths[i][1]));
      //       console.log(i);
      //     }else{
      //       clearInterval(id);
      //     }
      // i++}, 250);
    }
}
