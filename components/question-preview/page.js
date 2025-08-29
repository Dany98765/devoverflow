import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

export default async function PreviewDesc({ content }){
  const formattedContent = content?.replace(/\\/g, "").replace(/&#x20;/g, "");
  return (
    <section className="markdown prose grid break-words">
      <MDXRemote
        source={formattedContent}
        components={{
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
            />
          ),
        }}
      />
    </section>
  );
};