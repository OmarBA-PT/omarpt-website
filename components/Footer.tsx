import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white border-t-4 border-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li>Email: [email address]</li>
              <li>Phone: [phone number]</li>
              <li>Address: [address]</li>
            </ul>
            <Link
              href="/contact"
              className="inline-block bg-white text-gray-800 px-4 py-2 border-2 border-white hover:bg-gray-100"
            >
              Get in Touch
            </Link>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gray-600 border-2 border-gray-500 flex items-center justify-center">
                FB
              </div>
              <div className="w-10 h-10 bg-gray-600 border-2 border-gray-500 flex items-center justify-center">
                YT
              </div>
              <div className="w-10 h-10 bg-gray-600 border-2 border-gray-500 flex items-center justify-center">
                IG
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2025 Omar Personal Training</p>
          <div className="flex gap-6 text-sm">
            <Link href="/terms" className="text-gray-400 hover:text-white">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
