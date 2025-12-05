### context

While developing in react it is often necessary to extract fragments of a component and convert it into a new component, this can be done manually but it is a tedious process, we will try to solve this problem by creating an extension for vscode that allows to extract fragments of a component and convert it into a component in a new file.

### objective

Create an extension for vscode that allows to extract fragments from a component and convert it into a component in a new file.

### tasks

- Identify the user's selection.
- Extract the selected fragment.
- Request the name of the new component.
- Replace the selected fragment with a new component using <NewComponent />.
- Create a new file with the name of the new component in the same folder as the original file.
- Insert the selected fragment into the new file.
