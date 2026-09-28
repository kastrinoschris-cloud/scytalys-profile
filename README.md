# How to run

Requires Node.js (npm).

```bash
npm install
npm run dev
```

Then open the URL Vite displays



# Train of thought
Given the timebox limit of 4h, the following describe the thought process behind the current implementation.


## Single column layout & single form
I followed a single-column layout approach in order to keep the UI simple within the timebox and have one save status indication at the top of the page.

Profile fields and skills live in one form (and one save "pipeline") on purpose. I thought about splitting them but that would mean two statuses, two in-flight requests, and partial success cases (f.e. skills saved, profile form failed) that would require extra UX and conflict handling.

## Ordered list re-ordering functionality 
I decided to go with a simple "Up/Down" approach because drag&drop functionality would probably need a lot more time for a proper manual implementation and/or utilization of an external tool like dnd-kit.

## Validation
Validation is done through a Yup schema and is carried out inside the debounce in order to avoid re-validating the entire form on each keystroke.

## Saving data, debouncing, handling stale updates
Edits autosave after a short debounce so requests are not fired on every keystroke. Each save sends the full profile (fields + skills) in one PUT which only runs if client-side validation passes.

In-flight requests are cancelled with AbortControlle whenever values change. This way I ensure that a previous, slower response cannot overwrite the UI status after a newer edit has been sent.





# Things I'd improve on current implementation given more time

## UI/UX
- Adding a new skill to the list should auto-scroll the list to the latest entry (user has to manually scroll if there's overflow).
- I'd prefer a two column layout (profile information - skillset) so that vertical space wouldn't be an issue.
- Styling could also be improved. 

## Testing
- Unit tests for the components and the debounce/save logic




# Things I'd add given more time

## UI/UX
- Drag & Drop reordering of the skills list instead of the up/down approach

## Saving data
- Delta sync so unchanged fields are not resent on every save
- Retry failed saves automatically or give the user the option for a retry (clickable error message)
- Conflict handling (if the app is supposed to load server state)
- Persist unsaved changes across page reloads through localstorage