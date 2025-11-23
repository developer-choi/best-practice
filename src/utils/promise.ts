export async function timeoutPromise(timeout: number) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
