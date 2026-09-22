import { cn } from "@/lib/utils";

/**
 * Border frame for the form, carrying all three colours of the haku patasi:
 * a thin black lining against the cloth, the deep red border band, and a
 * thick gold edge on the outside.
 *
 * The bands are a border plus spread box-shadows rather than nested padded
 * divs on purpose. A filled parent sits *behind* its child, so a translucent
 * form would sample the frame's own colour and render as a solid panel —
 * which is exactly what nested wrappers did here. A border and shadows occupy
 * only the edge, leaving nothing behind the content.
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
        // the margin gives the rings room; box-shadow reserves no layout space
        "m-[26px] overflow-hidden rounded-[20px] border-4 border-haku",
        "shadow-[0_0_0_11px_#C0102B,0_0_0_25px_#C9A227,0_0_0_26px_#8C6D12,0_28px_64px_-24px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
