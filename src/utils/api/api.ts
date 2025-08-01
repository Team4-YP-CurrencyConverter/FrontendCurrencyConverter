interface IApi extends RequestInit {
  endPath: string;
}

let url = '';
if (import.meta.env.DEV) {
  url = 'http://localhost:3000/api';
} else if (import.meta.env.PROD) {
  url = 'https://goconvert.zapto.org/api';
}

async function api<T>({ endPath, ...options }: IApi): Promise<T> {
  const response = await fetch(url + endPath, {
    ...options,
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json() as T;
}

export default api;
