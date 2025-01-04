import Link from 'next/link'


export const BackButton = ({ href }: { href: string }) => {
  return (
    <Link 
      href={href}
      className="inline-flex items-center gap-2 font-[600] text-[#C879EB] hover:opacity-80 transition-opacity ml-2"
      aria-label="Go back to previous page"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M15.5 19L8.5 12L15.5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Back</span>
    </Link>
  )
}