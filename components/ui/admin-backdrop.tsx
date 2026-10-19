/**
 * Backdrop for the board's admin pages.
 *
 * Deliberately not an event photograph: the admin covers every event, and
 * the Indra Jatra image it used to borrow made Mha Puja's registrations look
 * like they belonged to the wrong festival. Plain haku with a faint warm
 * wash; the site-wide patasi weave from the root layout shows through.
 */
export default function AdminBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(90%_60%_at_50%_0%,rgba(192,16,43,0.10),transparent_70%)]"
    />
  );
}
