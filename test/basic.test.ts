import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils/e2e";

describe("vuetify-module (Nuxt 4)", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/basic", import.meta.url)),
  });

  it("renders the index page with v-app", async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch("/");
    expect(html).toContain("v-app");
  });
  it("includes Vuetify styles", async () => {
    const html = await $fetch("/");
    expect(html).toContain("vuetify");
  });

  it("has theme CSS variables configured", async () => {
    const html = await $fetch("/");
    expect(html).toContain("--v-theme-primary");
  });
});
