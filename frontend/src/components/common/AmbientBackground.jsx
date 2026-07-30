// Soft, slowly drifting blurred shapes behind the page content, in brand
// colors. Fixed to the viewport so it's visible site-wide without repeating
// per-section. Purely decorative — pointer-events disabled, low opacity.
function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="bg-blob bg-blob-a"
        style={{
          top: '-10%',
          left: '-5%',
          width: '420px',
          height: '420px',
          background: '#F2B705'
        }}
      />
      <div
        className="bg-blob bg-blob-b"
        style={{
          top: '30%',
          right: '-8%',
          width: '380px',
          height: '380px',
          background: '#0A0A0A'
        }}
      />
      <div
        className="bg-blob bg-blob-c"
        style={{
          bottom: '-12%',
          left: '20%',
          width: '460px',
          height: '460px',
          background: '#CC9900'
        }}
      />
    </div>
  );
}

export default AmbientBackground;
