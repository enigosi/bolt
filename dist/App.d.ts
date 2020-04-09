/// <reference types="node" />
import { Agent } from 'http';
import { SecureContextOptions } from 'tls';
import { WebClient, WebClientOptions } from '@slack/web-api';
import { Logger, LogLevel } from '@slack/logger';
import { ExpressReceiverOptions } from './ExpressReceiver';
import { ConversationStore } from './conversation-store';
import { Middleware, AnyMiddlewareArgs, SlackActionMiddlewareArgs, SlackCommandMiddlewareArgs, SlackEventMiddlewareArgs, SlackOptionsMiddlewareArgs, SlackShortcutMiddlewareArgs, SlackViewMiddlewareArgs, SlackAction, SlackShortcut, OptionsSource, BlockAction, SlackViewAction, Receiver, ReceiverEvent } from './types';
import { CodedError } from './errors';
/** App initialization options */
export interface AppOptions {
    signingSecret?: ExpressReceiverOptions['signingSecret'];
    endpoints?: ExpressReceiverOptions['endpoints'];
    processBeforeResponse?: ExpressReceiverOptions['processBeforeResponse'];
    agent?: Agent;
    clientTls?: Pick<SecureContextOptions, 'pfx' | 'key' | 'passphrase' | 'cert' | 'ca'>;
    convoStore?: ConversationStore | false;
    token?: AuthorizeResult['botToken'];
    botId?: AuthorizeResult['botId'];
    botUserId?: AuthorizeResult['botUserId'];
    authorize?: Authorize;
    receiver?: Receiver;
    logger?: Logger;
    logLevel?: LogLevel;
    ignoreSelf?: boolean;
    clientOptions?: Pick<WebClientOptions, 'slackApiUrl'>;
}
export { LogLevel, Logger } from '@slack/logger';
/** Authorization function - seeds the middleware processing and listeners with an authorization context */
export interface Authorize {
    (source: AuthorizeSourceData, body: AnyMiddlewareArgs['body']): Promise<AuthorizeResult>;
}
/** Authorization function inputs - authenticated data about an event for the authorization function */
export interface AuthorizeSourceData {
    teamId: string;
    enterpriseId?: string;
    userId?: string;
    conversationId?: string;
}
/** Authorization function outputs - data that will be available as part of event processing */
export interface AuthorizeResult {
    botToken?: string;
    userToken?: string;
    botId?: string;
    botUserId?: string;
    [key: string]: any;
}
export interface ActionConstraints<A extends SlackAction = SlackAction> {
    type?: A['type'];
    block_id?: A extends BlockAction ? (string | RegExp) : never;
    action_id?: A extends BlockAction ? (string | RegExp) : never;
    callback_id?: Extract<A, {
        callback_id?: string;
    }> extends any ? (string | RegExp) : never;
}
export interface ShortcutConstraints<S extends SlackShortcut = SlackShortcut> {
    type?: S['type'];
    callback_id?: string | RegExp;
}
export interface ViewConstraints {
    callback_id?: string | RegExp;
    type?: 'view_closed' | 'view_submission';
}
export interface ErrorHandler {
    (error: CodedError): Promise<void>;
}
/**
 * A Slack App
 */
export default class App {
    /** Slack Web API client */
    client: WebClient;
    private clientOptions;
    private clients;
    /** Receiver - ingests events from the Slack platform */
    private receiver;
    /** Logger */
    private logger;
    /** Authorize */
    private authorize;
    /** Global middleware chain */
    private middleware;
    /** Listener middleware chains */
    private listeners;
    private errorHandler;
    private axios;
    constructor({ signingSecret, endpoints, agent, clientTls, receiver, convoStore, token, botId, botUserId, authorize, logger, logLevel, ignoreSelf, clientOptions, processBeforeResponse, }?: AppOptions);
    /**
     * Register a new middleware, processed in the order registered.
     *
     * @param m global middleware function
     */
    use(m: Middleware<AnyMiddlewareArgs>): this;
    /**
     * Convenience method to call start on the receiver
     *
     * TODO: args could be defined using a generic constraint from the receiver type
     *
     * @param args receiver-specific start arguments
     */
    start(...args: any[]): Promise<unknown>;
    stop(...args: any[]): Promise<unknown>;
    event<EventType extends string = string>(eventName: EventType, ...listeners: Middleware<SlackEventMiddlewareArgs<EventType>>[]): void;
    message(...listeners: Middleware<SlackEventMiddlewareArgs<'message'>>[]): void;
    message(pattern: string | RegExp, ...listeners: Middleware<SlackEventMiddlewareArgs<'message'>>[]): void;
    shortcut<Shortcut extends SlackShortcut = SlackShortcut>(callbackId: string | RegExp, ...listeners: Middleware<SlackShortcutMiddlewareArgs<Shortcut>>[]): void;
    shortcut<Shortcut extends SlackShortcut = SlackShortcut, Constraints extends ShortcutConstraints<Shortcut> = ShortcutConstraints<Shortcut>>(constraints: Constraints, ...listeners: Middleware<SlackShortcutMiddlewareArgs<Extract<Shortcut, {
        type: Constraints['type'];
    }>>>[]): void;
    action<Action extends SlackAction = SlackAction>(actionId: string | RegExp, ...listeners: Middleware<SlackActionMiddlewareArgs<Action>>[]): void;
    action<Action extends SlackAction = SlackAction, Constraints extends ActionConstraints<Action> = ActionConstraints<Action>>(constraints: Constraints, ...listeners: Middleware<SlackActionMiddlewareArgs<Extract<Action, {
        type: Constraints['type'];
    }>>>[]): void;
    command(commandName: string, ...listeners: Middleware<SlackCommandMiddlewareArgs>[]): void;
    options<Source extends OptionsSource = OptionsSource>(actionId: string | RegExp, ...listeners: Middleware<SlackOptionsMiddlewareArgs<Source>>[]): void;
    options<Source extends OptionsSource = OptionsSource>(constraints: ActionConstraints, ...listeners: Middleware<SlackOptionsMiddlewareArgs<Source>>[]): void;
    view<ViewActionType extends SlackViewAction = SlackViewAction>(callbackId: string | RegExp, ...listeners: Middleware<SlackViewMiddlewareArgs<ViewActionType>>[]): void;
    view<ViewActionType extends SlackViewAction = SlackViewAction>(constraints: ViewConstraints, ...listeners: Middleware<SlackViewMiddlewareArgs<ViewActionType>>[]): void;
    error(errorHandler: ErrorHandler): void;
    /**
     * Handles events from the receiver
     */
    processEvent(event: ReceiverEvent): Promise<void>;
    /**
     * Global error handler. The final destination for all errors (hopefully).
     */
    private handleError;
}
//# sourceMappingURL=App.d.ts.map