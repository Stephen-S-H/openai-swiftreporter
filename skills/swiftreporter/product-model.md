# SwiftReporter product model

## Core records

- **Template**: reusable inspection structure. A template contains sections and questions used to build inspections. Prebuilt templates can be copied into the user's library. AI template creation remains available in the web app.
- **Inspection**: a job/report workspace created from the user's active template. It contains client/address metadata and links to observations, media, assignments, and report output.
- **Observation**: a finding inside one inspection. It can contain a title, description, recommendation, category, subcategory, location, severity, photos, and audio.
- **Media**: photos, audio, or videos associated with an inspection and its findings.
- **Report**: generated PDF output for an inspection. Report generation can take time, so its progress is checked separately.

## Reusable content

- **Comment library entry**: reusable inspection wording, commonly a description and recommendation associated with template/category context. Comments are not observations until used in an inspection.
- **Custom prompt**: saved guidance that changes how AI observation summaries are written.
- **Glossary term**: a preferred term and definition used to standardize AI wording.
- **Quote calculator settings**: the user's pricing and calculation preferences. The current MCP tools read these settings but do not create quotes.

## Back of House records

These are available only when the current product account has BOH access.

- **Contact**: person or business used by appointments and business workflows.
- **Appointment**: scheduled work, optionally linked to an inspection.
- **Contract**: signing workflow, usually tied to an appointment or inspection. MCP can list and send existing contracts.
- **Invoice**: billing record. Payments setup must be complete to list, create, send, or void invoices.
- **Booking settings**: configuration for the public booking page. MCP currently reads settings and the public handle.

## Identity and access

- **Viewer**: read-only access limited to inspections/reports shared through the web product. Write and BOH tools are omitted.
- **Standard/admin user**: can use tools allowed by current ownership, organisation, plan, and product access.
- **Organisation member**: may access same-org resources according to current membership and assignment rules.
- **Organisation admin/owner**: can assign inspectors when the target inspection and inspectors belong to the same active organisation.

MCP follows the same role, ownership, assignment, organisation, plan, and product access shown in the SwiftReporter web app.

## Record relationships

```text
Template
  └─ creates structure for → Inspection
                               ├─ Observation(s)
                               ├─ Photo/audio/video metadata
                               ├─ Assigned inspector(s)
                               └─ Generated report job/result

Contact ─┬─ may relate to → Appointment ─ may link to → Inspection
         ├─ may receive → Contract
         └─ may receive → Invoice
```

Never substitute one record type for another. In particular, a comment library entry is reusable wording, not an inspection observation, and a template is a reusable blueprint, not an inspection.
