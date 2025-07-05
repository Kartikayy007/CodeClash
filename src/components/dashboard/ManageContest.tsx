import React from "react";
import { Trophy, Clock, CheckCircle, ChevronUp, ChevronDown } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";

interface ContestItem {
  title: string;
  description: string;
  id: number;
  icon: React.ReactNode;
  status: "ONGOING" | "UPCOMING" | "ENDED";
}

interface ManageContestProps {
  className?: string;
}

const ManageContest = ({ className = "" }: ManageContestProps) => {
  // Example contest items with status
  const contestItems: ContestItem[] = [
    {
      title: "Weekly Coding Challenge",
      description: "Compete in the ongoing weekly challenge!",
      id: 1,
      icon: <Trophy className="h-[28px] w-[28px] text-yellow-300 drop-shadow-lg" />,
      status: "ONGOING",
    },
    {
      title: "Algorithm Masterclass",
      description: "Starts soon! Register now to participate.",
      id: 2,
      icon: <Clock className="h-[28px] w-[28px] text-cyan-300" />,
      status: "UPCOMING",
    },
    {
      title: "Past Contest",
      description: "Browse through your contest history and achievements.",
      id: 3,
      icon: <CheckCircle className="h-[28px] w-[28px] text-gray-400" />,
      status: "ENDED",
    },
  ];

  // Sort: ONGOING first, then soonest UPCOMING, then others
  const sortedItems = [
    ...contestItems.filter((c) => c.status === "ONGOING"),
    ...contestItems.filter((c) => c.status === "UPCOMING" && !contestItems.some((cc) => cc.status === "ONGOING")),
    ...contestItems.filter((c) => c.status === "ENDED"),
  ];

  // Custom CarouselPrevious and CarouselNext with ChevronUp/Down
  const CustomPrev = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof CarouselPrevious>>((props, ref) => (
    <CarouselPrevious
      {...props}
      ref={ref}
      className="absolute left-1/2 -translate-x-1/2 top-0 z-10 bg-[#23263a] rounded-full p-2 border border-cyan-500/30 hover:bg-cyan-500/10 transition"
    >
      <ChevronUp className="h-6 w-6 text-cyan-300" />
    </CarouselPrevious>
  ));
  CustomPrev.displayName = "CustomPrev";

  const CustomNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof CarouselNext>>((props, ref) => (
    <CarouselNext
      {...props}
      ref={ref}
      className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10 bg-[#23263a] rounded-full p-2 border border-cyan-500/30 hover:bg-cyan-500/10 transition"
    >
      <ChevronDown className="h-6 w-6 text-cyan-300" />
    </CarouselNext>
  ));
  CustomNext.displayName = "CustomNext";

  return (
    <div className={`w-full bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-cyan-500/20 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">Contest Status</h2>
      </div>
      <div className="relative w-full max-w-md mx-auto">
        <Carousel orientation="vertical" className="w-full">
          <CustomPrev />
          <CarouselContent className="h-[140px]">
            {sortedItems.map((item, idx) => (
              <CarouselItem key={item.id} className="flex items-center justify-center basis-full shrink-0 grow-0">
                <div
                  className={
                    "w-full h-[120px] rounded-2xl p-4 flex items-center gap-6 shadow-2xl transition-all duration-300 " +
                    (idx === 0
                      ? "bg-gradient-to-br from-yellow-400/40 via-cyan-400/40 to-blue-600/60 border-2 border-cyan-300/80 ring-4 ring-cyan-300/30 scale-105"
                      : "bg-[#23263a] border border-cyan-500/10 opacity-70")
                  }
                >
                  <div className="flex-shrink-0 flex flex-col items-center justify-center">
                    {item.icon}
                    {(item.status === "ONGOING" || item.status === "UPCOMING") && (
                      <span className={
                        "mt-2 px-2 py-0.5 rounded-full text-xs font-bold " +
                        (item.status === "ONGOING"
                          ? "bg-green-500/20 text-green-300 border border-green-400/40"
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40")
                      }>
                        {item.status}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className={
                      "font-extrabold text-xl mb-1 " +
                      (idx === 0 ? "text-white drop-shadow-lg" : "text-cyan-200/80")
                    }>
                      {item.title}
                    </div>
                    <div className={
                      "text-base " +
                      (idx === 0 ? "text-cyan-100/90 font-semibold" : "text-cyan-200/60")
                    }>
                      {item.description}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CustomNext />
        </Carousel>
      </div>
    </div>
  );
};

export default ManageContest;
