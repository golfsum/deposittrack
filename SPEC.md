# DepositTrack — Product Specification (V1)

> **Positioning:** Protect security deposits with verified photo evidence.
> DepositTrack is an inspection + deposit-protection tool, **not** a full property
> management platform. Stay focused on inspections and deposit protection.

---

## 1. Users, Roles & Shared Inspections

DepositTrack supports collaboration from launch.

### Roles
- Tenant
- Landlord
- Property Manager
- Inspector

### Invitations
- **Property Managers** can invite: Employees, Contractors, Inspectors
- **Landlords** can invite: Tenants

### Inspection Collaboration Modes

| Mode          | View | Add photos | Add notes | Add comments | Sign report | Edit content |
|---------------|:----:|:----------:|:---------:|:------------:|:-----------:|:------------:|
| **Shared**    |  ✅  |     ✅     |    ✅     |      ✅      |     ✅      |      ✅      |
| **Review Only**|  ✅  |     —      |    —      |      —       |     ✅      |      —       |
| **Comment Only**| ✅ |     —      |    —      |      ✅      |     —       |      —       |

- Review Only: view inspection, review photos, sign report. Cannot edit content.
- Comment Only: view inspection, leave comments. Cannot modify inspection data.

### Audit Trail (all activity)
Every inspection maintains an **immutable** activity log. Track:
- User
- Action
- Timestamp

Examples:
- "Noel added photo to Kitchen at 2:14 PM."
- "Tenant signed report at 2:36 PM."

Tracked actions include: photos added, photos removed, notes edited, signatures
completed, reports generated. **Audit logs appear in report metadata.**

---

## 2. Offline Support (Required V1 Feature)

Inspections must function without internet access. Many inspections occur in areas
with poor reception — this is a **core feature**.

While offline, users can:
- Create inspections
- Take photos
- Add notes
- Change room conditions
- Capture signatures

When connection returns:
- Sync automatically
- Resolve conflicts gracefully

Sync status display:
- Offline Mode
- Sync Pending
- Fully Synced

---

## 3. Guided Room Checklists (Optional, V1)

Show progress, e.g. **"4 of 6 items photographed."** Reduces missed documentation.

| Room        | Checklist items |
|-------------|-----------------|
| Kitchen     | Stove, Refrigerator, Sink, Cabinets, Countertops, Flooring |
| Bathroom    | Toilet, Sink, Tub/Shower, Mirror, Flooring |
| Bedroom     | Walls, Flooring, Closet, Windows |
| Living Room | Walls, Flooring, Windows, Ceiling |

---

## 4. Advanced Photo Management

- Bulk select photos
- Move multiple photos to another room
- Reorder photos
- Delete multiple photos
- Drag-and-drop photo organization

Important for large inspections.

---

## 5. Push Notifications

Notifications are **role-scoped**: defaults are based on the *type* of reminder and
who is responsible for it — not "send everything to everyone." This avoids spamming
inspectors and tenants with coordination tasks that belong to the landlord/PM.

### Notification Matrix (V1 defaults)

| Recipient                | Enabled by default |
|--------------------------|--------------------|
| **Landlord / Property Manager** | Upcoming move-in · Upcoming move-out · Missing signatures · Incomplete inspections · Report generated · **Lease ending soon** (§14) |
| **Assigned Inspector**   | Inspection assigned · Inspection tomorrow · Inspection overdue · Missing required photos |
| **Tenant** *(only after being invited)* | Review requested · Signature requested · Report completed · Move-out inspection reminder |

When a lease is created, default notify targets:
`☑ Landlord / Property Manager  ☑ Assigned Inspector  ☐ Tenant`

All defaults should be user/role-configurable (toggle per notification type).

**Future:**
- Expiring leases
- Annual inspections

---

## 6. Property Manager Features (Lightweight V1)

Property Managers can:
- Invite inspectors
- Assign inspections
- Assign properties
- Track completion status

Keep permissions simple. Roles: **Owner**, **Inspector**.
Full RBAC waits until V2.

---

## 7. Website — Bulk Upload Intelligence

When users upload multiple photos, the system suggests room groupings using:
- File timestamps
- Upload order
- AI image recognition

Example: Kitchen photos automatically suggested as Kitchen → user confirms.
Goal: reduce manual room assignment.

---

## 8. Inspection Calendar (Website)

Calendar View displaying:
- Upcoming inspections
- Assigned inspections
- Pending signatures
- Completed inspections

Views: Day / Week / Month. Useful for Property Managers.

---

## 9. Legal & Compliance

### Electronic Signatures
Comply with the **ESIGN Act** and **UETA**. Store audit data per signature:
- Signer name
- Role
- Date
- Time
- IP Address
- User ID
- Device information

Every signature must be linked to the inspection record.

### Audit Trail
Immutable activity log per inspection (see §1). Appears in report metadata.

### Report Disclaimer
Every report must include:

> "This report is intended to document observable property conditions at the time
> of inspection. It is not a professional appraisal, warranty, code inspection, or
> legal determination."

---

## 10. Security & Privacy

Marketing emphasizes:
- Secure cloud storage
- Encrypted data transmission
- Encrypted file storage
- Access controls
- Audit history

**Future Enterprise Roadmap:** SOC 2, SSO, Enterprise permissions.

---

