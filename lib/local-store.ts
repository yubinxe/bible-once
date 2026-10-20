"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * 이 기기에만 머무는 개인 기록. 서버로 전송하지 않는다.
 * 저장소 접근이 막힌 환경(사생활 보호 모드 등)에서도 화면은 정상 동작한다.
 */
export function readLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeLocal(key: string, value: unknown): boolean {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function useLocal<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const [persisted, setPersisted] = useState(true);

  useEffect(() => {
    const stored = readLocal<T>(key);
    // 저장소에서 읽은 값으로 한 번 동기화한다 (hydration 이후)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored !== null) setValue(stored);
    setReady(true);
  }, [key]);

  const save = useCallback(
    (next: T | null) => {
      setPersisted(writeLocal(key, next));
      setValue(next ?? initial);
    },
    [key, initial],
  );

  return { value, setValue, save, ready, persisted };
}
