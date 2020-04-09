"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
/**
 * Default implementation of ConversationStore, which stores data in memory.
 *
 * This should not be used in situations where there is more than once instance of the app running because state will
 * not be shared amongst the processes.
 */
class MemoryStore {
    constructor() {
        this.state = new Map();
    }
    set(conversationId, value, expiresAt) {
        return new Promise((resolve) => {
            this.state.set(conversationId, { value, expiresAt });
            resolve();
        });
    }
    get(conversationId) {
        return new Promise((resolve, reject) => {
            const entry = this.state.get(conversationId);
            if (entry !== undefined) {
                if (entry.expiresAt !== undefined && Date.now() > entry.expiresAt) {
                    // release the memory
                    this.state.delete(conversationId);
                    reject(new Error('Conversation expired'));
                }
                resolve(entry.value);
            }
            reject(new Error('Conversation not found'));
        });
    }
}
exports.MemoryStore = MemoryStore;
/**
 * Conversation context global middleware.
 *
 * This middleware allows listeners (and other middleware) to store state related to the conversationId of an incoming
 * event using the `context.updateConversation()` function. That state will be made available in future events that
 * take place in the same conversation by reading from `context.conversation`.
 *
 * @param store storage backend used to store and retrieve all conversation state
 * @param logger a logger
 */
function conversationContext(store, logger) {
    return async (args) => {
        const { body, context, next } = args;
        const { conversationId } = helpers_1.getTypeAndConversation(body);
        if (conversationId !== undefined) {
            // TODO: expiresAt is not passed through to store.set
            context.updateConversation = (conversation) => store.set(conversationId, conversation);
            store.get(conversationId)
                .then((conversationState) => {
                context.conversation = conversationState;
                logger.debug(`Conversation context loaded for ID ${conversationId}`);
            })
                .catch((error) => {
                logger.debug(`Conversation context not loaded: ${error.message}`);
            })
                .then(next)
                .catch(error => logger.debug(error.message));
        }
        else {
            logger.debug('No conversation ID for incoming event');
            // TODO: remove the non-null assertion operator
            await next();
        }
    };
}
exports.conversationContext = conversationContext;
//# sourceMappingURL=conversation-store.js.map