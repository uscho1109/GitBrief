// @ts-nocheck
globalThis.import = { meta: { env: { GEMINI_API_KEY: process.env.GEMINI_API_KEY } } };
import { summarizeRepository } from './src/api/summarize';

async function test() {
  try {
    const res = await summarizeRepository('https://github.com/harry0703/MoneyPrinterTurbo');
    console.log(res);
  } catch(e) {
    console.error(e);
  }
}
test();
