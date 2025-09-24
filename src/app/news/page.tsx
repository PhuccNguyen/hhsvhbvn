
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Facebook,
  Twitter} from 'lucide-react'
import {
  DocumentTextIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  CalendarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import { 
  StarIcon,
  SparklesIcon,
  HeartIcon
} from '@heroicons/react/24/solid'
import styles from './news.module.css'

export default function NewsPage() {
  const heroImages = [
    {
      alt: 'Gala trao giải HHSV 2024',
      caption: 'Đêm Gala hoành tráng của mùa giải trước'
    },
    {
      src: '/images/news/hero-2.jpg',
      alt: 'Thí sinh tham gia vòng sơ khảo',
      caption: 'Các thí sinh xuất sắc tại vòng sơ khảo'
    }
  ]

  const highlights = [
    {
      icon: <StarIcon className={styles.highlightIcon} />,
      title: "Lần đầu tiên",
      description: "Cuộc thi sinh viên mang biểu tượng Hòa Bình quy mô quốc gia"
    },
    {
      icon: <SparklesIcon className={styles.highlightIcon} />,
      title: "Quảng bá Đà Nẵng",
      description: "& di sản Việt Nam ra thế giới"
    },
    {
      icon: <HeartIcon className={styles.highlightIcon} />,
      title: "Thông điệp",
      description: "\"Sinh viên Việt Nam tiếp nối câu chuyện Hòa Bình\""
    },
    {
      icon: <TrophyIcon className={styles.highlightIcon} />,
      title: "Tổng giải thưởng",
      description: "2 tỷ VNĐ + 01 du học Mỹ 100.000 USD"
    }
  ]

  const people = [
    { name: "Phạm Xuân Hải", title: "Trưởng BTC", image: "/images/nguoinoitieng/hoa-hau-ubg.jpg" },
    { name: "Nguyễn Văn Chung", title: "Nhạc sĩ", image: "/images/nguoinoitieng/nhac-si-nguyen-van-chung.jpg" },
    { name: "Chú Tấn Văn", title: "MC", image: "/images/nguoinoitieng/mc-chu-tan-van.jpg" },
    { name: "Anh Quân Idol", title: "Ca sĩ", image: "/images/nguoinoitieng/ca-si-anh-quan-idol.jpg" },
    { name: "Duyên Quỳnh", title: "Ca sĩ", image: "/images/nguoinoitieng/ca-si-nguyen-duyen-quynh.jpg" }
  ]

  const sponsorTiers = [
    "15T Độc quyền",
    "10T Kim cương", 
    "3T Vàng",
    "1T Bạc",
    "500M Đồng",
    "100M Đồng hành"
  ]

  return (
    <article className={styles.newsPage}>
      {/* Article Header */}
           <header className={styles.articleHeader}>
        <motion.figure
          className={styles.heroFigure}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/images/news/newsbanner.jpg"
            alt="Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025"
            fill
            className={styles.heroImage}
            priority
            sizes="100vw"
            quality={90}
          />
          <div className={styles.heroOverlay} />
        </motion.figure>
        <div className={styles.headerContent}>
          <motion.div
            className={styles.metaInfo}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className={styles.metaCategory}>Sự kiện</span>
            <span className={styles.metaSeparator}>•</span>
            <span className={styles.metaAuthor}>TPA Entertainment</span>
            <span className={styles.metaSeparator}>•</span>
            <time className={styles.metaDate}>24/09/2025</time>
          </motion.div>
          <motion.h1
            className={styles.bannerTitle}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025: Hành trình tôn vinh trí tuệ và nhân ái
          </motion.h1>
          <motion.p
            className={styles.bannerLead}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Cuộc thi Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025 không chỉ là sân chơi tôn vinh vẻ đẹp toàn diện của nữ sinh viên mà còn lan tỏa thông điệp hòa bình, quảng bá văn hóa Việt Nam ra thế giới.
          </motion.p>
          <motion.div
            className={styles.bannerActions}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href="/checkin" className={styles.ctaPrimary}>
              <UserGroupIcon className={styles.ctaIcon} />
              Đăng ký tham dự
            </Link>
            <Link href="#timeline" className={styles.ctaSecondary}>
              <CalendarIcon className={styles.ctaIcon} />
              Lịch trình cuộc thi
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Introduction Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Nơi tôn vinh vẻ đẹp trí tuệ và nhân ái
          </motion.h2>
          <motion.div
            className={styles.sectionContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <p>
              Lần đầu tiên tại Việt Nam, <strong>Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025</strong> ra đời với sứ mệnh tôn vinh vẻ đẹp toàn diện của nữ sinh viên theo tiêu chí <em>“Xinh Đẹp – Trí Tuệ – Bản Lĩnh – Nhân Ái”</em>. Cuộc thi không chỉ là nơi các thí sinh thể hiện tài năng và cá tính mà còn là cầu nối quảng bá hình ảnh thành phố Đà Nẵng và di sản văn hóa Việt Nam ra thế giới.
            </p>
            <p>
              Với thông điệp <strong>“Sinh viên Việt Nam tiếp nối câu chuyện Hòa Bình”</strong>, cuộc thi khuyến khích thế hệ trẻ lan tỏa giá trị hòa bình và phát triển bền vững, đồng thời tạo cơ hội để các nữ sinh viên hoàn thiện bản thân và kết nối cộng đồng.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Điểm nhấn nổi bật
          </motion.h2>
          <div className={styles.highlightsGrid}>
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                className={styles.highlightCard}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <div className={styles.highlightIconWrapper}>
                  {highlight.icon}
                </div>
                <h3 className={styles.highlightTitle}>{highlight.title}</h3>
                <p className={styles.highlightDescription}>{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Thể lệ tham gia
          </motion.h2>
          <motion.div
            className={styles.sectionContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <p>
              Cuộc thi mở cửa cho các nữ sinh viên đáp ứng các điều kiện sau:
            </p>
            <ul className={styles.requirementsList}>
              <li className={styles.requirement}>
                <DocumentTextIcon className={styles.requirementIcon} />
                <span><strong>Đối tượng:</strong> Nữ sinh viên từ 19-25 tuổi</span>
              </li>
              <li className={styles.requirement}>
                <DocumentTextIcon className={styles.requirementIcon} />
                <span><strong>Chiều cao:</strong> ≥ 1m63</span>
              </li>
              <li className={styles.requirement}>
                <DocumentTextIcon className={styles.requirementIcon} />
                <span><strong>Tình trạng:</strong> Chưa kết hôn, không có con</span>
              </li>
              <li className={styles.requirement}>
                <DocumentTextIcon className={styles.requirementIcon} />
                <span><strong>Ngoại hình:</strong> Không phẫu thuật thẩm mỹ</span>
              </li>
              <li className={styles.requirement}>
                <DocumentTextIcon className={styles.requirementIcon} />
                <span><strong>Hồ sơ:</strong> Đầy đủ giấy tờ, ảnh theo chuẩn BTC</span>
              </li>
              <li className={styles.requirement}>
                <DocumentTextIcon className={styles.requirementIcon} />
                <span><strong>Thời hạn nộp:</strong> <span className={styles.deadline}>20/08 - 25/11/2025</span></span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={styles.section} id="timeline">
        <div className={styles.container}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Lịch trình cuộc thi
          </motion.h2>
          <motion.div
            className={styles.sectionContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>27/09</div>
                <div className={styles.timelineContent}>
                  <h4>Họp báo ra mắt</h4>
                  <p>Đà Nẵng - Giới thiệu cuộc thi</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>09-23/11</div>
                <div className={styles.timelineContent}>
                  <h4>Vòng sơ khảo</h4>
                  <p>Hà Nội (09/11) • Đà Nẵng (16/11) • TP.HCM (23/11)</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>05-15/12</div>
                <div className={styles.timelineContent}>
                  <h4>Vòng bán kết</h4>
                  <p>Trưng Vương - Đà Nẵng</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>28/12</div>
                <div className={styles.timelineContent}>
                  <h4>Chung kết</h4>
                  <p>Cung Tiên Sơn - <strong>Live VTV</strong></p>
                </div>
              </div>
            </div>
            <p className={styles.votingNote}>
              <strong>Lưu ý:</strong> Bình chọn qua <em>Tingnect.com</em> (không ảnh hưởng chấm thi)
            </p>
          </motion.div>
        </div>
      </section>

      {/* Awards Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Giải thưởng giá trị
          </motion.h2>
          <motion.div
            className={styles.sectionContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className={styles.awardsGrid}>
              <div className={styles.awardItem}>
                <div className={styles.awardRank}>👑</div>
                <h4>Hoa hậu</h4>
                <div className={styles.awardPrize}>2 tỷ VNĐ</div>
                <div className={styles.awardBonus}>+ Học bổng Mỹ 100k USD</div>
              </div>
              <div className={styles.awardItem}>
                <div className={styles.awardRank}>🥈</div>
                <h4>Á hậu 1</h4>
                <div className={styles.awardPrize}>1 tỷ VNĐ</div>
                <div className={styles.awardBonus}>+ Visa 50k USD</div>
              </div>
              <div className={styles.awardItem}>
                <div className={styles.awardRank}>🥉</div>
                <h4>Á hậu 2</h4>
                <div className={styles.awardPrize}>500 triệu VNĐ</div>
              </div>
              <div className={styles.awardItem}>
                <div className={styles.awardRank}>🏆</div>
                <h4>Á hậu 3</h4>
                <div className={styles.awardPrize}>250 triệu VNĐ</div>
              </div>
            </div>
            <p className={styles.specialAwards}>
              <strong>Giải phụ:</strong> 50 triệu VNĐ mỗi giải
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Nhà tài trợ đồng hành
          </motion.h2>
          <motion.div
            className={styles.sponsorTiers}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {sponsorTiers.map((tier, index) => (
              <div key={index} className={styles.sponsorChip}>
                {tier}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* People Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Ban tổ chức và giám khảo
          </motion.h2>
          <motion.div
            className={styles.peopleCarousel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className={styles.peopleTrack}>
              {people.map((person, index) => (
                <motion.div
                  key={index}
                  className={styles.personCard}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <div className={styles.personImageContainer}>
                    <Image
                      src={person.image}
                      alt={`${person.name} - ${person.title}`}
                      fill
                      className={styles.personImage}
                      sizes="(max-width: 768px) 25vw, 200px"
                    />
                  </div>
                  <div className={styles.personInfo}>
                    <h4 className={styles.personName}>{person.name}</h4>
                    <p className={styles.personTitle}>{person.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Liên hệ ban tổ chức
          </motion.h2>
          <motion.div
            className={styles.contactGrid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className={styles.contactInfo}>
              <div className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <MapPinIcon className={styles.contactIcon} />
                  <div>
                    <strong>TPA Entertainment</strong><br />
                    29 đường 12, P.Gò Vấp, TP.HCM
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <EnvelopeIcon className={styles.contactIcon} />
                  <div>
                    <a href="mailto:tpaentertainment2025@gmail.com">
                      tpaentertainment2025@gmail.com
                    </a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <PhoneIcon className={styles.contactIcon} />
                  <div>
                    <a href="tel:0902031034">
                      0902031034 (Mr Sơn Phạm)
                    </a>
                  </div>
                </div>
              </div>
              <div className={styles.socialLinks}>
                <h3>Kênh chính thức</h3>
                <div className={styles.socialGrid}>
                  <a href="#" className={styles.socialLink}>Facebook</a>
                  <a href="#" className={styles.socialLink}>Instagram</a>
                  <a href="#" className={styles.socialLink}>TikTok</a>
                  <a href="#" className={styles.socialLink}>YouTube</a>
                </div>
              </div>
            </div>
            <div className={styles.contactActions}>
              <Link href="/checkin" className={styles.contactCta}>
                <UserGroupIcon className={styles.ctaIcon} />
                Đăng ký tham dự
              </Link>
              <button className={styles.pressKit}>
                <DocumentTextIcon className={styles.ctaIcon} />
                Tải Press Kit
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </article>
  )
}