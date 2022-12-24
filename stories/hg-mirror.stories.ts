import { html, TemplateResult } from 'lit';
import '../src/components/hg-mirror.js';

export default {
  title: 'HgMirror',
  component: 'hg-mirror',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  title?: string;
  backgroundColor?: string;
}

const Template: Story<ArgTypes> = ({
  title,
  backgroundColor = 'white',
}: ArgTypes) => html`
  <hg-mirror
    style="--hg-mirror-background-color: ${backgroundColor}"
    .title=${title}
  ></hg-mirror>
`;

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
