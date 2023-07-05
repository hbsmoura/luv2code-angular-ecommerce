import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cartItems: CartItem[] = []
    totalPrice: Subject<number> = new Subject()
    totalQuantity: Subject<number> = new Subject()

    constructor() { }

    addToCart(cartItem: CartItem) {
        // findIndex method returns -1 if they array is empty or the item is not found
        let existingCartIndex = this.cartItems
            .findIndex(item => item.product.id === cartItem.product.id)


        if (existingCartIndex > -1) {
            this.cartItems[existingCartIndex].quantity++
        } else {
            this.cartItems.push(cartItem)
        }

        this.computeCartTotals()
    }

    decrementQuantity(cartItem: CartItem) {
        let existingCartIndex = this.cartItems
            .findIndex(item => item.product.id === cartItem.product.id)

        if (existingCartIndex > -1) this.cartItems[existingCartIndex].quantity--

        if (this.cartItems[existingCartIndex].quantity < 1) this.removeItem(cartItem)

        this.computeCartTotals()
    }

    removeItem(cartItem: CartItem) {
        let existingCartIndex = this.cartItems
            .findIndex(item => item.product.id === cartItem.product.id)

        if (existingCartIndex > -1) this.cartItems.splice(existingCartIndex, 1)

        this.computeCartTotals()
    }

    computeCartTotals() {
        this.totalPrice.next(this.cartItems.reduce(
            (acc, curr) => acc + (curr.product.unitPrice * curr.quantity), 0
        ))

        this.totalQuantity.next(this.cartItems.reduce(
            (acc, curr) => acc + curr.quantity, 0
        ))
    }
}
