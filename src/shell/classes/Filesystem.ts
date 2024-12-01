import { join } from "path";

export class Filesystem {
  from(path: string) {
    return join(import.meta.dirname, "..", "..", "..", "filesystem", path);
  }
}
