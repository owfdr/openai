import openai from "./openai.js";
import {
  always,
  compose,
  defaultTo,
  forEach,
  invoker,
  pathOr,
  reject,
  replace,
  split,
  tryCatch,
} from "ramda";

const toString = invoker(0, "toString");

const toArray = split("\n");

const filterArray = reject((x) => x === "");

const formatString = replace(/^data: /, "");

const parseString = tryCatch(JSON.parse, always({}));

const extractContent = pathOr("", ["choices", 0, "delta", "content"]);

const writeToStdout = (x) => process.stdout.write(x);

const takeResponse = compose(filterArray, toArray, toString);

const messageReady = compose(
  defaultTo(""),
  extractContent,
  parseString,
  formatString
);

const typewriteEffect = compose(writeToStdout, messageReady);

const animateIt = compose(forEach(typewriteEffect), takeResponse);

const res = await openai.createChatCompletion(
  {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Hello, how are you?" }],
    stream: true,
  },
  {
    responseType: "stream",
  }
);

res.data.on("data", animateIt);

// const createLog = compose(
//     forEach(
//       compose(
//         (x) => x && process.stdout.write(x),
//         (x) => (x === "[DONE]" ? "" : JSON.parse(x).choices[0].delta.content),
//         replace(/^data: /, "")
//       )
//     ),
//     reject((x) => x === ""),
//     split("\n"),
//     invoker(0, "toString")
//   );
