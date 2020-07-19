import {IValidationCheck} from "../interface";

const isType: IValidationCheck = (params, property, validations, errors) => {
    if (params.hasOwnProperty(property) && typeof params[property] !== validations.isType) {
        errors.push({property, error: `Is wrong type ${typeof params[property]} should be ${validations.isType}`})
    }
}

export default isType
