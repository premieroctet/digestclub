import { describe, expect, test } from '@jest/globals';
import { isTwitterLink, getTweetId } from './index';

describe('isTwitterLink', () => {
  test('url to user should return true', () => {
    const link = 'https://twitter.com/AdamRackis';
    const expected = true;
    const result = isTwitterLink(link);
    expect(result).toBe(expected);
  });

  test('url to tweet should return true', () => {
    const link = 'https://twitter.com/AdamRackis/status/1376920000000000000';
    const expected = true;
    const result = isTwitterLink(link);
    expect(result).toBe(expected);
  });

  test('url to home should return true', () => {
    const link = 'https://twitter.com/home';
    const expected = true;
    const result = isTwitterLink(link);
    expect(result).toBe(expected);
  });

  test('url to another website should return false', () => {
    const link = 'https://www.google.com';
    const expected = false;
    const result = isTwitterLink(link);
    expect(result).toBe(expected);
  });
});

describe('getTweetId', () => {
  test('url to user should return false', () => {
    const link = 'https://twitter.com/AdamRackis';
    const expected = false;
    const result = getTweetId(link);
    expect(result).toBe(expected);
  });

  test('url to tweet should return true', () => {
    const link = 'https://twitter.com/AdamRackis/status/1376920000000000000';
    const expected = '1376920000000000000';
    const result = getTweetId(link);
    expect(result).toBe(expected);
  });

  test('url to status without id should return false', () => {
    const link1 = 'https://twitter.com/AdamRackis/status/';
    const link2 = 'https://twitter.com/AdamRackis/1319672639921807361';
    const link3 = 'https://twitter.com/AdamRackis/status';
    const expected = false;
    const result1 = getTweetId(link1);
    const result2 = getTweetId(link2);
    const result3 = getTweetId(link3);
    expect(result1).toBe(expected);
    expect(result2).toBe(expected);
    expect(result3).toBe(expected);
  });
  test('url to google.com should return false', () => {
    const link = 'https://www.google.com';
    const expected = false;
    const result = getTweetId(link);
    expect(result).toBe(expected);
  });
});
