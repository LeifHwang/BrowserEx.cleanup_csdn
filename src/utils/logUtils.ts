/**
 * console.log，加上时间和[Cleanup! CSDN]前缀
 * @param text
 */
function logInfo(text: string) {
  console.log(`${new Date().toLocaleString()} [Cleanup! CSDN] ${text}`);
}

export { logInfo };
