import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
        return ((control.value != null) && (control.value.trim().length < 1)) ?
            {'notOnlyWhitespace': true} : null
    }
}
