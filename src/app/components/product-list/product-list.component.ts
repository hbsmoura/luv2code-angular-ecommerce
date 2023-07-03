import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

    products: Product[] = []
    currentCategoryId: number = 1;

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute
    ) {
        this.listProducts()
    }

    ngOnInit(): void {
        this.route.params.subscribe(() => this.listProducts())
    }

    listProducts() {

        //check if 'id' param is available
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id')

        this.currentCategoryId =
            hasCategoryId ? +this.route.snapshot.paramMap.get('id')! : 1

        this.productService.getProductList(this.currentCategoryId).subscribe(data => this.products = data)
    }

}
