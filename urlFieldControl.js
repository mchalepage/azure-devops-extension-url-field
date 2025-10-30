function isEmpty(str) {
    return (!str || 0 === str.length);
}

function urlFieldUpdate (workItemServices) {
    workItemServices.WorkItemFormService.getService().then(function (service) {
        var url = VSS.getConfiguration().witInputs.Url;
        var titleUrlText = VSS.getConfiguration().witInputs.Title;
        var fieldName = VSS.getConfiguration().witInputs.Field;
        var hideUrlIfEmptyField = (VSS.getConfiguration().witInputs.HideUrlIfEmptyField.toLowerCase() === 'true');
        var editableField = VSS.getConfiguration().witInputs.EditableField &&
                           (VSS.getConfiguration().witInputs.EditableField.toLowerCase() === 'true');

        service.getFieldValues([fieldName]).then(function (value) {
            var fieldValue = value[fieldName];

            var urlInput = document.getElementById('urlInput');
            var urlField = document.getElementById('urlField');

            // Handle editable field mode
            if (editableField) {
                // Show the input field
                urlInput.style.display = 'block';
                urlInput.value = fieldValue || '';

                // Set up input change handler (only once)
                if (!urlInput.hasAttribute('data-listener-added')) {
                    urlInput.addEventListener('blur', function() {
                        var newValue = urlInput.value.trim();
                        service.setFieldValue(fieldName, newValue).then(function() {
                            // Update the link after saving
                            updateLink(newValue, titleUrlText, url, hideUrlIfEmptyField, urlField);
                        });
                    });

                    // Also handle Enter key
                    urlInput.addEventListener('keypress', function(e) {
                        if (e.key === 'Enter') {
                            urlInput.blur(); // Trigger the blur event to save
                        }
                    });

                    urlInput.setAttribute('data-listener-added', 'true');
                }

                // Update the link based on current input value
                updateLink(fieldValue, titleUrlText, url, hideUrlIfEmptyField, urlField);
            } else {
                // Original behavior - not editable
                urlInput.style.display = 'none';
                url = url.replace('{field}', fieldValue);

                if (isEmpty(titleUrlText)) {
                    titleUrlText = url;
                }

                if (hideUrlIfEmptyField && isEmpty(fieldValue)) {
                    urlField.innerText = "";
                    urlField.href = urlField.title = "";
                } else {
                    urlField.innerText = titleUrlText;
                    urlField.href = urlField.title = url;
                }
            }
        });
    });
}

function updateLink(fieldValue, titleUrlText, urlTemplate, hideUrlIfEmptyField, urlField) {
    var url = urlTemplate.replace('{field}', fieldValue || '');

    // If URL template is just {field} or empty, use the field value directly as the URL
    if (urlTemplate === '{field}' || isEmpty(urlTemplate)) {
        url = fieldValue || '';
    }

    if (isEmpty(titleUrlText)) {
        titleUrlText = url;
    }

    if (hideUrlIfEmptyField && isEmpty(fieldValue)) {
        urlField.innerText = "";
        urlField.href = urlField.title = "";
    } else if (!isEmpty(url)) {
        urlField.innerText = titleUrlText;
        urlField.href = urlField.title = url;
    } else {
        urlField.innerText = "";
        urlField.href = urlField.title = "";
    }
}

VSS.require(["TFS/WorkItemTracking/Services"], function(workItemServices) {
    VSS.register(VSS.getContribution().id, () => {
        return {
            onLoaded: () => {
                urlFieldUpdate(workItemServices);
            },
            onSaved: () => {
                urlFieldUpdate(workItemServices);
            },
            onRefreshed: () => {
                urlFieldUpdate(workItemServices);
            }
        }
    });
    VSS.notifyLoadSucceeded();
});
