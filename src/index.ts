import {
    IValidateParams,
    IValidationChain,
    IValidationCheck,
    IValidationChecks,
    IValidationErrorMessage
} from "./interface";
import required from "./validations/required";
import isType from "./validations/is-type";
import minValue from "./validations/min-value";
import maxValue from "./validations/max-value";
import minLength from "./validations/min-length";
import maxLength from "./validations/max-length";

function validationChain(...initialValidationChecks: IValidationCheck[]): IValidationChain {
    const validationChecks: IValidationChecks = {
        ...initialValidationChecks.reduce((obj: IValidationChecks, ivc: IValidationCheck) => ({
            ...obj,
            [ivc.name]: ivc
        }), {})
    };

    function add(this: IValidationChain, validationCheck: IValidationCheck): IValidationChain {
        validationChecks[validationCheck.name] = validationCheck;
        return this;
    }

    const validate = (params: any, validateParams: IValidateParams): IValidationErrorMessage[] => {
        const errors: IValidationErrorMessage[] = [];
        for (const [property, validations] of Object.entries(validateParams)) {
            for (const validation of Object.keys(validations)) {
                if (!validationChecks.hasOwnProperty(validation))
                    throw new Error(`Validation not handled: ${validation}. Add a validation check for this.`)
                validationChecks[validation](params, property, validations, errors);
            }
        }
        const allowedKeys = Object.keys(validateParams).map(property => property);
        for (const property of Object.keys(params)) {
            if (!allowedKeys.find(ak => ak === property)) {
                errors.push({property, error: 'Is not allowed'});
            }
        }

        return errors;
    }

    return {
        add,
        validate
    }
}

const invalidObj: any = {
    aStringTwo: 14214,
    aStringThree: 'asfasfsasaf',
    aStringFour: 'asfas',
    aNumber: 12345
}

const validObj: any = {
    aString: 'asfasf',
    aStringTwo: '1421asasf4',
    aStringThree: 'asfas',
    aNumber: 80
}

const validateObj: IValidateParams = {
    aString: {
        required: true,
        isType: 'string'
    },
    aStringTwo: {
        required: true,
        isType: 'string'
    },
    aStringThree: {
        required: true,
        isType: 'string',
        minLength: 3,
        maxLength: 5,
    },
    aStringFour: {
        required: false,
        isType: 'string'
    },
    aNumber: {
        required: true,
        isType: 'number',
        minValue: 10,
        maxValue: 100
    },
}

let errors = validationChain(required, isType, minValue, maxValue, minLength, maxLength)
    .validate(invalidObj, validateObj);

console.log('some errors', errors);

errors = validationChain(required, isType, minValue, maxValue, minLength, maxLength)
    .validate(validObj, validateObj);

console.log('no errors: ', errors);
