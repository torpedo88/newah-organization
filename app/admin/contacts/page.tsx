import { createClient } from "@/lib/supabase/server";
import { deleteContact, updateContactStatus } from "./actions";

export default async function ContactsPage() {
  const supabase = await createClient();

  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
        <p className="text-gray-600 mt-2">View and manage contact form submissions</p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading contacts: {error.message}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Subject</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contacts && contacts.length > 0 ? (
                contacts.map((contact: any) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{contact.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{contact.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{contact.subject}</td>
                    <td className="px-6 py-4 text-sm">
                      <form action={async () => {
                        "use server";
                        const statuses = ["new", "read", "responded", "archived"];
                        const currentIdx = statuses.indexOf(contact.status);
                        const nextStatus = statuses[(currentIdx + 1) % statuses.length];
                        await updateContactStatus(contact.id.toString(), nextStatus);
                      }}>
                        <button
                          type="submit"
                          className="inline-block px-3 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: {
                              "new": "#fecaca",
                              "read": "#fef08a",
                              "responded": "#bbf7d0",
                              "archived": "#d1d5db",
                            }[contact.status] || "#e5e7eb",
                            color: {
                              "new": "#7f1d1d",
                              "read": "#78350f",
                              "responded": "#065f46",
                              "archived": "#374151",
                            }[contact.status] || "#1f2937",
                          }}
                        >
                          {contact.status}
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <a
                        href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Reply
                      </a>
                      <button
                        onClick={async () => {
                          if (confirm("Delete this contact?")) {
                            await deleteContact(contact.id.toString());
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No contact submissions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
