import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { DemoPage } from './DemoPage';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'useSidebar',
  component: DemoPage,
  tags: ['autodocs'],
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {},
};
