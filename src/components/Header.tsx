import Link from "next/link";

export function Header() {
    return (
      <header className="w-full bg-brand-header">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
          <h1 className="text-3xl text-center font-bold tracking-tight text-app-textOnDark">
            <Link href="/">Forms &amp; Reports</Link>
          </h1>
        </div>
      </header>
    );
  }  