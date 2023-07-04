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
    previousCategoryId = 1
    currentCategoryId = 1
    searchMode = false

    pageNumber = 1
    pageSize = 5
    totalElements = 0

    previousKeyword = ''

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
        this.searchMode = this.route.snapshot.paramMap.has('keyword')

        if (this.searchMode) this.handleSearchProducts()
        else this.handleListProducts()
    }

    handleListProducts() {
        //check if 'id' param is available
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id')

        this.currentCategoryId =
            hasCategoryId ? +this.route.snapshot.paramMap.get('id')! : 1

        if (this.previousCategoryId != this.currentCategoryId) this.pageNumber = 1

        this.previousCategoryId = this.currentCategoryId

        this.productService
            .getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId)
            .subscribe(this.processData())
    }

    handleSearchProducts() {
        const keyword: string = this.route.snapshot.paramMap.get('keyword')!

        if (this.previousKeyword != keyword) this.pageNumber = 1
        this.previousKeyword = keyword

        this.productService
            .searchProductsPaginate(this.pageNumber - 1, this.pageSize, keyword)
            .subscribe(this.processData())
    }

    updatePageSize(pageSize: string) {
        this.pageSize = +pageSize
        this.pageNumber = 1
        this.listProducts()
    }

    processData() {
        return (data: any) => {
            this.products = data._embedded.products
            this.pageNumber = data.page.number + 1
            this.pageSize = data.page.size
            this.totalElements = data.page.totalElements
        }
    }

}
