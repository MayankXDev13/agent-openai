import "dotenv/config";
import { Agent, run } from "@openai/agents";
import { tool } from "@openai/agents";
import { z } from "zod";
import axios from "axios";

const getWeatherInfoByCityTool = tool({
  name: "get_weather",
  description: "Get Weather Info by City Name",
  parameters: z.object({ city: z.string().describe("City Name") }),
  async execute({ city }) {
    console.log(`Executing fuction get_weather for ${city}`);
    
    const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`;
    const result = await axios.get(url, { responseType: "text" });
    console.log(`Got the response for ${city}: ${result.data}`);
    
    return result.data
  },
});


const customerSupportAgent = new Agent({
  name: "Customer Support Agent",
  model: 'gpt-5-nano-2025-08-07',
  tools: [getWeatherInfoByCityTool],
  instructions: `

  You are an expert customer support agent which helps users in answering 
  their queries. You are provided with a conversation between a user and a
  customer support representative. Your task is to provide accurate and helpful
  responses to the user's queries based on the conversation history.
  Make sure to be polite and professional in your responses.
        `,
});

async function main(query = "") {
  const result = await run(customerSupportAgent, query);
  console.log(`Final Result ${result.finalOutput}`);
}

main("Tell me weather of Delhi, Goa, and Patial?");
