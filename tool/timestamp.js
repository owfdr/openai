import path from "path";
import { always, compose, invoker, join, juxt, prop, replace } from "ramda";

const filename = compose(prop("name"), path.parse);

const extension = compose(prop("ext"), path.parse);

const removeCharacters = replace(/[-:.]/g, "");

const toISOString = invoker(0, "toISOString");

const date = always(new Date());

const stamp = compose(removeCharacters, toISOString, date);

const format = juxt([filename, stamp, extension]);

const timestamp = compose(join(""), format);

export default timestamp;

// const dateTime = compose(
//   (iso) => iso.replace(/[-:.]/g, ""),
//   (date) => date.toISOString(),
//   () => new Date()
// );

// const ts = (file) => {
//   const { name, ext } = path.parse(file);
//   const stamp = dateTime();

//   return ext ? `${name}${stamp}${ext}` : `${name}${stamp}`;
// };

// const timeStamp = (file) => name(file) + stamp() + ext(file);
