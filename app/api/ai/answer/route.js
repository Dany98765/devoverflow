import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { question, content } = await req.json();

    try {

      const { text } = await generateText({
        model: openai.chat("gpt-3.5-turbo"),
        prompt: `Generate a markdown-formatted response to the following question: ${question}. Base it on the provided content: ${content}`,
        system:
          "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).",
      });
  
      return NextResponse.json({ success: true, data: text }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message, error: error });
    }
}