import { mutation, query } from "./_generated/server";
import { convexToJson, v } from "convex/values";

export const addSessionId = mutation({
    args: { sessionId: v.string() },
    handler: async (ctx, { sessionId }) => {
        await ctx.db.insert("rooms", { sessionId });
    }
})

export const isChatRoomActive = query({
    args: { sessionId: v.string() },
    handler: async (ctx, { sessionId }) => {
        //get users array that have the sessionId attribute
        const usersInRoom = await ctx.db.query('users').filter((q) => q.eq(q.field('sessionId'), sessionId)).collect();
        if (usersInRoom.length === 2) {
            return true
        } else {
            return false
        }
    }
})
export const isRoomOpen = query({
    args: { sessionId: v.string() },
    handler: async (ctx, { sessionId }) => {
        //get users array that have the sessionId attribute
        const usersInRoom = await ctx.db.query('users').filter((q) => q.eq(q.field('sessionId'), sessionId)).collect()
        if (usersInRoom.length === 1) {
            return true
        } else {
            return false
        }
    }
})

export const addMessage = mutation({
    args: { sessionId: v.string(), userId: v.string(), message: v.string() },
    handler: async (ctx, { sessionId, userId, message }) => {
        //insert message into messages table
        await ctx.db.insert("messages", { sessionId, userId, message });

        //get all messages

        //get all user messages (no gpt responses)

        //if user messages even, call mediator and pass all messages
    }
})

export const messages = query({
    args: { sessionId: v.string(), displayName: v.string() },
    handler: async (ctx, { sessionId, displayName }) => {
        //get messages
        const messages = await ctx.db.query("messages").filter((q) => q.eq(q.field("sessionId"), sessionId)).collect();
        console.log(messages)
        let messagesWithDisplayName = messages.map(async (message) => {
            //get user who sent message
            const user = await ctx.db.query("users").filter((q) => q.eq(q.field("_id"), message.userId)).first();
            if (user?.displayName === displayName) {
                return { ...message, type: "outgoing", displayName: user.displayName }
            } else {
                return { ...message, type: "incomming", displayName: user?.displayName }
            }
        })
        
        try {
            let messagesToClientSchema = Promise.all(messagesWithDisplayName);
            return messagesToClientSchema
        } catch (error) {
            //TODO handle error:
            console.log("please dont :(")   
        }
    }
})

export const addUser = mutation({
    args: { displayName: v.string(), sessionId: v.string() },
    handler: async (ctx, { displayName, sessionId }) => {
        return await ctx.db.insert("users", { displayName, sessionId });
    }
})

export const getRoomInfo = query({
    args: { sessionId: v.string() },
    handler: async (ctx, { sessionId }) => {
        const userItemsInRoom = await ctx.db.query("users").filter((q) => q.eq(q.field("sessionId"), sessionId)).collect()
        const usersInRoom = userItemsInRoom.map((user) => {
            return user.displayName
        });
        return {
            sessionId: sessionId,
            users: usersInRoom
        }
    }
})