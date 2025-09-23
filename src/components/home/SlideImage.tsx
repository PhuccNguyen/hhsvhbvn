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
    id: 'nguyen-van-chung',
    name: 'Nguyễn Văn Chung',
    title: 'Nhạc sĩ, "Cha đẻ ca khúc Viết tiếp câu chuyện Hòa Bình"',
    image: '/images/nguoinoitieng/ChadecuacakhucviettiepcauchuyenHoaBinhNhacSiNguyenVanChung.jpg',
    isSpotlight: true,
  },
  {
    id: 'anh-quan',
    name: 'Anh Quân Idol',
    title: 'Ca sĩ',
    image: '/images/nguoinoitieng/CasiAnhQuanIdol.jpg',
  },
  {
    id: 'duyen-quynh',
    name: 'Duyên Quỳnh',
    title: 'Ca sĩ',
    image: '/images/nguoinoitieng/casinguyenduyenquynh.jpg',
  },
  {
    id: 'ngo-thai-ngan',
    name: 'Ngô Thái Ngân',
    title: 'Grand Võin Miss Grand Việt Nam',
    image: '/images/nguoinoitieng/Grand Voin Miss Grand Việt Nam Ngô Thái Ngân.jpg',
  },
  {
    id: 'dinh-y-quyen',
    name: 'Đinh Y Quyên',
    title: 'Á 3 Miss Grand Việt Nam',
    image: '/images/nguoinoitieng/a3MissgrandVietNamdinhYQuyen.jpg',
  },
  {
    id: 'pham-nhu-thuy',
    name: 'Phạm Như Thùy',
    title: 'Top 10 Miss Grand Việt Nam',
    image: '/images/nguoinoitieng/Top10MissGrandViệtNamPhamNhưThùy.jpg',
  },
  {
    id: 'chu-tan-van',
    name: 'Chú Tấn Văn',
    title: 'MC',
    image: '/images/nguoinoitieng/MCchuTanVan.jpg',
  },
  {
    id: 'nam-vuong',
    name: 'Nam Vương',
    title: 'Á vương siêu mẫu',
    image: '/images/nguoinoitieng/namvuong.jpg',
  },
]

export default function SlideImage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-play functionality for desktop
  useEffect(() => {
    if (isAutoPlaying && window.innerWidth >= 768) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % celebrities.length)
      }, 5500)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying])

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % celebrities.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + celebrities.length) % celebrities.length)
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
          src="/images/background/CUoCTHiHOAHaUSINHVIeNHOaBiNHVIetNAM2025.png"
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

        {/* Desktop Hero Layout */}
        <div className={styles.desktopHero}>
          <div className={styles.heroLayout}>
            {/* Side Images Left */}
            <div className={styles.sideImages}>
              {celebrities.slice(1, 3).map((celebrity, index) => (
                <div key={celebrity.id} className={styles.sideImageContainer}>
                  <Image
                    src={celebrity.image}
                    alt={`${celebrity.name} - ${celebrity.title}`}
                    fill
                    className={styles.sideImage}
                    loading="lazy"
                    sizes="(max-width: 1200px) 25vw, 320px"
                  />
                  <div className={styles.sideCaption}>
                    <h4 className={styles.sideName}>{celebrity.name}</h4>
                    <p className={styles.sideTitle}>{celebrity.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Central Spotlight */}
            <div className={styles.centralSpotlight}>
              <div className={styles.spotlightContainer}>
                <Image
                  src={celebrities[0].image}
                  alt={`${celebrities[0].name} - ${celebrities[0].title}`}
                  fill
                  className={styles.spotlightImage}
                  priority
                  sizes="(max-width: 1200px) 50vw, 600px"
                />
                <div className={styles.spotlightBorder} />
                <div className={styles.spotlightGlow} />
              </div>
              
              <div className={styles.spotlightCaption}>
                <h3 className={styles.spotlightName}>{celebrities[0].name}</h3>
                <p className={styles.spotlightTitle}>
                  Nhạc sĩ, <em className={styles.songQuote}>&ldquo;Cha đẻ ca khúc Viết tiếp câu chuyện Hòa Bình&rdquo;</em>
                </p>
              </div>
            </div>

            {/* Side Images Right */}
            <div className={styles.sideImages}>
              {celebrities.slice(3, 5).map((celebrity, index) => (
                <div key={celebrity.id} className={styles.sideImageContainer}>
                  <Image
                    src={celebrity.image}
                    alt={`${celebrity.name} - ${celebrity.title}`}
                    fill
                    className={styles.sideImage}
                    loading="lazy"
                    sizes="(max-width: 1200px) 25vw, 320px"
                  />
                  <div className={styles.sideCaption}>
                    <h4 className={styles.sideName}>{celebrity.name}</h4>
                    <p className={styles.sideTitle}>{celebrity.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className={styles.desktopNavigation}>
            <button
              className={styles.navButton}
              onClick={prevSlide}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-label="Xem nghệ sĩ trước"
            >
              <ChevronLeftIcon className={styles.navIcon} />
            </button>

            <div className={styles.desktopDots}>
              {celebrities.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.desktopDot} ${index === currentSlide ? styles.activeDesktopDot : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Xem ${celebrities[index].name}`}
                />
              ))}
            </div>

            <button
              className={styles.navButton}
              onClick={nextSlide}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-label="Xem nghệ sĩ tiếp theo"
            >
              <ChevronRightIcon className={styles.navIcon} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
