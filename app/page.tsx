import Link from 'next/link';

export default function Home() {
  return (
    <main>
        {/* Hero Section */}
        <section className="bg-gray-200 border-4 border-dashed border-gray-400 py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Hero Main Title for this Website
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Hero Subtitle which is a message that resonates with the target audience and encourages them to stay and explore the site.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-gray-800 text-white px-8 py-3 border-2 border-gray-800 hover:bg-gray-700"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Intro Section */}
        <section className="bg-white border-4 border-dashed border-gray-400 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-gray-50 p-6 border-2 border-gray-300">
              <p className="text-gray-700 mb-4">
                [INTRO SECTION - Will contain:]
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li>A short introduction</li>
                <li>A summary of the &quot;Stop Wasting Time&quot; content</li>
              </ul>
              <Link
                href="/services"
                className="inline-block bg-gray-800 text-white px-6 py-2 border-2 border-gray-800 hover:bg-gray-700"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Why Me Section */}
        <section className="bg-gray-100 border-4 border-dashed border-gray-400 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Train With Me?</h2>
            <p className="text-gray-500 mb-6 italic">Lorem ipsum dolor sit amet consectetur</p>
            <div className="bg-gray-50 p-6 border-2 border-gray-300 mb-6">
              <p className="text-gray-700">
                [Will contain a summary of the &apos;Why Train with Me?&apos; content]
              </p>
            </div>
            <Link
              href="/about"
              className="inline-block bg-gray-800 text-white px-6 py-2 border-2 border-gray-800 hover:bg-gray-700"
            >
              More About Me
            </Link>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-white border-4 border-dashed border-gray-400 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Services</h2>
            <p className="text-gray-500 mb-6 italic">Lorem ipsum dolor sit amet consectetur</p>
            <div className="bg-gray-50 p-6 border-2 border-gray-300 mb-6">
              <p className="text-gray-700">
                [Will contain a summary of the &apos;Services&apos; content]
              </p>
            </div>
            <Link
              href="/services"
              className="inline-block bg-gray-800 text-white px-6 py-2 border-2 border-gray-800 hover:bg-gray-700"
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-gray-100 border-4 border-dashed border-gray-400 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">About Me</h2>
            <p className="text-gray-500 mb-6 italic">Lorem ipsum dolor sit amet consectetur</p>
            <div className="bg-gray-50 p-6 border-2 border-gray-300 mb-6">
              <p className="text-gray-700">
                [Will contain a summary of the &apos;About Me&apos; content]
              </p>
            </div>
            <Link
              href="/about"
              className="inline-block bg-gray-800 text-white px-6 py-2 border-2 border-gray-800 hover:bg-gray-700"
            >
              More About Me
            </Link>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gray-200 border-4 border-dashed border-gray-400 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link
              href="/contact"
              className="inline-block bg-gray-800 text-white px-8 py-3 border-2 border-gray-800 hover:bg-gray-700 text-lg"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>
  );
}
