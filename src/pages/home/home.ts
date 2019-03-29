import { Component } from '@angular/core';
import { NavController, AlertController,ToastController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  MarkerOptions,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
  MyLocationOptions,
  Polyline,
  PolylineOptions,
  ILatLng
} from '@ionic-native/google-maps';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

//AIzaSyDjFhe6WUTTBG7Rlv0i3XiudZPfpqyf55Q
//API key para google directions

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mapReady: boolean = false;
  map: GoogleMap;
  destination:any;
  start:any;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public toastCtrl:ToastController,
              private launchNavigator: LaunchNavigator) {

  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    // Create a map after the view is loaded.
    // (platform is already ready in app.component.ts)
    this.map = GoogleMaps.create('map_canvas', {
      controls: {
        myLocationButton: true,
        myLocation: true
      },
      camera: {
        target: {
          lat: 19.252858,
          lng: -103.720654
        },
        zoom: 18,
        tilt: 30
      }
    });

    // Wait the maps plugin is ready until the MAP_READY event
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.mapReady = true;
    });
  }

  onButtonClick() {
    if (!this.mapReady) {
      this.showToast('map is not ready yet. Please try again.');
      return;
    }
    this.map.clear();

    // Get the location of you
    let options: MyLocationOptions = {
      enableHighAccuracy: true
    };
    this.map.getMyLocation(options)
      .then((location: MyLocation) => {
        console.log(JSON.stringify(location, null ,2));
        this.start = [location.latLng.lat, location.latLng.lng];
        this.destination = [19.252858,-103.720654];

        // Move the map camera to the location with animation
        return this.map.animateCamera({
          target: [
            location.latLng,
            {lat: 19.252858,lng: -103.720654}
          ],
          zoom: 17,
          tilt: 30
        }).then(() => {
          // add a marker
          return this.map.addMarker({
            title: '@ionic-native/google-maps plugin!',
            snippet: 'This plugin is awesome!',
            position: {
              lat: 19.252858,
              lng: -103.720654
            },
            animation: GoogleMapsAnimation.BOUNCE
          });
        })
      }).then((marker: Marker) => {
        // show the infoWindow
        marker.showInfoWindow();

        // If clicked it, display the alert
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          this.showToast('clicked!');
        });
      });
  }


  showToast(message: string) {
     let toast = this.toastCtrl.create({
       message: message,
       duration: 2000,
       position: 'middle'
     });

     toast.present(toast);
   }

   getDirections(){
     var encoded = "w}qtBzf`xRDU`B^RDi@`CCLbF~Ad@BpAb@dDvAZRRFl@BhHA|G?jID`A?Y`@";

     var path:ILatLng[] = [];
     var index = 0, len = encoded.length;
     var lat = 0, lng = 0;

     while (index < len) {
         var b, shift = 0, result = 0;

         do {
             b = encoded.charCodeAt(index++) - 63;
             result = result | ((b & 0x1f) << shift);
             shift += 5;
         } while (b >= 0x20);

         var dlat = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
         lat += dlat;

         shift = 0;
         result = 0;

         do {
             b = encoded.charCodeAt(index++) - 63;
             result = result | ((b & 0x1f) << shift);
             shift += 5;
         } while (b >= 0x20);

         var dlng = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
         lng += dlng;

         var p:ILatLng = {
             lat: lat / 1e5,
             lng: lng / 1e5,
         };
         path.push(p);
     }
       console.log(path)

      let options: PolylineOptions = {
        points: path,
        color: '#AA00FF',
        width: 10,
        geodesic: true,
        clickable: true
      };

      this.map.addPolyline(options).then((polyline: Polyline) => {

      });
     // let options: LaunchNavigatorOptions = {
     //       start: this.start
     //     };
     //
     //     this.launchNavigator.navigate(this.destination, options)
     //         .then(
     //             success => alert('Launched navigator'),
     //             error => alert('Error launching navigator: ' + error)
     //     );
   }


}
