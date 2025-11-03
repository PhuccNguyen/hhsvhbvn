'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import styles from './SlideImage.module.css'

interface Celebrity {
  id: string
  name: string
  title: string
  image: string
  isSpotlight?: boolean
}

const celebrities: Celebrity[] = [
  {
    id: 'truong-thi-thu-trang',
    name: 'Trương Thị Thu Trang',
    title: 'Chủ tịch TPA Entertainment - Nhà sáng lập dự án - Trưởng Ban tổ chức',
    image: '/images/nguoinoitieng/truong-thi-thu-trang.jpg',
    isSpotlight: true,
  },
  {
    id: 'mc-quoc-tri',
    name: 'MC Quốc Trí',
    title: 'MC',
    image: '/images/nguoinoitieng/mc-quoc-tri.jpg',
  },
  {
    id: 'mc-chu-tan-van',
    name: 'MC Chu Tấn Văn',
    title: 'MC',
    image: '/images/nguoinoitieng/mc-chu-tan-van.jpg',
  },
  {
    id: 'nguyen-van-chung',
    name: 'Nhạc sĩ Nguyễn Văn Chung',
    title: 'Nhạc sĩ - Cha đẻ của ca khúc viết tiếp câu chuyện Hòa Bình',
    image: '/images/nguoinoitieng/nhac-si-nguyen-van-chung.jpg',
  },
  {
    id: 'anh-quan-idol',
    name: 'Anh Quân Idol',
    title: 'Ca sĩ',
    image: '/images/nguoinoitieng/ca-si-anh-quan-idols.jpg',
  },
  {
    id: 'duyen-quynh',
    name: 'Duyên Quỳnh',
    title: 'Ca sĩ',
    image: '/images/nguoinoitieng/ca-si-nguyen-duyen-quynh.jpg',
  },
  {
    id: 'annie-nguyen',
    name: 'Annie Nguyễn',
    title: 'Hoa hậu - Đại sứ truyền thông',
    image: '/images/nguoinoitieng/hoa-hau-annie-nguyen.jpg',
  },
  {
    id: 'hua-vi-van',
    name: 'Hứa Vĩ Văn',
    title: 'Diễn viên',
    image: '/images/nguoinoitieng/dien-vien-hua-vi-van.png',
  },
  {
    id: 'ngo-ba-luc',
    name: 'Ngô Bá Lục',
    title: 'Nhà báo - Giám khảo',
    image: '/images/nguoinoitieng/giam-khao-nha-bao-ngo-ba-luc.jpg',
  },
  {
    id: 'ngo-thai-ngan',
    name: 'Ngô Thái Ngân',
    title: 'Miss Grand Việt Nam',
    image: '/images/nguoinoitieng/miss-grand-vietnam-ngo-thai-ngan.jpg',
  },
]

