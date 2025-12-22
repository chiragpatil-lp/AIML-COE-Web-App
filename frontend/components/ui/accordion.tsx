"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const AccordionContext = React.createContext<{
  type: "single" | "multiple";
  openItems: Set<string>;
  toggleItem: (value: string) => void;
} | null>(null);

function Accordion({
  className,
  type = "single",
  defaultValue,
  ...props
}: React.ComponentProps<"div"> & {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
}) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
    if (defaultValue) {
      return new Set(
        Array.isArray(defaultValue) ? defaultValue : [defaultValue],
      );
    }
    return new Set();
  });

  const toggleItem = React.useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(value)) {
          next.delete(value);
        } else {
          if (type === "single") {
            next.clear();
          }
          next.add(value);
        }
        return next;
      });
    },
    [type],
  );

  return (
    <AccordionContext.Provider value={{ type, openItems, toggleItem }}>
      <div
        data-slot="accordion"
        className={cn("space-y-2", className)}
        {...props}
      />
    </AccordionContext.Provider>
  );
}

function AccordionItem({
  className,
  value,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionItem must be used within Accordion");

  const isOpen = context.openItems.has(value);

  return (
    <div
      data-slot="accordion-item"
      className={cn(
        "collapse collapse-arrow bg-base-200 border border-base-300",
        className,
      )}
      {...props}
    >
      <input
        type={context.type === "single" ? "radio" : "checkbox"}
        name={context.type === "single" ? "accordion" : undefined}
        checked={isOpen}
        onChange={() => context.toggleItem(value)}
        className="peer"
      />
      {props.children}
    </div>
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="accordion-trigger"
      className={cn(
        "collapse-title text-sm font-medium flex items-center justify-between",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="accordion-content"
      className={cn("collapse-content text-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
