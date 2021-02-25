import { Component, OnInit } from "@angular/core";
import { Logic } from './../../models/app.logic';
import {ProductInfo} from './../../models/app.product.model';
import { Categories, Manufacturers } from "./../../models/app.constants";
@Component({
  selector: 'app-product-component',
  templateUrl:'app.product.view.html'
})
export class ProductComponent implements OnInit{  // the OnInit is implemented by Component
    product: ProductInfo;
    products: Array<ProductInfo>;
    private logic:Logic;
    columnHeaders:Array<string>;
    // save constants array data into local public properties
    categories = Categories;
    manufacturers = Manufacturers;
    constructor(){
      this.product = new ProductInfo(0, '', '', '', '','',0);
      this.products = new Array<ProductInfo>();
      this.logic = new Logic();
      this.columnHeaders = new Array<string>();
      console.log('Constructor Called');
    }

    ngOnInit():void {
      console.log('ng on init Called');
      // read all public data members' name of the ProductInfo class and add
      // it in columnHeaders array
      this.columnHeaders = Object.keys(this.product);
      console.log(this.columnHeaders);
        // read all products
      this.products = this.logic.getProducts();
    }

    clear():void {
      this.product = new ProductInfo(0, '', '', '', '','',0);
    }

    save():void {
      //GetProductRowIds Array
      let ProductIds = this.extractColumn(this.logic.getProducts(),'ProductRowId')
      let lastProductId = Math.max(...ProductIds)
      this.product.ProductRowId = lastProductId + 1;
      this.products = this.logic.addProduct(this.product);
      this.clear();
    }

    getSelectedProduct(prd:ProductInfo):void {
      // this.product = prd;
      // use Object.assign(target, source);
      // target is an object in which source will be copied with its schema and values
      // but source and target are physicallyu different objects
      this.product = Object.assign({}, prd);
    }

    deleteRow(prd: ProductInfo):void {
      this.products = this.products.filter((p)=>p.ProductRowId != prd.ProductRowId)
    }

    sort():void {
      this.sortData(this.products, "ProductName","BasePrice");
      //console.log(`After sorting: ${JSON.stringify(this.products)} `);

    }

    reverse():void {
      console.log(`reverse works`)
      this.sortData(this.products, "ProductRowId", "ProductRowId")
    }

    extractColumn (arr: Array<ProductInfo>, column: string): Array<number> {
      return arr.map(x => x[column])
    }

    sortData (list: ProductInfo[], sortColumn1: any, sortColumn2: any) {
      list.sort((a, b) => {
        let sortaValue;
        let sortbValue;

        if (typeof(a[sortColumn1]) === 'string'){
          sortaValue = a[sortColumn1].toUpperCase();
          sortbValue = b[sortColumn1].toUpperCase();
        }
        else{
          sortaValue = a[sortColumn1];
          sortbValue = b[sortColumn2];
        }

        if (sortaValue > sortbValue) 
          return 1
        else if (sortaValue < sortbValue)
          return -1
        else
          //Sorting of same product name >> by basePrice
          return Number(a[sortColumn2]) > Number(b[sortColumn2]) ? 1: -1      
        });
      return list;
    }
}
