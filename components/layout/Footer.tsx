import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-green-950 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <div className="flex justify-center mb-4">
          <Image
            src="/images/logos/claver-logo.png"
            alt="Claver Children's Festival Logo"
            width={80}
            height={80}
          />
        </div>

        <p className="font-semibold">
          Panaghiusa Festival 2026 • Children's Safari Festival
        </p>

        <p className="mt-2 text-sm text-gray-300">
          Municipality of Claver • Surigao del Norte
        </p>

        <p className="mt-4 text-xs text-gray-500">
          © 2026 Municipality of Claver. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
}