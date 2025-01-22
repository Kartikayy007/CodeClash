'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LabelButton from '@/components/ui/LabelButton';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import PixelCard from '@/components/ui/PixelCard';
import Hyperspeed, { hyperspeedPresets } from '@/components/ui/Hyperspeed';

const Page = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [testimonialPage, setTestimonialPage] = useState(0);

  const features = [
    {
      title: "Coding Challenges",
      description: "Solve challenges tailored for all skill levels, from beginner to advanced.",
      image: "/coding-challenges.svg",
      className: "w-full md:w-1/2 h-[600px]"
    },
    {
      title: "Tutorials",
      description: "Master concepts with interactive tutorials and expert-guided paths.",
      image: "/tutorials.svg",
      className: "w-full md:w-1/2 h-[290px]"
    },
    {
      title: "Community",
      description: "Join a thriving community of passionate programmers.",
      image: "/community.svg",
      className: "w-full md:w-1/2 h-[290px]"
    },
    {
      title: "Leaderboards",
      description: "Climb the ranks as you compete with coders worldwide.",
      image: "/leaderboards.svg",
      className: "w-full md:w-1/2 h-[290px]"
    }
  ];

  const testimonials = [
    {
      text: "Custom challenges with friends are so much fun! It's the best way to learn and compete in a friendly way.",
      name: "Emily T.",
      role: "Coding Enthusiast",
      image: "/emily.svg"
    },
    {
      text: "Code Clash transformed my coding practice. The challenges are engaging and push my limits!",
      name: "David M.",
      role: "Junior Developer",
      image: "/david.svg"
    },
    {
      text: "The instant feedback after each battle helped me understand my mistakes and grow as a programmer.",
      name: "Nina G.",
      role: "Machine Learning Intern",
      image: "/nina.svg"
    },

  ];

  const nextTestimonials = () => {
    setTestimonialPage((prev) => (prev + 1) % 2);
  };

  const previousTestimonials = () => {
    setTestimonialPage((prev) => (prev - 1 + 2) % 2);
  };

  return (
    <div className='bg-[#10141D] min-h-screen'>
      <nav className='bg-[#292C33] sticky top-0 z-50 w-full max-w-[1440px] h-16 mx-auto px-4 sm:px-6 md:px-20 py-2.5 flex items-center justify-between'>
        <Image
          src='/logo.svg'
          alt="logo"
          width={200}
          height={40}
          className="p-4"
          priority
        />
        <button
          className="md:hidden text-white hover:text-gray-300 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <ul className="hidden md:flex items-center gap-8 font-[600]">
          <li>
            <button className="text-white hover:text-gray-300 transition-colors">
              Home
            </button>
          </li>
          <li>
            <button className="text-white hover:text-gray-300 transition-colors">
              Features
            </button>
          </li>
          <li>
            <button className="text-white hover:text-gray-300 transition-colors">
              About
            </button>
          </li>
          <li>
            <button className="text-white hover:text-gray-300 transition-colors">
              Contact
            </button>
          </li>
          <li>
            <LabelButton
              variant="filled"
              customSize={{ width: '56px', height: '20px' }}
              className="text-sm whitespace-nowrap"
              onClick={() => router.push('/login')}
            >
              Join Us
            </LabelButton>
          </li>
        </ul>
      </nav>

      <section className='flex flex-col md:flex-row justify-center items-center w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-20 py-20 gap-8 mt-16'>
        <div className='flex-1 z-10'>
          <p className='text-[#DB84D9] text-lg mb-4  '>
            With CodeClash
          </p>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6'>
            Conquer Every Challenge
          </h1>
          <p className='text-gray-300 text-lg md:text-xl mb-8 max-w-xl'>
            The ultimate platform for coding enthusiasts to learn, compete, and grow.
          </p>
          <LabelButton
            variant="filled"
            customSize={{
              width: '200px',
              height: '48px'
            }}
            className="w-full md:w-[200px]"
            onClick={() => router.push('/get-started')}
          >
            Get Started
          </LabelButton>
        </div>

        {/* <div className='flex-1 relative z-10'>
          <div className='w-full max-w-xl'>
            <Image
              src="/illustration1.svg"
              alt="Developer working"
              width={600}
              height={500}
              className="w-full h-auto"
              priority
            />
          </div>
        </div> */}



        <Hyperspeed
          effectOptions={{
            ...hyperspeedPresets.cyberpunk
          }}
        />


      </section>

      <section className='flex flex-col items-center w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-20 py-20'>
        <h2 className='text-white font-[600] text-3xl mb-16'>
          Why Choose Us?
        </h2>

        <div className='w-full flex flex-wrap gap-8'>
          <div className='w-full md:w-[calc(50%-16px)] flex flex-col gap-8'>
            <PixelCard
              variant="blue"
              className='h-[290px] w-full' gap={10} speed={50} noFocus={true} colors={undefined} >
              <div className='z-10 p-8 absolute'>
                <h3 className='text-white text-2xl font-semibold mb-4'>
                  {features[0].title}
                </h3>
                <p className='text-gray-300 mb-8'>
                  {features[0].description}
                </p>
                <div className='w-full h-96 relative'>
                  <Image
                    src={features[0].image}
                    alt={features[0].title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </PixelCard>
          </div>

          <div className='w-full md:w-[calc(50%-16px)] flex flex-col gap-8'>
            <PixelCard
              variant="blue"
              className='h-[290px] w-full' gap={10} speed={50} noFocus={true} colors={undefined} >
              <div className='z-10 p-8 absolute'>
                <h3 className='text-white text-2xl font-semibold mb-4'>
                  {features[1].title}
                </h3>
                <p className='text-gray-300 mb-8'>
                  {features[1].description}
                </p>
                <div className='w-full h-48 relative'>
                  <Image
                    src={features[1].image}
                    alt={features[1].title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </PixelCard>

            <PixelCard
              variant="blue"
              className='h-[290px] w-full' gap={10} speed={50} noFocus={true} colors={undefined} >
              <div className='z-10 p-8 absolute'>
                <h3 className='text-white text-2xl font-semibold mb-4'>
                  {features[2].title}
                </h3>
                <p className='text-gray-300 mb-8'>
                  {features[2].description}
                </p>
                <div className='w-full h-48 relative'>
                  <Image
                    src={features[2].image}
                    alt={features[2].title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </PixelCard>
          </div>
        </div>
      </section>

      <section className='flex flex-col items-center w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-20 py-20'>
        <h2 className='text-white font-[600] text-3xl mb-16 text-center'>
          What Coders Say About Code Clash
        </h2>
        <div className='relative w-full'>
          <button
            onClick={previousTestimonials}
            className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white hover:text-gray-300 transition-colors z-10'
            aria-label="Previous testimonials"
            disabled={testimonialPage === 0}
          >
            <ChevronLeft size={32} className={testimonialPage === 0 ? 'opacity-50' : 'opacity-100'} />
          </button>

          <div className='overflow-hidden'>
            <div
              className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full transition-transform duration-300'
              style={{
                transform: `translateX(-${testimonialPage * 100}%)`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className='bg-[#1A1D24] rounded-lg p-8 hover:bg-[#212631] transition-colors flex flex-col items-center text-center relative'>
                  <Image
                    height={32}
                    width={152}
                    src='/quote.svg'
                    alt='Quote icon'
                    className='absolute top-0 left-0'
                  />
                  <p className='text-gray-300 z-10 text-lg mb-6 font-[600]'>
                    {testimonial.text}
                  </p>
                  <div className='w-20 h-20 relative mb-6 rounded-full overflow-hidden'>
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className='text-white font-semibold'>
                    {testimonial.name}
                  </h3>
                  <p className='text-gray-400'>
                    {testimonial.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextTestimonials}
            className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white hover:text-gray-300 transition-colors z-10'
            aria-label="Next testimonials"
            disabled={testimonialPage === 1}
          >
            <ChevronRight size={32} className={testimonialPage === 1 ? 'opacity-50' : 'opacity-100'} />
          </button>

          <div className='flex justify-center gap-2 mt-8'>
            {[0, 1].map((index) => (
              <button
                key={index}
                onClick={() => setTestimonialPage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${index === testimonialPage ? 'bg-[#DB84D9]' : 'bg-gray-600'
                  }`}
                aria-label={`Go to testimonial page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className='flex flex-col items-center w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-20 py-10 md:py-20'>
        <div className='w-full bg-gradient-to-r from-[#1A1D24] to-[#2A1D3C] rounded-lg overflow-hidden'>
          <div className='flex flex-col md:flex-row items-center justify-between p-6 md:p-0'>

            <div className='flex-1 w-full md:w-auto mb-8 md:mb-</div>0'>
              <Image
                height={300}
                width={400}
                src='/coding1.svg'
                alt={'Coding illustration'}
                className='w-full max-w-[300px] md:max-w-[400px] mx-auto'
              />
            </div>

            <div className='flex flex-col justify-center items-center flex-1 z-10 text-center px-4 mb-8 md:mb-0'>
              <h2 className='text-white font-[600] text-2xl md:text-3xl lg:text-4xl mb-4'>
                Ready to Code Clash?
              </h2>
              <p className='text-gray-300 text-base md:text-lg mb-6 md:mb-8 max-w-[300px]'>
                Unleash Your Inner Coder! Join the Battle Today
              </p>
              <LabelButton
                variant="filled"
                customSize={{
                  width: '180px',
                  height: '44px'
                }}
                className="w-[180px] md:w-[200px]"
                onClick={() => router.push('/join-now')}
              >
                Join Now
              </LabelButton>
            </div>

            <div className='flex-1 relative md:left-32 w-full md:w-auto'>
              <div className='relative w-full max-w-lg'>
                <Image
                  src="/coding2.svg"
                  alt="Ready to code"
                  width={250}
                  height={100}
                  className="w-full max-w-[200px] md:max-w-[250px] mx-auto md:mx-0 h-auto relative z-10"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {isMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-[#FFFFFF1A] p-4">
          <ul className="flex flex-col gap-4">
            <li>
              <button className="text-white hover:text-gray-300 transition-colors w-full text-left px-4">
                Home
              </button>
            </li>
            <li>
              <button className="text-white hover:text-gray-300 transition-colors w-full text-left px-4">
                Features
              </button>
            </li>
            <li>
              <button className="text-white hover:text-gray-300 transition-colors w-full text-left px-4">
                About
              </button>
            </li>
            <li>
              <button className="text-white hover:text-gray-300 transition-colors w-full text-left px-4">
                Contact
              </button>
            </li>
            <li className="px-4">
              <LabelButton
                variant="filled"
                customSize={{ width: '100%', height: '32px' }}
                onClick={() => router.push('/login')}
              >
                Join Us
              </LabelButton>
            </li>
          </ul>
        </div>
      )}

      <footer className="bg-[#10141D] text-white py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Code Clash</h2>
              <div className="flex space-x-4">
                <Link
                  href="https://twitter.com"
                  className="bg-[#7C3AED] p-2 rounded-lg hover:opacity-80 transition-opacity"
                >
                  <Twitter size={24} className="text-white" />
                </Link>
                <Link
                  href="https://instagram.com"
                  className="bg-[#7C3AED] p-2 rounded-lg hover:opacity-80 transition-opacity"
                >
                  <Instagram size={24} className="text-white" />
                </Link>
                <Link
                  href="https://linkedin.com"
                  className="bg-[#7C3AED] p-2 rounded-lg hover:opacity-80 transition-opacity"
                >
                  <Linkedin size={24} className="text-white" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-6">Platform</h3>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/guidelines" className="text-gray-400 hover:text-white transition-colors">Guidelines</Link></li>
                <li><Link href="/blogs" className="text-gray-400 hover:text-white transition-colors">Blogs</Link></li>
                <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-4">
                <li><Link href="/faqs" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-6">Links</h3>
              <ul className="space-y-4">
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center">
            <p className="text-gray-400 text-sm">© 2025 Code Clash. All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;