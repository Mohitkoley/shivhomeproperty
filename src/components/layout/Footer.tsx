import Link from 'next/link'
import { Home, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-indigo-400" />
              <span className="font-bold text-xl tracking-tight text-white">Shiv PG</span>
            </Link>
            <p className="text-sm text-gray-400">
              Premium PG accommodations with modern amenities, ensuring a comfortable and secure stay for students and professionals.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link href="/pgs" className="hover:text-indigo-400 transition-colors">Our PGs</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-indigo-400 shrink-0" />
                <span>123 Main Road, Near College, City, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-indigo-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-indigo-400 shrink-0" />
                <span>info@shivhomeproperty.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Admin Area</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/admin/login" className="hover:text-indigo-400 transition-colors">Admin Login</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center text-gray-500">
          <p>© {new Date().getFullYear()} Shiv Home Property. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
