import {IValidationCheck} from "../interface";

const minLength: IValidationCheck = (params, property, validations, errors) => {
    if (params.hasOwnProperty(property) && params[property].length < validations.minLength) {
        errors.push({property, error: 'Is too short'})
    }
}

export default minLength
