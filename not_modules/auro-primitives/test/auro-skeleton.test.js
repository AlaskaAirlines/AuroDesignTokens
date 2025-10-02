import { expect, fixture, html } from "@open-wc/testing";
import "../src/registered";

describe("auro-skeleton", () => {
  it("auro-skeleton is accessible", async () => {
    const el = await fixture(html`
      <auro-skeleton circle></auro-skeleton>
    `);

    await expect(el).to.be.accessible();
  });

  it("auro-skeleton custom element is defined", async () => {
    const el = await !!customElements.get("auro-skeleton");

    await expect(el).to.be.true;
  });
});
