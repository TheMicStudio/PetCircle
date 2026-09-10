import type { ComponentProps } from "react";
import { SOON } from "../showcase";

// A button that only exists for the design: no page or route behind it yet. Announced as
// disabled, explained on hover, and it never navigates.
export const Inert = ({ className, children, onClick, ...rest }: ComponentProps<"button">) => (
  <button
    {...rest}
    aria-disabled="true"
    className={`cursor-default ${className ?? ""}`}
    onClick={(event) => {
      event.preventDefault();
      // inside a clickable card the click must not bubble up to it either
      onClick?.(event);
    }}
    title={SOON}
    type="button"
  >
    {children}
  </button>
);
