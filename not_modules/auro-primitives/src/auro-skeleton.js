// Copyright (c) 2021 Alaska Airlines. All right reserved. Licensed under the Apache-2.0 license
// See LICENSE in the project root for license information.

// ---------------------------------------------------------------------

import AuroLibraryRuntimeUtils from "@aurodesignsystem/auro-library/scripts/utils/runtimeUtils.mjs";
// If use litElement base class
import { html, LitElement } from "lit";
import colorCss from "./styles/color.scss";
import styleCss from "./styles/style.scss";
import tokensCss from "./styles/tokens.scss";

// See https://git.io/JJ6SJ for "How to document your components using JSDoc"
/**
 * The auro-skeleton element provides users a way to indicate the loading of asynchronous content on a page.
 *
 * @attr {String} shape - Renders a circle, oval, or rectangle loader.
 */

// build the component class
export class AuroSkeleton extends LitElement {
  constructor() {
    super();

    /**
     * @private
     */
    this.runtimeUtils = new AuroLibraryRuntimeUtils();
  }

  // function to define props used within the scope of this component
  static get properties() {
    return {
      // ...super.properties,
    };
  }

  static get styles() {
    return [styleCss, colorCss, tokensCss];
  }

  /**
   * This will register this element with the browser.
   * @param {string} [name="auro-skeleton"] - The name of element that you want to register to.
   *
   * @example
   * AuroSkeleton.register("custom-skeleton") // this will register this element to <custom-skeleton/>
   *
   */
  static register(name = "auro-skeleton") {
    AuroLibraryRuntimeUtils.prototype.registerComponent(name, AuroSkeleton);
  }

  firstUpdated() {
    // Add the tag name as an attribute if it is different than the component name
    this.runtimeUtils.handleComponentTagRename(this, "auro-skeleton");
  }

  // When using auroElement, use the following attribute and function when hiding content from screen readers.
  // aria-hidden="${this.hideAudible(this.hiddenAudible)}"

  // function that renders the HTML and CSS into  the scope of the component
  render() {
    return html`
      <span class="util_displayHiddenVisually">Loading...</span>
    `;
  }
}
