export class Tokenizer {
  constructor(str) {
    this.str = str.trim();
    this.tokens = [];
    this.current = "";
  }

  tokenize() {
    let isCommand = true;

    for (const char of this.str) {
      if (char != " ") {
        this.current += char;
      }

      if (isCommand && char === " ") {
        this.token("cmd");
        isCommand = false;
      } else if (char === " ") {
        this.token("str");
      }
    }

    // Ensure the last string doesn't get skipped
    if (this.current.length) {
      this.token(isCommand ? "cmd" : "str");
    }

    return this.tokens;
  }

  token(type) {
    this.tokens.push({ type, value: this.current });
    this.current = "";
  }
}
