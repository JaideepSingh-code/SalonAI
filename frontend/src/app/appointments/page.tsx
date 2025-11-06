"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AppointmentCard from "@/components/AppointmentCard";
import { getAppointments, createAppointment, getServices, cancelAppointment } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import toast from "react-hot-toast";

interface Service {
  id: number;
  name: string;
  base_price: number;
  duration_minutes: number;
  category: string;
}

interface Appointment {
  id: number;
  service_name: string;
  appointment_date: string;
  status: string;
  total_price: number;
  duration_minutes: number;
  notes: string;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    service_id: 0,
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return; }

    const fetchData = async () => {
      try {
        const [aptsRes, svcRes] = await Promise.all([getAppointments(), getServices()]);
        setAppointments(aptsRes.data.appointments);
        setServices(svcRes.data.services);
      } catch { router.push("/login"); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [router]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateTime = `${bookingForm.appointment_date}T${bookingForm.appointment_time}:00`;
      await createAppointment({
        stylist_id: 1, // Default stylist for now
        service_id: bookingForm.service_id,
        appointment_date: dateTime,
        notes: bookingForm.notes,
      });
      toast.success("Appointment booked!");
      setShowBooking(false);
      const res = await getAppointments();
      setAppointments(res.data.appointments);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to book");
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelAppointment(id);
      toast.success("Appointment cancelled");
      setAppointments(appointments.map((a) => a.id === id ? { ...a, status: "cancelled" } : a));
    } catch {
      toast.error("Failed to cancel");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-salon-light">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
          <button onClick={() => setShowBooking(!showBooking)} className="btn-primary">
            {showBooking ? "Cancel" : "Book New"}
          </button>
        </div>

        {/* Booking Form */}
        {showBooking && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold mb-4">Book an Appointment</h3>
            <form onSubmit={handleBook} className="grid md:grid-cols-2 gap-4">
              <select
                className="input-field"
                value={bookingForm.service_id}
                onChange={(e) => setBookingForm({ ...bookingForm, service_id: Number(e.target.value) })}
                required
              >
                <option value={0}>Select a service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - ${s.base_price} ({s.duration_minutes} min)
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="input-field"
                value={bookingForm.appointment_date}
                onChange={(e) => setBookingForm({ ...bookingForm, appointment_date: e.target.value })}
                required
              />
              <input
                type="time"
                className="input-field"
                value={bookingForm.appointment_time}
                onChange={(e) => setBookingForm({ ...bookingForm, appointment_time: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Notes (optional)"
                className="input-field"
                value={bookingForm.notes}
                onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
              />
              <button type="submit" className="btn-primary md:col-span-2">
                Confirm Booking
              </button>
            </form>
          </div>
        )}

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No appointments yet. Book your first one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
