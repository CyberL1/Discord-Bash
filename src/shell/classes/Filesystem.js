import { join } from "path";

export class Filesystem {
  from(path) {
    return join(import.meta.dirname, "..", "..", "..", "filesystem", path);
  }
}
