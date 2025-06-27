"use client";

import "@mdxeditor/editor/style.css";
import "./styles.css";
import { useState, useEffect } from "react";
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

export default function QuestionEditor({ initialMarkdown = "", fieldName = "description", setMarkdown }) {
  const [ready, setReady] = useState(false);
  const [markdown, localSetMarkdown] = useState(initialMarkdown);

  useEffect(() => {
    setReady(true);
  }, []);

  const handleChange = (value) => {
    localSetMarkdown(value);
  };

  if (!ready) return null;

  return (
    <div
      style={{
        boxShadow: "10px 4px 12px rgba(185, 185, 185, 0.5)",
        backgroundColor: "rgba(230, 230, 230, 0.5)",
        padding: "8px",
        borderRadius: "8px",
      }}
    >
      <input type="hidden" name={fieldName} value={markdown} />
      <MDXEditor
        markdown={markdown}
        placeholder="Add your question's description and utilise the toolbar above."
        onChange={handleChange}
        className="markdown-editor w-full border"
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
            autoLoadLanguageSupport: true
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
