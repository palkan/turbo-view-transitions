import { suite } from "uvu";
import * as assert from "uvu/assert";

import { performTransition } from "../src";
import { reset, setup } from "./setup/env";

setup();

const peformTransitionSuite = suite("peformTransition");
peformTransitionSuite.before.each(() => {
  reset();
  document.startViewTransition = ((callback: () => unknown) => {
    const promise = new Promise<void>((resolve) => {
      callback();
      resolve();
    });

    return { finished: promise };
  }) as unknown as any; // eslint-disable-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
});

peformTransitionSuite(
  "when has one-to-one matching transition elements",
  async () => {
    const fromEl = document.createElement("div");
    fromEl.innerHTML = `
      <h1 data-turbo-transition="title">Hello</h1>
      <div id="target" data-turbo-transition="item">World</div>
      <span id="target2" data-turbo-transition="item">!</span>
      <p id="item_1" data-turbo-transition>1</p>
      <p id="item_2" data-turbo-transition>2</p>
      <p id="item_3" data-turbo-transition>3</p>
    `;

    const toEl = document.createElement("div");
    toEl.innerHTML = `
      <div class="container">
        <h2 data-turbo-transition="title">Hallo</h1>
        <ul>
          <li id="target" data-turbo-transition="item">Welt</li>
        </ul>
        <p id="item_1" data-turbo-transition>1</p>
        <p id="item_3" data-turbo-transition>3</p>
      </div>
    `;

    await performTransition(fromEl, toEl, async () => {
      assert.equal(
        fromEl.querySelector("h1")?.style.viewTransitionName,
        "title",
      );
      assert.equal(toEl.querySelector("h2")?.style.viewTransitionName, "title");
      assert.equal(
        fromEl.querySelector("div")?.style.viewTransitionName,
        "item",
      );
      assert.equal(toEl.querySelector("li")?.style.viewTransitionName, "item");
      assert.equal(fromEl.querySelector("span")?.style.viewTransitionName, "");

      assert.equal(
        (fromEl.querySelector("#item_1") as HTMLElement).style
          .viewTransitionName,
        "$item_1",
      );
      assert.equal(
        (toEl.querySelector("#item_1") as HTMLElement).style.viewTransitionName,
        "$item_1",
      );

      assert.equal(
        (fromEl.querySelector("#item_2") as HTMLElement).style
          .viewTransitionName,
        "",
      );

      assert.equal(
        (fromEl.querySelector("#item_3") as HTMLElement).style
          .viewTransitionName,
        "$item_3",
      );
      assert.equal(
        (toEl.querySelector("#item_3") as HTMLElement).style.viewTransitionName,
        "$item_3",
      );
    });

    assert.equal(fromEl.querySelector("div")?.style.viewTransitionName, "");
    assert.equal(toEl.querySelector("li")?.style.viewTransitionName, "");
    assert.equal(
      (fromEl.querySelector("#item_1") as HTMLElement).style.viewTransitionName,
      "",
    );
    assert.equal(
      (fromEl.querySelector("#item_3") as HTMLElement).style.viewTransitionName,
      "",
    );
  },
);

peformTransitionSuite(
  "when has multiple matching transition elements",
  async () => {
    const fromEl = document.createElement("div");
    fromEl.innerHTML = `
      <ul>
      <li id="a" data-turbo-transition="item">One</li>
      <li id="b" data-turbo-transition="item">Two</li>
      <li id="c" data-turbo-transition="item">Three</li>
    </ul>
    `;

    const toEl = document.createElement("div");
    toEl.innerHTML = `
      <div class="container">
        <ul>
          <li id="b" data-turbo-transition="item">Two</li>
          <li id="c" data-turbo-transition="item">Three</li>
        </ul>
      </div>
    `;

    await performTransition(fromEl, toEl, async () => {
      assert.equal(
        (fromEl.querySelector("#a") as HTMLElement).style.viewTransitionName,
        "",
      );
      assert.equal(
        (fromEl.querySelector("#b") as HTMLElement).style.viewTransitionName,
        "",
      );
      assert.equal(
        (fromEl.querySelector("#c") as HTMLElement).style.viewTransitionName,
        "",
      );
      assert.equal(
        (toEl.querySelector("#b") as HTMLElement).style.viewTransitionName,
        "",
      );
      assert.equal(
        (toEl.querySelector("#c") as HTMLElement).style.viewTransitionName,
        "",
      );
    });
  },
);

peformTransitionSuite.run();
