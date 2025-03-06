"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  return (
    <nav className="bg-[#181818] text-white py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white pl-6">
          Ikshana
        </Link>

        <ul className="flex gap-6 items-center">
          <li>
            <Link
              href="/Summary"
              className={`px-4 py-2 rounded ${pathname === "/Summary" ? "bg-gray-300 text-black font-bold" : "hover:bg-gray-300 hover:text-black"}`}
            >
              Summary
            </Link>
          </li>
          <li>
            <Link
              href="/Sleep"
              className={`px-4 py-2 rounded ${pathname === "/Sleep" ? "bg-gray-300 text-black font-bold" : "hover:bg-gray-300 hover:text-black"}`}
            >
              Sleep
            </Link>
          </li>
          <li>
            <Link
              href="/Medications"
              className={`px-4 py-2 rounded ${pathname === "/Medications" ? "bg-gray-300 text-black font-bold" : "hover:bg-gray-300 hover:text-black"}`}
            >
              Medications
            </Link>
          </li>
          <li>
            <Link
              href="/Child-data"
              className={`px-4 py-2 rounded ${pathname === "/Child-data" ? "bg-gray-300 text-black font-bold" : "hover:bg-gray-300 hover:text-black"}`}
            >
              Child Data
            </Link>
          </li>

          {status === "authenticated" ? (
            <>
              <li className="text-gray-300 px-4">Welcome, {session.user?.name}!</li>
              <li>
                <button
                  onClick={() => signOut()}
                  className="bg-white text-black px-6 py-2 text-lg font-bold rounded-md hover:bg-gray-300 transition"
                >
                  LOGOUT
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/Login">
                <button className="bg-white text-black px-6 py-2 text-lg font-bold rounded-md hover:bg-gray-300 transition">
                  SIGN-IN
                </button>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
