import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    rooms: defineTable({
        sessionId: v.string(),
        open: v.boolean()
    }),
    messages: defineTable({
        sessionId: v.string(),
        userId: v.string(),
        displayName: v.string(),
        message: v.string()
    }),
    users: defineTable({
        displayName: v.string(),
        sessionId: v.string()
    })
})