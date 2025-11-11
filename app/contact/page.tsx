export default function Contact() {
  return (
    <main className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Contact</h1>

        <div className="space-y-8">
          {/* Contact Details */}
          <div className="bg-white border-4 border-dashed border-gray-400 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Details</h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Email:</strong> [email address]
              </li>
              <li>
                <strong>Phone:</strong> [phone number]
              </li>
              <li>
                <strong>Address:</strong> [address]
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="bg-white border-4 border-dashed border-gray-400 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Form</h2>
            <p className="text-gray-700">[Placeholder for contact form]</p>
          </div>

          {/* Questionnaire */}
          <div className="bg-white border-4 border-dashed border-gray-400 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Questionnaires</h2>
            <p className="text-gray-700">[Will contain all the questionnaire content]</p>
          </div>
        </div>
      </div>
    </main>
  );
}
