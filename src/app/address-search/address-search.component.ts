import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormControl} from "@angular/forms";
import {flatMap, map} from "rxjs/operators";




@Component({
  selector: 'app-address-search',
  templateUrl: './address-search.component.html',
  styleUrls: ['./address-search.component.scss']
})
export class AddressSearchComponent implements OnInit {

  addressCtrl = new FormControl();
  baseUrl = "https://api3.geo.admin.ch/rest/services/ech/SearchServer?lang=de&type=locations&limit=10&origins=address&searchText"
  addresses;
  nrControl = new FormControl();
  plzControl= new FormControl();
  cityControl= new FormControl();

  constructor(private httpClient: HttpClient) {
   this.addressCtrl.valueChanges.subscribe(change => {
     this.search(change);
   });
  }

  ngOnInit(): void {
  }

  search(searchText) {
    this.addresses = this.httpClient.get<any>(`${this.baseUrl}=${searchText}`)
                                    .pipe(map(result => result.results.map(item => {

                                      let split = item.attrs.detail.split(' ');

                                      return {
                                        street: split[0] ? this.capitalize(split[0]) : '',
                                        nr: split[1] ? this.capitalize(split[1]) : '',
                                        plz: split[2] ? this.capitalize(split[2]) : '',
                                        city: split[3] ? this.capitalize(split[3]): ''
                                      };
                                    })));
  }

  select(address: any) {
    this.nrControl.patchValue(this.capitalize(address.nr));
    this.plzControl.patchValue(this.capitalize(address.plz));
    this.cityControl.patchValue(this.capitalize(address.city));
  }

  capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

}