export default function SlideImage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentDesktopSlide, setCurrentDesktopSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const desktopAutoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Desktop slides: 5 hình mỗi slide, 2 slides total
  const desktopSlides = [
    celebrities.slice(0, 5),  // Slide 1: 5 hình đầu
    celebrities.slice(5, 10), // Slide 2: 5 hình tiếp theo
  ]

  // Auto-play functionality for mobile
  useEffect(() => {
    if (isAutoPlaying && window.innerWidth < 768) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % celebrities.length)
      }, 4000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying])

  // Auto-play functionality for desktop (chuyển slide mỗi 6 giây)
  useEffect(() => {
    if (isAutoPlaying && window.innerWidth >= 768) {
      desktopAutoPlayRef.current = setInterval(() => {
        setCurrentDesktopSlide((prev) => (prev + 1) % desktopSlides.length)
      }, 6000)
    }

    return () => {
      if (desktopAutoPlayRef.current) {
        clearInterval(desktopAutoPlayRef.current)
      }
    }
  }, [isAutoPlaying, desktopSlides.length])

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentSlide < celebrities.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

  return (
    <section className={styles.slideSection} aria-labelledby="celebrities-heading">
      {/* Background with overlay */}
      <div className={styles.backgroundWrapper}>
        <Image
          src="/images/background/cuoc-thi-hhsv-hoa-binh-viet-nam-2025.png"
          alt="Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025 Background"
          fill
          className={styles.backgroundImage}
          priority={false}
          sizes="100vw"
        />
        <div className={styles.backgroundOverlay} />
      </div>

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerWrapper}>
          <h2 id="celebrities-heading" className={styles.sectionTitle}>
            Khách mời & Nghệ sĩ đồng hành
          </h2>
          <p className={styles.sectionSubtitle}>
            Gala tôn vinh những tài năng và nghệ sĩ góp phần lan tỏa thông điệp hòa bình
          </p>
        </div>

        {/* Mobile Carousel */}
        <div className={styles.mobileCarousel}>
          <div 
            className={styles.slideWrapper}
            ref={slideRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className={styles.slideTrack}
              style={{ 
                transform: `translateX(-${currentSlide * 100}%)`,
                transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              {celebrities.map((celebrity, index) => (
                <div 
                  key={celebrity.id} 
                  className={`${styles.slide} ${celebrity.isSpotlight ? styles.spotlightSlide : ''}`}
                >
                  <div className={styles.imageContainer}>
                    <Image
                      src={celebrity.image}
                      alt={`${celebrity.name} - ${celebrity.title}`}
                      fill
                      className={styles.celebrityImage}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      priority={index === 0}
                      sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 480px"
                    />
                    {celebrity.isSpotlight && (
                      <div className={styles.spotlightGlow} />
                    )}
                  </div>
                  
                  <div className={styles.captionOverlay}>
                    <div className={styles.captionContent}>
                      <h3 className={styles.celebrityName}>{celebrity.name}</h3>
                      <p className={styles.celebrityTitle}>
                        {celebrity.title.includes('Viết tiếp câu chuyện Hòa Bình') ? (
                          <>
                            Nhạc sĩ, <em className={styles.songQuote}>&ldquo;Cha đẻ ca khúc Viết tiếp câu chuyện Hòa Bình&rdquo;</em>
                          </>
                        ) : (
                          celebrity.title
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Dots Navigation */}
          <div className={styles.dotsContainer} role="tablist" aria-label="Chọn nghệ sĩ">
            {celebrities.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Xem ${celebrities[index].name}`}
                aria-current={index === currentSlide ? 'true' : 'false'}
                role="tab"
              />
            ))}
          </div>
        </div>

        {/* Desktop Hero Layout - 5 hình mỗi slide */}
        <div className={styles.desktopHero}>
          <div className={styles.heroLayout}>
            {desktopSlides[currentDesktopSlide].map((celebrity, index) => (
              <div 
                key={celebrity.id} 
                className={`${styles.desktopCard} ${index === 2 ? styles.centerCard : ''}`}
              >
                <div className={styles.desktopImageContainer}>
                  <Image
                    src={celebrity.image}
                    alt={`${celebrity.name} - ${celebrity.title}`}
                    fill
                    className={styles.desktopImage}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    priority={index === 0}
                    sizes="(max-width: 1200px) 20vw, 280px"
                  />
                  {celebrity.isSpotlight && <div className={styles.spotlightGlow} />}
                </div>
                
                <div className={styles.desktopCaption}>
                  <h3 className={styles.desktopName}>{celebrity.name}</h3>
                  <p className={styles.desktopTitle}>{celebrity.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Navigation */}
          <div className={styles.desktopNavigation}>
            <button
              className={styles.navButton}
              onClick={() => {
                setCurrentDesktopSlide((prev) => (prev - 1 + desktopSlides.length) % desktopSlides.length)
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-label="Xem slide trước"
            >
              <ChevronLeftIcon className={styles.navIcon} />
            </button>

            <div className={styles.desktopDots}>
              {desktopSlides.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.desktopDot} ${index === currentDesktopSlide ? styles.activeDesktopDot : ''}`}
                  onClick={() => setCurrentDesktopSlide(index)}
                  aria-label={`Xem slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              className={styles.navButton}
              onClick={() => {
                setCurrentDesktopSlide((prev) => (prev + 1) % desktopSlides.length)
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-label="Xem slide tiếp theo"
            >
              <ChevronRightIcon className={styles.navIcon} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
