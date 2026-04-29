export const config = { runtime: "edge" };

const TARGET_BASE = (() => {
  const raw = process.env.USERS || "";
  return raw ? atob(raw).replace(/\/$/, "") : "";
})();

const _stripSet = new Set(
  atob(
    "aG9zdCxjb25uZWN0aW9uLGtlZXAtYWxpdmUscHJveHktYXV0aGVudGljYXRlLHByb3h5LWF1dGhvcml6YXRpb24sdGUsdHJhaWxlcix0cmFuc2Zlci1lbmNvZGluZyx1cGdyYWRlLGZvcndhcmRlZCx4LWZvcndhcmRlZC1ob3N0LHgtZm9yd2FyZGVkLXByb3RvLHgtZm9yd2FyZGVkLXBvcnQ="
  ).split(",")
);

const _VFLAG = atob("eC12ZXJjZWwt");
const _RIP = atob("eC1yZWFsLWlw");
const _XFF = atob("eC1mb3J3YXJkZWQtZm9y");

export default async function handler(req) {
  if (!TARGET_BASE) {
    return new Response(atob("TWlzY29uZmlndXJlZDogVEFSR0VUX0RPTUFJTiBpcyBub3Qgc2V0"), {
      status: 500,
    });
  }

  try {
    const pathStart = req.url.indexOf("/", 8);
    const targetUrl =
      pathStart === -1 ? TARGET_BASE + "/" : TARGET_BASE + req.url.slice(pathStart);

    const out = new Headers();
    let clientIp = null;
    for (const [k, v] of req.headers) {
      if (_stripSet.has(k)) continue;
      if (k.startsWith(_VFLAG)) continue;
      if (k === _RIP) {
        clientIp = v;
        continue;
      }
      if (k === _XFF) {
        if (!clientIp) clientIp = v;
        continue;
      }
      out.set(k, v);
    }
    if (clientIp) out.set(_XFF, clientIp);

    const method = req.method;
    const hasBody = method !== "GET" && method !== "HEAD";

    return await fetch(targetUrl, {
      method,
      headers: out,
      body: hasBody ? req.body : undefined,
      duplex: "half",
      redirect: "manual",
    });
  } catch (err) {
    console.error(atob("cmVsYXkgZXJyb3I6"), err);
    return new Response(atob("QmFkIEdhdGV3YXk6IFR1bm5lbCBGYWlsZWQ="), {
      status: 502,
    });
  }
}
