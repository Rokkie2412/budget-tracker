export const swrFetcher = (url: string, token: string | null) => async () => {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || "Failed to fetch data from server");
  }

  return res.json();
};

export * from "./dashboard";
