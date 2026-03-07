export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#dccf9f_0%,#e6d8ab_20%,#eee1bb_42%,#f4e9c9_68%,#f8f0db_100%)]" />
      <div className="absolute inset-0 bg-phase-green" />
      <div className="absolute inset-0 bg-phase-purple" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.32)_0,transparent_44%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.24)_0,transparent_24%),radial-gradient(circle_at_90%_20%,rgba(255,255,255,0.2)_0,transparent_26%)]" />
    </div>
  );
}
