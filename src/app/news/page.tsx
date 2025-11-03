
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  DocumentTextIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import styles from './news.module.css'

export default function NewsPage() {

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
              Lần đầu tiên tại Việt Nam, <strong>Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025</strong> ra đời với sứ mệnh tôn vinh vẻ đẹp toàn diện của nữ sinh viên theo tiêu chí <em>“Xinh Đẹp – Trí Tuệ – Bản Lĩnh – Nhân Ái - Hòa Bình”</em>. Cuộc thi không chỉ là nơi các thí sinh thể hiện tài năng và cá tính mà còn là cầu nối quảng bá hình ảnh thành phố Đà Nẵng và di sản văn hóa Việt Nam ra thế giới.
            </p>
            <p>
              Với thông điệp <strong>“Sinh viên Việt Nam tiếp nối câu chuyện Hòa Bình”</strong>, cuộc thi khuyến khích thế hệ trẻ lan tỏa giá trị hòa bình và phát triển bền vững, đồng thời tạo cơ hội để các nữ sinh viên hoàn thiện bản thân và kết nối cộng đồng.
            </p>
          </motion.div>
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
            Đối Tượng Dự Thi
          </motion.h2>
          <motion.div
            className={styles.sectionContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <p>
              Nữ sinh viên Việt Nam từ <strong>18 đến 25 tuổi</strong> đáp ứng các tiêu chí sau:
            </p>
            <ul className={styles.requirementsList}>
              <li className={styles.requirement}>
                <DocumentTextIcon className={styles.requirementIcon} />
                <span><strong>Quốc tịch:</strong> Việt Nam hoặc người Việt định cư nước ngoài</span>
              </li>
              <li className={styles.requirement}>
                <DocumentTextIcon className={styles.requirementIcon} />
                <span><strong>Độ tuổi:</strong> 18-25 tuổi (theo CCCD/Hộ chiếu)</span>
              </li>
              <li className={styles.requirement}>
                <DocumentTextIcon className={styles.requirementIcon} />
                <span><strong>Chiều cao:</strong> Từ 1m63 trở lên</span>
              </li>
              <li className={styles.requirement}>
                <DocumentTextIcon className={styles.requirementIcon} />
                <span><strong>Tình trạng:</strong> Chưa kết hôn, chưa sinh con</span>
              </li>
              <li className={styles.requirement}>
                <DocumentTextIcon className={styles.requirementIcon} />
                <span><strong>Ngoại hình:</strong> Không phẫu thuật thẩm mỹ</span>
              </li>
              <li className={styles.requirement}>
                <DocumentTextIcon className={styles.requirementIcon} />
                <span><strong>Thời hạn nộp:</strong> <span className={styles.deadline}>Đến 25/11/2025</span></span>
              </li>
            </ul>
            <p className={styles.votingNote}>
              <strong>Hồ sơ gồm:</strong> Đơn đăng ký, Sơ yếu lý lịch, CCCD, Thẻ sinh viên, Ảnh & Video giới thiệu
            </p>
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
            Lịch Trình Cuộc Thi
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
                  <h4>Họp Báo Khởi Động</h4>
                  <p>Nhà Hát Trưng Vương, Đà Nẵng (17h00 - 21h00)</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>27/09 - 25/11</div>
                <div className={styles.timelineContent}>
                  <h4>Vòng Sơ Tuyển</h4>
                  <p>Đăng ký Online & Offline - Nộp hồ sơ qua website và email</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>06/11 - 30/11</div>
                <div className={styles.timelineContent}>
                  <h4>Vòng Sơ Khảo - 4 Khu Vực</h4>
                  <p>Cần Thơ (06/11) • TP.HCM (14/11) • Hà Nội (17-23/11) • Đà Nẵng (24-30/11)</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>05/12 - 15/12</div>
                <div className={styles.timelineContent}>
                  <h4>Vòng Bán Kết - TOP 50</h4>
                  <p>Đà Nẵng - Chọn thí sinh xuất sắc nhất vào Chung kết</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>28/12</div>
                <div className={styles.timelineContent}>
                  <h4>Đêm Chung Kết Hoành Tráng</h4>
                  <p>Đà Nẵng - Trao vương miện Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025</p>
                </div>
              </div>
            </div>
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
            Cơ Cấu Giải Thưởng
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
                <h4>Hoa Hậu</h4>
                <div className={styles.awardPrize}>2.000.000.000 VNĐ</div>
                <div className={styles.awardBonus}>+ Du học Mỹ 100.000 USD</div>
              </div>
              <div className={styles.awardItem}>
                <div className={styles.awardRank}>🥈</div>
                <h4>Á Hậu 1</h4>
                <div className={styles.awardPrize}>1.000.000.000 VNĐ</div>
                <div className={styles.awardBonus}>+ Visa Mỹ 50.000 USD</div>
              </div>
              <div className={styles.awardItem}>
                <div className={styles.awardRank}>🥉</div>
                <h4>Á Hậu 2</h4>
                <div className={styles.awardPrize}>500.000.000 VNĐ</div>
                <div className={styles.awardBonus}>+ Visa Mỹ 50.000 USD</div>
              </div>
              <div className={styles.awardItem}>
                <div className={styles.awardRank}>🏆</div>
                <h4>Á Hậu 3</h4>
                <div className={styles.awardPrize}>250.000.000 VNĐ</div>
                <div className={styles.awardBonus}>+ Vương miện & Quà tặng</div>
              </div>
            </div>
            <p className={styles.specialAwards}>
              <strong>9 Giải Phụ:</strong> 50.000.000 VNĐ/giải (Người đẹp thân thiện, Truyền thống, Yêu thích nhất, Ảnh, Phong cách, Đại sứ Hòa Bình, Khởi nghiệp, Tài năng, Nhân ái)
            </p>
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
                    <strong>Tổng đài:</strong>{' '}
                    <a href="tel:18008338">1800 8338</a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <PhoneIcon className={styles.contactIcon} />
                  <div>
                    <strong>Hotline:</strong>{' '}
                    <a href="tel:0395552929">0395 552 929</a>
                  </div>
                </div>
              </div>
              <div className={styles.socialLinks}>
                <h3>Kênh chính thức</h3>
                <div className={styles.socialGrid}>
                  <a href="https://www.facebook.com/hoahausinhvienhoabinhvn" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Facebook</a>
                  <a href="https://www.instagram.com/hoahausinhvienhoabinhvn" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Instagram</a>
                  <a href="https://www.tiktok.com/@hoahausinhvienhoabinhvn" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>TikTok</a>
                  <a href="https://www.youtube.com/@hoahausinhvienhoabinhvn" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>YouTube</a>
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