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
            var viewMode = document.getElementById('viewMode');
            var editMode = document.getElementById('editMode');
            var editButton = document.getElementById('editButton');
            var saveButton = document.getElementById('saveButton');
            var cancelButton = document.getElementById('cancelButton');

            // Handle editable field mode with improved UX
            if (editableField) {
                var currentUrl = fieldValue || '';

                // Function to switch to viewing mode
                function showViewMode() {
                    var displayUrl = currentUrl;
                    var displayTitle = titleUrlText;

                    // Handle URL template replacement
                    if (url === '{field}' || isEmpty(url)) {
                        displayUrl = currentUrl;
                    } else {
                        displayUrl = url.replace('{field}', currentUrl);
                    }

                    if (isEmpty(displayTitle)) {
                        displayTitle = displayUrl;
                    }

                    if (!isEmpty(displayUrl)) {
                        urlField.innerText = displayTitle;
                        urlField.href = displayUrl;
                        urlField.title = displayUrl;
                        urlField.style.display = 'inline-block';
                        editButton.style.display = 'inline-block';
                        viewMode.style.display = 'block';
                        editMode.style.display = 'none';
                    } else {
                        // No URL yet, show edit mode for initial entry
                        showEditMode();
                    }
                }

                // Function to switch to editing mode
                function showEditMode() {
                    urlInput.value = currentUrl;
                    viewMode.style.display = 'none';
                    editMode.style.display = 'block';
                    urlInput.focus();
                }

                // Edit button click handler
                if (!editButton.hasAttribute('data-listener-added')) {
                    editButton.addEventListener('click', function() {
                        showEditMode();
                    });
                    editButton.setAttribute('data-listener-added', 'true');
                }

                // Save button click handler
                if (!saveButton.hasAttribute('data-listener-added')) {
                    saveButton.addEventListener('click', function() {
                        var newValue = urlInput.value.trim();
                        service.setFieldValue(fieldName, newValue).then(function() {
                            currentUrl = newValue;
                            showViewMode();
                        });
                    });
                    saveButton.setAttribute('data-listener-added', 'true');
                }

                // Cancel button click handler
                if (!cancelButton.hasAttribute('data-listener-added')) {
                    cancelButton.addEventListener('click', function() {
                        // Revert to current saved value
                        urlInput.value = currentUrl;
                        if (!isEmpty(currentUrl)) {
                            showViewMode();
                        }
                    });
                    cancelButton.setAttribute('data-listener-added', 'true');
                }

                // Enter key in input = Save
                if (!urlInput.hasAttribute('data-listener-added')) {
                    urlInput.addEventListener('keypress', function(e) {
                        if (e.key === 'Enter') {
                            saveButton.click();
                        }
                    });
                    urlInput.setAttribute('data-listener-added', 'true');
                }

                // Initial display - Edit button is always visible in view mode
                currentUrl = fieldValue || '';
                showViewMode();

            } else {
                // Original behavior - not editable
                var displayUrl = url.replace('{field}', fieldValue);

                if (isEmpty(titleUrlText)) {
                    titleUrlText = displayUrl;
                }

                if (hideUrlIfEmptyField && isEmpty(fieldValue)) {
                    urlField.innerText = "";
                    urlField.href = urlField.title = "";
                    urlField.style.display = 'none';
                } else {
                    urlField.innerText = titleUrlText;
                    urlField.href = urlField.title = displayUrl;
                    urlField.style.display = 'block';
                }

                viewMode.style.display = 'block';
                editButton.style.display = 'none';
                editMode.style.display = 'none';
            }
        });
    });
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
