'use client'

import Image from "next/image";
import { usePathname } from "next/navigation";


type RouteImages = {
  [key: string]: { src: string; alt: string; width: number ; caption: string };
}

const routeImages: RouteImages = {
  '/login': {
    src: '/login.svg',
    alt: 'login',
    width: 400,
    caption: 'Continue your journey of coding excellence and unlock new challenges with every round!',
  },
  '/register': {
    src: '/register.svg',
    alt: 'register',
    width: 330,
    caption: 'Test your skills, challenge the best, and conquer new heights in the world of coding.',
  },
  '/forgot-password': {
    src: '/forgot-password.svg',
    alt: 'forgot-password',
    width: 400,
    caption: 'Forgot your password? Take a moment to reset and get back to conquering the coding arena!',
  },
  '/reset-password': {
    src: '/reset-password.svg',
    alt: 'reset-password',
    width: 250,
    caption: 'Continue your journey of coding excellence and unlock new challenges with every round!',
  },
  '/get-started': {
    src: '/get-started.svg',
    alt: 'get-started',
    width: 350,
    caption: 'Embark on the thrilling journey of competitive coding with Code Clash and rise to the challenge!',
  }
}

export function AuthHeroImage() {
  const pathname = usePathname();
  const Info = routeImages[pathname] || routeImages['/login'];

  return (
    <div className="bg-[#282D37] w-1/2 lg:flex flex-col hidden">
      <Image
        src='/logo.svg'
        alt="logo"
        width={200}
        height={40}
        className="relative top-8 left-12"
        priority
      />
      <div className="flex-1 flex flex-col items-center justify-center gap-16">
        <h1 className="xl:text-3xl text-xl px-12 text-center font-[600] text-white">
          {Info.caption}
        </h1>
        <Image
          src={Info.src}
          alt={Info.alt}
          width={Info.width}
          height={100}
          priority
        />
      </div>
    </div>
  );
}