## 1) Mission & Scope
- Goal: make the smallest correct edit to satisfy the request.
- Never expand scope. No new features, files, folders, or dependencies unless explicitly asked.

## 2) Change Policy
- Edit only the necessary lines in already-touched files.
- No refactors, abstractions, renames, or restructures unless explicitly requested.
- Keep behavior and public API stable unless the task requires change.

## 3) n8n Node Contract
- Parameters: use `noDataExpression: true` where applicable; validate inputs.
- Execute loop: use `this.getNodeParameter(..., i, default)` per item.
- Continue-on-fail: if `this.continueOnFail()` push `{ json: { error: <message> }, pairedItem: i }` and continue.
- Output shape: always `return [items.map(x => ({ json: x }))]` or `[{ json: data }]`.
- Pagination: never load unbounded lists; respect `returnAll/limit` and API page size.
- Memory: do not accumulate large arrays unnecessarily; slice to `limit` when `returnAll` is false.
- No side effects. No logging of sensitive data. No hidden global state.

## 4) TypeScript & Lint Contract
- Strict types; avoid `any`. Prefer narrow types over broad casts.
- Remove unused imports/variables. Match existing formatting. Pass existing ESLint rules.
- Naming: PascalCase for classes/types; camelCase for variables/functions; kebab-case for filenames.
- Imports: group and sort deterministically (builtin, external, internal); no unused/default-when-named exists.
- No TODO comments; implement or ask-first. No magic numbers — extract to local `const`.
- EOF: exactly one trailing newline; no extra blank lines.

## 5) Error Handling
- Throw short, sanitized errors: `new Error("WeValu API: <short reason>")`.
- Special cases: 401/403 → clear auth/permission messages; 429 → suggest retry; network → short retry or surface cleanly.
- Try/catch scope: keep narrow; do not wrap entire `execute` unless necessary.
- Bounded retries only for transient network errors; never infinite/back-to-back loops.
- Never expose stack traces, tokens, or PII.

## 6) Security
- No hardcoded secrets/URLs/tokens.
- Use existing credential/request helpers only; no custom auth flows.
- Sanitize and validate all external input before returning.
- Logging: no `console.*`; use `this.logger.info/error` and never log secrets or payloads.

## 7) Commit/PR Protocol
- One logical change per commit/PR.
- Commit message: concise, action + scope (e.g., `fix(node/employee): validate limit`).
- Don’t bump versions unless explicitly asked.

## 8) Ask-First Policy (must stop and ask)
- New file/function/module extraction.
- Changing node/credential names or public parameters.
- Adding dependencies or altering build/lint configs.
- Unclear requirements or multiple valid designs.
- Breaking changes, behavior changes, or wide refactors.
- Nontrivial error-handling policy changes.

## 9) Output Format for AI
- Provide only the necessary edits. No extra examples or boilerplate.
- If blocked by ambiguity, ask precise questions with 2–3 options.
- Keep responses minimal, focused, and immediately actionable.

## 10) Short Checklist
- [ ] Scope respected; no extra changes.
- [ ] Edits minimal; only necessary lines touched.
- [ ] Types strict; lints pass; no unused code.
- [ ] n8n contract respected (params, execute, output, pagination/memory).
- [ ] Errors short and sanitized; security/logging rules followed.
