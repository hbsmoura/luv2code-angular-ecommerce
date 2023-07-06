import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
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

    countries: Country[] = []
    shippingAddressStates: State[] = []
    billingAddressStates: State[] = []

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
            .subscribe(data => {
                this.creditCardYears = data
                this.checkoutFormGroup.get('creditCard')?.get('expirationYear')?.setValue(data[0])
            })

        this.updateExpirationMonth()

        // populate countries
        this.luv2ShopFormService.getCountries().subscribe(data => {
            this.countries = data
        })
    }

    getStates(formGroupName: string) {
        const formGroup = this.checkoutFormGroup.get(formGroupName)

        const countryCode = formGroup?.value.country.code

        this.luv2ShopFormService.getStates(countryCode).subscribe(data => {
            switch (formGroupName) {
                case 'shippingAddress':
                    this.shippingAddressStates = data
                    break;

                case 'billingAddress':
                    this.billingAddressStates = data
                    break;
            }

            formGroup?.get('state')?.setValue(data[0])
        })
    }

    onSubmit() {
        console.log('Handle submit button')
        console.log(this.checkoutFormGroup.get('customer')!.value)
    }

    copyShippingAddressToBillingAddress(event: any) {
        if (event.target.checked) {
            this.checkoutFormGroup.controls['billingAddress']
                .setValue(this.checkoutFormGroup.controls['shippingAddress'].value)

            this.billingAddressStates = this.shippingAddressStates

            return
        }

        this.checkoutFormGroup.controls['billingAddress'].reset()
        this.billingAddressStates = []
    }

    updateExpirationMonth() {
        const currentDate = new Date();

        let selectedYear = +this.checkoutFormGroup.get('creditCard')?.value.expirationYear

        let startMonth = selectedYear === currentDate.getFullYear() ? currentDate.getMonth() + 1 : 1

        this.luv2ShopFormService.getCreditCardMonths(startMonth)
            .subscribe(data => this.creditCardMonths = data)
    }

}
