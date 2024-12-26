interface IApi extends RequestInit {
  endPath: string;
}

async function api<T>({ endPath, ...options }: IApi): Promise<T> {
  const response = await fetch(`http://localhost:3000${endPath}`, {
    ...options,
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json() as T;
}

export default api;
