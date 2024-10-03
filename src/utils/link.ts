export async function isLinkValid(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      'User-Agent': 'digestclub-bot/1.0',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new TypeError('invalid_link');
      }
      return response;
    })
    .catch(() => {
      throw new TypeError('invalid_link');
    });
}

/**
 * @description Function that checks if a given URL is a Twitter / X link
 * @param url a string representing a URL
 * @returns a boolean indicating if the URL is a twitter link
 */
export function isTwitterLink(url: string): boolean {
  const twitterPattern =
    /^(?:https?:\/\/(?:www\.)?)?(?:twitter\.com|x\.com)\/.*$/;

  return twitterPattern.test(url);
}

/**
 * @description Function that returns the id of a tweet from a given twitter URL (ex: https://twitter.com/elonmusk/status/1427847987038444544)
 * @param url a string representing a URL
 * @returns a string representing the id of the tweet
 * @returns false if the URL is not a valid tweet link
 */
export function getTweetId(url: string): false | string {
  const twitterPattern =
    /^(?:https?:\/\/(?:www\.)?)?(?:twitter\.com|x\.com)\/.*\/status\/(\d+)(?:\?.*)?$/;

  const match = url.match(twitterPattern);

  if (match && match[1]) {
    return match[1];
  } else {
    return false;
  }
}
