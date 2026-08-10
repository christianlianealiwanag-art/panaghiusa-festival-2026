import { GiBackpack } from "react-icons/gi";

const perks: Array<{
  emoji: string;
  title: string;
  description: string;
}> = [
  {
    emoji: "🌭🍦🍿",
    title: "Free Snacks of Their Choice",
    description:
      "A taste of the wild awaits! Every explorer gets to pick a treat: hotdog on a stick, ice cream in a cone, fluffy cotton candy, or popcorn, plus refreshing juice. Available while supplies last.",
  },
  {
    emoji: "🎮",
    title: "Interactive Games",
    description:
      "Fun-filled games and challenges that keep the whole safari squad laughing, moving, and making new friends.",
  },
  {
    emoji: "🪄",
    title: "Magic Show",
    description:
      "A dazzling show packed with magic tricks, illusions, and plenty of surprises for our young audience.",
  },
  {
    emoji: "🎶",
    title: "Musical Variety Show",
    description:
      "Live music and lively performances that bring the whole Safari Adventure to life on stage.",
  },
  {
    emoji: "🎬",
    title: "Movie Shows",
    description:
      "Family-friendly movie screenings for a fun, relaxing break between all the safari excitement.",
  },
  {
    emoji: "🦁",
    title: "Safari Mascots",
    description:
      "Meet and greet our friendly safari mascots, ready for hugs, high-fives, and photo ops.",
  },
  {
    emoji: "🏆",
    title: "Special Prizes",
    description:
      "Exciting giveaways and surprise prizes await our lucky young explorers throughout the day.",
  },
];

export default function Freebies() {
  return (
    <section
      id="freebies"
      className="py-24 bg-gradient-to-b from-white via-green-50 to-yellow-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="text-green-700 font-bold uppercase tracking-[4px]">
            What to Expect
          </span>

          <h2 className="mt-4 text-5xl font-extrabold text-green-900">
            Freebies & Festival Surprises
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-700 leading-9">
            Every registered Young Explorer is in for a treat! Here&apos;s a
            sneak peek at everything waiting for them on festival day.
          </p>

        </div>

        {/* Safari Explorer Kit highlight */}

        <div className="mt-16 rounded-3xl bg-gradient-to-r from-green-700 to-green-800 p-10 text-white shadow-2xl md:p-14">
          <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-lg md:h-32 md:w-32">
              <GiBackpack className="text-6xl text-green-700 md:text-7xl" />
            </div>

            <div>
              <span className="rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold uppercase tracking-wider text-green-900">
                Every Explorer Gets One
              </span>

              <h3 className="mt-4 text-3xl font-black md:text-4xl">
                Safari Explorer Kit
              </h3>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-green-50">
                A green drawstring bag with a safari animal print, packed
                with everything a young explorer needs for the adventure:
                a Safari Adventure Passport, a bottled water, a snack
                biscuit, and assorted mini toys to keep the fun going long
                after the festival ends.
              </p>

              <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-yellow-300">
                Available while supplies last
              </p>
            </div>
          </div>
        </div>

        {/* Other perks grid */}

        <div className="grid gap-8 mt-10 md:grid-cols-2 lg:grid-cols-3">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="rounded-3xl bg-white p-8 text-center shadow-xl transition hover:-translate-y-2"
            >
              <div className="text-5xl mb-4">{perk.emoji}</div>

              <h4 className="text-xl font-bold text-green-800">
                {perk.title}
              </h4>

              <p className="mt-3 text-gray-600 leading-7">
                {perk.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
