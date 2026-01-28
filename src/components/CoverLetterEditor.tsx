import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { useEffect, useState } from 'react'
import { Bold, Highlighter, Italic, List, ListOrdered, Strikethrough, TextAlignCenter, TextAlignEnd, TextAlignJustify, TextAlignStart, Underline as UnderlineIcon, Link as LinkIcon, Undo2, Redo2, Heading1, Heading2, File, Download, Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FONT_FAMILIES } from "../lib/editor/fonts"
import { downloadCoverLetterPdf } from '@/lib/pdf/downloadCoverLetterPdf'
import { copyCoverLetter } from '@/lib/pdf/copyCoverLetter'


type Props = {
  coverLetter: string | null
  onChange?: (html: string) => void
}

/* ---------------- NORMALIZATION ---------------- */

function detectType(input: string) {
  if (/<\/?[a-z][\s\S]*>/i.test(input)) return 'html'
  if (/(\*\*|__|\[.*?\]\(.*?\))/g.test(input)) return 'markdown'
  return 'text'
}

function normalizeToHtml(input: string) {
  const type = detectType(input)

  if (type === 'html') return input
  if (type === 'markdown') return marked.parse(input) as string

  return input
    .split(/\n{2,}/)
    .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('')
}

function extractBody(html: string) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  return match ? match[1] : html
}

function sanitize(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'strong', 'em', 'u', 's',
      'ul', 'ol', 'li',
      'a', 'br', 'span',
      'h1', 'h2', 'h3'
    ],
    ALLOWED_ATTR: ['href', 'style'],
  })
}

/* ---------------- COMPONENT ---------------- */

export default function CoverLetterEditor({ coverLetter ,onChange}: Props) {
  const [color, setColor] = useState('#2563EB')
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'h-[350px] overflow-y-auto p-6 prose max-w-none focus:outline-none',
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getHTML())
    },
  })

  const processing = !editor || !coverLetter

  useEffect(() => {
    if (!editor || !coverLetter) return

    const html = sanitize(
      normalizeToHtml(
        extractBody(coverLetter)
      )
    )

    editor.commands.setContent(html, { emitUpdate: false })


  }, [editor, coverLetter])

  // const html = editor.getHTML()
  // console.log("from editor", html)

  if (!editor) return null

  if (processing) {
    return (
      <div className="h-[300px] max-w-[400px] flex flex-col items-center justify-center mx-auto mt-20 bg-gray-50 rounded-lg shadow-md p-6">

        <div className="text-center">
          <p className="text-gray-500 text-lg font-medium">
            Your cover letter will appear here shortly
          </p>
          <p className="text-gray-400 mt-2 text-sm">
            Once generated, you can edit, style, and download it
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <div className=" p-3  shadow  bg-slate-700  rounded-full hover:bg-slate-800 transition-colors">
            <File size={40} className="text-white" />
          </div>
        </div>

        <div className="mt-6 w-full space-y-2">
          <div className="h-3 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded-full animate-pulse w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="rounded bg-white text-black ">

      {/* ----------TOOLBAR ---------- */}
      <div className="flex flex-wrap gap-3 border-b border-slate-200 p-3 sticky top-0 z-10 bg-white">

        <Select
          onValueChange={(value) => {
            editor.chain().focus().setFontFamily(value).run()
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font: any) => (
              <SelectItem
                value={font.value}
                key={font.value}
                style={{ fontFamily: font.value }}
              >
                {font.label}
              </SelectItem>

            ))}

          </SelectContent>
        </Select>


        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => editor.chain().focus().toggleBold().run()}><Bold /></Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => editor.chain().focus().toggleItalic().run()}><Italic /></Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon /></Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Underline</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough /></Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Strike</p>
          </TooltipContent>
        </Tooltip>


        <Input
          type="color"
          value={color}
          className="w-[42px] h-8 p-0 border-none"
          onChange={(e) => {
            const value = e.target.value
            setColor(value)
            editor.chain().focus().setColor(value).run()
          }}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => editor.chain().focus().toggleHighlight().run()}><Highlighter /></Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Highlight</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => editor.chain().focus().setTextAlign('left').run()}>
              <TextAlignStart />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align-left</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => editor.chain().focus().setTextAlign('center').run()}>
              <TextAlignCenter />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align-center</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => editor.chain().focus().setTextAlign('right').run()}>
              <TextAlignEnd />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align-right</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
              <TextAlignJustify />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align-justify</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => editor.chain().focus().toggleBulletList().run()}>
              <List />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Unordered list</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              <ListOrdered />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ordered list</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                const url = prompt('Enter link')
                if (url) editor.chain().focus().setLink({ href: url }).run()
              }}
            >
              <LinkIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Link</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => editor.chain().focus().undo().run()}> <Undo2 /></Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => editor.chain().focus().redo().run()}> <Redo2 /> </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* ---------- EDITOR ---------- */}
      <div className="prose max-w-none [&_p]:mb-4">
        <EditorContent editor={editor} />
      </div>

      {/* ---------- BUBBLE MENU ---------- */}
      <BubbleMenu
        editor={editor}
        className="bg-white shadow border rounded flex gap-2 p-2"
      >
        <button onClick={() => editor.chain().focus().toggleBold().run()}> <Bold /> </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}> <Italic /> </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}> <UnderlineIcon /> </button>
        <button
          onClick={() => {
            const url = prompt('Enter link')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }}
        >
          <LinkIcon />
        </button>
      </BubbleMenu>

      {/* ---------- FLOATING MENU ---------- */}
      <FloatingMenu
        editor={editor}
        className="bg-white shadow border rounded p-2 flex gap-2"
      >
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List />
        </button>
      </FloatingMenu>

    </div>
    <div className='flex justify-between gap-5 md:gap-10 px-0 pt-10 flex-col md:flex-row '>
      <Button className='flex-1 cursor-pointer text-center bg-white text-black hover:text-white border border-white' onClick={() => downloadCoverLetterPdf(editor)}>
        <Download/> Download PDF
      </Button>

      <Button className='flex-1 cursor-pointer text-center bg-black text-white border border-white hover:bg-white hover:text-black hover:border-0' onClick={() => copyCoverLetter(editor.getText())}>
        <Copy/> Copy
      </Button>
    </div>
    </>
  )
}
