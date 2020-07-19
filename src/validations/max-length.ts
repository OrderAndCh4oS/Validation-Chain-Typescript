import {IValidationCheck} from "../interface";

const maxLength: IValidationCheck = (params, property, validations, errors) => {
    if (params.hasOwnProperty(property) && params[property].length > validations.maxLength) {
        errors.push({property, error: 'Is too long'})
    }
}

export default maxLength
