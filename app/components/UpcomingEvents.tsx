"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const events = [
  {
    id: 1,
    date: { day: "14", month: "JAN" },
    title: "Wonder Girls 2010 Wonder Girls World Tour San Francisco",
    description:
      "We'll get you directly seated and inside for you to enjoy the show.",
    image: "/Events/1.png",
  },
  {
    id: 2,
    date: { day: "20", month: "FEB" },
    title: "JYJ 2011 JYJ Worldwide Concert Barcelona",
    description: "Directly seated and inside for you to enjoy the show.",
    image: "/Events/2.png",
  },
  {
    id: 3,
    date: { day: "18", month: "MAR" },
    title: "2011 Super Junior SM Town Live New York City",
    description: "Directly seated and inside for you to enjoy the show.",
    image: "/Events/3.png",
  },
  {
    id: 4,
    date: { day: "14", month: "JAN" },
    title: "Wonder Girls 2010 Wonder Girls World Tour San Francisco",
    description:
      "We'll get you directly seated and inside for you to enjoy the show.",
    image: "/Events/4.png",
  },
  {
    id: 5,
    date: { day: "20", month: "FEB" },
    title: "JYJ 2011 JYJ Worldwide Concert Barcelona",
    description: "Directly seated and inside for you to enjoy the show.",
    image: "/Events/5.png",
  },
  {
    id: 6,
    date: { day: "18", month: "MAR" },
    title: "2011 Super Junior SM Town Live New York City",
    description: "Directly seated and inside for you to enjoy the show.",
    image: "/Events/6.png",
  },
];

const filters = [
  { label: "Weekdays", icon: "▼" },
  { label: "Event Type", icon: "▼" },
  { label: "Any Category", icon: "▼" },
];

export default function UpcomingEvents() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1180px]">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center lg:mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-900 lg:text-4xl"
          >
            Upcoming Events
          </motion.h2>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-3"
          >
            {filters.map((filter, idx) => (
              <button
                key={idx}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-purple-50"
                style={{
                  borderColor: "rgba(85, 34, 204, 0)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(85, 34, 204, 0.3)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(229, 231, 235, 1)")
                }
              >
                {filter.label}
                <span className="text-xs text-gray-400">{filter.icon}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {events.map((event, idx) => (
            <Link
              key={event.id}
              href={`/event/taylor-swift-eras-tour`}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-2xl"
              >
                {/* Image */}
                <div
                  className="relative h-48 w-full overflow-hidden sm:h-56"
                  style={{
                    background:
                      "linear-gradient(to bottom right, rgba(85, 34, 204, 0.4), rgba(237, 70, 144, 0.4))",
                  }}
                >
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Date Badge */}
                  <div className="absolute left-4 top-4 flex h-16 w-14 flex-col items-center justify-center rounded-lg bg-white shadow-md">
                    <span className="text-2xl font-bold text-gray-900">
                      {event.date.day}
                    </span>
                    <span className="text-xs font-medium uppercase text-gray-500">
                      {event.date.month}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              borderColor: "#5522CC",
              color: "#5522CC",
            }}
            className="rounded-full border-2 bg-transparent px-10 py-3 text-sm font-medium transition-all"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(85, 34, 204, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Load More
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
