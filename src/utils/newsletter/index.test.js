import {describe, expect, test} from '@jest/globals';
import { applyInlineStyleToRawHtml } from './index';

describe('applyInlineStyleToRawHtml', () => {
  test('should apply style to h1 tag', () => {
    const theme = {
      h1: {
        color: 'red',
      },
    };
    const rawHtml = '<h1>Test</h1>';
    const expected = '<h1 style="color: red;">Test</h1>';
    const result = applyInlineStyleToRawHtml(rawHtml, theme);
    expect(result).toBe(expected);
  })

  test('should apply a complex style to only h1 tag', () => {
    const theme = {
      h1: {
        color: 'red',
        fontSize: '2rem',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        border: '1px solid black',
        borderRadius: '5px',
        padding: '10px',
        margin: '10px',
        paddingTop: '20px',
      },
    };
    const rawHtml = '<body><div><h1><span>Test</span></h1></div><h2>Test</h2><h3>Test</h3><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p><img src="https://picsum.photos/200/300" alt="random image" /><a href="https://www.google.com">Google</a>';
    const expected = '<body><div><h1 style="color: red; font-size: 2rem; font-family: Arial; font-weight: bold; border: 1px solid black; border-radius: 5px; padding: 10px; margin: 10px; padding-top: 20px;"><span>Test</span></h1></div><h2>Test</h2><h3>Test</h3><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p><img src="https://picsum.photos/200/300" alt="random image" /><a href="https://www.google.com">Google</a>';
    const result = applyInlineStyleToRawHtml(rawHtml, theme);
    expect(result).toBe(expected);
  })

  test('should not apply style on <img />, <a> tags as they might have attributes that will be erased by the function', () => { 
    const theme = {
      h1: {
        color: 'red',
      },
      img: {
        color: 'red',
      },
      a: {
        color: 'red',
      }
    };
    const rawHtml = '<img src="https://picsum.photos/200/300" alt="random image" /><a href="https://www.google.com">Google</a>';
    const expected = '<img src="https://picsum.photos/200/300" alt="random image" /><a href="https://www.google.com">Google</a>';
    const result = applyInlineStyleToRawHtml(rawHtml, theme);
    expect(result).toBe(expected);
  })
});