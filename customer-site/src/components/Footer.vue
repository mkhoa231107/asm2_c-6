<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-section">
        <h3>Về Chúng Tôi</h3>
        <p>Hệ thống đặt món ăn nhanh trực tuyến, mang đến trải nghiệm tuyệt vời cho khách hàng.</p>
        <div class="social-links">
          <a href="#" class="social-icon" aria-label="Facebook">
            <span>f</span>
          </a>
          <a href="#" class="social-icon" aria-label="Instagram">
            <span>📷</span>
          </a>
          <a href="#" class="social-icon" aria-label="Twitter">
            <span>🐦</span>
          </a>
          <a href="#" class="social-icon" aria-label="YouTube">
            <span>▶</span>
          </a>
        </div>
      </div>
      
      <div class="footer-section">
        <h3>Liên Hệ</h3>
        <div class="contact-item">
          <span class="icon">📞</span>
          <span>Hotline: 1900-xxxx</span>
        </div>
        <div class="contact-item">
          <span class="icon">✉️</span>
          <span>Email: support@fastfood.vn</span>
        </div>
        <div class="contact-item">
          <span class="icon">📍</span>
          <span>Địa chỉ: TP. Hồ Chí Minh</span>
        </div>
      </div>
      
      <div class="footer-section">
        <h3>Giờ Hoạt Động</h3>
        <div class="hours-item">
          <span class="day">Thứ 2 - Thứ 6:</span>
          <span class="time">8:00 - 22:00</span>
        </div>
        <div class="hours-item">
          <span class="day">Thứ 7 - Chủ Nhật:</span>
          <span class="time">9:00 - 23:00</span>
        </div>
      </div>
      
      <div class="footer-section">
        <h3>Liên Kết Nhanh</h3>
        <router-link to="/foods" class="footer-link">Menu</router-link>
        <router-link to="/orders" class="footer-link">Đơn Hàng</router-link>
        <router-link to="/profile" class="footer-link">Tài Khoản</router-link>
        <a href="#" class="footer-link">Chính Sách</a>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; 2024 Fast Food System. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background-color: var(--surface);
  color: var(--muted);
  margin-top: auto;
  padding-top: 60px;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  padding-bottom: 40px;
}

.footer-section h3 {
  color: var(--text);
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 700;
}

.footer-section p {
  margin: 0;
  line-height: 1.7;
  font-size: 14px;
  color: var(--muted);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #9ca3af;
}

.icon {
  font-size: 18px;
  color: var(--accent);
}

.hours-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #374151;
  font-size: 14px;
}

.day {
  color: #9ca3af;
}

.time {
  color: #ffffff;
  font-weight: 600;
}

.footer-link {
  display: block;
  color: var(--muted);
  text-decoration: none;
  margin-bottom: 10px;
  font-size: 14px;
  transition: all 0.2s;
}

.footer-link:hover {
  color: var(--accent);
  padding-left: 8px;
}

.social-links {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: rgba(255,255,255,0.02);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  text-decoration: none;
  transition: all 0.2s;
  font-size: 18px;
  border: 1px solid rgba(255,255,255,0.04);
}

.social-icon:hover {
  background-color: var(--accent);
  color: white;
  border-color: var(--accent);
  transform: translateY(-3px);
}

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.04);
  padding: 24px 0;
  text-align: center;
}

.footer-bottom p {
  color: var(--muted);
  font-size: 14px;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .social-links {
    justify-content: flex-start;
  }
  
  .hours-item {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
}
</style>