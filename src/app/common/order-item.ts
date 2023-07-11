import { CartItem } from "./cart-item"

export class OrderItem {
    imageUrl: string
    totalQuantity: number
    unitPrice: number
    productId: number

    constructor(cartItem: CartItem){
        this.imageUrl = cartItem.product.imageUrl
        this.totalQuantity = cartItem.quantity
        this.unitPrice = cartItem.product.unitPrice
        this.productId = cartItem.product.id
    }
}
