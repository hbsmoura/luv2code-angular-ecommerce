import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

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
        private luv2ShopFormService: Luv2ShopFormService,
        private cartService: CartService
    ) {
        this.checkoutFormGroup = formBuilder.group({
            customer: this.formBuilder.group({
                firstName: new FormControl('', [
                    Validators.required, Validators.minLength(2),
                    Luv2ShopValidators.notOnlyWhitespace
                ]),
                lastName: new FormControl('', [
                    Validators.required, Validators.minLength(2),
                    Luv2ShopValidators.notOnlyWhitespace
                ]),
                email: new FormControl('', [
                    Validators.required,
                    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
                ])
            }),
            shippingAddress: this.formBuilder.group({
                street: new FormControl('', [
                    Validators.required, Validators.minLength(2),
                    Luv2ShopValidators.notOnlyWhitespace
                ]),
                city: new FormControl('', [
                    Validators.required, Validators.minLength(2),
                    Luv2ShopValidators.notOnlyWhitespace
                ]),
                state: new FormControl('', [Validators.required]),
                country: new FormControl('', [Validators.required]),
                zipCode: new FormControl('', [
                    Validators.required, Validators.minLength(2),
                    Luv2ShopValidators.notOnlyWhitespace
                ])
            }),
            billingAddress: this.formBuilder.group({
                street: new FormControl('', [
                    Validators.required, Validators.minLength(2),
                    Luv2ShopValidators.notOnlyWhitespace
                ]),
                city: new FormControl('', [
                    Validators.required, Validators.minLength(2),
                    Luv2ShopValidators.notOnlyWhitespace
                ]),
                state: new FormControl('', [Validators.required]),
                country: new FormControl('', [Validators.required]),
                zipCode: new FormControl('', [
                    Validators.required, Validators.minLength(2),
                    Luv2ShopValidators.notOnlyWhitespace
                ])
            }),
            creditCard: this.formBuilder.group({
                cardType: new FormControl('', [Validators.required]),
                nameOnCard: new FormControl('', [
                    Validators.required, Validators.minLength(2),
                    Luv2ShopValidators.notOnlyWhitespace
                ]),
                cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
                securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
                expirationMonth: [''],
                expirationYear: ['']
            })
        })
    }

    reviewCartDetails() {
        this.cartService.totalQuantity.subscribe(totalQuantity => this.totalQuantity = totalQuantity)
        this.cartService.totalPrice.subscribe(totalPrice => this.totalPrice = totalPrice)
        this.cartService.shipping.subscribe(shipping => this.shipping = shipping)
    }

    ngOnInit() {
        this.reviewCartDetails()

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

    get firstName() { return this.checkoutFormGroup.get('customer.firstName') }
    get lastName() { return this.checkoutFormGroup.get('customer.lastName') }
    get email() { return this.checkoutFormGroup.get('customer.email') }

    get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street') }
    get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city') }
    get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state') }
    get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country') }
    get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode') }

    get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street') }
    get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city') }
    get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state') }
    get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country') }
    get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode') }

    get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType') }
    get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard') }
    get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber') }
    get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode') }

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
        if (this.checkoutFormGroup.invalid) {
            this.checkoutFormGroup.markAllAsTouched()
        }
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
