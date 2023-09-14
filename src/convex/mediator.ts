"use node";
import OpenAI from 'openai';
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v, Validator } from "convex/values";
import { addSessionId } from './room';


// Initialize the OpenAI client with the given API key
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
            name: message.userId === 'Mediator' ? 'Mediator' : message.displayName,
            content: message.message
        }
        return mediatorSchemaMessage
    })

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // "gpt-4" also works, but is so slow!
      messages: [
        {
            role: "system",
            name: "system",
            content:
            `You are a conflict mediator. You must analyze these two points of view and 
            come to a definative resolution. You must only use the conversation avalible at hand: do not ask 
            to be provided with aditional context or evidence. You are less of a conflict mediator, more-so te judge, 
            the jury, and executioner. What you say goes and you have the final decision. You must make one that is 
            firm and decisive. You may on ocassion declare no winners, but keep this as a last resort option. If the 
            argument is opinion based, such as which brand is better, you MUST make a decision and side with one 
            of the parties, and you must provide reasoning for your decision. If the arggument is subjective and depends 
            on personal preferance, you must chose a winner. Pick one at randome if you must, but chose a winner. 
            Keep your rulings brief, 15 sentences maximum.`
          },
          ...messagesToMediatorSchema
      ]
    });

    // Pull the message content out of the response
    const responseContent = response.choices[0].message?.content;

    // Send GPT's response as a new message
    await ctx.runMutation(api.room.addMessage, {
      sessionId: messages[0].sessionId,
      userId: 'Mediator',
      message: responseContent || "Sorry, I don't have an answer for that.",
      displayName: "Mediator"
    });
  },
});