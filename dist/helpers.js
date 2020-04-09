"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Internal data type for capturing the class of event processed in App#onIncomingEvent()
 */
var IncomingEventType;
(function (IncomingEventType) {
    IncomingEventType[IncomingEventType["Event"] = 0] = "Event";
    IncomingEventType[IncomingEventType["Action"] = 1] = "Action";
    IncomingEventType[IncomingEventType["Command"] = 2] = "Command";
    IncomingEventType[IncomingEventType["Options"] = 3] = "Options";
    IncomingEventType[IncomingEventType["ViewAction"] = 4] = "ViewAction";
    IncomingEventType[IncomingEventType["Shortcut"] = 5] = "Shortcut";
})(IncomingEventType = exports.IncomingEventType || (exports.IncomingEventType = {}));
/**
 * Helper which finds the type and channel (if any) that any specific incoming event is related to.
 *
 * This is analogous to WhenEventHasChannelContext and the conditional type that checks SlackAction for a channel
 * context.
 */
function getTypeAndConversation(body) {
    if (body.event !== undefined) {
        const eventBody = body;
        return {
            type: IncomingEventType.Event,
            conversationId: eventBody.event.channel !== undefined ? eventBody.event.channel :
                eventBody.event.item !== undefined ? eventBody.event.item.channel : undefined,
        };
    }
    if (body.command !== undefined) {
        return {
            type: IncomingEventType.Command,
            conversationId: body.channel_id,
        };
    }
    if (body.name !== undefined || body.type === 'block_suggestion') {
        const optionsBody = body;
        return {
            type: IncomingEventType.Options,
            conversationId: optionsBody.channel !== undefined ? optionsBody.channel.id : undefined,
        };
    }
    if (body.actions !== undefined || body.type === 'dialog_submission') {
        const actionBody = body;
        return {
            type: IncomingEventType.Action,
            conversationId: actionBody.channel !== undefined ? actionBody.channel.id : undefined,
        };
    }
    if (body.type === 'shortcut') {
        return {
            type: IncomingEventType.Shortcut,
        };
    }
    if (body.type === 'message_action') {
        const shortcutBody = body;
        return {
            type: IncomingEventType.Shortcut,
            conversationId: shortcutBody.channel !== undefined ? shortcutBody.channel.id : undefined,
        };
    }
    if (body.type === 'view_submission' || body.type === 'view_closed') {
        return {
            type: IncomingEventType.ViewAction,
        };
    }
    return {};
}
exports.getTypeAndConversation = getTypeAndConversation;
/* istanbul ignore next */
/** Helper that should never be called, but is useful for exhaustiveness checking in conditional branches */
function assertNever(x) {
    throw new Error(`Unexpected object: ${x}`);
}
exports.assertNever = assertNever;
//# sourceMappingURL=helpers.js.map