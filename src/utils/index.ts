export const swrFetcher = (url: string, token: string | null) => async () => {
  let uri: string = "";

  if (__DEV__) {
    uri = `${url}`;
  } else {
    uri = `${process.env.EXPO_PUBLIC_API_URL}${url}`;
  }

  const res = await fetch(uri, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-vercel-protection-bypass": `${process.env.X_VERCEL_TOKEN}`,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch((): Record<string, unknown> => ({}));
    throw new Error(
      (errorBody as { message?: string }).message || "Failed to fetch data from server",
    );
  }
  return res.json();
};

export * from "./dashboard";
