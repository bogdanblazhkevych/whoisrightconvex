import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

export const userDisconnected = httpAction(async (ctx, request) => {
    //destructure response
    const { userId, sessionId, displayName } = await request.json();

    //set connected attribute of disconnected user to false
    await ctx.runMutation(internal.room.disconnectUser, { userId: userId })

    //get array of all users in room
    const usersInRoom = await ctx.runQuery(internal.room.getUsersInRoom, { sessionId: sessionId })

    //if all users in room are disconnected
    if (usersInRoom.every((user) => !user.isConnected)) {
        //delete all users, rooms, messages related to sessionID
        await ctx.runMutation(internal.room.deleteRecordsBySessionId, { sessionId: sessionId, tableName: "users"})
        await ctx.runMutation(internal.room.deleteRecordsBySessionId, { sessionId: sessionId, tableName: "messages"})
        await ctx.runMutation(internal.room.deleteRecordsBySessionId, { sessionId: sessionId, tableName: "rooms"})
    } else {
        //if other users still in room, notify of disconnect
        await ctx.runMutation(api.room.addMessage, {displayName: "system", message: `${displayName} had disconnected`, sessionId: sessionId, userId: "system"})
    }

    return new Response(null, {
        status: 200,
    });
});