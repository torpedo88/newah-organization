import { cn } from "@/lib/utils";

/**
 * Border frame for the form, following the haku patasi itself: the black
 * cloth, then a narrow gold thread, then the wide red border band.
 *
 * The order and the weights matter — on the garment the gold is a pinstripe
 * separating the black from the red, not a band in its own right, and the red
 * is the widest element. Getting that backwards reads as a generic gold frame
 * rather than the sari.
 *
 * The bands are a border plus spread box-shadows rather than nested padded
 * divs on purpose. A filled parent sits *behind* its child, so a translucent
 * form would sample the frame's own colour and render as a solid panel. A
 * border and shadows occupy only the edge, leaving nothing behind the content.
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
        "shadow-[0_0_0_3px_#C9A227,0_0_0_24px_#C0102B,0_0_0_25px_#7E0A1C,0_28px_64px_-24px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
