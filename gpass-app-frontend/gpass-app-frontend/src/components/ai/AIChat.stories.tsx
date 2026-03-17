import type { Meta, StoryObj } from '@storybook/react'
import { AIChat } from '@/components/ai/AIChat'

const meta = {
  title: 'Components/AI/AIChat',
  component: AIChat,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AIChat>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default AIChat komponens
 * A teljes chat interfész előzménnyel
 */
export const Default: Story = {
  args: {},
  render: () => <AIChat />,
  decorators: [
    (Story) => (
      <div className="h-screen flex flex-col">
        <Story />
      </div>
    ),
  ],
}

/**
 * AIChat beágyazva egy card-ban
 */
export const Embedded: Story = {
  args: {
    className: 'rounded-lg border',
  },
  render: (args) => (
    <div className="h-96 border rounded-lg overflow-hidden">
      <AIChat {...args} />
    </div>
  ),
}
