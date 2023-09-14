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

async function getUsersInSession(ctx: GenericQueryCtx<DataModel>, sessionId: string) {
    return await ctx.db.query('users').filter((q) => q.eq(q.field('sessionId'), sessionId)).collect();
}

export const isChatRoomActive = query({
    args: sessionIDValidaton,
    handler: async (ctx, { sessionId }) => {
        //get users array that have the sessionId attribute
        const usersInRoom = await getUsersInSession(ctx, sessionId);
        return usersInRoom.length === 2;
    }
})

export const isRoomOpen = query({
    args: sessionIDValidaton,
    handler: async (ctx, { sessionId }) => {
        //get users array that have the sessionId attribute
        const usersInRoom = await getUsersInSession(ctx, sessionId);
        return usersInRoom.length === 1;
    }
})

export const addMessage = mutation({
    args: { ...sessionIDValidaton, userId: v.string(), message: v.string(), displayName: v.string() },
    handler: async (ctx, { sessionId, userId, message, displayName }) => {
        //insert message into messages table
        //probably need some validation
        await ctx.db.insert("messages", { sessionId, userId, message });

        //get all messages 
        const messages = await ctx.db.query("messages").filter((q) => q.eq(q.field("sessionId"), sessionId)).collect();
        if (messages.length % 3 === 0) {
            const messagesWithDisplayNameAndType = await getMessagesWithDisplayNameAndType(ctx, messages, displayName);
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
        return await getMessagesWithDisplayNameAndType(ctx, messages, displayName)
    }
})

async function getMessagesWithDisplayNameAndType(ctx: GenericQueryCtx<DataModel>, messages: any[], displayName: string) {
    let messagesWithDisplayNameAndType = Promise.all(
        messages.map(async (message) => {
            //get user who sent message
            const user = await ctx.db.query("users").filter((q) => q.eq(q.field("_id"), message.userId)).first();
            
            //add type to message
            let type;
    
            if (user?.displayName === displayName) {
                type = 'outgoing';
            } else {
                type = 'incomming';
            }
    
            return { ...message, type, displayName: user?.displayName ?? "Mediator" };
        })
    )
    return messagesWithDisplayNameAndType;
}

export const addUser = mutation({
    args: { displayName: v.string(), ...sessionIDValidaton },
    handler: async (ctx, { displayName, sessionId }) => {
        return await ctx.db.insert("users", { displayName, sessionId });
    }
})

export const getRoomInfo = query({
    args: sessionIDValidaton,
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