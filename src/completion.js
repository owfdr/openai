import openai from "./openai.js";

const response = await openai.createCompletion({
  prompt: "I like to eat strawberries",
  model: "text-davinci-003",
  //   logprobs: 1,
  suffix: "Red is my favorite color.",
});

console.log(response.data.choices[0]);
