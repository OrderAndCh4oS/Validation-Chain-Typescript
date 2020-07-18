interface IValidationChain {
    add: (this: IValidationChain, validationCheck: IValidationCheck) => IValidationChain;
    validate: (params: any, validateParams: IValidateParams[]) => IValidationErrorMessage[]
}

interface IValidationChecks {
    [property: string]: IValidationCheck
}

interface IValidationCheck {
    (params: any, validateParam: IValidations, errors: IValidationErrorMessage[]): void
}

interface IValidationErrorMessage {
    property: string,
    error: string
}

interface IValidateParams {
    property: string,
    validations: IValidations
}

interface IValidations {
    [property: string]: any
}

export const required: IValidationCheck = (params, {property, validations}, errors) => {
    if (validations.required && !params.hasOwnProperty(property)) {
        errors.push({property, error: 'Is required'})
    }
}

export const minValue: IValidationCheck = (params, {property, validations}, errors) => {
    if (params.hasOwnProperty(property) && params[property] < validations.minValue) {
        errors.push({property, error: 'Is less than min value'})
    }
}

export const maxValue: IValidationCheck = (params, {property, validations}, errors) => {
    if (params.hasOwnProperty(property) && params[property] > validations.maxValue) {
        errors.push({property, error: 'Is greater than max value'})
    }
}

export const minLength: IValidationCheck = (params, {property, validations}, errors) => {
    if (params.hasOwnProperty(property) && params[property].length < validations.minLength) {
        errors.push({property, error: 'Is too short'})
    }
}

export const maxLength: IValidationCheck = (params, {property, validations}, errors) => {
    if (params.hasOwnProperty(property) && params[property].length > validations.maxLength) {
        errors.push({property, error: 'Is too long'})
    }
}

export const isType: IValidationCheck = (params, {property, validations}, errors) => {
    if (params.hasOwnProperty(property) && typeof params[property] !== validations.isType) {
        errors.push({property, error: `Is wrong type ${typeof params[property]} should be ${validations.isType}`})
    }
}

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

    const validate = (params: any, validateParams: IValidateParams[]): IValidationErrorMessage[] => {
        const errors: IValidationErrorMessage[] = [];
        for (const validateParam of validateParams) {
            for (const validation of Object.keys(validateParam.validations)) {
                if (!validationChecks.hasOwnProperty(validation))
                    throw new Error(`Validation not handled: ${validation}. Add a validation check for this.`)
                validationChecks[validation](params, validateParam, errors);
            }
        }
        const allowedKeys = validateParams.map(vp => vp.property);
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
    aNumber: 12345
}

const validObj: any = {
    aString: 'asfasf',
    aStringTwo: '1421asasf4',
    aStringThree: 'asfas',
    aNumber: 80
}

const validateObj: IValidateParams[] = [
    {
        property: 'aString',
        validations: {
            required: true,
            isType: 'string'
        },
    },
    {
        property: 'aStringTwo',
        validations: {
            required: true,
            isType: 'string'
        },
    },
    {
        property: 'aStringThree',
        validations: {
            required: true,
            isType: 'string',
            minLength: 3,
            maxLength: 5,
        },
    },
    {
        property: 'aNumber',
        validations: {
            required: true,
            isType: 'number',
            minValue: 10,
            maxValue: 100
        },
    },
]

let errors = validationChain(required, isType, minValue, maxValue, minLength, maxLength)
    .validate(invalidObj, validateObj);

console.log('some errors', errors);

errors = validationChain(required, isType, minValue, maxValue, minLength, maxLength)
    .validate(validObj, validateObj);

console.log('no errors: ', errors);
