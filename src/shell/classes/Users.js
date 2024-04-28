import { existsSync, mkdirSync, rmSync } from "fs";
import dotenv from "dotenv";

export class Users {
  constructor(shell) {
    this.shell = shell;
  }

  exists(userId) {
    return existsSync(this.shell.fs.from(`/home/${userId}`));
  }

  create(userId) {
    if (this.exists(userId)) {
      throw new Error("User found");
    }

    mkdirSync(this.shell.fs.from(`/home/${userId}`));
  }

  delete(userId) {
    if (!this.exists(userId)) {
      throw new Error("User not found");
    }

    rmSync(this.shell.fs.from(`/home/${userId}`), { recursive: true });
  }

  get(userId) {
    if (!this.exists(userId)) {
      throw new Error("User not found");
    }

    return {
      config: dotenv.config({
        override: true,
        path: this.shell.fs.from(`/home/${userId}/.shellcfg`),
      }).parsed,
    };
  }
}
