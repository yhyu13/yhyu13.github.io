import { DotMatrixBackground } from "@designcodeio/threeui/components/DotMatrixBackground";

export default function StageWash() {
  return (
    <div className="stage-wash" aria-hidden="true">
      <DotMatrixBackground opacity={0.18} hue={32} speed={0.35} gridScale={48} />
    </div>
  );
}
