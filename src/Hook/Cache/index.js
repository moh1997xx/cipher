import { useEffect } from "react";
import useSWR, { cache } from "swr";
import AsyncStorage from "@react-native-async-storage/async-storage";
import equal from "fast-deep-equal";

function getStorage(mode) {
  switch (mode) {
    case "local":
      return localStorage;
    case "session":
      return sessionStorage;
    case "async":
      return AsyncStorage;
    default: {
      throw new Error(
        `Invalid mode ${mode}, it must be either local or session.`
      );
    }
  }
}

// the value of SWR could be either undefined or an object
// if you had other values you will need to check them here
// and parse it correctly (e.g. use Number for number)
function baseParser(value) {
  return value === "undefined" ? undefined : JSON.parse(value);
}

function syncWithStorage(mode, parser = baseParser) {
  const storage = getStorage(mode);

  if (mode !== "async") {
    // Get all key from the storage
    for (let [key, data] of Object.entries(storage)) {
      if (!key.startsWith("swr-")) continue;
      // update SWR cache with the value from the storage
      cache.set(
        key.slice(4),
        parser(data).swrValue,
        false // don't notify the cache change, no-one is listening yet anyway
      );
    }
  }

  // storage.getAllKeys().then((keys) => {
  //   console.log({ keys });
  // });

  // Subscribe to SWR cache changes in the future
  return cache.subscribe(() => {
    // get all the keys in cache
    const keys = cache.keys();
    // save each key in SWR with the prefix swr-
    for (let key of keys) {
      if (!key.includes("@")) {
        storage.setItem(
          `swr-${key}`,
          JSON.stringify({ swrValue: cache.get(key) })
        );
      }
    }
  });
}

export function syncWithLocalStorage(parser) {
  return syncWithStorage("local", parser);
}

export function syncWithSessionStorage(parser) {
  return syncWithStorage("session", parser);
}

export function syncWithAsyncStorage(parser) {
  return syncWithStorage("async", parser);
}

export function useCache(key, enable) {
  if (typeof key === "function") {
    key = key();
  }

  const { data, mutate } = useSWR(`cache@${key}`, {
    initialData: null,
    fetcher: null,
  });

  useEffect(() => {
    if (key && enable && !data) {
      AsyncStorage.getItem(`swr-${key}`).then((data) => {
        mutate(baseParser(data)?.swrValue);
      });
    }
  }, [key, enable, data, mutate]);

  return data;
}

export function useSWRCache(key, fetchData) {
  const { data } = useSWR(key, fetchData);
  const cache = useCache(key, !data);

  if (!cache) {
    return data;
  }

  if (data && cache && !equal(data, cache)) {
    return data;
  }

  return cache;
}
