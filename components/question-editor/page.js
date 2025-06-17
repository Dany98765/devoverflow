// "use client";
// import "@mdxeditor/editor/style.css";
// import {
//   headingsPlugin,
//   listsPlugin,
//   quotePlugin,
//   thematicBreakPlugin,
//   markdownShortcutPlugin,
//   MDXEditor
// } from "@mdxeditor/editor";
// import { useEffect, useState } from "react";
// import "./styles.css"

// export default function QuestionEditor({ editorRef, initialMarkdown = "" }) {
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     setReady(true);
//   }, []);

//   if (!ready) return null;

//   return (
//     <div style={{ boxShadow: "10px 4px 12px rgba(185, 185, 185, 0.5)" }}>
//         <MDXEditor
//         plugins={[
//             headingsPlugin(),
//             listsPlugin(),
//             quotePlugin(),
//             thematicBreakPlugin(),
//             markdownShortcutPlugin()
//         ]}
//         ref={editorRef}
//         markdown={initialMarkdown}  // Changed from initialMarkdown to markdown
//         />
//     </div>
//   );
// }
"use client";

import "@mdxeditor/editor/style.css";
import "./styles.css";

import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  toolbarPlugin,
  UndoRedo,
  Separator,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  imagePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin
} from "@mdxeditor/editor";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function QuestionEditor({ editorRef, initialMarkdown = "" }) {
  const [ready, setReady] = useState(false);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? [basicDark] : [];

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div 
    style={{
      boxShadow: "10px 4px 12px rgba(185, 185, 185, 0.5)",
      backgroundColor: "rgba(230, 230, 230, 0.5)", // dark background
      color: "#ffffff",           // white text
      padding: "8px",
      borderRadius: "8px",
    }}>
      <MDXEditor
        ref={editorRef}
        markdown={initialMarkdown}
        placeholder="Add your question's description and uitilise the tool bar above."
        onChange={() => {}} // optional: hook this if you want live updates
        className="background-light800_dark200 light-border-2 markdown-editor dark-editor w-full border"
        key={resolvedTheme}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          tablePlugin(),
          imagePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              css: "css",
              txt: "txt",
              sql: "sql",
              html: "html",
              saas: "saas",
              scss: "scss",
              bash: "bash",
              json: "json",
              js: "javascript",
              ts: "typescript",
              "": "unspecified",
              tsx: "TypeScript (React)",
              jsx: "JavaScript (React)",
            },
            autoLoadLanguageSupport: true,
            codeMirrorExtensions: theme,
          }),
          diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
          toolbarPlugin({
            toolbarContents: () => (
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    fallback: () => (
                      <>
                        <UndoRedo />
                        <Separator />
                        <BoldItalicUnderlineToggles />
                        <Separator />
                        <ListsToggle />
                        <Separator />
                        <CreateLink />
                        <InsertImage />
                        <Separator />
                        <InsertTable />
                        <InsertThematicBreak />
                        <InsertCodeBlock />
                      </>
                    ),
                  },
                ]}
              />
            ),
          }),
        ]}
      />
    </div>
  );
}
