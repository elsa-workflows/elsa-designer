import { FunctionalComponent, h } from '@stencil/core';

interface HtmlFragmentProps {
  content: string;
}

export const HtmlFragment: FunctionalComponent<HtmlFragmentProps> = ({ content }) => (
  <div innerHTML={content}></div>
);
