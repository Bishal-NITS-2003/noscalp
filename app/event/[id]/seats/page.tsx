"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import ProgressStepper from "@/app/components/event/ProgressStepper";
import SeatMap from "@/app/components/seats/SeatMap";
import TicketPricing from "@/app/components/seats/TicketPricing";
import SelectedTickets from "@/app/components/seats/SelectedTickets";
import CheckoutSummary from "@/app/components/seats/CheckoutSummary";
import { getEventById } from "@/app/data/events";
import {
  getVenueLayoutByEventId,
  generateVenueSeats,
  ticketTiers,
  getTierForSection,
} from "@/app/data/seats";
import { Seat, SelectedTicket } from "@/app/types/seat";
import Footer from "@/app/components/Footer";

export default function SeatSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const event = getEventById(eventId);
  const venueLayout = getVenueLayoutByEventId(eventId);
  const [seats, setSeats] = useState<Seat[]>(() =>
    generateVenueSeats(venueLayout)
  );
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "selected") {
      // Deselect seat
      setSeats((prevSeats) =>
        prevSeats.map((s) =>
          s.id === seat.id ? { ...s, status: "available" } : s
        )
      );
      setSelectedTickets((prev) => prev.filter((t) => t.seat.id !== seat.id));
    } else if (seat.status === "available") {
      // Select seat - automatically get tier based on section
      const tier = getTierForSection(seat.section, venueLayout);

      setSeats((prevSeats) =>
        prevSeats.map((s) =>
          s.id === seat.id ? { ...s, status: "selected" } : s
        )
      );

      const newTicket: SelectedTicket = {
        seat,
        tier,
        eventTitle: event?.title || "Event",
        eventImage: event?.image || "/Events/7.png",
        eventDate: "June 04, Mon",
        eventTime: "08:00 PM",
      };
      setSelectedTickets((prev) => [...prev, newTicket]);
    }
  };

  const handleRemoveTicket = (seatId: string) => {
    setSeats((prevSeats) =>
      prevSeats.map((s) =>
        s.id === seatId ? { ...s, status: "available" } : s
      )
    );
    setSelectedTickets((prev) => prev.filter((t) => t.seat.id !== seatId));
  };

  const handleCheckout = () => {
    // Store selected tickets in sessionStorage or state management
    sessionStorage.setItem("selectedTickets", JSON.stringify(selectedTickets));
    router.push(`/event/${eventId}/checkout`);
  };

  const subtotal = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.tier.price,
    0
  );
  const serviceFee = selectedTickets.length > 0 ? 1.0 : 0;

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with background */}
      <div className="relative z-10">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/Hero/background.png')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
        />
        <div className="absolute inset-0 z-10 bg-linear-to-br from-[#ED4690] to-[#5522CC] opacity-90" />
        <Navbar />
      </div>

      <ProgressStepper currentStep={2} />

      {/* Event Title and Image Header */}
      <div className="w-full bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl"
          >
            {event.title}
          </motion.h1>

          {/* Event Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-64 w-full overflow-hidden rounded-2xl sm:h-80 lg:h-96"
            style={{
              background:
                "linear-gradient(to bottom right, rgba(85, 34, 204, 0.4), rgba(237, 70, 144, 0.4))",
            }}
          >
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Event Info Below Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 space-y-2"
          >
            <p className="text-base font-semibold text-gray-900 sm:text-lg">
              The Eras Tour: Taylor Swift
            </p>
            <p className="text-sm text-gray-600 sm:text-base">
              Mon, June 04 · 08:00 pm · Royal Albert Hall.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Ticket Pricing Section */}
      <div className="w-full bg-white px-4 sm:px-6 lg:px-8 ">
        <div className="mx-auto max-w-[1180px]">
          <TicketPricing tiers={ticketTiers} />
        </div>
      </div>

      {/* Seat Map - Full Width */}
      <div className="w-full bg-white px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-[1400px]">
          <SeatMap
            sections={venueLayout.sections}
            seats={seats}
            onSeatClick={handleSeatClick}
          />
        </div>
      </div>

      {/* Selected Tickets and Checkout Section - Below Seat Map */}
      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="space-y-6">
          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-sm border border-blue-300 bg-blue-100"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-sm bg-blue-600"></div>
              <span className="text-sm text-gray-600">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-sm border border-red-600 bg-red-500"></div>
              <span className="text-sm text-gray-600">Selected</span>
            </div>
          </motion.div>

          {/* Selected Tickets */}
          {selectedTickets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-white p-4 shadow-sm sm:p-6"
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Selected Tickets
              </h3>
              <SelectedTickets
                tickets={selectedTickets}
                onRemoveTicket={handleRemoveTicket}
              />
            </motion.div>
          )}

          {/* Checkout Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl bg-white p-4 shadow-sm sm:p-6"
          >
            <CheckoutSummary
              subtotal={subtotal}
              serviceFee={serviceFee}
              itemCount={selectedTickets.length}
              onCheckout={handleCheckout}
            />
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
