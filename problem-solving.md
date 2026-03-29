# Problem-Solving

## Table of Contents

- [Problem #1: Timeline Generator Produces Repetitive and Redundant Articles](#problem-1-timeline-generator-produces-repetitive-and-redundant-articles)
- [Problem #2: Database Entries Need Validation and Possibly Regeneration](#problem-2-database-entries-need-validation-and-possibly-regeneration)

---

## Problem #1: Timeline Generator Produces Repetitive and Redundant Articles

### Issue (Problem #2)

The generated article is not created properly because it contains redundant and repetitive lines, which are confusing and misleading.

The AI model currently receives a list of commit messages and creates the article in sequence, without checking whether commits are repeated. It also generates output without building a global understanding of the full list and context.

#### Example of problematic text

> “Multiple fixes and improvements were implemented in the TLG project. The unnecessary syncing logic was removed from the repository sync process, streamlining the synchronization functionality. Additionally, a redundant delete button was eliminated from the article list, enhancing user interface clarity. A new 'delete' button for articles was added to improve article management. Furthermore, timeline sync logic and related comments were removed to simplify the codebase. Lastly, spelling corrections for the term 'Timeline' were made throughout the project to ensure consistency and professionalism.”

## Possible Solutions

1. Send the redundant and repetitive text back to the AI model for redacting.
2. Add additional prompts so the AI model reads the full list of commits first and creates articles without redundancy.

The first solution is a useful safety net, but it does not solve the original issue. First-pass generation should be correct. To achieve that, additional prompt instructions should guide the model on preparation, grouping, and generation flow.

## Additional Prompting Instructions

- Read the entire list first.
- Group redundant or repeated commit comments.
- Consolidate into clean, non-repetitive entries.
- Avoid contradiction.
- Create an article with a logical flow from start to finish.

## Full Prompt

> “You are an expert technical writer JSON formatter who creates extremely clean, concise, and non-repetitive daily changelog summaries for a software project.
>
> Output only valid JSON and nothing else.
>
> The required JSON schema is:
> {
> "title": "string",
> "date": "string",
> "description": "string"
> }
>
> 1. First, read and fully analyze the ENTIRE list of commits before writing anything.
> 2. Aggressively group and merge ALL similar, related, or overlapping commits into the fewest possible logical statements. Do not describe any change more than once.
> 3. When multiple commits affect the same component or feature, consolidate them into a single clear action. Avoid repeating the same nouns, verbs, or ideas (e.g., do not repeat words like "logic", "button", "process", or "fix" unnecessarily).
> 4. When commits involve both removing and adding elements of the **same feature**, treat it as a single "Updated" or "Improved" change. Do NOT mention removal and addition separately. Example: "Improved the article delete functionality for better management."
> 5. Create one smooth, flowing narrative paragraph with logical structure. Eliminate every trace of repetition, redundancy, or contradictory statements.
> 6. Use only action-oriented language: start clauses with "Removed", "Added", "Updated", "Improved", "Corrected", "Refactored", "Simplified", or "Enhanced". Never use personal pronouns like "we", "I", "the team", or "us".
> 7. Completely ignore and never mention any changes to articles.js, package-lock.json, or README.md.
> ”

## Problem #2: Database Entries Need Validation and Possibly Regeneration

### Issue

Because the previous prompt did not clearly define the expected output, some generated articles in MongoDB have weak structure, poor flow, and repetitive wording.

The easiest option would be to clear the relevant MongoDB data and run the app again so improved articles are generated. However, this is only a shortcut. A better approach is to add controlled validation and optional regeneration.

### Possible Solutions (Problem #2)

1. Build an automatic validator that scans all articles for structure, flow, redundancy, and repetition. Regenerate only the articles that fail validation.
2. Add a `Regenerate` button to each article entry as a manual fallback tool.

Validation must always run first. Regeneration should happen only when validation fails. The manual `Regenerate` button remains useful as a support option, while automated validation is the primary mechanism.

### Implementation Plan

- Run through articles one by one.
- Validate each article first (structure, flow, redundancy, repetition).
- If validation fails, regenerate the article using updated prompts.
- Replace only failed articles; keep valid ones unchanged.
