import { __, assoc, compose, converge, path, pick, prop } from "ramda";
import openai from "./openai.js";

// TODO: refactor

const fakeWeather = compose(
  assoc("forecast", ["sunny", "windy"]),
  assoc("temperature", 72),
  pick(["location", "unit"])
);

const methods = {
  weatherReport: (parameter) => JSON.stringify(fakeWeather(parameter)),
};

const messages = [
  {
    role: "user",
    content: "What's the weather like in Boston? Make sure it is in celsius",
  },
];

const functions = [
  {
    name: "weatherReport",
    description: "Provide current weather in a given location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA",
        },
        unit: {
          type: "string",
          enum: ["fahrenheit", "celsius"],
        },
      },
      required: ["location"],
    },
  },
];

const response = await openai.createChatCompletion({
  model: "gpt-3.5-turbo-0613",
  messages,
  functions,
  function_call: "auto",
});

const extractMessage = path(["data", "choices", 0, "message"]);

const extractFunctionName = path(["function_call", "name"]);

const matchFunction = prop(__, methods);

const useFunction = compose(matchFunction, extractFunctionName, extractMessage);

const extractArguments = path(["function_call", "arguments"]);

const parseJSON = JSON.parse;

const useArguments = compose(parseJSON, extractArguments, extractMessage);

const functionCall = converge(
  (func, args) => func(args),
  [useFunction, useArguments]
);

if (response.data.choices[0].message.function_call.name === "weatherReport") {
  const message = extractMessage(response);
  const name = extractFunctionName(message);
  const content = functionCall(response);

  messages.push(message);

  messages.push({
    role: "function",
    name,
    content,
  });

  console.log(messages);

  const secondResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages,
  });

  console.log(secondResponse.data.choices[0].message);
}
