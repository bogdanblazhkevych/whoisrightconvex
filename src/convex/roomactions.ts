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
    handler: async (ctx, {sessionId, displayName}) => {
        try {
            const getChatRoomUserCount = await ctx.runQuery(api.room.getChatRoomUserCount, { sessionId: sessionId });
            //room is only joinable if there is one other user in the room
            if (getChatRoomUserCount === 1) {
                //add user
                let userId: string = await ctx.runMutation(api.room.addUser, {
                    displayName: displayName,
                    sessionId: sessionId
                })
                //add initial message
                await ctx.runMutation(api.room.addMessage, {
                    sessionId: sessionId,
                    userId: "Mediator", 
                    message: "greetings! what can I resolve today",
                    displayName: "Mediator"
                })
                //return data
                return {
                    validated: true,
                    sessionId: sessionId,
                    userId: userId,
                    error: "no errors"
                }
            } else {
                //return data
                return {
                    validated: false,
                    sessionId: '',
                    userId: '',
                    error: "room is full or can not be found"
                }
            }
        } catch (error) {
            //return data
            return {
                validated: false,
                sessionId: '',
                    userId: '',
                    error: "room is full or can not be found"
            }
        }
    }
})

function generateCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase()
}