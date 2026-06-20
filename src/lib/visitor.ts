const VISITOR_ID_KEY = "visitor_id";
const VISITOR_SIG_KEY = "visitor_sig";

export function getVisitorHeaders(): Record<string, string> {
  if (typeof sessionStorage === "undefined") return {};

  const id = sessionStorage.getItem(VISITOR_ID_KEY);
  const sig = sessionStorage.getItem(VISITOR_SIG_KEY);

  if (!id || !sig) return {};

  return {
    "X-Visitor-Id": id,
    "X-Visitor-Signature": sig,
  };
}

export function setVisitorFromHeaders(headers: Headers): void {
  const id = headers.get("X-Visitor-Id");
  const sig = headers.get("X-Visitor-Signature");

  if (id && sig) {
    sessionStorage.setItem(VISITOR_ID_KEY, id);
    sessionStorage.setItem(VISITOR_SIG_KEY, sig);
  }
}
