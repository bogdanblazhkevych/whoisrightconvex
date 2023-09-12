'use node';

import crypto from 'crypto'
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const getSessionId = action({
    args: {},
    handler: async (ctx) => {
        const sessionId = generateCode();
        await ctx.runMutation(api.room.addSessionId, {
            sessionId: sessionId
        });
        return sessionId
    }
})

function generateCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase()
}