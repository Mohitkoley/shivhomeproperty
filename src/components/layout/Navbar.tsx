'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Home, Menu, X } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/pgs', label: 'Our PGs' },
    { href: '/contact', label: 'Contact' },
  ]

  // Track scrolling to apply dynamic styles (shadow/height)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close mobile menu when Escape key is pressed
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md border-slate-200/80 shadow-sm py-2' 
          : 'bg-white border-transparent py-3'
      }`}
    >
      {/* Skip to Content Link */}
      <Link
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-indigo-600 focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
      >
        Skip to main content
      </Link>

      <div className="container mx-auto px-4 flex items-center justify-between h-14">
        {/* Brand/Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-3 group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4 focus-visible:rounded-lg"
          aria-label="Shiv PG Home"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 transition-transform duration-300 group-hover:scale-105 shadow-sm">
            <Home className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 bg-clip-text text-transparent transition-all duration-300">
            Shiv PG
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block" aria-label="Primary Navigation">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`text-sm font-semibold transition-all duration-200 relative py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-8 focus-visible:rounded-sm ${
                      isActive
                        ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-indigo-600 after:rounded-full'
                        : 'text-slate-600 hover:text-indigo-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <Button 
              href="/pgs" 
              variant="primary" 
              size="sm" 
              className="px-5 font-semibold shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all"
            >
              View PGs
            </Button>
          </div>

          {/* Hamburger Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {isOpen && (
        <div 
          className="fixed inset-0 top-[70px] z-40 bg-slate-900/20 backdrop-blur-xs transition-opacity duration-300 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200/80 shadow-xl transition-all duration-300 ease-in-out z-50 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <nav className="px-6 py-8" aria-label="Primary Navigation (Mobile)">
          <ul className="flex flex-col gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`block text-base font-semibold py-2 transition-colors outline-none focus-visible:text-indigo-600 ${
                      isActive
                        ? 'text-indigo-600 border-l-2 border-indigo-650 pl-3 -ml-3'
                        : 'text-slate-700 hover:text-indigo-650'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
            <li className="pt-4 border-t border-slate-100">
              <Button 
                href="/pgs" 
                variant="primary" 
                size="md" 
                className="w-full justify-center shadow-md shadow-indigo-100 font-semibold"
              >
                View PGs
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
