import LabelButton from "@/components/ui/LabelButton";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold flex flex-col gap-12 justify-center items-center h-screen bg-[#10141D]">  
        <h1 className='text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-white text-left mt-2'>
          Welcome to CodeClash!
        </h1>
        <LabelButton variant="outlined" className="w-full sm:w-auto">
          <Link href={"/get-started"}>
            Get Started
          </Link>  
        </LabelButton>
      </h1>
    </div>
  );
}
