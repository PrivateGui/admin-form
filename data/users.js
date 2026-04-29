export const config = { runtime: (() => atob("ZWRnZQ=="))() };


const _ENV_KEY = atob("VVNFUlM="); 
const _SLASH = atob("Lw==");
const _EMPTY = atob("");


const _STRIP_RAW = atob(
  "aG9zdCxjb25uZWN0aW9uLGtlZXAtYWxpdmUscHJveHktYXV0aGVudGljYXRlLHByb3h5LWF1dGhvcml6YXRpb24sdGUsdHJhaWxlcix0cmFuc2Zlci1lbmNvZGluZyx1cGdyYWRlLGZvcndhcmRlZCx4LWZvcndhcmRlZC1ob3N0LHgtZm9yd2FyZGVkLXByb3RvLHgtZm9yd2FyZGVkLXBvcnQ="
);
const _STRIP = new Set(_STRIP_RAW.split(","));


const _VFLAG = atob("eC12ZXJjZWwt");  
const _RIP = atob("eC1yZWFsLWlw");   
const _XFF = atob("eC1mb3J3YXJkZWQtZm9y");


const _MISCONF = atob("TWlzY29uZmlndXJlZDogVEFSR0VUX0RPTUFJTiBpcyBub3Qgc2V0");
const _BADGW = atob("QmFkIEdhdGV3YXk6IFR1bm5lbCBGYWlsZWQ=");
const _ERR_PREF = atob("cmVsYXkgZXJyb3I6");


const _DUP_KEY = atob("ZHVwbGV4"); 
const _DUP_VAL = atob("aGFsZg=="); 



export default async function handler(req) {

  const rawTarget = globalThis.process?.env?.[_ENV_KEY] || _EMPTY;
  if (!rawTarget) {
    return new Response(_MISCONF, { status: 500 });
  }
  const TARGET_BASE = rawTarget.replace(/\/$/, _EMPTY);

  try {

    const parsedUrl = new URL(req.url);
    const targetUrl = TARGET_BASE + parsedUrl.pathname + parsedUrl.search;


    const out = new Headers();
    let clientIp = null;
    const reqHeaders = req.headers;
    for (const [k, v] of reqHeaders) {
      if (_STRIP.has(k)) continue;
      if (k.startsWith(_VFLAG)) continue;
      if (k === _RIP) { clientIp = v; continue; } 
      if (k === _XFF) { if (!clientIp) clientIp = v; continue; } 
      out.set(k, v);
    }
    if (clientIp) out.set(_XFF, clientIp);

    
    const _method = req.method;
    const _hasBody = _method !== "GET" && _method !== "HEAD";

    
    const _fetch = globalThis.fetch;
    const _fetchOpts = {
      method: _method,
      headers: out,
      redirect: "manual",
    };
    if (_hasBody) {
      _fetchOpts.body = req.body;
      _fetchOpts[_DUP_KEY] = _DUP_VAL;   
    }

   
    return await _fetch(targetUrl, _fetchOpts);
  } catch (err) {
    console.error(_ERR_PREF, err);
    return new Response(_BADGW, { status: 502 });
  }
}
