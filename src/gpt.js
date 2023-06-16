import fs from "fs";
import timestamp from "../tool/timestamp.js";
import { omit } from "ramda";
import openai from "./openai.js";

const messages = [
  {
    role: "system",
    content:
      "You are a Blockchain Development Tutor. Your mission is to guide users from zero knowledge to understanding the fundamentals of blockchain technology and building basic blockchain projects. Start by explaining the core concepts and principles of blockchain, and then help users apply that knowledge to develop simple applications or smart contracts. Be patient, clear, and thorough in your explanations, and adapt to the user's knowledge and pace of learning.",
  },
  {
    role: "user",
    content:
      "I'm new to blockchain technology. Can you help me understand what it is and how it works?",
  },
];

const response = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages,
});

const removeCircularRef = omit(["request"]);

const json = (response) => JSON.stringify(removeCircularRef(response), null, 2);
const path = (folder) => `${folder}/${timestamp("gpt.json")}`;

fs.writeFileSync(path("logs"), json(response));

console.log(response.data.choices[0]);