## 11. Accessibility (Required V1)

- Screen reader support
- Voice-over labels
- Large touch targets
- High contrast mode
- Accessible PDF generation

Users must be able to complete inspections without relying solely on visual indicators.

---

## 12. Monetization

Add a **Pay-As-You-Go** option — many landlords manage only one or two rentals.

| Tier              | Price        | Includes |
|-------------------|--------------|----------|
| Free              | $0           | 1 property, 1 report |
| Single Report     | $4.99        | One inspection report |
| Starter           | $9 / month   | — |
| Pro               | $29 / month  | — |
| Property Manager  | $99+ / month | — |

May convert better than subscription-only pricing.

---

## 13. Move-In Summary  *(NEW)*

A simple, **optional** summary section that captures the lease/financial context of
a tenancy. Purely informational — it does not change inspection logic, but it
surfaces deposit and lease facts on every report and powers the pre-lease
inspection reminders (§14).

### Scope
- **Lives at the property / lease level**, not on a single inspection. Figures are
  entered **once** and shared across that lease's **move-in and move-out**
  inspections (and any interim inspections), so deposit/rent/lease dates stay
  consistent and don't have to be re-keyed.
- Each inspection **references** the active lease's Move-In Summary and renders it
  on its report. Move-out reports can therefore show the same deposit figure that
  was recorded at move-in.
- All fields are **optional** — a lease/inspection is valid with the summary blank.
- Editable by users with edit rights (Shared mode / Owner / Property Manager).
  Each edit is recorded in the audit trail.

### Fields
| Field                 | Type            | Notes |
|-----------------------|-----------------|-------|
| Security Deposit      | Currency        | Amount held. Highlighted on report — this is what DepositTrack protects. |
| Monthly Rent          | Currency        | — |
| Move-In Date          | Date            | Lease/tenancy start. |
| Lease Duration        | Number + unit   | e.g. 12 months. Used to **derive** Lease End Date if end date is blank. |
| Lease End Date        | Date            | If blank, derived from Move-In Date + Lease Duration. If both provided, the explicit Lease End Date wins. |

**Derivation rule:** `Lease End Date = Move-In Date + Lease Duration` when the end
date is not entered. If the user later edits either input, recompute the derived end
date (but never overwrite a manually entered end date).

### Summary View
Show a compact card on the inspection detail screen and in the generated PDF report:

```
Move-In Summary
  Security Deposit   $1,500
  Monthly Rent       $1,200
  Move-In Date       Jun 1, 2026
  Lease Duration     12 months
  Lease End Date     May 31, 2027   (derived)
```

- Omit blank fields from the card rather than showing empty rows.
- Currency formatted to the user's locale.
- Mark derived values with "(derived)" so it's clear they weren't entered directly.
- Include the Move-In Summary in the **accessible PDF** output (§11) with proper
  labels for screen readers.

### Validation
- Currency: non-negative.
- Lease End Date must be on or after Move-In Date (warn, don't hard-block — figures
  may be entered out of order offline).
- Works fully **offline** (§2) — summary edits sync like any other inspection data.

---

## 14. Pre-Lease Inspection Reminders  *(NEW)*

Notify the relevant users **before a lease ends** so a move-out / pre-move-out
inspection can be scheduled in time — protecting the deposit while there's still
time to act.

### Trigger source
Driven by the **Lease End Date** from the Move-In Summary (§13), whether entered
directly or derived from Move-In Date + Lease Duration. If no lease end is known,
no reminder is scheduled.

### Default reminder schedule
Send a push notification (§5) at:
- **30 days** before Lease End Date
- **7 days** before Lease End Date
- **Day of** Lease End Date *(optional / configurable)*

Reminder copy example:
> "Lease for 123 Main St ends in 7 days. Schedule a move-out inspection to protect
> the deposit."

### Recipients
Default to the **Landlord / Property Manager** — they coordinate the process. The
assigned inspector and tenant are *not* spammed with coordination reminders; they
have their own role-scoped notifications (see §5, Notification Matrix). Tenant
pre-lease reminders stay **off unless the tenant has been invited** to the
inspection.

### Behavior
- Reschedule automatically if the Lease End Date changes (edit cancels old pending
  reminders and schedules new ones).
- Suppress reminders once a **move-out inspection** for the same property has been
  completed.
- Allow the user to dismiss / snooze a reminder.
- Reminder windows should be **configurable** (per user or per org) in a later
  iteration; ship sensible defaults (30 / 7 / day-of) for V1.

> Relates to the existing "Upcoming move-out reminder" notification (§5) and the
> future "Expiring leases" / "Annual inspections" notifications.

---

## 15. Homepage & Marketing

**Hero headline:** Protect Security Deposits with Verified Photo Evidence
**Hero subheadline:** Create move-in and move-out inspection reports with photos,
signatures, GPS verification, and downloadable PDFs.

- **Primary CTA:** Start Free Inspection
- **Secondary CTA:** Watch Demo

**Supporting points:** Mobile inspections · Tenant and landlord signatures ·
Professional PDF reports · Secure cloud storage

The homepage must immediately communicate: **Take Photos. Generate Reports. Protect Deposits.**

### Core Differentiators
Verified photos · GPS capture · Timestamp verification · Simple workflow ·
Tenant participation · Fast report generation · Affordable pricing.
