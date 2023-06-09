import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewProductModalComponent } from 'src/app/containers/pages/add-new-product-modal/add-new-product-modal.component';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProduct } from 'src/app/data/api.service';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { GooglePlaceModule, GooglePlaceDirective } from "ngx-google-places-autocomplete"; 
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import {Location, Appearance, GermanAddress} from '@angular-material-extensions/google-maps-autocomplete';

import PlaceResult = google.maps.places.PlaceResult;


// Generated by https://quicktype.io

export interface IBranch {
  branch_Id:       number;
  branch_Name:     string;
  branch_Location: BranchLocation;
}

export interface BranchLocation {
  location_Street:    string;
  location_Suburb:    string;
  location_City:      string;
  location_Zip_Code:  string;
  location_Longitude: number;
  location_Latitude:  number;
  location_Places_Id: string;
}


//submit to api data structure
// Generated by https://quicktype.io

export interface IEmployee {
  emp_First_Name: string;
  emp_Last_Name:  string;
  emp_Email:      string;
  emp_Password:   string;
  emp_Role:       string;
  emp_Branch_Id:  number;
}

// Generated by https://quicktype.io

export interface IDriver {
  emp_First_Name:      string;
  emp_Last_Name:       string;
  emp_Email:           string;
  emp_Password:        string;
  emp_Role:            string;
  emp_Branch_Id:       number;
  emp_Driving_Licence: EmpDrivingLicence;
}

export interface EmpDrivingLicence {
  dl_Licence_Number: string;
  dl_Code:           string;
  dl_Valid_Until:    string;
}



export interface iClient {
  client_Id:                  number;
  order_Client_Email:         string;
  client_First_Name:          string;
  client_Last_Name:           string;
  client_Business_Name:       string;
  client_Id_Number:           string;
  client_Business_Reg_Number: string;
}

@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.component.html'
})


export class RegisterEmployeeComponent implements OnInit {
  
  
  
  categories = [
    { label: 'Driver', value: 'Driver' },
    { label: 'Consultant', value: 'Consultant' },
    { label: 'Manager', value: 'Manager' }
  ];


  //submit order data

  public employeeDetails : IEmployee = 
  {

    emp_First_Name: '',
    emp_Last_Name:  '',
    emp_Email:      '',
    emp_Password:   '',
    emp_Role:       '',
    emp_Branch_Id:  0
  };

  
  public driverDetails : IDriver = 
  {

    emp_First_Name: '',
    emp_Last_Name:  '',
    emp_Email:      '',
    emp_Password:   '',
    emp_Role:       '',
    emp_Branch_Id:  0,
    emp_Driving_Licence: {
      dl_Licence_Number: '',
      dl_Code: '',
      dl_Valid_Until: ''
    }
  };

  public branch : IBranch[] = [];
  

  //googlle
  public appearance = Appearance;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  public selectedAddress: PlaceResult;
 
  clientindex: number = 0;


  clientorderform:FormGroup = null;

  locString: String = 'location';
  clientdisplayMode = 'list';
  
  selectClientAllState = '';
  clientPage = 1;
  searchclient = '';
  orderclientBy = '';
  isLoading: boolean;
  endOfTheClientList = false;
  totalClientItem = 0;
  totalClientPage = 0;


  @ViewChild('addClientNewModalRef', { static: true }) addClientNewModalRef: AddNewProductModalComponent;  
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  @ViewChild('myTable') table: any; 

  
  client : IBranch[] = [];
  selectedClient: IBranch[] = [];

  clientdata: string;
  clientcount: number = 0;
  locationcount: number = 0;
  expanded: any = {};
  timeout: any;  

  clientrows; 

  clienttemp;
  clientitemsPerPage = 10;
  clientColumnMode = ColumnMode;
  clientcolumns = [
    { prop: 'branch_Id', name: 'Branch ID' },
    { prop: 'client_Business_Name', name: 'Client Business Name' },
    { prop: 'client_Id', name: 'Client Id' },
    { prop: 'client_Last_Name', name: 'Client Last Name' },
  ];

