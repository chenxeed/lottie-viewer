/**
 * Shorten the text to a certain length and add ellipsis
 */
export function ellipsisText(text: string, maxLength = 20) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + "...";
  } else {
    return text;
  }
}
