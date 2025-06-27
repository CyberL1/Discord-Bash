import { existsSync, mkdirSync, rmSync } from "fs";
import dotenv from "dotenv";
import type { Shell } from "./Shell.ts";

export class Users {
  private shell: Shell;
  private userDirectories: Map<string, string>;

  constructor(shell: Shell) {
    this.shell = shell;
    this.userDirectories = new Map();
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
        quiet: true,
      }).parsed,
      env: {
        HOME: `/home/${userId}`,
        PWD: this.userDirectories[userId] || `/home/${userId}`,
      },
    };
  }

  setDirectory(userId: string, path: string) {
    this.userDirectories[userId] = path;
  }
}
