/**
 * Functions that checks if a string is empty, i.e. has no characters
 * @param {string} str - string to check
 * @returns {boolean} true if string is empty
 */
export function isStringEmpty(str: string): boolean {
  const trimmedStr = str.trim();
  return trimmedStr.length === 0;
}

/**
 * Function that returns a hidden string, i.e. a string with all characters replaced by '*'
 */
export function makeHidden(str: string): string {
  return str.replace(/./g, '*');
}

/**
 * Function that copies a string to the clipboard
 * @param {string} str - string to copy
 */
export function copyToClipboard(str: string): void {
  const textField = document.createElement('textarea');
  textField.innerText = str;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
}
