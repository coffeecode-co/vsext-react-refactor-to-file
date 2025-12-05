export class ComponentGenerator {
  /**
   * Generates the React component code block.
   * @param name Name of the component
   * @param content JSX content to be wrapped
   * @param isTypeScript Whether to add TypeScript annotations
   */
  public generate(
    name: string,
    content: string,
    isTypeScript: boolean
  ): string {
    const typeAnnotation = isTypeScript ? ": React.FC" : "";

    return `import React from 'react';

const ${name}${typeAnnotation} = () => {
\treturn (
\t\t${content}
\t);
};

export default ${name};
`;
  }
}
