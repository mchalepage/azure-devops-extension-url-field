# URL Field + for Azure DevOps

Enhanced work item control that keeps important URLs readable, editable, and in sync with the data on your Azure Boards work items.

## What it does
- Supports four usage patterns: static link, dynamic URL with `{field}` substitution, full field replacement, and inline editable URL entry.
- Switches between compact view mode and edit mode without leaving the work item form; Save and Cancel keep the experience fast and predictable.
- Optionally hides the link when the backing field is empty so boards stay uncluttered.
- Works with any string-compatible field type, including multi-line text for longer URLs.

## Scenarios
- **Static URL**: Provide only the `URL` input. Every work item shows the same link.
- **Dynamic URL**: Include `{field}` in the `URL` input and pick a field. The placeholder is replaced with the field value (e.g. ServiceNow ticket numbers).
- **Manual URL**: Use `{field}` as the entire URL template. The control renders whatever is stored in the chosen field.
- **Inline editable URL**: Set `Editable URL Field` to `true` and select a field. Users edit directly in the control; changes are saved back to the field when they hit the Update icon or press Enter.

## UX details
- View mode shows a single link with the optional title and an Edit button. Empty values automatically prompt for entry.
- Edit mode exposes a text box plus Update and Cancel icon buttons (using the built-in Bowtie icon font) with accessible labels; the input receives focus for quick updates.
- Responsive flex layout keeps the link/input and actions on one line when there is room, then wraps cleanly without clipping on smaller screens; the surface stays within the 32–38px height Azure DevOps allocates for single-line fields.
- Honors Azure DevOps light, dark, and high-contrast themes so the control stays legible in every mode.
- The link opens in a new tab (`target="_blank"`), keeping the work item context intact.
- Hide-if-empty prevents blank anchors for teams that only fill the value occasionally.

## Configure in Azure DevOps
Add the control to a work item form and supply these inputs:
- `URL` *(required)*: Literal URL or template containing `{field}`.
- `Title`: Optional text shown instead of the raw URL.
- `Field`: Backing work item field. Required for templates and editable mode.
- `HideUrlIfEmptyField`: `true` to suppress the link when the field has no data.
- `EditableField`: `true` to enable inline editing.

## Install and use
- Install the published extension from the Marketplace or package the contents of this repo with `tfx extension create --manifest-globs vss-extension.json`.
- In your process editor, add *URL Field +* to the desired group on the work item form and provide the inputs above.
- For editable URLs, back the control with a multi-line text field if you expect URLs over 255 characters.

## Local development
- `npm install` downloads the Azure DevOps SDK referenced by `index.html`.
- `index.html` hosts the control shell and loads `urlFieldControl.js` for behavior.
- Layout and styling live in `urlFieldControl.css`; theme tokens from Azure DevOps drive colors so updates stay in sync with the host UI. Tweak spacing or responsiveness there.
- Update the HTML and JS directly, then rebuild the VSIX package with `tfx extension create` when ready to test or publish.

## Credits and license
- Based on the original [URL Field](https://github.com/krypu/azure-devops-extension-url-field) by Krystian Andrzejewski (EUPL-1.2-or-later).
- Enhancements © 2025 McHale. Distributed under EUPL-1.2-or-later; see `LICENSE.txt` for the full text.
