'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Crown, 
  ChevronDown,
  ArrowRight,
  Star,
  Newspaper
} from 'lucide-react'
import styles from './Header.module.css'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCheckinExpanded, setIsCheckinExpanded] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsCheckinExpanded(false)
  }, [pathname])

  const checkinRounds = [
    { href: '/checkin/hop-bao', label: 'Họp báo', date: '27/09/2025' },
    { href: '/checkin/so-khao', label: 'Sơ khảo', date: '05/10-25/11' },
    { href: '/checkin/ban-ket', label: 'Bán kết', date: '15/12/2025' },
    { href: '/checkin/chung-ket', label: 'Chung kết', date: '28/12/2025' }
  ]

  const mainNavigationItems = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/checkin', label: 'Check-in', icon: Users, hasSubmenu: true, priority: true },
    { href: '/news', label: 'Tin tức', icon: Newspaper },
    { href: 'https://tingvote.com', label: 'Vote', icon: Crown, external: true, secondary: true }
  ]

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleCheckinToggle = () => {
    setIsCheckinExpanded(!isCheckinExpanded)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setIsCheckinExpanded(false)
  }

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          {/* Logo Section - TingNect First, TPA Second */}
          <motion.div
            className={styles.logoSection}
            animate={{
              scale: isScrolled ? 0.95 : 1
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Link href="/" className={styles.logoContainer}>
              <div className={styles.logoWrapper}>
                <div className={styles.tingnectLogo}>
                  <Image
                    src="/images/logo/tingnect-logo.png"
                    alt="TingNect"
                    width={137}
                    height={38}
                    priority
                    className={styles.logoImage}
                  />
                </div>
                
                <div className={styles.logoDivider} />
                
                <div className={styles.tpaLogo}>
                  <Image
                    src="/images/logo/Logo_tpa.svg"
                    alt="TPA Entertainment"
                    width={60}
                    height={60}
                    priority
                    className={styles.logoImage}
                  />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            {mainNavigationItems
              .filter(item => !item.secondary)
              .map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href === '/checkin' && pathname.startsWith('/checkin'))
              
              return (
                <div key={item.href} className={styles.navItemWrapper}>
                  {item.hasSubmenu ? (
                    <div className={styles.dropdown}>
                      <motion.div
                        className={`${styles.navLink} ${item.priority ? styles.priority : ''} ${isActive ? styles.active : ''}`}
                        whileHover={{ y: -1 }}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                        <ChevronDown size={14} />
                      </motion.div>
                      
                      <div className={styles.dropdownMenu}>
                        <div className={styles.dropdownContent}>
                          {checkinRounds.map((round) => (
                            <Link
                              key={round.href}
                              href={round.href}
                              className={`${styles.dropdownItem} ${
                                pathname === round.href ? styles.active : ''
                              }`}
                            >
                              <div className={styles.dropdownItemContent}>
                                <span className={styles.dropdownLabel}>{round.label}</span>
                                <span className={styles.dropdownDate}>{round.date}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : item.external ? (
                    <motion.a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.navLink} ${item.secondary ? styles.secondary : ''}`}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </motion.a>
                  ) : (
                    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href={item.href}
                        className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  )}
                </div>
              )
            })}
            
            {/* Secondary Vote Link */}
            {mainNavigationItems
              .filter(item => item.secondary)
              .map((item) => {
              const Icon = item.icon
              return (
                <motion.a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.navLink} ${styles.secondary}`}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </motion.a>
              )
            })}
          </nav>

          {/* Mobile Check-in CTA - Always Visible */}
          <motion.div
            className={styles.mobileCheckinCTA}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          >
            <Link href="/checkin" className={styles.mobileCheckinButton}>
              <Users size={16} />
              <span>Check-in</span>
            </Link>
          </motion.div>

          {/* Desktop Check-in CTA */}
          <motion.div
            className={styles.desktopCheckinCTA}
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              boxShadow: "0 12px 30px rgba(231, 200, 115, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/checkin" className={styles.checkinButton}>
              <Users size={18} />
              <span>Check-in</span>
              <ArrowRight size={16} />
              <div className={styles.ctaShine} />
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className={styles.mobileMenuButton}
            onClick={handleMobileMenuToggle}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </motion.button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeMobileMenu}
          >
            <motion.div
              className={styles.mobileDrawer}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: 'spring', 
                damping: 30, 
                stiffness: 400 
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Menu Header */}
              <div className={styles.mobileMenuHeader}>
                <div className={styles.mobileLogoSection}>
                  <div className={styles.mobileLogoWrapper}>
                    <div className={styles.tingnectLogo}>
                      <Image
                        src="/images/logo/tingnect-logo.png"
                        alt="TingNect"
                        width={80}
                        height={22}
                        className={styles.logoImage}
                      />
                    </div>
                    <div className={styles.logoDivider} />
                    <div className={styles.tpaLogo}>
                      <Image
                        src="/images/logo/Logo_tpa.svg"
                        alt="TPA Entertainment"
                        width={28}
                        height={28}
                        className={styles.logoImage}
                      />
                    </div>
                  </div>
                </div>
                
                <motion.button
                  className={styles.mobileCloseButton}
                  onClick={closeMobileMenu}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Mobile Menu Content */}
              <div className={styles.mobileMenuContent}>
                {/* Navigation Items */}
                {mainNavigationItems
                  .filter(item => !item.secondary)
                  .map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || 
                    (item.href === '/checkin' && pathname.startsWith('/checkin'))
                  
                  return (
                    <div key={item.href} className={styles.mobileNavItem}>
                      {item.hasSubmenu ? (
                        <div className={styles.mobileAccordion}>
                          <motion.button
                            className={`${styles.mobileNavLink} ${styles.accordionTrigger} ${
                              isActive ? styles.active : ''
                            }`}
                            onClick={handleCheckinToggle}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className={styles.navLinkContent}>
                              <Icon size={20} />
                              <span>{item.label}</span>
                            </div>
                            <motion.div
                              animate={{ rotate: isCheckinExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown size={16} />
                            </motion.div>
                          </motion.button>

                          <AnimatePresence>
                            {isCheckinExpanded && (
                              <motion.div
                                className={styles.accordionContent}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                              >
                                {checkinRounds.map((round, roundIndex) => (
                                  <motion.div
                                    key={round.href}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: roundIndex * 0.1 }}
                                    whileHover={{ x: 8 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <Link
                                      href={round.href}
                                      className={`${styles.mobileSubLink} ${
                                        pathname === round.href ? styles.active : ''
                                      }`}
                                      onClick={closeMobileMenu}
                                    >
                                      <div className={styles.subLinkContent}>
                                        <span className={styles.subLinkLabel}>{round.label}</span>
                                        <span className={styles.subLinkDate}>{round.date}</span>
                                      </div>
                                      <ArrowRight size={14} />
                                    </Link>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : item.external ? (
                        <motion.a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.mobileNavLink}
                          onClick={closeMobileMenu}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className={styles.navLinkContent}>
                            <Icon size={20} />
                            <span>{item.label}</span>
                          </div>
                          <ArrowRight size={16} />
                        </motion.a>
                      ) : (
                        <motion.div
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            className={`${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                            onClick={closeMobileMenu}
                          >
                            <div className={styles.navLinkContent}>
                              <Icon size={20} />
                              <span>{item.label}</span>
                            </div>
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  )
                })}

                {/* Mobile Vote CTA */}
                <motion.a
                  href="https://tingvote.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileVoteCTA}
                  onClick={closeMobileMenu}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className={styles.voteCTAContent}>
                    <div className={styles.voteCTAIcon}>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      >
                        <Crown size={24} />
                      </motion.div>
                    </div>
                    <div className={styles.voteCTAText}>
                      <span className={styles.voteCTALabel}>Bình chọn ngay</span>
                      <span className={styles.voteCTASubtext}>Ủng hộ thí sinh yêu thích</span>
                    </div>
                    <Star size={18} />
                  </div>
                  <div className={styles.ctaShine} />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
