import { Customer } from './models/customer';
import { Component, OnInit } from '@angular/core';
import { gql, Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

const GET_CUSTOMERS = gql`query
  {
      customers {
        id
        fullName
        address
        automobileType
      }

  }
`;

const CREATE_CUSTOMER = gql`
  mutation createCustomer($fullName: String!, $address: String!, $automobileType: String!) {
    createCustomer(input: { fullName: $fullName, address: $address,  automobileType:$automobileType}) {
      id
      fullName
      address
      automobileType
    }
  }
`;

const DELETE_CUSTOMER = gql`
  mutation deleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      id
      fullName
      address
      automobileType
    }
  }
`;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  allCustomers: Customer[] = [];
  title = 'virtusafrontend';
  customerForm: Customer = {
    id:'',
    fullName: '',
    address: '',
    automobileType:''

  }
  constructor(private apollo: Apollo) { }
  ngOnInit(): void {
    this.apollo.watchQuery<any>({
      query: GET_CUSTOMERS
    }).valueChanges
      .subscribe(({ data, loading }) => {
        console.log(loading);
        this.allCustomers = data.customers;
      })
  }


  createCustomer(fullName: string, address: string, automobileType: string) {
    this.apollo
      .mutate({
        mutation: CREATE_CUSTOMER,
        refetchQueries: [{ query: GET_CUSTOMERS}],
        variables: {
          fullName: fullName,
          address: address,
          automobileType: automobileType
        },
      })
      .subscribe(() => {
        console.log("created");
      });
  }
  updateCustomer(){

  }

  deleteCustomer(id: string) {
    console.log(id);
    this.apollo
      .mutate({
        mutation: DELETE_CUSTOMER,
        refetchQueries: [{ query: GET_CUSTOMERS }],
        variables: {
          id: id,
        },
      })
      .subscribe(() => {
        console.log("deleted");
      });
  }

}
