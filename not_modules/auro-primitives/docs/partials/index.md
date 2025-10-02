<!--
The index.md file is a compiled document. No edits should be made directly to this file.
README.md is created by running `npm run build:docs`.
This file is generated based on a template fetched from `./docs/partials/index.md`
-->

# Skeleton

<!-- AURO-GENERATED-CONTENT:START (FILE:src=../docs/partials/description.md) -->
<!-- AURO-GENERATED-CONTENT:END -->

## auro-skeleton use cases

<!-- AURO-GENERATED-CONTENT:START (FILE:src=../docs/partials/useCases.md) -->
<!-- AURO-GENERATED-CONTENT:END -->

## Do not...

`<auro-skeleton>` should not be used on action components like `<auro-button>`, `<auro-input>` or `<auro-radio>`.

Do not represent a loading state with `<auro-skeleton>` for an entire component such as a toast notification, dropdown menus, or a modal dialog. It is appropriate to use `<auro-skeleton>` for content inside those components, but never for the entire component.

## Default examples

The `<auro-skeleton>` API consists of a standardized enumerated `shape` attribute and the use of customized CSS. The following examples illustrate use cases to include `circle`, `oval` and `rectangle`. With the use of CSS the user has infinite options for how the animated skeleton can be used in their loading UI.

<div class="exampleWrapper">
  <!-- AURO-GENERATED-CONTENT:START (FILE:src=../apiExamples/basic.html) -->
  <!-- AURO-GENERATED-CONTENT:END -->
</div>

<auro-accordion alignRight>
  <span slot="trigger">See code</span>

<!-- AURO-GENERATED-CONTENT:START (CODE:src=../apiExamples/basic.html) -->
<!-- AURO-GENERATED-CONTENT:END -->

</auro-accordion>

## Be creative

Use your imagination. Wherever data can be placed, an `<auro-skeleton>` element can be used. In the following example see how `<auro-skeleton>` is used in place where data will be filled once the process is completed.

<div class="exampleWrapper">
  <!-- AURO-GENERATED-CONTENT:START (FILE:src=../apiExamples/table_example.html) -->
  <!-- AURO-GENERATED-CONTENT:END -->
</div>

<auro-accordion alignRight>
  <span slot="trigger">See code</span>

<!-- AURO-GENERATED-CONTENT:START (CODE:src=../apiExamples/table_example.html) -->
<!-- AURO-GENERATED-CONTENT:END -->

</auro-accordion>

## Recommended Use and Version Control

There are two important parts of every Auro component. The <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes">class</a> and the custom element. The class is exported and then used as part of defining the Web Component. When importing this component as described in the <a href="#install">install</a> section, the class is imported and the `auro-skeleton` custom element is defined automatically.

To protect from versioning conflicts with other instances of the component being loaded, it is recommended to use our `AuroSkeleton.register(name)` method and pass in a unique name.

```js
import { AuroSkeleton } from '@aurodesignsystem/auro-skeleton/class';

AuroSkeleton.register('custom-skeleton');
```

This will create a new custom element that you can use in your HTML that will function identically to the `<auro-skeleton>` element.

<div class="exampleWrapper exampleWrapper--flex">
  <!-- AURO-GENERATED-CONTENT:START (FILE:src=../apiExamples/custom.html) -->
  <!-- The below content is automatically added from ../apiExamples/custom.html -->
  <custom-skeleton></custom-skeleton>
  <custom-skeleton bordered></custom-skeleton>
  <!-- AURO-GENERATED-CONTENT:END -->
</div>
<auro-accordion alignRight>
  <span slot="trigger">See code</span>
<!-- AURO-GENERATED-CONTENT:START (CODE:src=../apiExamples/custom.html) -->
<!-- The below code snippet is automatically added from ../apiExamples/custom.html -->

```html
<custom-skeleton></custom-skeleton>
<custom-skeleton bordered></custom-skeleton>
```
<!-- AURO-GENERATED-CONTENT:END -->
</auro-accordion>
