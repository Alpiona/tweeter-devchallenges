import axios, { AxiosResponse } from 'axios';

export default async function api<T = any>(
  path: string,
): Promise<AxiosResponse<T>> {
  const ret = await axios.get<T>(process.env.BASE_URL + path);
  return ret;
}
