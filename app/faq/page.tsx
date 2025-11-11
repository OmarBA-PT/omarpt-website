import Link from 'next/link';

export default function FAQ() {
  return (
    <main className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">FAQ</h1>

        <div className="bg-white border-4 border-dashed border-gray-400 p-8 mb-8">
          <p className="text-gray-700 mb-4">
            [FAQ PAGE - Will contain a set of FAQ items]
          </p>
        </div>

        <div className="bg-gray-200 border-4 border-dashed border-gray-400 p-8 text-center">
          <p className="text-gray-700 mb-6">
            Have a question not answered here?
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gray-800 text-white px-8 py-3 border-2 border-gray-800 hover:bg-gray-700"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
