"use client";

interface Appointment {
  id: number;
  service_name: string;
  appointment_date: string;
  status: string;
  total_price: number;
  duration_minutes: number;
  notes: string;
}

interface Props {
  appointment: Appointment;
  onCancel: (id: number) => void;
}

export default function AppointmentCard({ appointment, onCancel }: Props) {
  const date = new Date(appointment.appointment_date);
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="card flex justify-between items-center">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{appointment.service_name}</h4>
        <p className="text-sm text-gray-500">
          {date.toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}{" "}
          at {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </p>
        <p className="text-sm text-gray-400">{appointment.duration_minutes} min</p>
        {appointment.notes && (
          <p className="text-sm text-gray-400 mt-1">Note: {appointment.notes}</p>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-semibold text-gray-700">
          ${appointment.total_price?.toFixed(2)}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status] || ""}`}>
          {appointment.status}
        </span>
        {(appointment.status === "pending" || appointment.status === "confirmed") && (
          <button
            onClick={() => onCancel(appointment.id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
