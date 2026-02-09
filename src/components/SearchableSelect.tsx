import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface Option {
    value: string
    label: string
}

interface SearchableSelectProps {
    options: Option[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    className?: string
    disabled?: boolean
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    emptyMessage = "No option found.",
    className,
    disabled = false,
}: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                    disabled={disabled}
                >
                    {value
                        ? options.find((option) => option.value === value)?.label || value
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label} // Use label for search matching
                                    onSelect={(currentValue) => {
                                        // We want to pass the original value, not the label
                                        // The onSelect gives us the value of the item, which is often lowercased label by default in some implementations
                                        // But here we set value={option.label}, so currentValue will be label.
                                        // Let's find the option again to be safe.
                                        const selectedOption = options.find(o => o.label.toLowerCase() === currentValue.toLowerCase()) || option;
                                        onChange(selectedOption.value === value ? "" : selectedOption.value)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
