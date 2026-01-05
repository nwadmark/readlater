import Link from "next/link";
import { listLinks } from "@/app/actions";
import { BookOpen } from "lucide-react";
import SignInButton from "@/components/auth/sign-in-button";
import LibraryContent from "@/components/library-content";

// Force dynamic rendering - do not cache across users
export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const links = await listLinks();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <header className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-[2rem] md:text-[2.5rem] font-extralight tracking-tight text-foreground">
              Library
            </h1>
            <div className="flex items-center gap-6">
              <nav className="flex gap-8">
                <Link href="/" className="text-[0.875rem] font-medium text-foreground/40 hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/library" className="text-[0.875rem] font-medium text-primary transition-colors">
                  Library
                </Link>
              </nav>
              <SignInButton />
            </div>
          </div>
          <p className="text-[0.875rem] text-[#6b7280] font-light">
            Everything you've saved.
          </p>
        </header>

        {links.length === 0 ? (
          <div className="max-w-[400px] mx-auto mt-20 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-[#D4D4D4] stroke-[1.5]" />
            <h3 className="mt-5 text-[1.125rem] font-medium text-[#444444]">
              Your library is empty
            </h3>
            <p className="mt-2 max-w-[320px] mx-auto text-[0.9375rem] leading-relaxed text-[#6b7280]">
              Links you save will appear here. You can organize them by status and revisit them anytime.
            </p>
            <Link href="/">
              <button className="mt-6 px-6 py-3 bg-white border border-[#E0E0E0] rounded-lg text-[0.875rem] font-medium text-[#333333] transition-all duration-150 hover:bg-[#FAFAFA] hover:border-[#CCCCCC]">
                Save your first link
              </button>
            </Link>
          </div>
        ) : (
          <LibraryContent links={links} />
        )}
      </div>
    </div>
  );
}

