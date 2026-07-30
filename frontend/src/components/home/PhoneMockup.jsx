// Displays the actual hand-holding-phone mockup graphic supplied by the
// client, placed at /public/images/phone-mockup.png
function PhoneMockup({ className = '' }) {
  return (
    <div className={`mx-auto ${className}`}>
      <img
        src="/images/phone-mockup.png"
        alt="QuantSolutions app on a phone"
        className="w-full object-contain"
      />
    </div>
  );
}

export default PhoneMockup;
