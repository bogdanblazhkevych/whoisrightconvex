import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addSessionId = mutation({
    args: { sessionId: v.string() },
    handler: async (ctx, {sessionId}) => {
        let open = true;
        await ctx.db.insert("rooms", {sessionId, open});
    }
})

export const findRoom = query({
    args: { sessionId: v.string() },
    handler: async (ctx, { sessionId }) => {
        const room = await ctx.db.query('rooms').filter((q) => q.eq(q.field('sessionId'), sessionId)).collect()
        if (room.length === 0) {
            throw new Error("room does not exist")
        } else if (!room[0].open) {
            throw new Error("room is full")
        } else {
            return room[0].open
        }
    }
})