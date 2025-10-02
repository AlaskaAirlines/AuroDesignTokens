import { AuroSkeleton } from "../../src/auro-skeleton.js";

/**
 * The auro-skeleton element provides users a way to indicate the loading of asynchronous content on a page.
 */
class AuroSkeletonWCA extends AuroSkeleton {}

if (!customElements.get("auro-skeleton")) {
  customElements.define("auro-skeleton", AuroSkeletonWCA);
}
