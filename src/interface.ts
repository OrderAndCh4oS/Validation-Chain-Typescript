export interface IValidationChain {
    add: (this: IValidationChain, validationCheck: IValidationCheck) => IValidationChain;
    validate: (params: any, validateParams: IValidateParams) => IValidationErrorMessage[]
}

export interface IValidationChecks {
    [property: string]: IValidationCheck
}

export interface IValidationCheck {
    (params: any, property: string, validation: IValidations, errors: IValidationErrorMessage[]): void
}

export interface IValidationErrorMessage {
    property: string,
    error: string
}

export interface IValidateParams {
    [property: string]: IValidations
}

export interface IValidations {
    [property: string]: any
}
