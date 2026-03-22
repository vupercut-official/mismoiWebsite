# Owner Control System - Make.com Setup Guide

## 3 Scenarios to Import

1. **1-email-intake.json** - Watches Gmail, splits attachments vs links, parses content, stages to data store
2. **2-drive-watcher.json** - Watches Google Drive folder for new files (PDF, spreadsheet, docs), parses and stages
3. **3-analysis-insights.json** - Daily scheduled run: pulls unprocessed records, sends to GPT-4, emails structured insights

## Import Steps

1. Go to Make.com > Scenarios > Import Blueprint
2. Upload each JSON file
3. Configure connections (see below)

## After Import: What You Need to Configure

### Connections (every purple module needs auth)
- Gmail account connection
- Google Drive account connection
- OpenAI API key connection
- Google Sheets connection (Scenario 3)
- CloudConvert connection (Scenario 2, for PDF parsing)

### Data Store Setup
Create a data store called `owner_control_staging` with these fields:
- `source` (text) - where the data came from
- `filename` (text) - original file name or URL
- `content` (text) - extracted text content
- `sender` (text) - email sender if applicable
- `subject` (text) - email subject if applicable
- `received_date` (date) - when the source was received
- `drive_file_id` (text) - Google Drive file ID if applicable
- `processed` (boolean) - whether this record has been analyzed
- `processed_date` (date) - when it was analyzed

Link this data store in all modules that reference it across all 3 scenarios.

### Scenario-Specific Config

**Scenario 1 (Email Intake):**
- Set Gmail folder/label to watch (default: INBOX)
- Set Google Drive folder ID for staging uploads

**Scenario 2 (Drive Watcher):**
- Set Google Drive folder ID to watch
- Optional: Add OneDrive trigger as a second scenario variant

**Scenario 3 (Analysis):**
- Set owner email address in the Gmail send module
- Set Google Sheets spreadsheet ID and sheet ID for the dashboard log
- Adjust schedule (default: daily)
- Tune the GPT-4 system prompt to match the owner's industry/priorities

## Optional Add-ons
- Slack notification module after email send
- Notion database push instead of/alongside Google Sheets
- Error handler webhooks for monitoring
- OneDrive variant of Scenario 2 (swap Google Drive modules for OneDrive modules)

## Cost Estimate
- Make.com: ~5,000-10,000 operations/month depending on email volume
- OpenAI: ~$0.50-2/day depending on data volume (GPT-4 pricing)
- CloudConvert: Free tier covers ~25 conversions/day
