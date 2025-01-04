import { join, normalize } from "path";

export class Filesystem {
  from(path: string) {
    return normalize(
      join(
        import.meta.dirname,
        "..",
        "..",
        "..",
        "filesystem",
        join("/", path),
      ),
    );
  }

  translate(env: { [key: string]: string }, path: string) {
    if (path === "~") {
      path = env.HOME;
    } else if (path.startsWith("~/")) {
      path = path.replace("~/", `${env.HOME}/`);
    } else if (path.startsWith("/")) {
      path = join("/", path);
    } else {
      path = join(env.PWD, path);
    }

    return path.replaceAll("\\", "/");
  }
}
