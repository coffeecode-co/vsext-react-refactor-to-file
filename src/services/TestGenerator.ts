export class TestGenerator {
  /**
   * Generates a basic test file code block (React Testing Library).
   * @param componentName Name of the component
   */
  public generate(componentName: string): string {
    return `import React from 'react';
import { render, screen } from '@testing-library/react';
import ${componentName} from '../${componentName}';

describe('${componentName}', () => {
    test('renders successfully', () => {
        render(<${componentName} />);
        // Add your assertions here
    });
});
`;
  }
}
