# ABA Data Hub reconstruction agent rules

## Absolute workspace boundary

- The only authorized local workspace is `C:\Users\Moonlabpc\Desktop\aba 2` and its descendants.
- Perform 100% of project file reads, writes, searches, generated artifacts, downloads, temporary project files, builds, tests, and command working directories inside this folder.
- Never inspect, enumerate, open, read, write, copy, move, rename, or otherwise access any local file or directory outside this folder without the user's explicit permission for the exact path and action.
- Do not use parent traversal (`..`), home shortcuts (`~`), environment variables that resolve outside the workspace, or broad absolute paths to discover other local content.
- Installed executables may be invoked only as tools. Their working directory and every project input/output must remain within this workspace. Do not inspect their installation directories.
- Read-only access to user-authorized web sources, such as the supplied YouTube video and public documentation, is allowed. Save any resulting artifact only inside this workspace.
- If a task requires access outside the workspace, stop before accessing it, explain the exact path and reason, and ask the user for explicit permission.

## No deletion

- Never delete any file, folder, project data, system data, database row, remote asset, or cloud resource.
- Never run destructive cleanup or rollback commands, including `rm`, `rmdir`, `del`, `Remove-Item`, `git clean`, `git reset --hard`, or equivalent operations.
- Do not replace deletion with truncation or destructive overwrite.
- If removal is necessary, propose a non-destructive alternative such as deprecation, exclusion, versioning, or moving to a user-approved quarantine location inside the workspace. Ask for explicit permission before any move.

## Planning and implementation discipline

- Begin reconstruction features in plan mode and keep evidence, specifications, decisions, and acceptance criteria inside `docs/system-rebuild/` and `specs/`.
- Keep separate authoritative specifications for frontend, backend, Supabase, and web publication. A change crossing boundaries must update every affected specification before implementation.
- Use shadcn/ui as the default component foundation for the React frontend. Add only components required by an approved screen; customize them through project-owned tokens and components inside this workspace.
- Separate observed behavior from inferred behavior. Do not implement an inferred product decision until the user approves it.
- Use spec-driven development and TDD: approved specification, failing test, minimal implementation, refactor, and verification.
- Use only anonymized fixtures. Never introduce real clinical, identifying, or minor-related data.
- Subagents inherit every rule in this file. Their prompts must restate the workspace boundary and no-deletion rule.

## Stop conditions

Stop and ask the user before:

- accessing any local path outside `aba 2`;
- moving any file or directory;
- installing a dependency globally or writing outside the workspace;
- connecting production credentials, modifying production data, or deploying;
- implementing behavior that materially depends on evidence not available in the source material.
