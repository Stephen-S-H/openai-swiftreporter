# SwiftReporter for ChatGPT and OpenAI

Use ChatGPT with your SwiftReporter account to work with inspections, observations, reports, contacts, appointments, and more.

## Requirements

- A ChatGPT plan and workspace that support custom MCP apps
- Developer mode enabled by your workspace administrator
- A SwiftReporter account

## Install in ChatGPT

1. Open **Settings → Apps** in ChatGPT.
2. Select **Create** to create a custom app. If the option is unavailable, ask your workspace administrator to enable developer mode.
3. Name the app `SwiftReporter`.
4. Enter `https://app.swiftreporter.com/api/mcp` as the MCP server URL.
5. Select **Scan tools**, review the tools ChatGPT discovers, and create the app.
6. Connect the app, then sign in to SwiftReporter in the browser and approve access.

If ChatGPT asks for a client ID, enter `swiftreporter-openai`. No client secret is required.

Workspace administrators can test the app as a draft and publish it for other workspace members.

## Use

Enable the SwiftReporter app in a ChatGPT conversation, then ask it to work with your account. For example:

- "List my active inspections."
- "Show the observations for the Smith Street inspection."
- "Create an observation for damaged roof flashing."
- "Generate the PDF report and tell me when it is ready."
- "Find this customer's upcoming appointments."

ChatGPT may ask for confirmation before actions that create, change, delete, merge, share, or send data. Check the details before approving.

## Capabilities

The SwiftReporter MCP server can:

- view, create, update, archive, restore, and share inspections;
- view, add, edit, summarize, and delete observations;
- list inspection media such as photos, audio, and video;
- generate PDF reports and check report status;
- browse templates and reusable comments, create templates, and copy prebuilt templates;
- view organisation details, members, notifications, and account settings;
- update your profile and notification preferences;
- list, create, update, and merge contacts;
- list and create appointments;
- view booking and quote settings;
- list and send contracts; and
- view or update custom AI prompts and glossary terms.

The tools available to you depend on your SwiftReporter plan, organisation role, and access to each record. ChatGPT can only access data and actions already available to your signed-in SwiftReporter account.

## Included files

- `mcp.json` contains a generic remote MCP configuration.
- `chatgpt-app.example.json` contains the values used when creating the ChatGPT app.
- `skills/swiftreporter/` contains optional guidance for AI coding agents.

## Connection and access

The app uses the hosted SwiftReporter MCP server:

`https://app.swiftreporter.com/api/mcp`

Authentication happens on the SwiftReporter website. Do not add an API key or client secret.

To disconnect, open **SwiftReporter → Account → Connected Apps** and revoke ChatGPT's access.

If ChatGPT cannot see the tools, confirm the app is enabled for the conversation and ask your workspace administrator to verify that the app is available. If authentication expires, reconnect the app.
