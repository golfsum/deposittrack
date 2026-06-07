import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How DepositTrack collects, uses, stores, and protects your information.",
};

const UPDATED = "June 7, 2026";
const CONTACT = "support@deposittrack.com";

export default function PrivacyPage() {
  return (
    <article>
      <h1>Privacy Policy</h1>
      <p className="updated">Last updated: {UPDATED}</p>

      <p>
        DepositTrack (&ldquo;DepositTrack,&rdquo; &ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;) helps landlords, tenants, property
        managers, and inspectors document property conditions and protect security
        deposits. This Privacy Policy explains what information we collect, how we
        use it, and the choices you have. It applies to our mobile apps, website,
        and related services (the &ldquo;Service&rdquo;).
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Account information.</strong> Your name, email address, and the
          role you select (tenant, landlord, property manager, or inspector) when
          you create an account or sign in with Google or Apple.
        </li>
        <li>
          <strong>Inspection content.</strong> Photos, notes, room conditions,
          checklists, comments, property details, and the move-in summary
          information you enter (such as deposit amount, rent, and lease dates).
        </li>
        <li>
          <strong>Photo metadata and location.</strong> When you allow it, photos
          are tagged with the date, time, and GPS coordinates of capture to verify
          where and when documentation was made.
        </li>
        <li>
          <strong>Electronic signatures.</strong> When a report is signed, we
          record the signer&rsquo;s name, role, user ID, date, time, IP address,
          and device information to maintain a compliant audit trail.
        </li>
        <li>
          <strong>Device and usage data.</strong> App version, device type,
          operating system, and basic diagnostic information used to operate and
          improve the Service.
        </li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To create, sync, and share inspections and generate reports.</li>
        <li>To verify photo authenticity through timestamp and GPS data.</li>
        <li>To capture and maintain legally compliant electronic signatures.</li>
        <li>To send notifications you request (assignments, signature requests, lease reminders).</li>
        <li>To secure the Service, prevent abuse, and provide support.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>How your information is stored and secured</h2>
      <p>
        Your data is stored using Google Firebase (Authentication, Cloud
        Firestore, and Cloud Storage). Data is encrypted in transit and at rest,
        access is restricted by authentication and security rules, and inspection
        activity is recorded in an immutable audit log. No method of transmission
        or storage is 100% secure, but we work to protect your information using
        industry-standard measures.
      </p>

      <h2>How we share information</h2>
      <ul>
        <li>
          <strong>Collaborators.</strong> Inspections you share are visible to the
          people you invite, according to the access level you choose (shared,
          review-only, or comment-only).
        </li>
        <li>
          <strong>Service providers.</strong> We use Google Firebase and Google /
          Apple sign-in to operate the Service. Their handling of data is governed
          by their respective privacy policies.
        </li>
        <li>
          <strong>Legal.</strong> We may disclose information if required by law or
          to protect the rights, safety, and security of users and the Service.
        </li>
        <li>
          <strong>We do not sell your personal information.</strong>
        </li>
      </ul>

      <h2>Data retention</h2>
      <p>
        We retain inspection records and associated data for as long as your
        account is active or as needed to provide the Service and meet legal
        requirements. You may request deletion of your account and associated data
        at any time.
      </p>

      <h2>Your rights and choices</h2>
      <ul>
        <li>Access, update, or delete your account information.</li>
        <li>Control camera, photo library, location, and notification permissions in your device settings.</li>
        <li>Request a copy or deletion of your data by contacting us.</li>
      </ul>

      <h2>Children</h2>
      <p>
        The Service is not directed to children under 13 (or the age required by
        your jurisdiction), and we do not knowingly collect their information.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will
        be posted on this page with an updated &ldquo;Last updated&rdquo; date.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about this Privacy Policy? Email us at{" "}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>
    </article>
  );
}
