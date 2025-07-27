"use client"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/Carousel"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ContestItem {
  title: string
  description: string
  id: number
  status: "ONGOING" | "UPCOMING" | "ENDED"
  date: string
  time: string
}

interface ManageContestProps {
  className?: string
}

const ManageContest = ({ className = "" }: ManageContestProps) => {
  const router = useRouter()
  const contestItems: ContestItem[] = [
    // Past contests
   
    // Current/Next upcoming (center)
    {
      title: "Sunday Clash",
      description: "Join our Sunday Clash this Sunday!",
      id: 3,
      status: "ENDED",
      date: "July 27 2025",
      time: "5:30 PM - 7:30 PM",
    },


    {
      title: "Upcoming Contests",
      description: "",
      id: 1,
      status: "UPCOMING",
      date: "Keep an eye for updates!",
      time: "Coming Soon",
    }

  ]

  const mainUpcomingIndex = contestItems.findIndex((item) => item.status === "UPCOMING" && item.id === 3)


  return (
    <div
      className={`w-full  bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-cyan-500/20">
        <h2 className="text-xl font-bold text-white">Weekly Clash</h2>
      </div>

      <div className="relative">
        <Carousel
          orientation="vertical"
          className="w-full"
          opts={{
            align: "center",
            loop: false,
            startIndex: mainUpcomingIndex,
          }}
        >
          <CarouselPrevious className="absolute left-1/2 -translate-x-1/2 -top-4 z-10 bg-[#23263a] hover:bg-[#2a2f42] rounded-full p-2 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-200">
            <ChevronUp className="h-4 w-4 text-cyan-300" />
          </CarouselPrevious>

          <CarouselContent className="h-[280px] sm:h-[300px] py-4">
            {contestItems.map((item, idx) => {
              const isCenter = idx === mainUpcomingIndex
              const isPast = item.status === "ENDED"

              return (
                <CarouselItem key={item.id} className="flex items-center justify-center basis-full">
                  <div
                    className={`w-full rounded-3xl  transition-all duration-500 ${
                      isCenter
                        ? "bg-gradient-to-br from-cyan-500/20 via-blue-500/20 p-4 to-purple-600/30 border-2 border-cyan-400/60 shadow-2xl shadow-cyan-500/20 "
                        : isPast
                          ? "bg-gradient-to-br p-6 from-[#1f2229] to-[#23263a] border border-gray-600/20 opacity-60"
                          : "bg-gradient-to-br p-6 from-[#23263a] to-[#2a2f42] border border-cyan-500/20 opacity-80"
                    }`}
                  >
                    {/* Title */}
                    <h3
                      className={`font-bold mb-3 leading-tight ${
                        isCenter
                          ? "text-white text-xl sm:text-2xl"
                          : isPast
                            ? "text-gray-300 text-lg"
                            : "text-cyan-100 text-lg sm:text-xl"
                      }`}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`mb-4 leading-relaxed ${
                        isCenter
                          ? "text-cyan-100/90 text-sm sm:text-base"
                          : isPast
                            ? "text-gray-400 text-sm"
                            : "text-cyan-200/70 text-sm"
                      }`}
                    >
                      {item.description}
                    </p>

                    {/* Date and Time */}
                    <div className="mb-6 space-y-1">
                      <div
                        className={`text-sm font-medium ${
                          isCenter ? "text-cyan-200" : isPast ? "text-gray-400" : "text-cyan-300/80"
                        }`}
                      >
                        {item.date}
                      </div>
                      <div
                        className={`text-sm ${
                          isCenter ? "text-yellow-300 font-semibold" : isPast ? "text-gray-500" : "text-cyan-400/70"
                        }`}
                      >
                        {item.time}
                      </div>
                    </div>

                    {/* Join Button */}
                    {!isPast && (
                      <Button
                        onClick={() => {
                          if (isCenter) {
                            router.push("https://codeclash.tech/contest/join/0e24132c-c850-4b62-a893-c20309a719fd")
                          }
                        }}
                        disabled={!isCenter}
                        className={`w-full rounded-2xl font-semibold transition-all duration-200 ${
                          isCenter
                            ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white hover:opacity-90"
                            : "bg-gray-600/80 text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        Join Contest
                      </Button>
                    )}

                    {isPast && (
                      <div className="w-full text-center py-3 rounded-2xl bg-gray-600/20 text-gray-400 text-sm font-medium">
                        Contest Ended
                      </div>
                    )}
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>

          <CarouselNext className="absolute left-1/2 -translate-x-1/2 -bottom-4 z-10 bg-[#23263a] hover:bg-[#2a2f42] rounded-full p-2 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-200">
            <ChevronDown className="h-4 w-4 text-cyan-300" />
          </CarouselNext>
        </Carousel>
      </div>
    </div>
  )
}

export default ManageContest
