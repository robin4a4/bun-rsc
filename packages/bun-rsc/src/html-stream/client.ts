const encoder = new TextEncoder();
let streamController: unknown;
export const rscStream = new ReadableStream({
  start(controller) {
    if (typeof window === "undefined") {
      return;
    }
    const handleChunk = (chunk: string) => {
      if (typeof chunk === "string") {
        controller.enqueue(encoder.encode(chunk));
      } else {
        controller.enqueue(chunk);
      }
    };
    // @ts-ignore
    window.__FLIGHT_DATA ||= [];
    // @ts-ignore
    // biome-ignore lint/complexity/noForEach: <explanation>
    window.__FLIGHT_DATA.forEach(handleChunk);
    // @ts-ignore
    window.__FLIGHT_DATA.push = (chunk) => {
      handleChunk(chunk);
    };
    streamController = controller;
  },
});

if (typeof document !== "undefined" && document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    // @ts-ignore
    streamController?.close();
  });
} else {
  // @ts-ignore
  streamController?.close();
}
