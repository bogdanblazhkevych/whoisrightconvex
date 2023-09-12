import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addSessionId = mutation({
    args: { sessionId: v.string() },
    handler: async (ctx, {sessionId}) => {
        let open = true;
        await ctx.db.insert("rooms", {sessionId, open});
    }
})

export const monitorRoom = query({
    args: { sessionId: v.string() },
    handler: async (ctx, { sessionId }) => {
        //get the room item from it's session id
        try {
            const room = await ctx.db.query('rooms').filter((q) => q.eq(q.field('sessionId'), sessionId)).collect();
            if (room.length !== 0 && !room[0].open) {
                return true
            } else {
                return false
            }
        } catch (error) {
            return false
        }
    }
})

export const findRoom = query({
    args: { sessionId: v.string() },
    handler: async (ctx, { sessionId }) => {
        //get the room itsm from it's session id
        const room = await ctx.db.query('rooms').filter((q) => q.eq(q.field('sessionId'), sessionId)).collect()
        //perform checks on the room
        if (room.length === 0) {
            throw new Error("room does not exist")
        } else if (!room[0].open) {
            throw new Error("room is full")
        } else {
            return room[0].open
        }
    }
})

export const closeRoom = mutation({
    args: { sessionId: v.string() },
    handler: async (ctx, { sessionId }) => {   
        //get the room item from it's session id
        const room = await ctx.db.query("rooms").filter((q) => q.eq(q.field("sessionId"), sessionId)).collect();
        //get the room's _id attirbute because its needed to patch
        const _id = room[0]._id;
        //set the open attribute of the room to false
        await ctx.db.patch(_id, { open: false })
    }
})

export const addMessage = mutation({
    args: { sessionId: v.string(), userId: v.string(), displayName: v.string(), message: v.string() },
    handler: async (ctx, { sessionId, userId, displayName, message }) => {
        //insert message into messages table
        await ctx.db.insert("messages", { sessionId, userId, displayName, message });
    }
})

export const messages = query({
    args: { sessionId: v.string(), displayName: v.string() },
    handler: async (ctx, { sessionId, displayName }) => {
        const messages = await ctx.db.query("messages").filter((q) => q.eq(q.field("sessionId"), sessionId)).collect();
        const messagesToClientSchema = messages.map((message) => {
            let type;
            if (message.displayName === displayName) {
                return { ...message, type: "outgoing"}
            } else {
                return { ...message, type: "incomming"}
            }
        })
        return messagesToClientSchema
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