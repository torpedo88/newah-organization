import DoorRegistrationForm from "@/components/admin/door-registration-form";
import AdminBackdrop from "@/components/ui/admin-backdrop";

export default function DoorTestPage() {
  return (
    <div className="relative min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <AdminBackdrop />
      <div className="relative mx-auto w-full max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-white">Door Registration Test</h1>
        <DoorRegistrationForm />
      </div>
    </div>
  );
}
