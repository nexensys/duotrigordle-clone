import { WORDS_TARGET } from "./duotrigordle-copied/consts";
import LZString from "lz-string";

export function isValidWord(w: string[]): boolean {
  return WORDS_TARGET.includes(w.join("").toUpperCase());
}

export function shouldCheckWord(w: string[]): boolean {
  return w.length === 5;
}

export function className(...classes: any[]): string {
  return classes.filter(Boolean).join(" ");
}

export function range(s: number, e?: number): number[] {
  return e
    ? Array(e - s)
        .fill(null)
        .map((_, idx) => idx + s)
    : Array(s)
        .fill(null)
        .map((_, idx) => idx);
}

const cache = new WeakMap<() => any, { [key: string]: any }>();
export function memo<T>(func: () => T, deps: any[]): T {
  if (!cache.has(func)) cache.set(func, {});
  const funcCache: { [key: string]: any } = cache.get(func) as {
    [key: string]: any;
  };
  const depHash = LZString.compressToBase64(JSON.stringify(deps));
  return funcCache[depHash] ?? (funcCache[depHash] = func());
}
