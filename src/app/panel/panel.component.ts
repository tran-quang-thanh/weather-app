import { WeatherService } from './../weather.service';
import { DialogComponent } from './../dialog/dialog.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

export interface DialogData {
  city: string;
}

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  interval: number;
  city: string;
  temp: string;
  humidity: number;
  visibility: number;
  pressure: number
  description: string;
  icon: string;
  windSpeed: number;
  count = 0;

  constructor(public dialog: MatDialog, private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.city = null;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {city: this.city}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData(result);
      if (this.interval == null) {
        this.interval = setInterval(() => this.retriveData(this.city), 20000);
      }
    });
  }

  retriveData(result: string): void {
    if (result != null) {
      this.weatherService.getCurrentWeather(result.toLowerCase())
        .subscribe(res => {
          this.city = result.toLowerCase();
          this.temp = Number(res["main"]["temp"] - 273.15).toPrecision(4);
          this.humidity = res["main"]["humidity"];
          this.visibility = res["visibility"];
          this.pressure = res["main"]["pressure"];
          this.description = res["weather"][0]["description"];
          this.icon = `http://openweathermap.org/img/w/` + res["weather"][0]["icon"] + `.png`;
          this.windSpeed = res["wind"]["speed"];
        }, err => {
          this.dialog.open(ErrorDialog, {
            width: '250px',
          });
        })
      }
  }
}

@Component({
  selector: 'error-dialog',
  templateUrl: './error-dialog.html',
})
export class ErrorDialog {

  constructor() { }
}
