import { suite } from "uvu";
import * as assert from "uvu/assert";

import { shouldPerformTransition } from "../src";
import { reset, setup } from "./setup/env";

setup();

const shouldPeformTransition = suite("shouldPeformTransition");
shouldPeformTransition.before.each(() => {
  reset();
  document.startViewTransition = (async () => {}) as unknown as any; // eslint-disable-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
});
shouldPeformTransition("has meta", () => {
  document.head.innerHTML = `
    <meta name="view-transition" content="same-origin">
  `;
  assert.ok(shouldPerformTransition());
});
shouldPeformTransition("has no meta", () => {
  assert.not.ok(shouldPerformTransition());
});
shouldPeformTransition("has meta but no startViewTransition", () => {
  document.startViewTransition = undefined as unknown as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  document.head.innerHTML = `
    <meta name="view-transition" content="same-origin">
  `;
  assert.not.ok(shouldPerformTransition());
});

shouldPeformTransition.run();
