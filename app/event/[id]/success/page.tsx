"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import Navbar from "@/app/components/Navbar";
import ProgressStepper from "@/app/components/event/ProgressStepper";
import SuccessHeader from "@/app/components/success/SuccessHeader";
import ItemDetails from "@/app/components/success/ItemDetails";
import CustomerDetailsSection from "@/app/components/success/CustomerDetailsSection";
import RewardsSection from "@/app/components/success/RewardsSection";
import TicketCard from "@/app/components/success/TicketCard";
import ActionButtons from "@/app/components/success/ActionButtons";
import Footer from "@/app/components/Footer";
import { SelectedTicket } from "@/app/types/seat";

// Mock customer data - in production this would come from auth/database
const MOCK_CUSTOMER_DATA = {
  name: "Elnaz Bolkhari",
  contactNumber: "98 935-498 28 65",
  email: "elnazbolkhari@gmail",
};

// Rewards configuration
const REWARDS = [
  {
    message: "20% Discount on your next ticket!",
    type: "discount" as const,
  },
  {
    message: "Earned: 50 points for your purchase!",
    type: "points" as const,
  },
];

export default function SuccessPage() {
  const router = useRouter();
  const ticketCardRef = useRef<HTMLDivElement>(null);

  const [purchaseData, setPurchaseData] = useState<{
    tickets: SelectedTicket[];
    totalAmount: number;
    purchaseDate: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Fetch purchase data from sessionStorage
    const storedData = sessionStorage.getItem("purchaseData");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setTimeout(() => setPurchaseData(data), 0);
      } catch (error) {
        console.error("Error parsing purchase data:", error);
        router.push("/");
      }
    } else {
      // No purchase data found, redirect to home
      router.push("/");
    }
    setTimeout(() => setIsLoading(false), 0);
  }, [router]);

  const handleDownloadTicket = async () => {
    if (!ticketCardRef.current) {
      alert("Ticket card not found. Please try again.");
      return;
    }

    setIsDownloading(true);

    // Small delay to ensure all content is rendered
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      const element = ticketCardRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#111827",
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0,
        removeContainer: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // Create download link
      const link = document.createElement("a");
      const eventTitle = purchaseData?.tickets[0]?.eventTitle || "Event-Ticket";
      link.download = `${eventTitle.replace(/\s+/g, "-")}-Ticket.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsDownloading(false);
    } catch (error) {
      console.error("Error downloading ticket:", error);
      console.error("Error details:", {
        message: (error as Error).message,
        stack: (error as Error).stack,
      });
      alert(
        `Failed to download ticket: ${
          (error as Error).message
        }. Please try taking a screenshot instead.`
      );
      setIsDownloading(false);
    }
  };

  const handleShareTicket = async () => {
    if (!purchaseData) return;

    const ticket = purchaseData.tickets[0];
    const shareData = {
      title: `${ticket.eventTitle} - Ticket`,
      text: `I just got tickets for ${ticket.eventTitle}! 🎉\nDate: ${
        ticket.eventDate
      }\nTime: ${ticket.eventTime}\nSection: ${
        ticket.seat.section
      }, Row ${String.fromCharCode(64 + ticket.seat.row)}, Seat ${
        ticket.seat.number
      }`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
        );
        alert("Ticket details copied to clipboard!");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Error sharing:", error);
        // Try clipboard as fallback
        try {
          await navigator.clipboard.writeText(
            `${shareData.title}\n\n${shareData.text}`
          );
          alert("Ticket details copied to clipboard!");
        } catch {
          alert("Unable to share. Please try again.");
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          <p className="text-gray-600">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!purchaseData) {
    return null; // Will redirect
  }

  // Calculate ticket details for display
  const firstTicket = purchaseData.tickets[0];
  const eventTitle = firstTicket.eventTitle;
  const quantity = purchaseData.tickets.length;

  // Group tickets by section to display seat numbers
  const sectionSeats = purchaseData.tickets
    .map((t) => t.seat.number)
    .join(", ");
  const sectionLetter = firstTicket.seat.section
    .replace("section-", "")
    .toUpperCase();

  // Format date as "4 June" from "June 04, Mon"
  const formatDate = (dateStr: string) => {
    const parts = dateStr.split(" ");
    if (parts.length >= 2) {
      const day = parts[1].replace(",", "");
      const month = parts[0];
      return `${parseInt(day)} ${month}`;
    }
    return dateStr;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with gradient background */}
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
        <div className="relative z-20">
          <Navbar />
        </div>
      </div>

      {/* Progress Stepper */}
      <ProgressStepper currentStep={4} />

      {/* Main Content */}
      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Success Header */}
        <div className="mb-6 sm:mb-8">
          <SuccessHeader />
        </div>

        {/* Two Column Layout - Responsive */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* Left Column - Details */}
          <div className="w-full space-y-4 sm:space-y-6 lg:w-[45%]">
            {/* Congratulations Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2 pb-4 border-b border-gray-200 sm:pb-6"
            >
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Congratulations!
              </h2>
              <p className="text-sm text-gray-700 sm:text-base">
                You&apos;ve Successfully purchased the ticket for:
              </p>
              <p className="text-sm font-medium text-gray-900 sm:text-base">
                {eventTitle}.
              </p>
            </motion.div>

            {/* Item Details */}
            <div className="pb-4 border-b border-gray-200 sm:pb-6">
              <ItemDetails
                eventTitle={eventTitle}
                quantity={quantity}
                amount={purchaseData.totalAmount}
              />
            </div>

            {/* Customer Details */}
            <div className="pb-4 border-b border-gray-200 sm:pb-6">
              <CustomerDetailsSection customerDetails={MOCK_CUSTOMER_DATA} />
            </div>

            {/* Rewards Section */}
            <RewardsSection rewards={REWARDS} />
          </div>

          {/* Right Column - Ticket Card & Actions */}
          <div className="w-full space-y-4 sm:space-y-6 lg:flex-1">
            {/* Ticket Card */}
            <TicketCard
              ref={ticketCardRef}
              eventTitle={eventTitle}
              eventImage={firstTicket.eventImage}
              quantity={quantity}
              section={sectionLetter}
              seatNumbers={sectionSeats}
              date={formatDate(firstTicket.eventDate)}
              time={firstTicket.eventTime}
            />

            {/* Action Buttons */}
            <ActionButtons
              onDownload={handleDownloadTicket}
              onShare={handleShareTicket}
              isDownloading={isDownloading}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 sm:mt-16">
        <Footer />
      </div>
    </div>
  );
}
