import {IValidationCheck} from "../interface";

const minValue: IValidationCheck = (params, property, validations, errors) => {
    if (params.hasOwnProperty(property) && params[property] < validations.minValue) {
        errors.push({property, error: 'Is less than min value'})
    }
}

export default minValue;
