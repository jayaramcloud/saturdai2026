const REGISTRATION_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc85wV7CgYL6QUN-4xCjplm3ryfM4NOdJoZrVjjThtMO2bKKQ/viewform";
const CONTACT_EMAIL = "jayaram.linux@gmail.com";

export default function RegisterBanner() {
  return (
    <div className="register-banner">
      <span className="register-banner-text">
        🚀 Agentic AI with Hermes Agent starts Fri, Sep 25 — spots are limited
      </span>
      <a
        href={REGISTRATION_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="register-banner-btn"
      >
        Register Now
      </a>
      <span className="register-banner-text">
        or Email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="register-banner-link">
          {CONTACT_EMAIL}
        </a>
      </span>
    </div>
  );
}
