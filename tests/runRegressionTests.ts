import { BUG_REGRESSION_CASES, type BugRegressionCase } from "./bug-regression-cases";

const FIXED_NOW = new Date("2026-06-08T08:00:00+08:00");
const NativeDate = Date;

class FixedDate extends NativeDate {
  constructor(
    ...args:
      | []
      | [string | number | Date]
      | [number, number, number?, number?, number?, number?, number?]
  ) {
    if (args.length === 0) {
      super(FIXED_NOW.getTime());
      return;
    }
    if (args.length === 1) {
      super(args[0]);
      return;
    }
    super(...args);
  }

  static now() {
    return FIXED_NOW.getTime();
  }
}

globalThis.Date = FixedDate as DateConstructor;

type ExtractedTask = {
  title?: string;
  summary?: string;
  timeType?: string;
  deadline?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category?: string;
};

function canPassWithoutTask(testCase: BugRegressionCase) {
  const expected = testCase.expected;
  const expectsNoTime =
    expected.timeType === "unknown" &&
    (expected.deadline === undefined || expected.deadline === "");
  const hasPositiveTaskExpectation = Boolean(
    expected.title ||
    expected.summary ||
    expected.startTime ||
    expected.endTime ||
    expected.location ||
    expected.category,
  );

  return expectsNoTime && !hasPositiveTaskExpectation;
}

function compareField(
  testCase: BugRegressionCase,
  task: ExtractedTask | undefined,
  field: keyof BugRegressionCase["expected"],
) {
  const expectedValue = testCase.expected[field];
  if (expectedValue === undefined) return undefined;

  if (!task) {
    return canPassWithoutTask(testCase)
      ? undefined
      : `${field}: expected ${expectedValue}, got no task`;
  }

  const actualValue = task[field];
  if (actualValue === expectedValue) return undefined;
  return `${field}: expected ${expectedValue || "空"}, got ${actualValue || "空"}`;
}

async function main() {
  const { extractTasksFromText } = await import("../src/services/ai/extractTasks");
  const failures: Array<{ id: string; title: string; errors: string[] }> = [];

  for (const testCase of BUG_REGRESSION_CASES) {
    const task = extractTasksFromText(testCase.input)[0];
    const errors = (
      [
        "title",
        "summary",
        "timeType",
        "deadline",
        "startTime",
        "endTime",
        "location",
        "category",
      ] as const
    )
      .map((field) => compareField(testCase, task, field))
      .filter((error): error is string => Boolean(error));

    if (errors.length) {
      failures.push({ id: testCase.id, title: testCase.title, errors });
      console.log(`✗ ${testCase.id} ${testCase.title}`);
      errors.forEach((error) => console.log(`  - ${error}`));
    } else {
      console.log(`✓ ${testCase.id} ${testCase.title}`);
    }
  }

  if (failures.length) {
    console.log(
      `\nFAIL ${failures.length}/${BUG_REGRESSION_CASES.length} bug regression cases failed.`,
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `\nPASS ${BUG_REGRESSION_CASES.length}/${BUG_REGRESSION_CASES.length} bug regression cases passed.`,
  );
}

void main();
