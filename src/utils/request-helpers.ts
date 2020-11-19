interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

// https://www.carlrippon.com/fetch-with-async-await-and-typescript/
export async function get<T>(
  path: string,
  args: RequestInit = {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  },
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}

export async function http<T>(request: RequestInfo): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(request);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
}
