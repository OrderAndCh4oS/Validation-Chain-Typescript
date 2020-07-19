import {IValidationCheck} from "../interface";

const maxValue: IValidationCheck = (params, property, validations, errors) => {
    if (params.hasOwnProperty(property) && params[property] > validations.maxValue) {
        errors.push({property, error: 'Is greater than max value'})
    }
}

export default maxValue