  registerEmployeeForm = this.fb.group({
    
    emp_First_Name: ['', [Validators.required]],
    emp_Last_Name:  ['', [Validators.required]],
    emp_Email:      ['', [Validators.required]],
    emp_Password:   ['', [Validators.required]],
    emp_Role:       ['', [Validators.required]],
    emptypecontrol:       ['', [Validators.required]]  ,
    dl_Licence_Number:       ['', [Validators.required]],
    dl_Code :       ['', [Validators.required]],
    dl_Valid_Until:       ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) 
  {
    
    this.loadClientData(this.clientitemsPerPage, this.clientPage, this.searchclient, this.orderclientBy);
    
  
    
  }

  onProductQuantity(Qty: Number)
  {
    console.log("product quantity: " + Qty);
    /*if (this.isProductQtyTrue(item)) {
      
    } else { 

      //logic of autoselect goes here
    
      
    }*/
  }

  driverAuth : boolean;
  driver = 'Driver';

  empType()
  {
    this.driverAuth = false;

    if(this.registerEmployeeForm.value.emptypecontrol == this.driver)
    {
      this.driverAuth = true;
    }

    console.log('employee role ',this.registerEmployeeForm.value.emptypecontrol)
    console.log('driver authentication ',this.driverAuth)
  }

  ngOnInit() {
    console.log("registerEmployeeForm: " , this.registerEmployeeForm);
  }

  loadClientData(pageSize: number = 10, currentPage: number = 1, search: string = '', orderBy: string = '') 
  {
    this.clientitemsPerPage = pageSize;
    this.clientPage = currentPage;
    this.searchclient = search;
    this.orderclientBy = orderBy;

    this.authService.getBranch().subscribe(data=> {
      console.log(data)
      this.clientdata = data

      this.branch.push({
        branch_Id: data.branch_Id,
        branch_Name: data.branch_Name,
        branch_Location: {
          location_City: data.branch_Location.location_City,
          location_Street: data.branch_Location.location_Street,
          location_Suburb: data.branch_Location.location_Suburb,
          location_Zip_Code: data.branch_Location.location_Zip_Code,
          location_Longitude: data.branch_Location.location_Longitude,
          location_Latitude: data.branch_Location.location_Latitude,
          location_Places_Id: data.branch_Location.location_Places_Id
        }
      });
      
      this.clientrows = this.branch.slice(0,this.clientcount).map(({branch_Id, branch_Name}) => ({branch_Id, branch_Name}));  

      this.clienttemp = [...this.clientrows];
      console.log(this.clientrows)
      console.log(this.clientrows.branch_Name)
      console.log(this.clienttemp)
      console.log(this.client)
      console.log('client count : ' + this.clientcount)
      console.log('BRANCH : ' , this.branch)
    },error => {
        this.isLoading = false;
      })
  }


  onPage(event) {
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
  }

  changeClientDisplayMode(mode) {
    this.clientdisplayMode = mode;
  }
  
  showClientAddNewModal() {
    this.addClientNewModalRef.show();
  }

      isSelectedClient(c: IBranch) {
        return this.client.findIndex(x => x.branch_Id === c.branch_Id) > -1;
        
      } 
  

    branchId: number;

  onSelectClient(item: IBranch) {
    if (this.isSelectedClient(item)) {
      console.log(item.branch_Name);
      console.log(this.client.findIndex(d => d.branch_Id === item.branch_Id));
      this.branchId = item.branch_Id;
      this.clientindex = this.client.findIndex(d => d.branch_Id === item.branch_Id)
      console.log('client index: ' + this.clientindex);
      this.selectedClient = this.client.filter(x => x.branch_Id !== item.branch_Id);
 /*     this.orderForm.patchValue({
        order_Client_Id : item.client_Id,
        
        duration: 5
      });    
  */   
      
    } else {
      console.log(item.branch_Name);
     
    }
    this.setClientSelectAllState();
  }

  setClientSelectAllState() {
    if (this.selectedClient.length === this.client.length) {
      this.selectClientAllState = 'checked';
    } else if (this.client.length !== 0) {
      this.selectClientAllState = 'indeterminate';
    } else {
      this.selectClientAllState = '';
    }
  }

  selectClientAllChange($event) {
    if ($event.target.checked) {
    } else {
      this.selectedClient = [...this.client];
    }
    this.setClientSelectAllState();
  }

 

  pageClientChanged(event: any): void {
   // this.loadClientData(this.clientitemsPerPage, event.page, this.searchclient, this.orderclientBy);
  }

  

  itemsClientPerPageChange(perPage: number) {
   // this.loadClientData(perPage, 1, this.searchclient, this.orderclientBy);
  }


  changeClientOrderBy(item: any) {
    //this.loadClientData(this.clientitemsPerPage, 1, this.searchclient, item.value);
  }


  searchClientKeyUp(event){
    const val = event.target.value.toLowerCase().trim();
    //this.loadClientData(this.clientitemsPerPage, 1, val, this.orderclientBy);
  }


  onClientContextMenuClick(action: string, item: iClient) {
    console.log('onClientContextMenuClick -> action :  ', action, ', item.client_First_Name :', item.client_First_Name);
  }

  addTagFn(addedName) {
    return { name: addedName, tag: true };
  }

  
  registerEmployee()
  {


    console.log(this.employeeDetails);

    if(this.registerEmployeeForm.value.emptypecontrol == this.driver)
    {
      console.log('this.employeeDetails : ', this.employeeDetails); 
      console.log('this.registerEmployeeForm.value.emp_First_Name : ', this.registerEmployeeForm.value.emp_First_Name); 
      console.log('this registerEmployeeForm emptypecontrol : ', this.registerEmployeeForm.value.emptypecontrol); 
      this.driverDetails.emp_First_Name = this.registerEmployeeForm.value.emp_First_Name;
      this.driverDetails.emp_Last_Name = this.registerEmployeeForm.value.emp_Last_Name;
      this.driverDetails.emp_Email = this.registerEmployeeForm.value.emp_Email;
      this.driverDetails.emp_Password = this.registerEmployeeForm.value.emp_Password;
      this.driverDetails.emp_Role = this.registerEmployeeForm.value.emptypecontrol;
      this.driverDetails.emp_Branch_Id = this.branch[this.branch.length-1].branch_Id;
      this.driverDetails.emp_Driving_Licence.dl_Licence_Number = this.registerEmployeeForm.value.dl_Licence_Number;
      this.driverDetails.emp_Driving_Licence.dl_Code = this.registerEmployeeForm.value.dl_Code;
      this.driverDetails.emp_Driving_Licence.dl_Valid_Until = this.registerEmployeeForm.value.dl_Valid_Until + 'T00:00:00.000Z';

      console.log('branch ID : ', this.branch[this.branch.length-1].branch_Id); 
      console.log('driver?  : ', (this.registerEmployeeForm.value.emptypecontrol == this.driver)); 
  
      this.authService.registerDriver(this.driverDetails).subscribe();
    }else
    {
      console.log('this.registerEmployeeForm.value.emp_First_Name : ', this.registerEmployeeForm.value.emp_First_Name); 
      console.log('this registerEmployeeForm emptypecontrol : ', this.registerEmployeeForm.value.emptypecontrol); 
      this.employeeDetails.emp_First_Name = this.registerEmployeeForm.value.emp_First_Name;
      this.employeeDetails.emp_Last_Name = this.registerEmployeeForm.value.emp_Last_Name;
      this.employeeDetails.emp_Email = this.registerEmployeeForm.value.emp_Email;
      this.employeeDetails.emp_Password = this.registerEmployeeForm.value.emp_Password;
      this.employeeDetails.emp_Role = this.registerEmployeeForm.value.emptypecontrol;
      this.employeeDetails.emp_Branch_Id = 1;

      console.log('this.employeeDetails : ', this.employeeDetails); 
      console.log('driver?  : ', (this.registerEmployeeForm.value.emptypecontrol == this.driver)); 
      this.authService.registerEmployee(this.employeeDetails).subscribe();
    }

  }

  //google
  
 
  //order_Location
  // Getter method to access formcontrols
  get myForm() {
    return this.registerEmployeeForm.controls;
  }
}
 

