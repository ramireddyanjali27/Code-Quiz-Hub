// ─── Code Runner Service ─────────────────────────────────────
// Simulated in-browser execution for coding challenges.
//
// INTEGRATION POINT: swap these two functions with calls to a
// real execution API (e.g. Judge0 / Piston / self-hosted runner)
// — the UI components only consume these Promises, so nothing
// else needs to change.

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Run user code and return program output.
 * @param {{ code: string, language: string, challenge: object }} payload
 * @returns {Promise<{ ok: boolean, output: string, error?: string }>}
 */
export const runCode = async ({ code }) => {
  await sleep(700 + Math.random() * 500);
  if (!code || !code.trim()) {
    return { ok: false, output: '', error: 'Nothing to run — the editor is empty.' };
  }
  // Simulation: surface the challenge's sample output as the result.
  return { ok: true, output: 'Program finished.' };
};

/**
 * Submit user code against the challenge's test cases.
 * @param {{ code: string, language: string, challenge: object }} payload
 * @returns {Promise<{ passedAll: boolean, results: [{ name, passed }], summary: string }>}
 */
export const submitCode = async ({ code, challenge }) => {
  const tests = challenge?.tests || [];
  await sleep(500);

  if (!code || !code.trim()) {
    return {
      passedAll: false,
      results: tests.map((t) => ({ name: t.name, passed: false })),
      summary: 'Submission failed — the editor is empty.',
    };
  }

  // Staggered per-test evaluation so the UI can animate progress.
  const results = [];
  for (const t of tests) {
    await sleep(420);
    results.push({ name: t.name, passed: true });
  }

  const passedCount = results.filter((r) => r.passed).length;
  return {
    passedAll: passedCount === results.length,
    results,
    summary:
      passedCount === results.length
        ? `All ${results.length} test cases passed. Great work!`
        : `${passedCount}/${results.length} test cases passed.`,
  };
};

export default { runCode, submitCode };
