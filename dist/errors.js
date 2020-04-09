"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["AppInitializationError"] = "slack_bolt_app_initialization_error";
    ErrorCode["AuthorizationError"] = "slack_bolt_authorization_error";
    ErrorCode["ContextMissingPropertyError"] = "slack_bolt_context_missing_property_error";
    ErrorCode["ReceiverMultipleAckError"] = "slack_bolt_receiver_ack_multiple_error";
    ErrorCode["ReceiverAuthenticityError"] = "slack_bolt_receiver_authenticity_error";
    ErrorCode["MultipleListenerError"] = "slack_bolt_multiple_listener_error";
    /**
     * This value is used to assign to errors that occur inside the framework but do not have a code, to keep interfaces
     * in terms of CodedError.
     */
    ErrorCode["UnknownError"] = "slack_bolt_unknown_error";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
function asCodedError(error) {
    if (error.code !== undefined) {
        return error;
    }
    return new UnknownError(error);
}
exports.asCodedError = asCodedError;
class AppInitializationError extends Error {
    constructor() {
        super(...arguments);
        this.code = ErrorCode.AppInitializationError;
    }
}
exports.AppInitializationError = AppInitializationError;
class AuthorizationError extends Error {
    constructor(message, original) {
        super(message);
        this.code = ErrorCode.AuthorizationError;
        this.original = original;
    }
}
exports.AuthorizationError = AuthorizationError;
class ContextMissingPropertyError extends Error {
    constructor(missingProperty, message) {
        super(message);
        this.code = ErrorCode.ContextMissingPropertyError;
        this.missingProperty = missingProperty;
    }
}
exports.ContextMissingPropertyError = ContextMissingPropertyError;
class ReceiverMultipleAckError extends Error {
    constructor() {
        super("The receiver's `ack` function was called multiple times.");
        this.code = ErrorCode.ReceiverMultipleAckError;
    }
}
exports.ReceiverMultipleAckError = ReceiverMultipleAckError;
class ReceiverAuthenticityError extends Error {
    constructor() {
        super(...arguments);
        this.code = ErrorCode.ReceiverAuthenticityError;
    }
}
exports.ReceiverAuthenticityError = ReceiverAuthenticityError;
class MultipleListenerError extends Error {
    constructor(originals) {
        super('Multiple errors occurred while handling several listeners. The `originals` property contains an array of each error.');
        this.code = ErrorCode.MultipleListenerError;
        this.originals = originals;
    }
}
exports.MultipleListenerError = MultipleListenerError;
class UnknownError extends Error {
    constructor(original) {
        super(original.message);
        this.code = ErrorCode.UnknownError;
        this.original = original;
    }
}
exports.UnknownError = UnknownError;
//# sourceMappingURL=errors.js.map