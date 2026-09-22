import { cn } from "@/lib/utils";

/**
 * Border frame for the form: a thin black lining with a thick gold band
 * outside it, and nothing at all behind the content.
 *
 * The bands are a border plus spread box-shadows rather than nested padded
 * divs on purpose. A filled parent sits *behind* its child, so a translucent
 * form would have sampled the frame's own colour and rendered as a solid
 * panel — which is exactly what nested wrappers did here. A border and a
 * shadow occupy only the edge, so the photograph shows through the middle.
 *
 * Purely decorative — it adds no semantics and is not announced.
 */
export default function PatasiFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // the margin gives the outer gold band room; box-shadow does not
        // reserve layout space of its own
        "m-[15px] overflow-hidden rounded-[20px] border-4 border-haku",
        "shadow-[0_0_0_15px_#C9A227,0_0_0_16px_#8C6D12,0_28px_64px_-24px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
