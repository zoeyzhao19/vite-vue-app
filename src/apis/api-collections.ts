export interface queryObj {
  [key: string]: any;
}

interface UrlDict {
  [key: string]: {
    [key: string]: string;
  };
}

export const urlDict: UrlDict = {};

export const getUrl = (targetScope: string, urlKey: string): string => {
  try {
    const scopes = Object.keys(urlDict);
    if (scopes.indexOf(targetScope) < 0) {
      throw new Error("Invalid resuest scope");
    }
    const hostname = urlDict[targetScope][urlKey];
    if (!hostname) {
      throw new Error("Invalid resuest url");
    }
    return hostname;
  } catch (err) {
    return "";
  }
};
