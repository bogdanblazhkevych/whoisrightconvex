import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { GenericQueryCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";

const sessionIDValidaton = { sessionId: v.string() } as const;

export const addSessionId = mutation({
    args: sessionIDValidaton,
    handler: async (ctx, { sessionId }) => {
       await ctx.db.insert("rooms", { sessionId });
    }
})

export const getChatRoomUserCount = query({
    args: sessionIDValidaton,
    handler: async (ctx, {sessionId}) => {
        //gets array of users in room
        const usersInRoom = await ctx.db.query('users').filter((q) => q.eq(q.field('sessionId'), sessionId)).collect();
        return usersInRoom.length
    }
})

export const addMessage = mutation({
    args: { ...sessionIDValidaton, userId: v.union(v.id("users"), v.string()), message: v.string(), displayName: v.string() },
    handler: async (ctx, { sessionId, userId, message, displayName }) => {
        //insert message into messages table
        await ctx.db.insert("messages", { sessionId, userId, message });
        //get all messages excluding system messages 
        const messages = await ctx.db.query("messages").filter((q) => q.and(q.eq(q.field("sessionId"), sessionId), q.neq(q.field("userId"), "system"))).collect();
        //deciding whether or not mediator should send a message
        if (messages.length % 3 === 0) {
            //gets additional attributes for messages because gpt needs a "name"
            const messagesWithDisplayNameAndType = await mapMessagesToIncludeDisplayNameAndType(ctx, messages, userId);
            await ctx.scheduler.runAfter(0, api.mediator.chat, {
                messages: messagesWithDisplayNameAndType
            });
        }
    }
})

export const messages = query({
    args: { ...sessionIDValidaton, userId: v.string() },
    handler: async (ctx, { sessionId, userId }) => {
        //get messages
        const messages = await ctx.db.query("messages").filter((q) => q.eq(q.field("sessionId"), sessionId)).collect();
        //add display name and type: "outgoing" | "incomming" | "Mediaotr" | "System" to messages before sending to client
        return await mapMessagesToIncludeDisplayNameAndType(ctx, messages, userId)
    }
})

export const addUser = mutation({
    args: { displayName: v.string(), ...sessionIDValidaton },
    handler: async (ctx, { displayName, sessionId }) => {
        //adds a user to the db
        return await ctx.db.insert("users", { isConnected: true, displayName, sessionId });
    }
})

export const getRoomInfo = query({
    args: sessionIDValidaton,
    handler: async (ctx, { sessionId }) => {
        //getting all users in room then mapping to an array of displayNames
        const usersInRoom = await ctx.db.query('users').filter((q) => q.eq(q.field('sessionId'), sessionId)).collect();
        const displayNameList = usersInRoom.map((user) => {
            return user.displayName
        });
        //returning sessionId and displayName array to the client
        return {
            sessionId: sessionId,
            users: displayNameList
        }
    }
})

export const disconnectUser = internalMutation({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        await ctx.db.patch(userId, { isConnected: false })
    }
})

export const getUsersInRoom = internalQuery({
    args: { sessionId: v.string() },
    handler: async (ctx, { sessionId }) => {
        return await ctx.db.query('users').filter((q) => q.eq(q.field('sessionId'), sessionId)).collect();
    }
})

export const deleteRecordsBySessionId = internalMutation({
    handler: async (ctx, args: { sessionId: string, tableName: "users" | "messages" | "rooms" }) => {
        //get list of records that match sessionId
        const { sessionId, tableName } = args
        const records = await ctx.db.query(tableName).filter((q) => q.eq(q.field("sessionId"), sessionId)).collect();
        //delete all records in array
        await Promise.all(records.map((record) => {
            ctx.db.delete(record._id)
        }))
    }
})

//Helper Functions

async function mapMessagesToIncludeDisplayNameAndType(ctx: GenericQueryCtx<DataModel>, messages: any[], userId: string) {
    let messagesWithDisplayNameAndType = Promise.all(
        messages.map(async (message) => {
            //if a message has a user id thats a user foreign key
            if (message.userId !== "Mediator" && message.userId !== "system") {
                //get the user reccord of current message
                const user = await ctx.db.query("users").filter((q) => q.eq(q.field("_id"), message.userId)).first();
                //set type to incomming or outgoing
                let type;
                if (user?._id == userId) {
                    type = "outgoing"
                } else {
                    type = "incomming"
                }
                return { ...message, type, displayName: user?.displayName }
            } else {
                //display name and type are the same as user id
                return { ...message, type: message.userId, displayName: message.userId}
            }
        })
    )
    return messagesWithDisplayNameAndType;
}