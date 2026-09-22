import { cn } from "@/lib/utils";

/**
 * The patasi border.
 *
 * On the garment the black sari is edged with a deep red band carrying a fine
 * woven pattern. Here that band frames the card: a red gradient border with
 * repeating hairlines standing in for the weave, and a thin gold line where
 * the band meets the cloth, which is how the real border reads up close.
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
        "relative rounded-[28px] p-[10px]",
        // the band itself, woven with repeating hairlines
        "bg-[repeating-linear-gradient(135deg,#C0102B_0px,#C0102B_6px,#9E0C22_6px,#9E0C22_9px,#E23B50_9px,#E23B50_10px)]",
        "shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)]",
        className,
      )}
    >
      {/* the gold thread where the border meets the cloth */}
      <div className="rounded-[20px] p-px bg-lun/70">
        <div className="overflow-hidden rounded-[19px]">{children}</div>
      </div>
    </div>
  );
}
