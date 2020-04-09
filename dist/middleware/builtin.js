"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
/**
 * Middleware that filters out any event that isn't an action
 */
exports.onlyActions = async ({ action, next }) => {
    // Filter out any non-actions
    if (action === undefined) {
        return;
    }
    // It matches so we should continue down this middleware listener chain
    // TODO: remove the non-null assertion operator
    await next();
};
/**
 * Middleware that filters out any event that isn't a shortcut
 */
// tslint:disable-next-line: max-line-length
exports.onlyShortcuts = async ({ shortcut, next }) => {
    // Filter out any non-shortcuts
    if (shortcut === undefined) {
        return;
    }
    // It matches so we should continue down this middleware listener chain
    // TODO: remove the non-null assertion operator
    await next();
};
/**
 * Middleware that filters out any event that isn't a command
 */
exports.onlyCommands = async ({ command, next }) => {
    // Filter out any non-commands
    if (command === undefined) {
        return;
    }
    // It matches so we should continue down this middleware listener chain
    // TODO: remove the non-null assertion operator
    await next();
};
/**
 * Middleware that filters out any event that isn't an options
 */
exports.onlyOptions = async ({ options, next }) => {
    // Filter out any non-options requests
    if (options === undefined) {
        return;
    }
    // It matches so we should continue down this middleware listener chain
    // TODO: remove the non-null assertion operator
    await next();
};
/**
 * Middleware that filters out any event that isn't an event
 */
exports.onlyEvents = async ({ event, next }) => {
    // Filter out any non-events
    if (event === undefined) {
        return;
    }
    // It matches so we should continue down this middleware listener chain
    // TODO: remove the non-null assertion operator
    await next();
};
/**
 * Middleware that filters out any event that isn't a view_submission or view_closed event
 */
exports.onlyViewActions = async ({ view, next }) => {
    // Filter out anything that doesn't have a view
    if (view === undefined) {
        return;
    }
    // It matches so we should continue down this middleware listener chain
    // TODO: remove the non-null assertion operator
    await next();
};
/**
 * Middleware that checks for matches given constraints
 */
function matchConstraints(constraints) {
    return async ({ payload, body, next, context }) => {
        // TODO: is putting matches in an array actually helpful? there's no way to know which of the regexps contributed
        // which matches (and in which order)
        let tempMatches;
        // Narrow type for ActionConstraints
        if ('block_id' in constraints || 'action_id' in constraints) {
            if (!isBlockPayload(payload)) {
                return;
            }
            // Check block_id
            if (constraints.block_id !== undefined) {
                if (typeof constraints.block_id === 'string') {
                    if (payload.block_id !== constraints.block_id) {
                        return;
                    }
                }
                else {
                    tempMatches = payload.block_id.match(constraints.block_id);
                    if (tempMatches !== null) {
                        context['blockIdMatches'] = tempMatches;
                    }
                    else {
                        return;
                    }
                }
            }
            // Check action_id
            if (constraints.action_id !== undefined) {
                if (typeof constraints.action_id === 'string') {
                    if (payload.action_id !== constraints.action_id) {
                        return;
                    }
                }
                else {
                    tempMatches = payload.action_id.match(constraints.action_id);
                    if (tempMatches !== null) {
                        context['actionIdMatches'] = tempMatches;
                    }
                    else {
                        return;
                    }
                }
            }
        }
        // Check callback_id
        if ('callback_id' in constraints && constraints.callback_id !== undefined) {
            let callbackId = '';
            if (isViewBody(body)) {
                callbackId = body['view']['callback_id'];
            }
            else {
                if (isCallbackIdentifiedBody(body)) {
                    callbackId = body['callback_id'];
                }
                else {
                    return;
                }
            }
            if (typeof constraints.callback_id === 'string') {
                if (callbackId !== constraints.callback_id) {
                    return;
                }
            }
            else {
                tempMatches = callbackId.match(constraints.callback_id);
                if (tempMatches !== null) {
                    context['callbackIdMatches'] = tempMatches;
                }
                else {
                    return;
                }
            }
        }
        // Check type
        if ('type' in constraints) {
            if (body.type !== constraints.type)
                return;
        }
        // TODO: remove the non-null assertion operator
        await next();
    };
}
exports.matchConstraints = matchConstraints;
/*
 * Middleware that filters out messages that don't match pattern
 */
