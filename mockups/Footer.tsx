import React from 'react';

export function Footer() {
  return (
    <footer className="px-6 py-12 mt-20 bg-zinc-900 text-white">
      <div className="mx-auto my-0 text-center max-w-[1200px]">
        <div className="flex gap-3 justify-center items-center mb-4">
          <div className="w-9 h-9 text-lg rounded-lg font-bold bg-indigo-500 flex items-center justify-center">
            V
          </div>
          <h4 className="m-0 text-xl font-semibold">Voyager AI</h4>
        </div>
        <p className="mb-6 text-sm text-neutral-400">
          AI-powered contextual travel planning powered by Gemini 2.0 Flash
        </p>
        <nav className="flex gap-8 justify-center text-sm max-sm:flex-col max-sm:gap-4">
          <a
            className="no-underline duration-300 ease-out text-neutral-400 transition-colors hover:text-white"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="no-underline duration-300 ease-out text-neutral-400 transition-colors hover:text-white"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="no-underline duration-300 ease-out text-neutral-400 transition-colors hover:text-white"
            href="#"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}

