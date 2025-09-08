import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { DemoPage } from './DemoPage';

const meta = {
  title: 'useSidebar',
  component: DemoPage,
  tags: ['autodocs'],
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    closeOnOutsideClick: true,
    breakpoints: {
      full: 992,
      mini: 768,
      hidden: 0,
    },
  },
};

export const OnlyMini: Story = {
  args: {
    closeOnOutsideClick: true,
    breakpoints: {
      mini: 768,
      hidden: 0,
    },
  },
};
