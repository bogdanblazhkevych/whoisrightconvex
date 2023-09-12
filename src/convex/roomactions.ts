'use node';

import crypto from 'crypto'
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from 'convex/values';

export const getSessionId = action({
    args: { displayName: v.string() },
    handler: async (ctx, { displayName }) => {
        //generates a 6 digit session id
        const sessionId = generateCode();
        //adds a room to the room table with its session id
        await ctx.runMutation(api.room.addSessionId, {
            sessionId: sessionId
        });
        //adds user to user table
        let userId: string = await ctx.runMutation(api.room.addUser, {
            displayName: displayName,
            sessionId: sessionId
        })
        //sends sessionId and userId to client
        return {
            sessionId: sessionId,
            userId: userId
        }
    }
})

export const validateSessionId = action({
    args: { sessionId: v.string(), displayName: v.string() },
    handler: async (ctx, { sessionId, displayName }) => {
        try {
            //check if room is open / valic
            const isRoomOpen = await ctx.runQuery(api.room.findRoom, {
                sessionId: sessionId
            });
            //closes room if room is valid
            await ctx.runMutation(api.room.closeRoom, {
                sessionId: sessionId
            })
            //adds user to user table
            let userId: string = await ctx.runMutation(api.room.addUser, {
                displayName: displayName,
                sessionId: sessionId
            })
            //add display name to room participants array
            return {
                validated: true,
                sessionId: sessionId,
                userId: userId,
                error: "no errors"
            }
        } catch (error) {
            return {
                validated: false,
                sessionId: 'no session id',
                userId: 'no user id',
                error: "something went wrong"
            }
        }
    }
})

function generateCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase()
}