import openai from "./openai.js";
// import fs from "fs";

const response = await openai.createImage({
  prompt: "a super detailed infographic of a working time machine",
  n: 2,
  size: "256x256",
});

// const response = await openai.createImageVariation(
//   fs.createReadStream("images/abc.png"),
//   2,
//   "256x256"
// );

console.log(response.data);
