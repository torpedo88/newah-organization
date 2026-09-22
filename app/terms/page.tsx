import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal/legal-page";
import { ORG, formattedAddress } from "@/lib/legal/org";

export const metadata: Metadata = {
  title: "Terms and Conditions - Newah Organization of America",
  description:
    "The terms governing use of this website, event registration and donations for the Northern California Chapter of the Newah Organization of America.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions">
      <p>
        These Terms and Conditions (&ldquo;Terms&rdquo;) govern your use of this website
        and your registration for events or submission of donations through it. The site
        is operated by {ORG.name} (&ldquo;{ORG.shortName}&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;) through its {ORG.chapter}.
      </p>
      <p>
        <strong>
          By registering, donating or otherwise using this site, you agree to these Terms.
        </strong>{" "}
        If you do not agree, please do not use the site. Please also read our{" "}
        <Link href="/privacy">Privacy Policy</Link>, which forms part of these Terms.
      </p>

      <h2>1. Who we are</h2>
      <p>
        {ORG.legalName} is a nonprofit organization dedicated to preserving and promoting
        Newah culture, language and traditions in the United States. The {ORG.chapter}{" "}
        organizes events and community activities in Northern California.
      </p>

      <h2>2. Eligibility and accurate information</h2>
      <p>
        You must be at least 18 years old to submit a form on this site. If you are
        registering on behalf of other people, including children, you confirm you are
        authorized to provide their information and to agree to these Terms for them.
      </p>
      <p>
        You agree to provide accurate and complete information. We rely on what you submit
        to plan catering, seating and capacity, and inaccurate information may mean we
        cannot accommodate you.
      </p>

      <h2>3. Registrations</h2>
      <ul>
        <li>
          A registration is confirmed when you receive a registration reference code. A
          submitted form alone is not a guarantee of a place.
        </li>
        <li>
          We may limit numbers, and we may decline or cancel a registration where an event
          is at capacity, where information appears inaccurate or fraudulent, or where
          required for the safety or good conduct of an event.
        </li>
        <li>
          Registering for food indicates the number of guests and the selection you
          expect. Please contact us as early as possible if your numbers change.
        </li>
        <li>
          Events may be changed, rescheduled or cancelled. We will make reasonable efforts
          to notify registrants using the contact details provided.
        </li>
      </ul>

      <h2>4. Donations</h2>
      <ul>
        <li>
          <strong>Donations are voluntary and, unless we state otherwise in writing, are
          final and non-refundable.</strong> If you believe a donation was made in error
          or was duplicated, contact us at{" "}
          <a href={`mailto:${ORG.contactEmail}`}>{ORG.contactEmail}</a> and we will review
          it in good faith.
        </li>
        <li>
          Payments are processed by a third-party payment processor. Your use of that
          payment page is also governed by that processor&rsquo;s own terms. We do not
          receive or store your card details.
        </li>
        <li>
          You are responsible for the accuracy of the payment details you enter and for
          ensuring you are authorized to use the payment method.
        </li>
        {ORG.showTaxDeductibility ? (
          <li>
            {ORG.legalName} is recognized as tax-exempt under section 501(c)(3) of the
            Internal Revenue Code (EIN {ORG.ein}). Donations may be tax-deductible to the
            extent permitted by law, less the value of any goods or services received. We
            do not provide tax advice; please consult your own advisor.
          </li>
        ) : (
          <li>
            Any statement about the tax treatment of a donation will be made in your
            receipt. We do not provide tax advice; please consult your own advisor about
            deductibility.
          </li>
        )}
      </ul>

      <h2>5. Communications you agree to receive</h2>
      <p>
        When you tick the consent box on our forms, you agree that we may use the contact
        details you provide to send you communications about requests for support,
        membership drives, upcoming and future events, and other organizational news.
      </p>
      <p>
        <strong>You may opt out at any time</strong> by using the unsubscribe link in any
        email we send, or by emailing{" "}
        <a href={`mailto:${ORG.contactEmail}`}>{ORG.contactEmail}</a>. We will still send
        you messages that relate directly to a registration or donation you have made.
      </p>

      <h2>6. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>submit false, misleading or fraudulent information, or impersonate anyone;</li>
        <li>submit registrations in bulk or by automated means;</li>
        <li>attempt to gain unauthorized access to any part of the site, its administrative areas, or its underlying systems;</li>
        <li>interfere with, disrupt or place undue load on the site;</li>
        <li>use the site or any information obtained from it for unlawful purposes, or to send unsolicited communications.</li>
      </ul>

      <h2>7. Conduct at events</h2>
      <p>
        We ask everyone attending our events to behave respectfully toward other
        attendees, volunteers and venue staff. We may decline entry to, or ask to leave,
        anyone whose conduct is unsafe, harassing or seriously disruptive, without refund.
      </p>

      <h2>8. Photography at events</h2>
      <p>
        Our events are community gatherings and photographs or video may be taken and used
        in the organization&rsquo;s publications, website and social media. If you prefer
        not to appear, tell an organizer at the event or email us and we will make
        reasonable efforts to accommodate you and to remove images on request.
      </p>

      <h2>9. Intellectual property</h2>
      <p>
        The organization&rsquo;s name, logo and the content of this site belong to{" "}
        {ORG.legalName} or its licensors, and may not be used without permission. The
        photograph used as this site&rsquo;s background is used under its own license,
        credited where it appears.
      </p>

      <h2>10. Availability of the site</h2>
      <p>
        The site is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
        basis. We do not warrant that it will be uninterrupted, timely or error-free. We
        may change, suspend or discontinue any part of it at any time. To the fullest
        extent permitted by law, we disclaim all warranties, express or implied, including
        the implied warranties of merchantability, fitness for a particular purpose and
        non-infringement.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by applicable law, {ORG.shortName}, its officers,
        board members, volunteers and agents will not be liable for any indirect,
        incidental, special, consequential or punitive damages, or for any loss of data,
        profits, or goodwill, arising out of your use of this site or your attendance at
        an event.
      </p>
      <p>
        Our total liability arising out of or relating to these Terms will not exceed the
        greater of the amount you paid to us in the twelve months before the claim, or
        one hundred United States dollars (US$100).
      </p>
      <p>
        Nothing in these Terms excludes or limits liability that cannot lawfully be
        excluded or limited, including liability for death or personal injury caused by
        negligence, or for fraud.
      </p>

      <h2>12. Indemnity</h2>
      <p>
        You agree to indemnify and hold harmless {ORG.shortName}, its officers, board
        members and volunteers from any claim or demand, including reasonable legal fees,
        arising out of your breach of these Terms, your misuse of the site, or your
        violation of any law or the rights of a third party.
      </p>

      <h2>13. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of the State of California, without regard to
        its conflict of laws rules. You and {ORG.shortName} agree to the exclusive
        jurisdiction of the state and federal courts located in Northern California for
        any dispute arising out of these Terms.
      </p>
      <p>
        Before commencing any formal proceedings, you agree to contact us at{" "}
        <a href={`mailto:${ORG.contactEmail}`}>{ORG.contactEmail}</a> and to attempt in
        good faith to resolve the dispute informally for at least thirty days.
      </p>

      <h2>14. Severability and entire agreement</h2>
      <p>
        If any provision of these Terms is held unenforceable, the remaining provisions
        remain in full force, and the unenforceable provision will be applied as closely
        as possible to its original intent. These Terms, with the Privacy Policy,
        constitute the entire agreement between you and us regarding this site. Our
        failure to enforce any provision is not a waiver of it.
      </p>

      <h2>15. Changes to these Terms</h2>
      <p>
        We may update these Terms. The effective date at the top of this page shows when
        they last changed, and continued use of the site after a change means you accept
        the updated Terms.
      </p>

      <h2>16. Contact</h2>
      <p>
        <strong>{ORG.legalName}</strong>
        <br />
        {ORG.chapter}
        <br />
        Email: <a href={`mailto:${ORG.contactEmail}`}>{ORG.contactEmail}</a>
        <br />
        {formattedAddress()}
      </p>
    </LegalPage>
  );
}
