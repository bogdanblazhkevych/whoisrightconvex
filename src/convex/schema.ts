import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    rooms: defineTable({
        sessionId: v.string(),
        open: v.boolean()
    })
})