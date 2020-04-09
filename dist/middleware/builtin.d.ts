import { Middleware, AnyMiddlewareArgs, SlackActionMiddlewareArgs, SlackCommandMiddlewareArgs, SlackEventMiddlewareArgs, SlackOptionsMiddlewareArgs, SlackViewMiddlewareArgs, SlackEvent, SlackAction, SlackShortcut, SlashCommand, ViewSubmitAction, ViewClosedAction, OptionsRequest } from '../types';
import { ActionConstraints, ViewConstraints, ShortcutConstraints } from '../App';
/**
 * Middleware that filters out any event that isn't an action
 */
export declare const onlyActions: Middleware<AnyMiddlewareArgs & {
    action?: SlackAction;
}>;
/**
 * Middleware that filters out any event that isn't a shortcut
 */
export declare const onlyShortcuts: Middleware<AnyMiddlewareArgs & {
    shortcut?: SlackShortcut;
}>;
/**
 * Middleware that filters out any event that isn't a command
 */
export declare const onlyCommands: Middleware<AnyMiddlewareArgs & {
    command?: SlashCommand;
}>;
/**
 * Middleware that filters out any event that isn't an options
 */
export declare const onlyOptions: Middleware<AnyMiddlewareArgs & {
    options?: OptionsRequest;
}>;
/**
 * Middleware that filters out any event that isn't an event
 */
export declare const onlyEvents: Middleware<AnyMiddlewareArgs & {
    event?: SlackEvent;
}>;
/**
 * Middleware that filters out any event that isn't a view_submission or view_closed event
 */
export declare const onlyViewActions: Middleware<AnyMiddlewareArgs & {
    view?: (ViewSubmitAction | ViewClosedAction);
}>;
/**
 * Middleware that checks for matches given constraints
 */
export declare function matchConstraints(constraints: ActionConstraints | ViewConstraints | ShortcutConstraints): Middleware<SlackActionMiddlewareArgs | SlackOptionsMiddlewareArgs | SlackViewMiddlewareArgs>;
export declare function matchMessage(pattern: string | RegExp): Middleware<SlackEventMiddlewareArgs<'message'>>;
/**
 * Middleware that filters out any command that doesn't match name
 */
export declare function matchCommandName(name: string): Middleware<SlackCommandMiddlewareArgs>;
/**
 * Middleware that filters out any event that isn't of given type
 */
export declare function matchEventType(type: string): Middleware<SlackEventMiddlewareArgs>;
export declare function ignoreSelf(): Middleware<AnyMiddlewareArgs>;
export declare function subtype(subtype: string): Middleware<SlackEventMiddlewareArgs<'message'>>;
export declare function directMention(): Middleware<SlackEventMiddlewareArgs<'message'>>;
//# sourceMappingURL=builtin.d.ts.map