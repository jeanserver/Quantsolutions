// Displays the actual AI mascot graphic supplied by the client, placed at
// /public/images/ai-mascot.png
function AIBadge({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/images/ai-mascot.png"
        alt="QuantSolutions AI"
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export default AIBadge;
