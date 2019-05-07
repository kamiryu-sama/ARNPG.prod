import { Component, OnInit } from '@angular/core';

//Servicios
import { CrudespeciesService } from '../services/crudespecies.service';
import { AuthenticateService } from '../services/authentication.service';

import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-actualizar-especie',
  templateUrl: './actualizar-especie.page.html',
  styleUrls: ['./actualizar-especie.page.scss'],
})
export class ActualizarEspeciePage implements OnInit {

  userEmail: string;

  validations_form: FormGroup;
  image: any;
  item: any;
  load: boolean = false;

  constructor(
    private imagePicker: ImagePicker,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private crudService: CrudespeciesService,
    private webview: WebView,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticateService,
    private navCtrl: NavController


  ) { }

  ngOnInit() {
    //if(this.authService.userDetails()){
    //  this.userEmail = this.authService.userDetails().email;
    //}else{
    //  this.navCtrl.navigateBack('');
    //}
    this.getData();
    this.image = this.item.imagen;
  }

  getData(){
    this.route.data.subscribe(routeData => {
     let data = routeData['data'];
     if (data) {
       this.item = data;
       this.image = this.item.image;
     }
    })
    this.validations_form = this.formBuilder.group({
      familia: new FormControl(this.item.familia, Validators.required),
      orden: new FormControl(this.item.orden, Validators.required),
      especie: new FormControl(this.item.especie, Validators.required),
      nombre: new FormControl(this.item.nombre, Validators.required),
      cites: new FormControl(this.item.cites, Validators.required),
      lea: new FormControl(this.item.lea, Validators.required),
      uicn: new FormControl(this.item.uicn, Validators.required),
      distEstacional: new FormControl(this.item.distEstacional, Validators.required),
      descripcion: new FormControl(this.item.descripcion, Validators.required),
      ecologia: new FormControl(this.item.ecologia, Validators.required),
      habitat: new FormControl(this.item.habitat, Validators.required),
      distribucion: new FormControl(this.item.distribucion, Validators.required),
    
    });
  }

  onSubmit(value){
    let data = {
      familia: value.familia,
      orden: value.orden,
      especie: value.especie,
      nombre: value.nombre,
      cites: value.cites,
      lea: value.lea,
      uicn: value.uicn,
      distEstacional: value.distEstacional,
      descripcion: value.descripcion,
      ecologia: value.ecologia,
      habitat: value.habitat,
      distribucion: value.distribucion,
      image: this.image
    }
    this.crudService.updateEspecie(this.item.id,data)
    .then(
      res => {
        this.router.navigate(["/gestionar-especies"]);
      }
    )
  }

  async delete() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Do you want to delete ' + this.item.title + '?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.crudService.deleteEspecie(this.item.id)
            .then(
              res => {
                this.router.navigate(["/gestionar-especies"]);
              },
              err => console.log(err)
            )
          }
        }
      ]
    });
    await alert.present();
  }

  openImagePicker(){
    this.imagePicker.hasReadPermission()
    .then((result) => {
      if(result == false){
        // no callbacks required as this opens a popup which returns async
        this.imagePicker.requestReadPermission();
      }
      else if(result == true){
        this.imagePicker.getPictures({
          maximumImagesCount: 1
        }).then(
          (results) => {
            for (var i = 0; i < results.length; i++) {
              this.uploadImageToFirebase(results[i]);
            }
          }, (err) => console.log(err)
        );
      }
    }, (err) => {
      console.log(err);
    });
  }

  async uploadImageToFirebase(image){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    const toast = await this.toastCtrl.create({
      message: 'Image was updated successfully',
      duration: 3000
    });
    this.presentLoading(loading);
    let image_src = this.webview.convertFileSrc(image);
    let randomId = Math.random().toString(36).substr(2, 5);

    //uploads img to firebase storage
    this.crudService.uploadImage(image_src, randomId)
    .then(photoURL => {
      this.image = photoURL;
      loading.dismiss();
      toast.present();
    }, err =>{
      console.log(err);
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}