import type { Token } from "#shell/types.ts";

export class Tokenizer {
  str: string;
  tokens: Token[];
  current: string;

  constructor(str: string) {
    this.str = str.trim();
    this.tokens = [];
    this.current = "";
  }

  tokenize() {
    let isCommand = true;
    let isComment = false;

    for (const char of this.str) {
      if (char === "#") {
        isComment = true;
      }

      if (!isComment) {
        if (char != " ") {
          this.current += char;
        }

        if (this.current.length) {
          if (isCommand && char === " ") {
            this.token("cmd");
            isCommand = false;
          } else if (char === " ") {
            this.token("str");
          }
        }
      }
    }

    // Ensure the last string doesn't get skipped
    if (this.current.length) {
      this.token(isCommand ? "cmd" : "str");
    }

    return this.tokens;
  }

  token(type: string) {
    this.tokens.push({ type, value: this.current });
    this.current = "";
  }
}
