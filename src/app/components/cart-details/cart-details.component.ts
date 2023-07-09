import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
    cartItems: CartItem[] = []
    totalPrice = 0
    totalQuantity = 0
    shipping = 0

    constructor(private cartService: CartService) {}

    ngOnInit(): void {
        this.listCartItems()
    }

    listCartItems() {
        this.cartItems = this.cartService.cartItems
        this.cartService.totalPrice.subscribe(data => this.totalPrice = data)
        this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data)
        this.cartService.shipping.subscribe(data => this.shipping = data)

        this.cartService.computeCartTotals()
    }

    changeQuantity(cartItem: CartItem, operation: number) {
        switch (operation) {
            case -1: {
                this.cartService.decrementQuantity(cartItem)
                break
            }
            case 0: {
                this.cartService.removeItem(cartItem)
                break
            }
            case 1: {
                this.cartService.addToCart(cartItem)
            }
        }
    }
}
