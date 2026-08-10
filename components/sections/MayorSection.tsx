import Image from "next/image";

export default function MayorSection() {
  return (
    <section
      id="mayor"
      className="py-24 bg-gradient-to-b from-yellow-50 to-green-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Mayor Image */}

          <div className="flex justify-center">

            <Image
              src="/images/mayor/Mayor-safari.jpg"
              alt="Hon. Georgia D. Gokiangkee"
              width={500}
              height={650}
              className="rounded-3xl shadow-2xl w-full max-w-md object-cover"
              priority
            />

          </div>

          {/* Mayor Message */}

          <div>

            <span className="uppercase tracking-[4px] text-green-700 font-bold">
              Meet Our Mayor
            </span>

            <h2 className="text-5xl font-black text-green-900 mt-4">
              Hon. Georgia D. Gokiangkee
            </h2>

            <p className="mt-8 text-xl text-gray-700 leading-9">
              Welcome to the Panaghiusa Festival 2026 Children's Safari Festival!
              Join us for a fun-filled Safari Adventure with exciting camps,
              amazing performances, games, prizes, and unforgettable memories
              for every child.
            </p>

            <div className="mt-10 bg-yellow-100 border-l-8 border-yellow-500 p-6 rounded-2xl">

              <h3 className="text-2xl font-bold text-green-800">
                🦁 Mayor's Stamp Challenge
              </h3>

              <p className="mt-3 text-lg text-gray-700">
                If you see the Mayor during the event,
                bring your <strong>Safari Passport</strong> and ask for the
                <strong> Official Mayor's Safari Stamp!</strong>
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}