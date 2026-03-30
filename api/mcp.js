export default async function handler(req, res) {
  const token = process.env.TOKEN;

  const upstream = await fetch(
    "https://main.guide/mcp/cash-machine-guide",
    {
      method: req.method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: req.headers.accept || "application/json, text/event-stream",
        "Content-Type": req.headers["content-type"] || "application/json",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      },
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? await new Promise((resolve, reject) => {
              let data = "";
              req.on("data", chunk => (data += chunk));
              req.on("end", () => resolve(data));
              req.on("error", reject);
            })
          : undefined
    }
  );

  res.status(upstream.status);

  // пробрасываем заголовки
  upstream.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  // 🔥 самое важное — стриминг
  const reader = upstream.body.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(Buffer.from(value));
  }

  res.end();
}
