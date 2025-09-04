// ES module syntax
import { get_encoding } from "tiktoken";

// Arguments are dictionaries that map tokenID -> token
// For example: 904 -> "hello"
const encoding = get_encoding("cl100k_base");
const tokens = encoding.encode("Hello! This is a basic tokenizer");

console.log(tokens);