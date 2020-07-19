import {IValidationCheck} from "../interface";

const required: IValidationCheck = (params, property, validations, errors) => {
    if (validations.required && !params.hasOwnProperty(property)) {
        errors.push({property, error: 'Is required'})
    }
}

export default required;
