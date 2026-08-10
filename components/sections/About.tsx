export default function About() {
  return (
    <section
      id="about"
      className="bg-gradient-to-b from-green-50 to-yellow-50 py-24"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="text-green-700 font-bold uppercase tracking-[4px]">
            Welcome to the Adventure
          </span>

          <h2 className="mt-4 text-5xl font-extrabold text-green-900">
            Panaghiusa Festival 2026
          </h2>

          <h3 className="mt-2 text-3xl font-bold text-amber-700">
            Children's Festival
          </h3>

          <p className="mt-8 max-w-4xl mx-auto text-xl text-gray-700 leading-9">
            Prepare for an unforgettable Safari Adventure where learning,
            creativity, friendship, and excitement come together.
            Children will explore interactive camps, meet safari friends,
            collect passport stamps, enjoy exciting performances,
            receive delightful treats, and create memories that will last a lifetime.
          </p>

        </div>

        <div className="grid md:grid-cols-4 gap-8 mt-20">

          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">

            <div className="text-6xl mb-4">
              🦒
            </div>

            <h4 className="text-2xl font-bold text-green-800">
              4 Safari Camps
            </h4>

            <p className="mt-4 text-gray-600">
              Interactive activities that encourage teamwork,
              imagination and adventure.
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">

            <div className="text-6xl mb-4">
              🎭
            </div>

            <h4 className="text-2xl font-bold text-green-800">
              Live Shows
            </h4>

            <p className="mt-4 text-gray-600">
              Musical performances,
              mascots,
              bubbles,
              magic,
              and exciting entertainment.
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">

            <div className="text-6xl mb-4">
              📖
            </div>

            <h4 className="text-2xl font-bold text-green-800">
              Safari Passport
            </h4>

            <p className="mt-4 text-gray-600">
              Complete every camp,
              collect stamps,
              and become an Official Safari Explorer.
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">

            <div className="text-6xl mb-4">
              🎁
            </div>

            <h4 className="text-2xl font-bold text-green-800">
              Surprises
            </h4>

            <p className="mt-4 text-gray-600">
              Snacks,
              giveaways,
              games,
              prizes,
              and unforgettable memories.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}