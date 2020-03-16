import { Component } from '@angular/core';
import * as L from 'leaflet';

import { ModalController } from '@ionic/angular';
import { ModalQuestionPage } from '../pages/modal-question/modal-question.page';
import { DataService } from '../services/data.service';
import { Storage } from '@ionic/storage';



@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  map: any;
  distanceMap: any;
  position: any;
  markerPlaceToGo: any;

  imgLink: any;
  markerId = "1";
  markerName: string;

  //Img variables.............................................................

  layers: any;
  imgContainer: any;
  randomNumber: number = Math.floor(Math.random() * 4) + 1;
  randomNumberList: Array<number> = [];
  // This distance will be replaced by the data of the map
  distance: any; // getRouteDistance() ?
  distance1: number;
  distance2: number;
  distance3: number;
  distance4: number;
  // distance1: number = this.distance / 4;
  // distance2: number = this.distance1 * 2;
  // distance3: number = this.distance1 * 3;
  // distance4: number = this.distance;
  // The currentDistance will be replaced by the data of the map
  currentDistance: any; // getRouteDistance() ?

  distanceRanges: object = {
    range1: { isInTheRange: false },
    range2: { isInTheRange: false },
    range3: { isInTheRange: false },
    range4: { isInTheRange: false }
  };

  firtDistance: object = {
    distance: { isDistance: false }
  };

  keepUpdated: any;

  //..............................................................................

  constructor(
    public modalController: ModalController,
    private data: DataService,
    private storage: Storage
  ) {
    this.imgLink = `../../../assets/img/${
      this.data.getPlace(this.markerId).img.url
      // this.data.getAllData()[this.markerId].img.url
    }`;
  }

  ionViewDidEnter() {
    console.log("dataService getPlace", this.data.getPlace(this.markerId));
    this.markerName = this.data.getPlace(this.markerId).name;
    // console.log('dataService', this.data.getAllData()[this.markerId]);

    // this.imgLink = `../../../assets/img/${this.data.getAllData()[0].img}`;
    // console.log('id', this.data.getAllData()[this.markerId].id);
    // this.storage.set('info', [
    //   { id: this.data.getAllData()[this.markerId].id }
    // ]);
    // this.storage.set('currentMarkerID', this.markerId);
    // console.log(this.imgLink);

    // if (this.map) {
    //   console.log("borrar mapa");
    //   this.map.remove();
    // }

    this.map = L.map("map").setView([43.2603479, -2.933411], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      this.map
    );

    this.markerPlaceToGo = L.marker([28.130006, -15.448792], {
      draggable: false
    }).addTo(this.map);

    this.map
      .locate({ setView: true, watch: true })
      .on("locationfound", (e: any) => {
        // Consultamos si existe y si ya existe le cambiamos la posición
        if (this.position != undefined) {
          this.position.setLatLng([e.latitude, e.longitude]);
          this.map.setView([e.latitude, e.longitude], 30); // Calculamos la distancia entre la posición actual y el marcador
          this.distanceMap = Math.round(
            this.map.distance(
              [e.latitude, e.longitude],
              this.markerPlaceToGo.getLatLng()
            )
          );
          // Colocamos la distancia dentro de un Popup
          this.position
            .bindPopup("Estás a " + this.distanceMap + " metros del objetivo.")
            .openPopup();
        } else {
          this.position = L.circle([e.latitude, e.longitude], {
            radius: 5
          }).addTo(this.map);
          this.map.setView([e.latitude, e.longitude], 30);
        }
      });

    //setInterval(() =>{ this.prueba(); }, 3000);

    //setInterval Img.............................................................

    this.layers = document.querySelectorAll(".layer");
    this.imgContainer = document.querySelector(".image-container");

    // this.distance = this.distanceMap;

    // To show the first part of the image
    // this.checkDisplayLayer('range1');

    // Add a setInterval to update and check the distances ranges
    this.keepUpdated = setInterval(() => {
      if (this.randomNumberList.length === this.layers.length) {
        this.removeImage();
        clearInterval(this.keepUpdated);
      }

      if (
        !this.firtDistance["distance"].isDistance &&
        this.distanceMap != undefined
      ) {
        this.distance = this.distanceMap;
        this.distance1 = this.distance / 4;
        this.distance2 = this.distance1 * 2;
        this.distance3 = this.distance1 * 3;
        this.distance4 = this.distance;
        this.firtDistance["distance"].isDistance = true;
        // To show the first part of the image
        // this.checkDisplayLayer('range1');
      }
      this.allChecks();
    }, 5000);

    //..................................................................................
  }

  prueba() {
    console.log("distancia: ", this.distanceMap);
  }

  //Function img.............................................................

  // Add an animation to a layer and remove that layer
  removeLayer(indexLayer: number) {
    this.layers[indexLayer].classList.add("animation-layer");
    setTimeout(() => this.layers[indexLayer].remove(), 1000);
  }

  // Show an aleatory part of the image depending on a random number
  displayLayers() {
    switch (this.randomNumber) {
      case 1:
        this.removeLayer(0);
        break;
      case 2:
        this.removeLayer(1);
        break;
      case 3:
        this.removeLayer(2);
        break;
      case 4:
        this.removeLayer(3);
        break;
      default:
        console.log("Error layers");
    }
  }

  // Check if the random number is not repeated and show the layers
  displayRandomLayer() {
    while (this.randomNumberList.includes(this.randomNumber)) {
      this.randomNumber = Math.floor(Math.random() * 4) + 1;
    }
    this.displayLayers();
    this.randomNumberList.push(this.randomNumber);
  }

  removeImage() {
    // if (this.randomNumberList.length === this.layers.length) {
    setTimeout(() => this.imgContainer.classList.add("animation-layer"), 1500);
    setTimeout(() => this.imgContainer.remove(), 2500);
    // }
  }

  // Check if in every distance range the function only runs once
  checkDisplayLayer(range: string) {
    // console.log('distanceRanges', this.distanceRanges);
    // console.log('this.distance', this.distance);
    // console.log('this.currentDistance', this.currentDistance);

    if (!this.distanceRanges[range].isInTheRange) {
      switch (range) {
        case "range1":
          console.log(
            "this.currentDistance >= this.distance3",
            this.currentDistance >= this.distance3
          );
          if (this.currentDistance >= this.distance3) {
            console.log("1");
            this.displayRandomLayer();
            this.distanceRanges[range].isInTheRange = true;
          }
          break;
        case "range2":
          if (
            this.currentDistance < this.distance3 &&
            this.currentDistance >= this.distance2
          ) {
            console.log("2");
            this.displayRandomLayer();
            this.distanceRanges[range].isInTheRange = true;
          }
          break;
        case "range3":
          if (
            this.currentDistance < this.distance2 &&
            this.currentDistance >= this.distance1
          ) {
            console.log("3");
            this.displayRandomLayer();
            this.distanceRanges[range].isInTheRange = true;
          }
          break;
        case "range4":
          if (this.currentDistance < this.distance1) {
            console.log("4");
            this.displayRandomLayer();
            this.distanceRanges[range].isInTheRange = true;
          }
      }
    }
  }

  allChecks() {
    this.currentDistance = this.distanceMap;
    console.log("this.currentDistance", this.currentDistance);
    this.checkDisplayLayer("range1");
    this.checkDisplayLayer("range2");
    this.checkDisplayLayer("range3");
    this.checkDisplayLayer("range4");
  }

  //.............................................................................

  //QUESTION.............................................................

  // showModal() {
  //   console.log('show modal');
  // }
  async showModal() {
    const modal = await this.modalController.create({
      component: ModalQuestionPage,
      componentProps: {
        question: {
          q: this.data.getPlace(this.markerId).question
        },
        answers: {
          answer1: this.data.getPlace(this.markerId).options.anotherBadOption,
          answer2: this.data.getPlace(this.markerId).options.badOption,
          answer3: this.data.getPlace(this.markerId).options.correct
        },
        answer: {
          rightAnswer: this.data.getPlace(this.markerId).options.correct
        }
      }
    });
    clearInterval(this.keepUpdated);
    return await modal.present();
  }
}
