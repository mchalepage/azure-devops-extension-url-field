# URL Field - a custom work item control
## Azure DevOps extension

### Year 2023 notification
Dear Users,
Due to greatly reduced amount of free time since last year (a family of five!), I am unable to continue supporting this project at all.
Please accept its current state as it is and feel free to fork it and publish your own version.
Best regards,
Krystian

### Usage

This custom control allows you to add a clickable URL on your workitem form, that can optionally use another field as a variable in that URL. Depending on your needs, there are four different ways you can use this custom control extension:

1. A fixed static URL that is always the same for every workitem.
2. A dynamic URL that combines a static base URL with some parametres taken from an other field.
3. A manual URL that is fully based on an other field.
4. **NEW**: An editable URL field where users can directly enter/paste URLs without needing a separate field.

The typical scenario for this custom control is option number two, see the following example below:

Let's assume that in your Azure DevOps instance, you have a custom field on a bug form. It's a simple string field that stores a ServiceNow incident number. Then, you can create an URL Field that would combine your SN web address with this SN number, e.g.:

URL `https://company.service-now.com/nav_to.do?uri=incident.do?sysparm_query=number={field}`
Field `ServiceNow Incident`

When you open your work item, `{field}` will be replaced by a value from a selected field. Have a look at screenshots to see the output.

For scenario 1, you simple need to skip `{field}` in URL option, so nothing is replaced (a fixed link).
For scenario 3, you simple need to enter *only* `{field}` in URL option, so everything is replaced (a manual link, fully based on an another field).

#### New: Editable URL Field (Scenario 4)

For scenario 4, enable the "Editable URL Field" option. This allows users to directly enter or paste URLs without needing to create a separate field on the form:

Configuration:
- URL: `{field}` (or leave empty)
- Field: Select any string field to store the URL
- Editable URL Field: `true`
- Title: (optional) Display text for the link

When configured, users will see an input box where they can type or paste a URL. The URL is automatically saved to the selected field and displayed as a clickable link below the input. This eliminates the need for two separate fields on your form.

### License

Licensed under the EUPL-1.2-or-later

Full text in 23 official languages is available at https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
