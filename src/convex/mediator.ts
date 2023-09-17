"use node";
import OpenAI from 'openai';
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

const apiKey = process.env.OPENAI_API_KEY!;
const openai = new OpenAI({
  apiKey: apiKey
});

export const chat = action({
  args: {
    messages: v.array(v.object({_creationTime: v.number(), _id: v.id("messages"), displayName: v.string(), message: v.string(), sessionId: v.string(), type: v.string(), userId: v.string()})),
  },
  handler: async (ctx, {messages}) => {
    let messagesToMediatorSchema = messages.map((message) => {
        let mediatorSchemaMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
            role: message.userId === 'Mediator' ? 'assistant' : 'user',
            //spaces in name property are not supported and will throw an error
            name: message.userId === 'Mediator' ? 'Mediator' : message.displayName.replace(/ /g, '_'),
            content: message.message
        }
        return mediatorSchemaMessage
    })

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
            role: "system",
            name: "system",
            content:
            `You are a conflict mediator. You must analyze these two points of view and 
            come to a definative resolution. When making a decision on who is right, you must make one that is 
            firm and decisive. You may on ocassion declare no winners, but keep this as a last resort option. If the 
            argument is opinion based, such as which brand is better, you MUST make a decision and side with one 
            of the parties, and you must provide reasoning for your decision. If the argument is subjective and depends 
            on personal preferance, you must chose a winner. Pick one at randome if you must, but chose a winner. 
            Keep your rulings brief, 15 sentences maximum, but maximum. This is a texting group chat with two users and 
            you so keep it brief unless necessarry. ask questions if needed, and ultimatly resolve the dispute. YOU must speak 
            with both parties, and come up with a resolution to the conflict. work through the problem, understand the context, 
            and keep working through the problem untill you come up with a resolution to the conflict.`
          },
          ...messagesToMediatorSchema
      ]
    });

    const responseContent = response.choices[0].message?.content;

    await ctx.runMutation(api.room.addMessage, {
      sessionId: messages[0].sessionId,
      userId: 'Mediator',
      message: responseContent || "Sorry, I don't have an answer for that.",
      displayName: "Mediator"
    });
  },
});