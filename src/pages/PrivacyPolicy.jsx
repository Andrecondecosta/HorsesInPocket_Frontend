import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail } from 'lucide-react';

import PublicPage from '../components/PublicPage';
import { Button } from '@/components/ui/button';

const CONTACT_EMAIL = 'horsehub2025@gmail.com';

const H2 = ({ children }) => <h2 className="mt-4 font-serif text-[26px] font-bold leading-tight">{children}</h2>;
const P = ({ children }) => <p className="text-[15px] leading-relaxed text-foreground/85">{children}</p>;
const UL = ({ children }) => (
  <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[15px] leading-relaxed text-foreground/85 marker:text-primary">
    {children}
  </ul>
);
const Contact = () => (
  <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 self-start font-medium text-primary hover:underline">
    <Mail className="size-4" aria-hidden="true" />
    {CONTACT_EMAIL}
  </a>
);

// O texto da política é o mesmo de antes; só muda a apresentação
const PrivacyPolicy = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <PublicPage setIsLoggedIn={setIsLoggedIn}>
      <article className="mx-auto flex max-w-2xl flex-col gap-3">
        <header className="mb-2 flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-leather">Legal</span>
          <h1 className="font-serif text-[44px] font-bold leading-none md:text-[56px]">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: 01/01/2026</p>
        </header>

        <P>
          At <strong>HorsesInPocket</strong>, your privacy is a top priority. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our platform and mobile application.
        </P>

        <H2>1. Information We Collect</H2>
        <UL>
          <li><strong>Personal Information:</strong> Name, email address, phone number, date of birth, gender, country, and account credentials.</li>
          <li><strong>Horse Data:</strong> Details you add about horses, including name, age, breed, photos, videos, and genealogy information.</li>
          <li><strong>Usage Data:</strong> Actions performed on the platform, such as horses created, shared, or received.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, device information, operating system, and app version.</li>
          <li><strong>Camera & Photos:</strong> If you grant permission, we access your camera and photo library solely to let you upload horse profile images and videos.</li>
        </UL>

        <H2>2. How We Use Your Data</H2>
        <P>We use your information to:</P>
        <UL>
          <li>Provide, operate, and improve our services.</li>
          <li>Enable you to share horse profiles securely using tokenized links.</li>
          <li>Send important notifications about your account and horse activity.</li>
          <li>Ensure the safety and integrity of the platform.</li>
          <li>Comply with legal obligations.</li>
        </UL>

        <H2>3. Sharing Information</H2>
        <P>We do not sell your data. Information may be shared with:</P>
        <UL>
          <li>Trusted partners for technical operations (e.g., hosting services, cloud storage).</li>
          <li>Other users, only when you explicitly share horse profiles via tokenized links. These links are secured with unique tokens and may expire for added security.</li>
          <li>Authorities, if legally required.</li>
        </UL>

        <H2>4. Data Retention</H2>
        <P>
          We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us.
        </P>

        <H2>5. Cookies</H2>
        <P>
          We use cookies and similar technologies to personalize your experience, analyze traffic, and remember preferences. You may disable cookies in your browser settings, though some features may not function properly.
        </P>

        <H2>6. Data Security</H2>
        <P>
          We implement appropriate technical and organizational measures to protect your data, including encrypted connections (HTTPS) and secure token-based authentication. However, no system is completely secure.
        </P>

        <H2>7. Your Rights (GDPR)</H2>
        <P>
          Under GDPR and applicable law, you have the right to:
        </P>
        <UL>
          <li>Access the personal data we hold about you.</li>
          <li>Correct inaccurate or incomplete data.</li>
          <li>Request deletion of your data ("right to be forgotten").</li>
          <li>Object to or restrict processing of your data.</li>
          <li>Data portability.</li>
        </UL>
        <P>To exercise your rights, please contact us at:</P>
        <Contact />

        <H2>8. Privacy for Minors</H2>
        <P>
          HorsesInPocket is not intended for users under 16 years old. We do not knowingly collect personal data from children. If you believe a child has provided us with their data, please contact us immediately.
        </P>

        <H2>9. Third-Party Services</H2>
        <P>
          Our platform may use third-party services (such as cloud hosting, payment processors, and analytics). These services have their own privacy policies, and we encourage you to review them.
        </P>

        <H2>10. Changes to This Policy</H2>
        <P>
          We may update this Privacy Policy from time to time. We will notify you of significant changes via the platform or email. Continued use of the app after changes constitutes acceptance of the updated policy.
        </P>

        <H2>11. Contact Us</H2>
        <P>
          If you have questions or concerns about this Privacy Policy, please contact us:
        </P>
        <Contact />

        <div className="mt-6 border-t pt-5">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ChevronLeft />
            Back
          </Button>
        </div>
      </article>
    </PublicPage>
  );
};

export default PrivacyPolicy;
