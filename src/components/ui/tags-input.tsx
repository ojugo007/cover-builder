import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const SPLITTER_REGEX = /[\n#?=&\t,./-]+/
const FORMATTING_REGEX = /^[^a-zA-Z0-9]*|[^a-zA-Z0-9]*$/g

export interface TagsInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  maxItems?: number
  minItems?: number
  dir?: "ltr" | "rtl"
}

export const TagsInput = React.forwardRef<HTMLDivElement, TagsInputProps>(
  (
    {
      value,
      onValueChange,
      placeholder,
      maxItems = Infinity,
      minItems = 0,
      className,
      dir = "ltr",
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState("")
    const [activeIndex, setActiveIndex] = React.useState<number>(-1)

    const canAdd = value.length < maxItems
    const canRemove = value.length > minItems

    const addTag = React.useCallback(
      (tag: string) => {
        const parsed = tag.replace(FORMATTING_REGEX, "").trim()
        if (!parsed || value.includes(parsed) || !canAdd) return
        onValueChange([...value, parsed])
      },
      [value, onValueChange, canAdd]
    )

    const removeTag = React.useCallback(
      (tag: string) => {
        if (!canRemove) return
        onValueChange(value.filter((v) => v !== tag))
      },
      [value, onValueChange, canRemove]
    )

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const items = e.clipboardData
        .getData("text")
        .split(SPLITTER_REGEX)

      const next = [...value]
      for (const item of items) {
        const parsed = item.replace(FORMATTING_REGEX, "").trim()
        if (parsed && !next.includes(parsed) && next.length < maxItems) {
          next.push(parsed)
        }
      }

      onValueChange(next)
      setInputValue("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Enter":
          e.preventDefault()
          if (inputValue.trim()) {
            addTag(inputValue)
            setInputValue("")
          }
          break

        case "Backspace":
        case "Delete":
          if (!inputValue && value.length && canRemove) {
            removeTag(value[value.length - 1])
          }
          break

        case "ArrowLeft":
          if (!inputValue && value.length) {
            setActiveIndex((i) => Math.max(i - 1, 0))
          }
          break

        case "ArrowRight":
          setActiveIndex(-1)
          break
      }
    }

    return (
      <div
        ref={ref}
        dir={dir}
        className={cn(
          "flex flex-wrap items-center gap-1 rounded-md border bg-background p-1 focus-within:ring-2 focus-within:ring-ring",
          className
        )}
        {...props}
      >
        {value.map((tag, index) => (
          <Badge
            key={tag}
            data-active={index === activeIndex}
            variant="secondary"
            className="flex items-center gap-1 px-2"
          >
            <span className="text-xs">{tag}</span>
            <button
              type="button"
              disabled={!canRemove}
              onClick={() => removeTag(tag)}
              className="disabled:opacity-50"
            >
              <X className="h-3 w-3 hover:text-destructive" />
            </button>
          </Badge>
        ))}

        <Input
          value={inputValue}
          disabled={!canAdd}
          placeholder={placeholder}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className="h-7 min-w-[120px] flex-1 border-none px-1 focus-visible:ring-0"
        />
      </div>
    )
  }
)

TagsInput.displayName = "TagsInput"
