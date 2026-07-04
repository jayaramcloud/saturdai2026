const REGISTRATION_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc85wV7CgYL6QUN-4xCjplm3ryfM4NOdJoZrVjjThtMO2bKKQ/viewform";

export default function RegisterBanner() {
  return (
    <div className="register-banner">
      <span className="register-banner-text">🚀 Free AI Bootcamp starts July 4 — spots are limited</span>
      <a
        href={REGISTRATION_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="register-banner-btn"
      >
        Register Now
      </a>
    </div>
  );
}
