import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
    checkoutFormGroup: FormGroup
    totalPrice = 0
    totalQuantity = 0
    shipping = 0

    creditCardYears: number[] = []
    creditCardMonths: number[] = []

    constructor(
        private formBuilder: FormBuilder,
        private luv2ShopFormService: Luv2ShopFormService
    ) {
        this.checkoutFormGroup = formBuilder.group({
            customer: this.formBuilder.group({
                firstName: [''],
                lastName: [''],
                email: ['']
            }),
            shippingAddress: this.formBuilder.group({
                street: [''],
                city: [''],
                state: [''],
                country: [''],
                zipCode: ['']
            }),
            billingAddress: this.formBuilder.group({
                street: [''],
                city: [''],
                state: [''],
                country: [''],
                zipCode: ['']
            }),
            creditCard: this.formBuilder.group({
                cardType: [''],
                nameOnCard: [''],
                cardNumber: [''],
                securityCode: [''],
                expirationMonth: [''],
                expirationYear: ['']
            })
        })
    }

    ngOnInit() {
        this.luv2ShopFormService.getCreditCardYears()
            .subscribe(data => this.creditCardYears = data)

        this.updateExpirationMonth()
    }

    onSubmit() {
        console.log('Handle submit button')
        console.log(this.checkoutFormGroup.get('customer')!.value)
    }

    copyShippingAddressToBillingAddress(event: any) {
        if (event.target.checked) {
            this.checkoutFormGroup.controls['billingAddress']
                .setValue(this.checkoutFormGroup.controls['shippingAddress'].value)
            return
        }

        this.checkoutFormGroup.controls['billingAddress'].reset()
    }

    updateExpirationMonth() {
        const currentDate = new Date();

        let selectedYear = +this.checkoutFormGroup.get('creditCard')?.value.expirationYear
        selectedYear = selectedYear < currentDate.getFullYear() ? currentDate.getFullYear() : selectedYear

        let startMonth = selectedYear === currentDate.getFullYear() ? currentDate.getMonth() + 1 : 1

        this.luv2ShopFormService.getCreditCardMonths(startMonth)
            .subscribe(data => this.creditCardMonths = data)
    }

}
