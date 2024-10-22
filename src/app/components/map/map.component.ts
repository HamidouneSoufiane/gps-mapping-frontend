import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Location } from '../../models/location';
import { LocationService } from 'src/app/services/location.service';


L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
});

const myIcon = L.icon({
  iconUrl: 'assets/myIcon.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40], 
  popupAnchor: [0, -40] 
});

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  
  private map!: L.Map;
  private gpsPoints: Location[] = [];

  constructor(private http: HttpClient, private location: LocationService) {}

  ngOnInit(): void {
    this.initMap();
    this.loadGpsPoints();
  }

  private initMap(): void {
    this.map = L.map('map').setView([35.6222, 10.7376], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private loadGpsPoints(): void {
    this.location.getLocations()
      .subscribe(points => {
        console.log(points);
        this.gpsPoints = points;
        this.drawPolyline();
        this.addStartAndEndMarkers();
        this.animateMarker();
      });
  }

  private drawPolyline(): void {
    const latlngs = this.gpsPoints.map(point => [point.latitude, point.longitude] as [number, number]);
    L.polyline(latlngs, { color: 'blue' }).addTo(this.map);
  }

  private addStartAndEndMarkers(): void {
    if (this.gpsPoints.length === 0) return;

    const startPoint = this.gpsPoints[0];
    L.marker([startPoint.latitude, startPoint.longitude], { icon: myIcon})
      .bindPopup(`
        <b>Départ</b><br/>
        <b>ID Device:</b> ${startPoint.id_device}<br/>
        <b>Date:</b> ${new Date(startPoint.date).toLocaleString()}
      `)
      .addTo(this.map);

    const endPoint = this.gpsPoints[this.gpsPoints.length - 1];
    L.marker([endPoint.latitude, endPoint.longitude], { icon: myIcon})
      .bindPopup(`
        <b>Arrivée</b><br/>
        <b>ID Device:</b> ${endPoint.id_device}<br/>
        <b>Date:</b> ${new Date(endPoint.date).toLocaleString()}
      `)
      .addTo(this.map);
  }

  private animateMarker(): void {
    if (this.gpsPoints.length === 0) return;

    const marker = L.marker([this.gpsPoints[0].latitude, this.gpsPoints[0].longitude]).addTo(this.map);
    let index = 0;

    const interval = setInterval(() => {
      if (index >= this.gpsPoints.length) {
        clearInterval(interval);
        return;
      }

      const point = this.gpsPoints[index];


      marker.setLatLng([point.latitude, point.longitude]);

      
      marker.bindPopup(`
        <b>ID Device:</b> ${point.id_device}<br/>
        <b>Date:</b> ${new Date(point.date).toLocaleString()}<br/>
        <b>Latitude:</b> ${point.latitude}<br/>
        <b>Longitude:</b> ${point.longitude}
      `).openPopup();

      index++;
    }, 500);
  }
}
