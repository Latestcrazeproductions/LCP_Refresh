# Cookie Consent & Data Capture

This document describes the cookie consent system and how the captured data supports business growth and potential data monetization.

## Overview

- **Cookie consent popup** appears on first visit
- **Consent choices** stored in browser cookie (`lcp_consent`) and persisted to database
- **Lead capture** optional email when user opts into marketing
- **Anonymized signals** (geo, device, referrer) for segmentation

## Database Schema

Table: `cookie_consents`

| Column | Type | Purpose |
|--------|------|---------|
| visitor_id | text | Anonymous ID (stored in cookie) |
| session_id | text | Per-session ID |
| essential | boolean | Required cookies |
| analytics | boolean | Analytics consent |
| marketing | boolean | Marketing consent |
| preferences | boolean | Preference cookies |
| consent_method | text | accept_all, reject_non_essential, customize, banner_dismiss |
| policy_version | text | Policy version when consented |
| email | text | Lead email (when marketing opted-in) |
| ip_hash | text | Hashed IP (never raw IP) |
| country_code | text | Geo (from Vercel/Cloudflare) |
| region | text | Geo region |
| user_agent_hash | text | Hashed user agent |
| referrer_domain | text | Referring site |
| first_page | text | First page viewed |
| created_at | timestamptz | Timestamp |

## Migration

Run the migration to create the table:

```bash
npx supabase db push
```

Or apply manually in Supabase SQL Editor:

```sql
-- See supabase/migrations/20250310000000_create_cookie_consents.sql
```

## Business Use Cases

### 1. Marketing leads
- Query `cookie_consents` where `marketing = true` and `email is not null`
- Export for email campaigns, CRM integration

### 2. Consent analytics
- Consent rate by country: `SELECT country_code, count(*), sum(case when marketing then 1 else 0 end) FROM cookie_consents GROUP BY country_code`
- Conversion funnel: visitors → consent → marketing opt-in

### 3. Segmentation
- `ip_hash`, `country_code`, `user_agent_hash`, `referrer_domain` enable anonymized audience segments
- Example: "Phoenix-area visitors who accept marketing" (country_code + region)

### 4. Data monetization
- Aggregated consent rates by geo, device type, referrer
- Anonymized segments for programmatic or partnership deals
- Ensure privacy policy discloses data sale/sharing; obtain consent where required (GDPR, CCPA)

## API

**POST /api/cookie-consent**

Request body:
```json
{
  "visitor_id": "uuid",
  "session_id": "uuid",
  "essential": true,
  "analytics": true,
  "marketing": true,
  "preferences": true,
  "consent_method": "accept_all",
  "policy_version": "1.0",
  "email": "optional@example.com",
  "referrer_domain": "google.com",
  "first_page": "/"
}
```

## Cookie Preferences

Users can reopen the consent dialog via **Cookie preferences** in the footer. This clears the consent cookie and reloads the page to show the banner again.
