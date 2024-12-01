import { existsSync, mkdirSync, rmSync } from "fs";
import dotenv from "dotenv";
import type { Shell } from "./Shell.ts";

export class Users {
  private shell: Shell;

  constructor(shell: Shell) {
    this.shell = shell;
  }

  exists(userId: string) {
    return existsSync(this.shell.fs.from(`/home/${userId}`));
  }

  create(userId: string) {
    if (this.exists(userId)) {
      throw new Error("User found");
    }

    mkdirSync(this.shell.fs.from(`/home/${userId}`));
  }

  delete(userId: string) {
    if (!this.exists(userId)) {
      throw new Error("User not found");
    }

    rmSync(this.shell.fs.from(`/home/${userId}`), { recursive: true });
  }

  get(userId: string) {
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
