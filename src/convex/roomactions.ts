'use node';

import crypto from 'crypto'
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from 'convex/values';

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

//if findRoom
//return roomID 
//set isOpen to false

export const validateSessionId = action({
    args: { sessionId: v.string()},
    handler: async (ctx, { sessionId }) => {
        try {
            const isRoomOpen = await ctx.runQuery(api.room.findRoom, {
                sessionId: sessionId
            });
            await ctx.runMutation(api.room.closeRoom, {
                sessionId: sessionId
            })
            return {
                validated: true,
                data: sessionId
            }
        } catch (error) {
            return {
                validated: false,
                data: "something went wrong"
            }
        }
    }
})

function generateCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase()
}