import Link from 'next/link';

export default function Services() {
  return (
    <main className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Services</h1>

        <div className="bg-white border-4 border-dashed border-gray-400 p-8">
          <p className="text-gray-700 mb-4">
            [SERVICES PAGE - Will contain full info about:]
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-3 mb-8">
            <li>Stop Wasting Time</li>
            <li>Services</li>
            <li>Pricing</li>
          </ul>

          <div className="text-center">
            <Link
              href="/contact"
              className="inline-block bg-gray-800 text-white px-8 py-3 border-2 border-gray-800 hover:bg-gray-700"
            >
              Start Now
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
