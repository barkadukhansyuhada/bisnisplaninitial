
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';

test('renders dashboard title', () => {
  render(<Dashboard />);
  const linkElement = screen.getByText(/Dashboard – Data Room & Readiness/i);
  expect(linkElement).toBeInTheDocument();
});
