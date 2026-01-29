import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

export interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  label?: string
  id?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  label,
  id,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleUnselect = (value: string) => {
    onChange(selected.filter((s) => s !== value))
  }

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        id={id}
        className={cn(
          "flex min-h-10 w-full flex-wrap gap-1 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background cursor-pointer",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          open && "ring-2 ring-ring ring-offset-2"
        )}
        onClick={() => setOpen(!open)}
      >
        {selected.length > 0 ? (
          selected.map((value) => {
            const option = options.find((opt) => opt.value === value)
            return (
              <Badge key={value} variant="secondary" className="gap-1">
                {option?.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(value)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnselect(value)
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })
        ) : (
          <span className="text-muted-foreground text-sm">{placeholder}</span>
        )}
      </div>
      {open && options.length > 0 && (
        <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
          <Command className="max-h-64 overflow-auto">
            <CommandList>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selected.includes(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}
