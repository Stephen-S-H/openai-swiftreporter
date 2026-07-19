/**
 * Generates chatgpt-app-submission.json from MCP wave tool annotations.
 * Run from web/: node integrations/openai-swiftreporter/generate-submission.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const webRoot = path.resolve(__dirname, '../..')
const toolsDir = path.join(webRoot, 'src/server/mcp/tools')
const files = ['waveA.ts', 'waveB.ts', 'waveC.ts', 'waveD.ts'].map((f) => path.join(toolsDir, f))
const text = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n')

/** @type {Record<string, any>} */
const tools = {}
const re = /name:\s*'([^']+)'[\s\S]*?annotations:\s*\{([^}]*)\}/g
let m
while ((m = re.exec(text))) {
  const name = m[1]
  const body = m[2]
  const get = (k) => {
    const mm = body.match(new RegExp(`${k}:\\s*(true|false)`))
    return mm ? mm[1] === 'true' : false
  }
  const readOnly = get('readOnlyHint')
  const openWorld = get('openWorldHint')
  const destructive = get('destructiveHint')
  tools[name] = {
    annotations: {
      readOnlyHint: readOnly,
      openWorldHint: openWorld,
      destructiveHint: destructive,
    },
    justifications: {
      read_only_justification: readOnly
        ? 'Only retrieves SwiftReporter account or inspection data and does not create or change records.'
        : "Writes to the signed-in user's private SwiftReporter account or related records.",
      open_world_justification: openWorld
        ? 'Can affect external systems such as email delivery, payment processors, or other third-party services.'
        : "Operates only within the user's private SwiftReporter workspace and does not publish to the public internet.",
      destructive_justification: destructive
        ? 'Can permanently delete, merge, void, or otherwise irreversibly change user data or financial records.'
        : 'Does not permanently delete, void, revoke access, or perform irreversible destructive actions.',
    },
  }
}

const refine = {
  observations_delete: {
    destructive_justification:
      'Permanently deletes the selected observation after the user confirms the action.',
  },
  contacts_merge: {
    destructive_justification:
      'Merges a secondary contact into a primary contact, which cannot be undone as separate records.',
    open_world_justification: 'Only updates private SwiftReporter contact records owned by the signed-in user.',
  },
  inspections_share_send: {
    open_world_justification: 'Sends an inspection share invite email to an external recipient address.',
    read_only_justification: 'Creates and sends a share invite rather than only reading inspection data.',
  },
  contracts_send: {
    open_world_justification: 'Sends a contract for signing through the configured e-signature workflow.',
  },
  invoices_send: {
    open_world_justification: 'Sends an invoice to customer contacts through the payments workflow.',
  },
  invoices_create: {
    open_world_justification: 'Creates an invoice that may interact with the connected payments provider.',
  },
  invoices_confirm_void: {
    destructive_justification: 'Completes a prepared invoice void, which cannot be undone after confirmation.',
    open_world_justification: 'Voids the invoice through the connected payments provider.',
  },
  invoices_prepare_void: {
    read_only_justification: 'Validates and describes a proposed void without completing the void yet.',
    destructive_justification: 'Does not void the invoice until a separate confirmation tool is used.',
  },
  observations_summarize: {
    open_world_justification: 'Calls SwiftReporter AI processing to generate a summary for the observation.',
    read_only_justification: 'Updates the observation with a generated summary rather than only reading it.',
  },
  reports_generate_start: {
    open_world_justification: 'Starts PDF report generation that may use hosted rendering and storage services.',
  },
  account_update_notification_settings: {
    read_only_justification: "Updates the user's notification preferences in their SwiftReporter account.",
  },
}

for (const [name, patch] of Object.entries(refine)) {
  if (tools[name]) Object.assign(tools[name].justifications, patch)
}

const submission = {
  $schema: 'https://developers.openai.com/apps-sdk/schemas/chatgpt-app-submission.v1.json',
  schema_version: 1,
  app_info: {
    display_name: 'SwiftReporter',
    subtitle: 'Manage inspection workflows',
    description:
      'SwiftReporter helps inspectors work with inspections, observations, reports, templates, contacts, appointments, contracts, and invoices from ChatGPT. Connect your SwiftReporter account, then ask ChatGPT to find jobs, update findings, start PDF reports, and manage Back of House records with the same access as your signed-in web user. You approve access once and can revoke it anytime from Account → Connected Apps.',
    category: 'BUSINESS',
  },
  tools,
  test_cases: [
    {
      description: 'List the signed-in user inspections so review can confirm read access.',
      user_prompt: 'List my active inspections in SwiftReporter.',
      file_attachment_urls: null,
      tools_triggered: 'inspections_list',
      expected_output:
        'Returns a paginated list of inspections the signed-in user can access, with names or addresses and IDs.',
      expected_output_url: null,
    },
    {
      description: 'Open one inspection and show its observations.',
      user_prompt: 'Open my most recent inspection and list its observations.',
      file_attachment_urls: null,
      tools_triggered: 'inspections_list,inspections_get,observations_list',
      expected_output:
        'Identifies a recent inspection and returns its observation summaries without inventing findings.',
      expected_output_url: null,
    },
    {
      description: 'Create a new observation on an existing inspection.',
      user_prompt: 'Add an observation to that inspection about damaged roof flashing that needs repair.',
      file_attachment_urls: null,
      tools_triggered: 'observations_create',
      expected_output:
        'Creates an observation on the selected inspection and confirms the new observation ID or summary.',
      expected_output_url: null,
    },
    {
      description: 'Start a PDF report and check job status.',
      user_prompt: 'Generate the PDF report for that inspection and tell me when it is ready.',
      file_attachment_urls: null,
      tools_triggered: 'reports_generate_start,reports_job_status',
      expected_output:
        'Starts report generation, returns a job id, and reports status until the job completes or is still running.',
      expected_output_url: null,
    },
    {
      description: 'Read account entitlements before a gated workflow.',
      user_prompt: 'What SwiftReporter plan and permissions does my account have?',
      file_attachment_urls: null,
      tools_triggered: 'account_get_entitlements',
      expected_output:
        'Returns the signed-in user role, plan or entitlements, and relevant feature access flags.',
      expected_output_url: null,
    },
  ],
  negative_test_cases: [
    {
      description: 'Do not trigger for unrelated personal calendar requests.',
      user_prompt: 'What meetings do I have on my Google Calendar tomorrow?',
      file_attachment_urls: null,
      tools_triggered: null,
      expected_output:
        'The app should not be invoked because calendar scheduling outside SwiftReporter is out of scope.',
      expected_output_url: null,
    },
    {
      description: 'Do not trigger for general weather or home-repair advice.',
      user_prompt: 'How do I fix a leaking faucet at home?',
      file_attachment_urls: null,
      tools_triggered: null,
      expected_output:
        'The app should not be invoked because this is general advice, not a SwiftReporter account workflow.',
      expected_output_url: null,
    },
    {
      description: 'Do not attempt account deletion or org admin actions that are intentionally unavailable.',
      user_prompt: 'Delete my SwiftReporter account and remove my organisation.',
      file_attachment_urls: null,
      tools_triggered: null,
      expected_output:
        'The app should refuse or avoid tool calls for account/org deletion and direct the user to the SwiftReporter web app.',
      expected_output_url: null,
    },
  ],
}

const out = path.join(__dirname, 'chatgpt-app-submission.json')
fs.writeFileSync(out, `${JSON.stringify(submission, null, 2)}\n`)
console.log(`wrote ${out} with ${Object.keys(tools).length} tools`)
