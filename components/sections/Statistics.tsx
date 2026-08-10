export default function Statistics() {
  return (
    <section className="py-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-black text-center text-green-800">
          Festival at a Glance
        </h2>

        <div className="grid md:grid-cols-4 gap-8 mt-12">

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="text-5xl">👧</div>
            <h3 className="text-4xl font-black mt-4">800</h3>
            <p>Expected Children</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="text-5xl">🏕️</div>
            <h3 className="text-4xl font-black mt-4">4</h3>
            <p>Safari Camps</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="text-5xl">👮</div>
            <h3 className="text-4xl font-black mt-4">120+</h3>
            <p>Volunteers</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="text-5xl">🎁</div>
            <h3 className="text-4xl font-black mt-4">FREE</h3>
            <p>Explorer Kit</p>
          </div>

        </div>

      </div>
    </section>
  );
}