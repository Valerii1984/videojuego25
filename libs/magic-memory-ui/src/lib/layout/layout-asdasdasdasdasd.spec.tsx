import React from 'react';
import { render } from '@testing-library/react-native';

import LayoutAsdasdasdasdasd from './layout-asdasdasdasdasd';

describe('LayoutAsdasdasdasdasd', () => {
  it('should render successfully', () => {
    const { root } = render(< LayoutAsdasdasdasdasd />);
    expect(root).toBeTruthy();
  });
});
