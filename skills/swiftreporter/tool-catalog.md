# SwiftReporter MCP tool catalog

The live `tools/list` response is authoritative. Available tools follow the current user's role, organisation, plan, Back of House access, Payments setup, and record access in the SwiftReporter web app.

## Account and organisation context

| Tool | Meaning | Important gate or note |
|---|---|---|
| `account_get` | Current user's safe account summary | Read |
| `account_get_entitlements` | Effective role, organisation, plan, Back of House, and Payments access | Call before account-dependent workflows |
| `org_get` | Current organisation summary | Organisation member |
| `org_list_members` | Members visible to current user | Use IDs for assignment only |
| `account_update_profile` | Update safe profile fields | Write; non-viewer |
| `account_update_notification_settings` | Update notification preferences | Write; non-viewer |
| `notifications_list` | Recent notification delivery events | Read; non-viewer |

## Inspections and observations

| Tool | Meaning | Important gate or note |
|---|---|---|
| `inspections_list` | Paginated active/archived inspections | Owner/shared/assigned/org policy |
| `inspections_get` | Inspection summary or full nested data | Set `full` only when needed |
| `inspections_create` | Create from user's active template | Write; non-viewer |
| `inspections_update` | Update allowed inspection fields | Read target first |
| `inspections_archive` | Archive or restore an inspection | Owner only; reversible |
| `inspections_assign` | Set assigned inspectors | Org admin/owner; active same-org members |
| `observations_list` | Observation summaries for inspection | Parent inspection read access |
| `observations_get` | One observation's details | Parent inspection read access |
| `observations_create` | Add finding to inspection | Parent inspection write access |
| `observations_update` | Update allowed finding fields | Parent inspection write access |
| `observations_delete` | Permanently delete owned observation | Destructive; explicit confirmation |
| `observations_summarize` | Run web AI summary for finding | Write; parent inspection access |
| `media_list` | Photo/audio/video metadata | No arbitrary storage access |
| `inspections_share_send` | Email an inspection share invite | Owner only; external side effect |

## Reports

| Tool | Meaning | Important gate or note |
|---|---|---|
| `reports_generate_start` | Queue PDF report generation | Write; returns `job_id` |
| `reports_job_status` | Poll asynchronous report job | Read; job must belong to user |

`reports_job_status` may mention template jobs for backward compatibility, but AI template wizard start tools are not exposed.

## Templates and comments

| Tool | Meaning | Important gate or note |
|---|---|---|
| `templates_list` | User/org template summaries | Non-viewer |
| `templates_get` | Template summary; optionally sections | Read before reuse |
| `templates_create` | Create blank template | No AI generation |
| `templates_copy_prebuilt` | Copy existing prebuilt template | Write |
| `comments_list` | Reusable comment entries | Optional template filter |
| `comments_search` | Search descriptions/recommendations | Resolve ID before acting |
| `comments_create` | Create reusable comment entry | Not an observation |

## BOH: contacts, appointments, booking

| Tool | Meaning | Important gate or note |
|---|---|---|
| `contacts_list` | User-owned contacts | BOH; non-viewer |
| `contacts_create` | Create person/business contact | BOH |
| `contacts_update` | Update accessible contact | BOH; ownership/org policy |
| `contacts_merge` | Merge duplicate into primary contact | Destructive; read both and confirm |
| `appointments_list` | User-owned appointments | BOH |
| `appointments_create` | Create scheduled appointment | BOH; validate ISO date/time |
| `booking_settings_get` | Booking config and public handle | BOH; read-only |

## Business actions

| Tool | Meaning | Important gate or note |
|---|---|---|
| `contracts_list` | User-owned contracts | BOH |
| `contracts_send` | Send a contract for signing from an inspection + contract template | Requires `inspection_id` + `contract_template_id`; external side effect |
| `invoices_list` | User-owned invoices | BOH + completed Payments setup |
| `invoices_create` | Create invoice using the web invoice workflow | BOH + Payments; use user-confirmed fields |
| `invoices_send` | Send invoice to contacts | External side effect; confirm recipients |
| `invoices_prepare_void` | Validate and describe invoice void | First step; no void yet |
| `invoices_confirm_void` | Complete the prepared void | Call only after user confirms impact |

## Tools and preferences

| Tool | Meaning | Important gate or note |
|---|---|---|
| `quote_calculator_get_settings` | Read inspector pricing settings | Inspector access |
| `custom_prompts_get` | Read AI summarization prompt | Current account |
| `custom_prompts_update` | Update summarization prompt | Explain future AI effect |
| `glossary_list` | List AI glossary terms | Current account |
| `glossary_upsert` | Create/update term | User-owned terms |

## Intentionally unavailable

Do not invent or emulate tools for:

- organisation invites, role/seat changes, or organisation deletion;
- account deletion;
- Stripe/Square setup and billing portals;
- AI template wizard jobs;
- public booking completion, customer portal access, passwords, payment cards, and account security changes.

Direct the user to the authenticated SwiftReporter web UI for these operations.
