function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white text-[#172b4d]">
      <section className="bg-[#f1f5fa]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">

          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#6b778c]">
                Razorpay Buildathon
              </p>

              <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#172b4d] sm:text-4xl">
                Build the future of payments
                <br className="hidden sm:block" />
                with Razorpay
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-[#6b778c] sm:text-base">
                Build innovative payment experiences using Razorpay's
                developer-first payment infrastructure.
              </p>
            </div>
            <a
              href="https://razorpay.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-fit items-center gap-3 rounded-sm bg-[#2f5bea] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#244bd0] hover:shadow-md"
            >
              Sign Up Now

              <span className="text-base transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>

          </div>

        </div>
      </section>
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <a
                href="https://razorpay.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <span className="text-2xl font-bold italic tracking-tight text-[#1677ff]">
                  R
                </span>

                <span className="text-xl font-bold tracking-tight text-[#172b4d]">
                  Razorpay
                </span>
              </a>


              <p className="mt-5 max-w-xs text-xs leading-5 text-[#6b778c]">
                Powering businesses with modern payment infrastructure,
                financial technology and developer-first APIs.
              </p>


              <p className="mt-5 max-w-xs text-xs leading-5 text-[#6b778c]">
                Build smarter payment experiences and create products
                that move money forward.
              </p>
              <div className="mt-7 flex gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[9px] font-bold text-slate-500">
                  PCI
                  <br />
                  DSS
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[9px] font-bold text-slate-500">
                  ISO
                  <br />
                  27001
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[9px] font-bold text-slate-500">
                  SOC
                  <br />
                  2
                </div>

              </div>

            </div>
            <div className="lg:col-span-2">
              <FooterColumn title="Accept Payments">
                <FooterLink
                  href="https://razorpay.com/payment-gateway/"
                  label="Payment Gateway"
                />
                <FooterLink
                  href="https://razorpay.com/payment-links/"
                  label="Payment Links"
                />
                <FooterLink
                  href="https://razorpay.com/payment-pages/"
                  label="Payment Pages"
                />
                <FooterLink
                  href="https://razorpay.com/docs/"
                  label="Payment APIs"
                />
                <FooterLink
                  href="https://razorpay.com/docs/"
                  label="QR Codes"
                />
                <FooterLink
                  href="https://razorpay.com/subscriptions/"
                  label="Subscriptions"
                />
                <FooterLink
                  href="https://razorpay.com/"
                  label="Smart Collect"
                />
                <FooterLink
                  href="https://razorpay.com/"
                  label="Optimizer"
                />
              </FooterColumn>
              <FooterColumn title="Payroll" className="mt-9">
                <FooterLink
                  href="https://razorpay.com/payroll/"
                  label="RazorpayX Payroll"
                />
              </FooterColumn>
              <FooterColumn title="Become a Partner" className="mt-9">
                <FooterLink
                  href="https://razorpay.com/partners/"
                  label="Refer and Earn"
                />
                <FooterLink
                  href="https://razorpay.com/partners/"
                  label="Partner Program"
                />
              </FooterColumn>
            </div>
            <div className="lg:col-span-2">
              <FooterColumn title="Banking Plus">
                <FooterLink
                  href="https://razorpay.com/razorpayx/"
                  label="RazorpayX"
                />
                <FooterLink
                  href="https://razorpay.com/razorpayx/current-account/"
                  label="Current Accounts"
                />
                <FooterLink
                  href="https://razorpay.com/razorpayx/payouts/"
                  label="Payouts"
                />
                <FooterLink
                  href="https://razorpay.com/razorpayx/payout-links/"
                  label="Payout Links"
                />
              </FooterColumn>
              <FooterColumn title="Developers" className="mt-9">
                <FooterLink
                  href="https://razorpay.com/docs/"
                  label="Docs"
                />
                <FooterLink
                  href="https://razorpay.com/docs/"
                  label="Integrations"
                />
                <FooterLink
                  href="https://razorpay.com/docs/api/"
                  label="API Reference"
                />
                <FooterLink
                  href="https://razorpay.com/docs/api/sandbox-setup/"
                  label="Sandbox"
                />
              </FooterColumn>

              <FooterColumn title="Resources" className="mt-9">
                <FooterLink
                  href="https://razorpay.com/blog/"
                  label="Blog"
                />
                <FooterLink
                  href="https://razorpay.com/blog/"
                  label="Learn"
                />
                <FooterLink
                  href="https://razorpay.com/docs/"
                  label="Documentation"
                />
                <FooterLink
                  href="https://razorpay.com/"
                  label="Customer Stories"
                />
              </FooterColumn>
            </div>
            <div className="lg:col-span-2">
              <FooterColumn title="Company">
                <FooterLink
                  href="https://razorpay.com/about/"
                  label="About Us"
                />
                <FooterLink
                  href="https://razorpay.com/careers/"
                  label="Careers"
                />
                <FooterLink
                  href="https://razorpay.com/terms/"
                  label="Terms of Use"
                />
                <FooterLink
                  href="https://razorpay.com/privacy-policy/"
                  label="Privacy Policy"
                />
                <FooterLink
                  href="https://razorpay.com/grievance-redressal/"
                  label="Grievance Redressal"
                />
                <FooterLink
                  href="https://razorpay.com/responsible-disclosure/"
                  label="Responsible Disclosure"
                />
                <FooterLink
                  href="https://razorpay.com/partners/"
                  label="Partners"
                />
              </FooterColumn>
              <FooterColumn title="Help & Support" className="mt-9">
                <FooterLink
                  href="https://razorpay.com/support/"
                  label="Support"
                />
                <FooterLink
                  href="https://razorpay.com/docs/faqs/"
                  label="Knowledge Base"
                />
              </FooterColumn>
            </div>
            <div className="lg:col-span-3">
              <FooterColumn title="Find Us Online">
                <div className="mt-5 flex items-center gap-2">
                  <SocialLink
                    href="https://www.facebook.com/Razorpay/"
                    label="f"
                    ariaLabel="Razorpay Facebook"
                  />
                  <SocialLink
                    href="https://www.linkedin.com/in/vishal-singh-5b052828a/"
                    label="in"
                    ariaLabel="Vishal Singh LinkedIn"
                  />
                  <SocialLink
                    href="https://www.instagram.com/razorpay/"
                    label="◎"
                    ariaLabel="Razorpay Instagram"
                  />
                  <SocialLink
                    href="https://x.com/Razorpay"
                    label="𝕏"
                    ariaLabel="Razorpay X"
                  />
                  <SocialLink
                    href="https://github.com/razorpay"
                    label="◉"
                    ariaLabel="Razorpay GitHub"
                  />
                </div>
              </FooterColumn>
              <div className="mt-10">

                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b778c]">
                  System Status
                </p>
                <a
                  href="https://status.razorpay.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-xs text-[#6b778c] transition-colors hover:text-[#172b4d]"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span>
                    All systems operational
                  </span>
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
              <div className="mt-10">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b778c]">
                  Registered Office
                </p>

                <p className="max-w-xs text-xs leading-5 text-[#6b778c]">
                  Razorpay Payments Private Limited
                  <br />
                  Bengaluru, Karnataka, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-slate-200 bg-[#fafbfc]">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-4 text-xs text-[#6b778c] md:flex-row md:items-center md:justify-between">
            <p>
              © {currentYear} Razorpay Buildathon. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
             <a
                href="https://razorpay.com/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#172b4d]"
              >
                Privacy Policy
              </a>

              <a
                href="https://razorpay.com/terms/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#172b4d]"
              >
                Terms
              </a>

              <a
                href="https://razorpay.com/responsible-disclosure/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#172b4d]"
              >
                Responsible Disclosure
              </a>

              <a
                href="https://razorpay.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#172b4d]"
              >
                Razorpay.com
              </a>

            </div>

          </div>

        </div>

      </section>

    </footer>
  );
}
function FooterColumn({ title, children, className = "" }) {
  return (
    <div className={className}>

      <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#172b4d]">
        {title}
      </h3>

      <div className="mt-4 space-y-2">
        {children}
      </div>

    </div>
  );
}
function FooterLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-fit text-xs leading-5 text-[#42526e] transition-colors duration-200 hover:text-[#1677ff]"
    >
      {label}
    </a>
  );
}
function SocialLink({ href, label, ariaLabel }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="flex h-8 w-8 items-center justify-center rounded-sm border border-slate-200 bg-white text-[11px] font-semibold text-[#42526e] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1677ff] hover:text-[#1677ff] hover:shadow"
    >
      {label}
    </a>
  );
}


export default Footer;