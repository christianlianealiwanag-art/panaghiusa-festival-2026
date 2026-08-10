import { FaFacebook } from "react-icons/fa6";

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-20 bg-green-800 text-white"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-4xl font-black">
          Need Assistance?
        </h2>

        <p className="mt-6 text-xl">
          Municipal Budget Office 
          (086) 816 3259/claverbudgetoffice@gmail.com
        </p>

        <p className="mt-2">
          Municipality of Claver
        </p>

        <p className="mt-2">
          Surigao del Norte
        </p>

        <a
          href="https://www.facebook.com/profile.php?id=61592497815154"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-yellow-300 hover:text-yellow-200 transition"
        >
          <FaFacebook className="text-2xl" />
          Claver Children's Festival
        </a>

        <div>
          <button className="mt-10 bg-yellow-400 text-green-900 px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition">
            Contact Us
          </button>
        </div>

      </div>
    </section>
  );
}