"use client";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProgressStepper from "@/app/components/event/ProgressStepper";
import EventHeader from "../../components/event/EventHeader";
import DateTimeSelector, {
  type TimeSlot,
} from "../../components/event/DateTimeSelector";
import { getEventById } from "../../data/events";

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const event = getEventById(eventId);

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Event Not Found
          </h1>
          <p className="text-gray-600">
            The event you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const handleBookNow = (slot: TimeSlot) => {
    // Store the selected time slot and navigate to seat selection
    sessionStorage.setItem("selectedTimeSlot", JSON.stringify(slot));
    router.push(`/event/${eventId}/seats`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with white background for event pages */}
      <div className="z-10 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/Hero/background.png')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
        />
        <div className="absolute opacity-90 inset-0 z-10 bg-linear-to-br from-[#ED4690] to-[#5522CC]" />
        <Navbar />
      </div>

      {/* Progress Stepper */}
      <ProgressStepper currentStep={1} />

      {/* Event Header */}
      <EventHeader
        title={event.title}
        image={event.image}
        date="3 June until 6 June, 2024"
        time="08:00 PM & 10:00 PM"
        location={event.venue}
      />

      {/* Date & Time Selector */}
      <DateTimeSelector timeSlots={event.timeSlots} onBookNow={handleBookNow} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
