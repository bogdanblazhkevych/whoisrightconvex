import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { GenericQueryCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";

const sessionIDValidaton = { sessionId: v.string() } as const;

export const addSessionId = mutation({
    args: sessionIDValidaton,
    handler: async (ctx, { sessionId }) => {
        // Validation?
        await ctx.db.insert("rooms", { sessionId });
    }
})

export const getChatRoomUserCount = query({
    args: sessionIDValidaton,
    handler: async (ctx, {sessionId}) => {
        //gets array of users in room
        const usersInRoom = await getUsersInRoom(ctx, sessionId);
        return usersInRoom.length
    }
})

export const addMessage = mutation({
    args: { ...sessionIDValidaton, userId: v.union(v.id("users"), v.string()), message: v.string(), displayName: v.string() },
    handler: async (ctx, { sessionId, userId, message, displayName }) => {
        //insert message into messages table
        //probably need some validation
        await ctx.db.insert("messages", { sessionId, userId, message });
        //get all messages 
        const messages = await ctx.db.query("messages").filter((q) => q.eq(q.field("sessionId"), sessionId)).collect();
        //deciding wether or not mediator should send a message
        if (messages.length % 3 === 0) {
            //gets additional attributes for messages because gpt needs a "name"
            const messagesWithDisplayNameAndType = await mapMessagesToIncludeDisplayNameAndType(ctx, messages, displayName);
            await ctx.scheduler.runAfter(0, api.mediator.chat, {
                messages: messagesWithDisplayNameAndType
            });
        }
    }
})

export const messages = query({
    args: { ...sessionIDValidaton, displayName: v.string() },
    handler: async (ctx, { sessionId, displayName }) => {
        //get messages
        const messages = await ctx.db.query("messages").filter((q) => q.eq(q.field("sessionId"), sessionId)).collect();
        //add display name and type: "outgoing" | "incomming" to messages before sending to client
        return await mapMessagesToIncludeDisplayNameAndType(ctx, messages, displayName)
    }
})

export const addUser = mutation({
    args: { displayName: v.string(), ...sessionIDValidaton },
    handler: async (ctx, { displayName, sessionId }) => {
        //adds a user to the db
        return await ctx.db.insert("users", { displayName, sessionId });
    }
})

export const getRoomInfo = query({
    args: sessionIDValidaton,
    handler: async (ctx, { sessionId }) => {
        //getting all users in room then mapping to an array of displayNames
        const userItemsInRoom = await getUsersInRoom(ctx, sessionId);
        const displayNameList = userItemsInRoom.map((user) => {
            return user.displayName
        });
        //returning sessionId and displayName array to the client
        return {
            sessionId: sessionId,
            users: displayNameList
        }
    }
})

//Helper Functions

async function getUsersInRoom(ctx: GenericQueryCtx<DataModel>, sessionId: string) {
    return await ctx.db.query('users').filter((q) => q.eq(q.field('sessionId'), sessionId)).collect();
}

async function mapMessagesToIncludeDisplayNameAndType(ctx: GenericQueryCtx<DataModel>, messages: any[], displayName: string) {
    let messagesWithDisplayNameAndType = Promise.all(
        messages.map(async (message) => {
            //get user who sent message
            const user = await ctx.db.query("users").filter((q) => q.eq(q.field("_id"), message.userId)).first();
            //add type to message
            let type;
            if (!user) {
                type = "Mediator";
                return { ...message, type, displayName: "Mediator" };
            } else if (user.displayName === displayName) {
                type = 'outgoing';
            } else {
                type = 'incomming';
            }
            return { ...message, type, displayName: user.displayName ?? "Mediator" };
        })
    )
    return messagesWithDisplayNameAndType;
}