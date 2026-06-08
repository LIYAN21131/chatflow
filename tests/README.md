# Regression Test Policy

This directory is the permanent bug memory for the task extraction engine.

## Case Groups

- `basic-cases.ts`: core submit, organize, assign tasks.
- `date-cases.ts`: relative dates, explicit dates, and time parsing.
- `event-cases.ts`: exams, meetings, classes, activities, and ranges.
- `notice-cases.ts`: notification and URL-heavy messages.
- `multi-task-cases.ts`: one chat message producing multiple tasks.
- `real-world-cases.ts`: real user chat records and product-facing examples.
- `bug-regression-cases.ts`: bugs that have already happened and must never return.

## Rule

Fixing a bug always means:

1. Change the recognition logic.
2. Add a `BugRegressionCase`.
3. Run `npm run test:regression`.

Missing any one of these means the bug is not considered fixed.

## Run

```bash
npm run test:regression
```

The command prints one line per bug:

```text
✓ Bug-001
✗ Bug-004
```

When any case fails, the command exits with a non-zero status.