function matchMessage(pattern) {
    return async ({ message, context, next }) => {
        let tempMatches;
        if (message.text === undefined) {
            return;
        }
        // Filter out messages that don't contain the pattern
        if (typeof pattern === 'string') {
            if (!message.text.includes(pattern)) {
                return;
            }
        }
        else {
            tempMatches = message.text.match(pattern);
            if (tempMatches !== null) {
                context['matches'] = tempMatches;
            }
            else {
                return;
            }
        }
        // TODO: remove the non-null assertion operator
        await next();
    };
}
exports.matchMessage = matchMessage;
/**
 * Middleware that filters out any command that doesn't match name
 */
function matchCommandName(name) {
    return async ({ command, next }) => {
        // Filter out any commands that are not the correct command name
        if (name !== command.command) {
            return;
        }
        // TODO: remove the non-null assertion operator
        await next();
    };
}
exports.matchCommandName = matchCommandName;
/**
 * Middleware that filters out any event that isn't of given type
 */
function matchEventType(type) {
    return async ({ event, next }) => {
        // Filter out any events that are not the correct type
        if (type !== event.type) {
            return;
        }
        // TODO: remove the non-null assertion operator
        await next();
    };
}
exports.matchEventType = matchEventType;
function ignoreSelf() {
    return async (args) => {
        // When context does not have a botId in it, then this middleware cannot perform its job. Bail immediately.
        if (args.context.botId === undefined) {
            throw new errors_1.ContextMissingPropertyError('botId', 'Cannot ignore events from the app without a bot ID. Ensure authorize callback returns a botId.');
        }
        const botId = args.context.botId;
        const botUserId = args.context.botUserId !== undefined ? args.context.botUserId : undefined;
        if (isEventArgs(args)) {
            // Once we've narrowed the type down to SlackEventMiddlewareArgs, there's no way to further narrow it down to
            // SlackEventMiddlewareArgs<'message'> without a cast, so the following couple lines do that.
            if (args.message !== undefined) {
                const message = args.message;
                // TODO: revisit this once we have all the message subtypes defined to see if we can do this better with
                // type narrowing
                // Look for an event that is identified as a bot message from the same bot ID as this app, and return to skip
                if (message.subtype === 'bot_message' && message.bot_id === botId) {
                    return;
                }
            }
            // Its an Events API event that isn't of type message, but the user ID might match our own app. Filter these out.
            // However, some events still must be fired, because they can make sense.
            const eventsWhichShouldBeKept = [
                'member_joined_channel',
                'member_left_channel',
            ];
            const isEventShouldBeKept = eventsWhichShouldBeKept.includes(args.event.type);
            if (botUserId !== undefined && args.event.user === botUserId && !isEventShouldBeKept) {
                return;
            }
        }
        // If all the previous checks didn't skip this message, then its okay to resume to next
        // TODO: remove the non-null assertion operator
        await args.next();
    };
}
exports.ignoreSelf = ignoreSelf;
function subtype(subtype) {
    return async ({ message, next }) => {
        if (message.subtype === subtype) {
            // TODO: remove the non-null assertion operator
            await next();
        }
    };
}
exports.subtype = subtype;
const slackLink = /<(?<type>[@#!])?(?<link>[^>|]+)(?:\|(?<label>[^>]+))?>/;
function directMention() {
    return async ({ message, context, next }) => {
        // When context does not have a botUserId in it, then this middleware cannot perform its job. Bail immediately.
        if (context.botUserId === undefined) {
            throw new errors_1.ContextMissingPropertyError('botUserId', 'Cannot match direct mentions of the app without a bot user ID. Ensure authorize callback returns a botUserId.');
        }
        if (message.text === undefined) {
            return;
        }
        // Match the message text with a user mention format
        const text = message.text.trim();
        const matches = slackLink.exec(text);
        if (matches === null || // stop when no matches are found
            matches.index !== 0 || // stop if match isn't at the beginning
            // stop if match isn't a user mention with the right user ID
            matches.groups === undefined || matches.groups.type !== '@' || matches.groups.link !== context.botUserId) {
            return;
        }
        // TODO: remove the non-null assertion operator
        await next();
    };
}
exports.directMention = directMention;
function isBlockPayload(payload) {
    return payload.action_id !== undefined;
}
function isCallbackIdentifiedBody(body) {
    return body.callback_id !== undefined;
}
function isViewBody(body) {
    return body.view !== undefined;
}
function isEventArgs(args) {
    return args.event !== undefined;
}
//# sourceMappingURL=builtin.js.map