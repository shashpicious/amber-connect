import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-6", className)}
      classNames={{
        months: "flex flex-col gap-4 w-full",
        month: "flex flex-col gap-4 w-full",
        month_caption: "flex items-center justify-center relative h-7 w-full mb-2",
        caption_label: "text-sm font-semibold text-foreground",
        nav: "flex items-center",
        button_previous: "absolute left-0 inline-flex items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-7 w-7 p-0 opacity-60 hover:opacity-100 transition-opacity",
        button_next: "absolute right-0 inline-flex items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-7 w-7 p-0 opacity-60 hover:opacity-100 transition-opacity",
        month_grid: "w-full border-collapse",
        weekdays: "flex w-full",
        weekday: "text-muted-foreground w-full font-normal text-[0.8rem] text-center py-1",
        week: "flex w-full mt-1",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 w-full aspect-square",
        day_button: "inline-flex items-center justify-center rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground w-full aspect-square p-0 font-normal aria-selected:opacity-100",
        range_end: "day-range-end aria-selected:rounded-r-md",
        selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
        today: "bg-accent text-accent-foreground rounded-md",
        outside: "day-outside text-muted-foreground aria-selected:text-muted-foreground opacity-40",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight
          return <Icon className="h-4 w-4" />
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
