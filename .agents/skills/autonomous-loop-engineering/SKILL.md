---
name: autonomous-loop-engineering
description: Strict guidelines for autonomous iteration, self-correction, and tool-driven feedback loops for AI agents.
tags:
  - loop-engineering
  - agents
  - testing
  - autonomous-iteration
  - test-driven-development
---

# autonomous-loop-engineering

## Context
You are an autonomous AI coding agent operating within an iterative execution environment. Your objective is to utilize **Loop Engineering** to solve tasks. You must design, execute, and manage strict feedback loops—writing code, utilizing tools (compilers, linters, test runners) to evaluate output, and iteratively refining the solution based on terminal feedback until a strict Definition of Done (DoD) is met.

## Rules

### 1. Establish the Feedback Baseline First
Before modifying core implementation files, explicitly define and create the verification mechanism. Write or identify the test case, linter configuration, or execution script that will provide objective, automated feedback during your loop. Run it to establish a failing baseline.

### 2. The Iteration Protocol (PEEAC)
Execute your loops using this strict, unyielding sequence:
- **Plan:** State the exact hypothesis for the current iteration.
- **Execute:** Write or modify the required code.
- **Evaluate:** Run the verification tools. Execute test runners (e.g., `bun run test`, `php artisan test`, `tsc`). Execute relevant linters (e.g., `pint`, `rector`, and optionally `phpstan` for Laravel environments).
- **Analyze:** Read the terminal output. If the execution fails, explicitly write out *why* it failed based on the stack trace before attempting a fix.
- **Commit:** If the verification passes (0 errors), commit the changes immediately using the `atomic-semantic-commits` skill before proceeding to the next task. 

### 3. State and Context Management
- **Prevent Context Bloat:** If a loop exceeds 3 consecutive failures, synthesize a brief summary of what has been attempted, what failed, and why. Do not pollute the context window with endless, unanalyzed stack traces.
- **Hypothesis Variation:** Never attempt the exact same logical approach twice. If a specific architectural path or method fails, you must pivot to a fundamentally different approach.

### 4. Halting Conditions
- **Success:** All tests and linters pass with zero errors. Proceed to commit.
- **Hard Halt:** If you fail to resolve the issue after **4 consecutive attempts**, you must STOP. Summarize the blocker, document the attempted solutions, and explicitly ask the human user for architectural guidance or intervention.

## Examples

### Good: Establishing a strict test-driven loop
```text
Goal: Implement a data parser.

1. Plan: I will write `ParserTest.php` first to define expected outputs, then run it to establish a baseline failure.
2. Execute: [Generates ParserTest.php]
3. Evaluate: Running `php artisan test --filter ParserTest`. Result: Fails (Class not found).
4. Analyze: The baseline is established. I will now create `Parser.php` to satisfy the tests.

```

### Good: Analyzing failure and pivoting hypothesis

```text
Evaluate: Running `bun run test`. Result: Failed. NullReferenceException on line 42.

Analyze: Attempt 1 failed because I assumed the external API always returns an array. The payload actually returns null when empty.
Plan: For Attempt 2, I will pivot my approach to include an early-return null check before mapping the dataset.
Execute: [Modifies line 42]
Evaluate: Running `bun run test`. Result: Passed.
Commit: Using atomic-semantic-commits to save this state.

```

## Anti-patterns

* **Whack-a-mole:** Immediately generating a fix based purely on an error code without reading the surrounding stack trace or analyzing the root cause.
* **Infinite Looping:** Trying the exact same logic multiple times in a row, or toggling infinitely between two failed states (e.g., State A -> State B -> State A -> State B).
* **Symptom Suppression:** Fixing a compilation or linting error by suppressing the warning (e.g., adding `// @ts-ignore`, using `any`, or disabling a PHPStan rule) rather than satisfying the underlying structural requirement.
* **Silent Failures:** Writing or modifying code and assuming it works perfectly without explicitly calling a command-line tool (test or linter) to verify it.

## References

* [The Art of Loop Engineering (LangChain)](https://www.langchain.com/blog/the-art-of-loop-engineering)
* [Loop Engineering (Addy Osmani)](https://addyosmani.com/blog/loop-engineering/)
* [Loop Engineering Concepts (Cobus Greyling)](https://cobusgreyling.medium.com/loop-engineering-62926dd6991c)
