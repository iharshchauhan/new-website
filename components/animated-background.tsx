export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#d5e3b5_0%,#dce7bd_18%,#e8edd2_34%,#f1efdf_60%,#f5f2e8_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(247,255,211,0.65)_0,transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.26)_0,transparent_24%),radial-gradient(circle_at_90%_20%,rgba(255,255,255,0.2)_0,transparent_26%)]" />
    </div>
  );
}
