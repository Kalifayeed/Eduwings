import type { UseFormRegisterReturn } from "react-hook-form";

/**
 * Visually hidden anti-spam field.
 *
 * Hidden from sighted users, removed from the tab order, and marked
 * `aria-hidden` so assistive technology skips it too — a screen reader user must
 * never be asked to fill in a trap. `autoComplete="off"` stops browsers
 * populating it. Automated form-fillers, which read the DOM rather than the
 * accessibility tree, do fill it, and the server rejects those submissions.
 */
function HoneypotField({ registration }: { registration: UseFormRegisterReturn }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
      <label htmlFor={registration.name}>
        Leave this field empty
        <input
          {...registration}
          id={registration.name}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </label>
    </div>
  );
}

export { HoneypotField };
