const http = require("http");
const fs = require("fs");
const path = require("path");

const host = process.env.HOST || "localhost";
const port = Number(process.env.PORT) || 3000;
const rootDir = path.resolve(__dirname, "..");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function resolveFilePath(urlPath) {
  const pathname = urlPath.split("?")[0];
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const normalizedPath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  return path.join(rootDir, normalizedPath);
}

http
  .createServer((request, response) => {
    const filePath = resolveFilePath(request.url || "/");

    fs.readFile(filePath, (error, content) => {
      if (error) {
        const statusCode = error.code === "ENOENT" ? 404 : 500;
        const message =
          statusCode === 404 ? "Arquivo nao encontrado." : "Erro interno do servidor.";

        response.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
        response.end(message);
        return;
      }

      const extension = path.extname(filePath).toLowerCase();
      response.writeHead(200, {
        "Content-Type": contentTypes[extension] || "application/octet-stream"
      });
      response.end(content);
    });
  })
  .listen(port, host, () => {
    console.log(`Servidor local em http://${host}:${port}`);
  });
