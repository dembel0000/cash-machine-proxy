export default async function handler(req, res) {
  const response = await fetch(
    "https://main.guide/mcp/cash-machine-guide",
    {
      method: req.method,
      headers: {
        "Authorization": `Bearer ${process.env.TOKEN}`,
        "Content-Type": "application/json"
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined
    }
  );

  const data = await response.text();
  res.send(data);
}
