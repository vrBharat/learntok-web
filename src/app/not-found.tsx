import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfaf6] text-black font-sans px-4 text-center">
      <h1 className="text-6xl font-bold tracking-tighter mb-4">404</h1>
      <p className="text-lg font-mono text-gray-700 mb-8 max-w-md">
        you've wandered somewhere nobody has documented yet.
      </p>
      
      <div className="font-mono text-xs text-gray-400 mb-8 whitespace-pre">
        {`
   .---.
  /     \\
 ( () () )
  \\  _  /
   \`---'
        `}
      </div>

      <Link href="/">
        <button className="py-2 px-6 bg-transparent border-2 border-black font-bold hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none">
          GO HOME
        </button>
      </Link>
    </div>
  );
}
