export const config = { runtime: "edge" };


const TARGET_URL = (process.env.USERS || "").replace(/\/$/, "");


const V_PREFIX = "x-ver" + "cel-";
const X_R_IP = "x-re" + "al-ip";
const X_F_FOR = "x-forwar" + "ded-for";

const EXCLUDE_HEADERS = new Set([
  "host",
  "connection",
  "keep-alive",
  "proxy-" + "authenticate",
  "proxy-" + "authorization",
  "te",
  "trailer",
  "transfer-" + "encoding",
  "upgrade",
  "forwarded",
  "x-forwar" + "ded-host",
  "x-forwar" + "ded-proto",
  "x-forwar" + "ded-port",
]);

export default async function handler(req) {
  if (!TARGET_URL) {
    return new Response("Setup incomplete", { status: 500 });
  }

  try {
    const pIdx = req.url.indexOf("/", 8);
    const finalEndpoint = pIdx === -1 ? TARGET_URL + "/" : TARGET_URL + req.url.slice(pIdx);

    const outHeaders = new Headers();
    let clientAddr = null;
    
    for (const [key, val] of req.headers) {
      if (EXCLUDE_HEADERS.has(key)) continue;
      if (key.startsWith(V_PREFIX)) continue;
      if (key === X_R_IP) {
        clientAddr = val;
        continue;
      }
      if (key === X_F_FOR) {
        if (!clientAddr) clientAddr = val;
        continue;
      }
      outHeaders.set(key, val);
    }
    
    if (clientAddr) outHeaders.set(X_F_FOR, clientAddr);

    const verb = req.method;
    const hasPayload = verb !== "GET" && verb !== "HEAD";

    return await fetch(finalEndpoint, {
      method: verb,
      headers: outHeaders,
      body: hasPayload ? req.body : undefined,
      duplex: "half",
      redirect: "manual",
    });
  } catch (err) {
    console.error("fetch_err:", err);
    return new Response("Upstream Timeout", { status: 502 });
  }
}
