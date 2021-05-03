export class FetchUtils {
  static fetchJson = async (
    url: RequestInfo,
    options?: RequestInit,
  ): Promise<any> => {
    const response = await fetch(url, options);
    if (response.status >= 200 && response.status < 300) {
      const json = await response.json();
      return json;
    } else {
      throw new Error(response.statusText);
    }
  };
}

export default FetchUtils;
