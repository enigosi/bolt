export interface CodedError extends Error {
    code: string;
}
export declare enum ErrorCode {
    AppInitializationError = "slack_bolt_app_initialization_error",
    AuthorizationError = "slack_bolt_authorization_error",
    ContextMissingPropertyError = "slack_bolt_context_missing_property_error",
    ReceiverMultipleAckError = "slack_bolt_receiver_ack_multiple_error",
    ReceiverAuthenticityError = "slack_bolt_receiver_authenticity_error",
    MultipleListenerError = "slack_bolt_multiple_listener_error",
    /**
     * This value is used to assign to errors that occur inside the framework but do not have a code, to keep interfaces
     * in terms of CodedError.
     */
    UnknownError = "slack_bolt_unknown_error"
}
export declare function asCodedError(error: CodedError | Error): CodedError;
export declare class AppInitializationError extends Error implements CodedError {
    code: ErrorCode;
}
export declare class AuthorizationError extends Error implements CodedError {
    code: ErrorCode;
    original: Error;
    constructor(message: string, original: Error);
}
export declare class ContextMissingPropertyError extends Error implements CodedError {
    code: ErrorCode;
    missingProperty: string;
    constructor(missingProperty: string, message: string);
}
export declare class ReceiverMultipleAckError extends Error implements CodedError {
    code: ErrorCode;
    constructor();
}
export declare class ReceiverAuthenticityError extends Error implements CodedError {
    code: ErrorCode;
}
export declare class MultipleListenerError extends Error implements CodedError {
    code: ErrorCode;
    originals: Error[];
    constructor(originals: Error[]);
}
export declare class UnknownError extends Error implements CodedError {
    code: ErrorCode;
    original: Error;
    constructor(original: Error);
}
//# sourceMappingURL=errors.d.ts.map