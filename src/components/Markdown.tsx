import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

export const Markdown = ({ children }: { children: string }) => (
  <ReactMarkdown plugins={[gfm]} escapeHtml={true} children={children} />
);

export default Markdown;
