import React, { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';

function App() {
  const [theme, setTheme] = useState('light');
  const [skinColor, setSkinColor] = useState('#ec9142'); // Default color-2 skin
  const [isPlaying, setIsPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('skills');
  const [activeSection, setActiveSection] = useState('home');
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0); // 0-indexed for proper slide alignment
  const [fadeActive, setFadeActive] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Age states
  const [age, setAge] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  // Security: Prevent Right-Click & F12 Inspect Element shortcuts
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // Prevent F12
      if (e.key === "F12") {
        e.preventDefault();
      }
      // Prevent Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C" || e.key === "i" || e.key === "j" || e.key === "c")) {
        e.preventDefault();
      }
      // Prevent Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Preloader activation & Notification Pop
  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add('loaded');
    }, 1000);

    const notificationTimer = setTimeout(() => {
      setShowNotification(true);
    }, 1800);

    return () => {
      clearTimeout(timer);
      clearTimeout(notificationTimer);
      document.body.classList.remove('loaded');
    };
  }, []);

  // Initialize ParticlesJS via global script
  useEffect(() => {
    const initParticles = () => {
      if (window.particlesJS) {
        window.particlesJS("particles-js", {
          "particles": {
            "number": { "value": 70, "density": { "enable": true, "value_area": 1000 } },
            "color": { "value": "#646464" },
            "shape": {
              "type": "circle",
              "stroke": { "width": 0, "color": "#000000" },
              "polygon": { "nb_sides": 4 }
            },
            "opacity": { "value": 0.5, "random": false },
            "size": { "value": 4, "random": true },
            "line_linked": {
              "enable": true,
              "distance": 120,
              "color": "#939393",
              "opacity": 0.8,
              "width": 2
            },
            "move": {
              "enable": true,
              "speed": 6,
              "direction": "none",
              "random": true,
              "straight": false,
              "out_mode": "out",
              "bounce": false
            }
          },
          "interactivity": {
            "detect_on": "canvas",
            "events": {
              "onhover": { "enable": true, "mode": "repulse" },
              "onclick": { "enable": false },
              "resize": true
            },
            "modes": {
              "repulse": { "distance": 200, "duration": 0.4 }
            }
          },
          "retina_detect": false
        });
      }
    };

    initParticles();
    window.addEventListener('resize', initParticles);
    return () => window.removeEventListener('resize', initParticles);
  }, []);

  // Calculate real-time age based on birth date (22/04/2004)
  useEffect(() => {
    function getAmoDate(day, month, year) {
      let amountDay = 0;
      const leap = new Date(year, 1, 29).getDate() === 29;
      switch (month) {
        case 1: case 3: case 5: case 7: case 8: case 10: case 12:
          amountDay = 31;
          break;
        case 4: case 6: case 9: case 11:
          amountDay = 30;
          break;
        default:
          amountDay = leap ? 29 : 28;
          break;
      }
      return amountDay - day;
    }

    function calculateAge() {
      const myBD = new Date("04/22/2004"); // Đinh Quang Đức birthday: 22/04/2004
      const currentDate = new Date();
      let hours = currentDate.getHours();
      let mins = currentDate.getMinutes();
      let sec = currentDate.getSeconds();

      const myDay = myBD.getDate();
      let myMonth = myBD.getMonth() + 1;
      let myYear = myBD.getFullYear();

      const currentDay = currentDate.getDate();
      let currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      let diffDay = getAmoDate(myDay, myMonth, myYear) + currentDay;

      let diffMonth = 0;
      if (++myMonth <= 12) diffMonth += 12 - myMonth + 1;
      if (--currentMonth >= 1) diffMonth += currentMonth;
      
      let diffYear = 0;
      while (++myYear <= currentYear - 1) diffYear++;

      diffMonth += diffDay / 31;
      diffDay %= 31;
      diffYear += diffMonth / 12;
      diffMonth %= 12;

      diffYear = Math.floor(diffYear);
      diffMonth = Math.floor(diffMonth);

      if (hours < 10) hours = "0" + hours;
      if (mins < 10) mins = "0" + mins;
      if (sec < 10) sec = "0" + sec;

      setAge({
        years: diffYear,
        months: diffMonth,
        days: diffDay,
        hours,
        minutes: mins,
        seconds: sec
      });
    }

    calculateAge();
    const interval = setInterval(calculateAge, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update Theme class on body
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Update Skin Color variable and Custom Cursor Color
  useEffect(() => {
    document.documentElement.style.setProperty('--skin-color', skinColor);
    document.body.style.setProperty('--color', skinColor);
  }, [skinColor]);

  // Scroll to active section link highlight & Update Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      const sections = ['home', 'about', 'testimonial', 'contact'];
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const height = el.offsetHeight;
          const top = el.offsetTop - 150;
          if (scrollY > top && scrollY <= top + height) {
            setActiveSection(id);
          }
        }
      });

      // Progress bar logic
      let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      let scrolled = (winScroll / height) * 100;
      const pb = document.getElementById("progressBar");
      if (pb) pb.style.width = scrolled + "%";
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom Cursor Script Implementation
  useEffect(() => {
    const getMousePosition = (e) => {
      return { x: e.clientX, y: e.clientY };
    };

    let mousePosition = { x: 0, y: 0 };
    const body = document.querySelector('body');
    const cursorWrapper = document.createElement('div');
    const cursorEl1 = document.createElement('div');
    const cursorEl2 = document.createElement('div');

    cursorWrapper.classList.add('cursor');
    cursorEl1.classList.add('cursor-el1');
    cursorEl2.classList.add('cursor-el2');
    cursorWrapper.appendChild(cursorEl1);
    cursorWrapper.appendChild(cursorEl2);
    body.appendChild(cursorWrapper);

    const handleMouseMove = (ev) => {
      mousePosition = getMousePosition(ev);
    };
    body.addEventListener('mousemove', handleMouseMove);

    let animFrameId;
    const renderCursor = () => {
      cursorEl1.style.transform = `translate(${mousePosition.x}px, ${mousePosition.y}px)`;
      cursorEl2.style.transform = `translate(${mousePosition.x}px, ${mousePosition.y}px)`;
      animFrameId = requestAnimationFrame(renderCursor);
    };
    animFrameId = requestAnimationFrame(renderCursor);

    const cursorConfig = {
      cursor_shape: "15",
      hover_effect: "plugin",
      color: skinColor,
      width: 30,
      blending_mode: "normal",
      default_cursor: "auto"
    };

    const shapeClass = "cursor-" + cursorConfig.cursor_shape;
    cursorWrapper.classList.add(cursorConfig.hover_effect);
    cursorWrapper.classList.add(shapeClass);

    body.style.setProperty('--cursor-width', cursorConfig.width + "px");
    body.style.setProperty('--color', skinColor);
    body.style.setProperty('--blending-mode', cursorConfig.blending_mode);
    body.style.setProperty('--default-cursor', cursorConfig.default_cursor);

    const handleLinkEnter = () => cursorWrapper.classList.add('link-hover');
    const handleLinkLeave = () => cursorWrapper.classList.remove('link-hover');
    const handleInputEnter = () => cursorWrapper.classList.add('input-hover');
    const handleInputLeave = () => cursorWrapper.classList.remove('input-hover');

    const setupEventListeners = () => {
      const links = document.querySelectorAll('a, button, .tab-item, .style-switcher-toggler, .day-night, .colors span, .custom-notification .btn-1');
      const inputs = document.querySelectorAll('input, textarea');

      links.forEach(link => {
        link.addEventListener('mouseenter', handleLinkEnter);
        link.addEventListener('mouseleave', handleLinkLeave);
      });

      inputs.forEach(input => {
        input.addEventListener('mouseenter', handleInputEnter);
        input.addEventListener('mouseleave', handleInputLeave);
      });
    };

    setupEventListeners();
    const observer = new MutationObserver(setupEventListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      body.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrameId);
      if (body.contains(cursorWrapper)) {
        body.removeChild(cursorWrapper);
      }
      observer.disconnect();
    };
  }, [skinColor]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const toggleMusic = () => {
    const audio = document.getElementById('myAudio');
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleLinkClick = (e, hash) => {
    e.preventDefault();
    setMenuOpen(false);
    setFadeActive(true);
    setTimeout(() => {
      setFadeActive(false);
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      window.location.hash = hash;
    }, 300);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Sanitize input to filter out HTML tags (XSS protection)
    const sanitize = (text) => text.replace(/<[^>]*>?/gm, '');
    const name = sanitize(e.target.elements[0].value);
    const email = sanitize(e.target.elements[1].value);
    const subject = sanitize(e.target.elements[2].value);
    const message = sanitize(e.target.elements[3].value);

    const mailtoUrl = `mailto:dqduc2204@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Chào bạn,\n\nTên người gửi: ${name}\nEmail liên hệ: ${email}\n\nNội dung thư:\n${message}`)}`;
    
    window.location.href = mailtoUrl;
    e.target.reset();
  };

  // Testimonial Quotes
  const quotes = [
    { text: "After a day! We've learned something new? Or become a copy of yesterday?", author: "Đinh Quang Đức" },
    { text: "Code documentation is a love-letter to your future self", author: "Đinh Quang Đức" },
    { text: "Vision without execution is hallucination", author: "Đinh Quang Đức" }
  ];

  return (
    <>
      {/* Preloader start */}
      <div id="loader-wrapper">
        <div id="loader"></div>
        <div id="loader_logo"></div>
        <div className="loader-section section-left"></div>
        <div className="loader-section section-right"></div>
      </div>

      {/* Progress bar start */}
      <div className="progress">
        <div className="progress-container">
          <div className="progress-bar" id="progressBar"></div>
        </div>
      </div>

      {/* Background Particles container */}
      <div id="particles-js"></div>

      {/* Header start */}
      <header className="header">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="logo">
              <a href="index.html" className="day-night-logo">
                <img src={theme === 'light' ? "/logo.svg" : "/logo-dark.svg"} alt="logo" />
              </a>
            </div>
            <div onClick={() => setMenuOpen(true)} className="hamburger-btn outer-shadow hover-in-shadow">
              <span></span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation menu start */}
      <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        <div onClick={() => setMenuOpen(false)} className="close-nav-menu outer-shadow hover-in-shadow">&times;</div>
        <div className="nav-menu-inner">
          <ul>
            <li>
              <a href="#home" onClick={(e) => handleLinkClick(e, '#home')} className={`link-item ${activeSection === 'home' ? 'inner-shadow active' : 'outer-shadow'} hover-in-shadow`}>Home</a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleLinkClick(e, '#about')} className={`link-item ${activeSection === 'about' ? 'inner-shadow active' : 'outer-shadow'} hover-in-shadow`}>About Me</a>
            </li>
            <li>
              <a href="#testimonial" onClick={(e) => handleLinkClick(e, '#testimonial')} className={`link-item ${activeSection === 'testimonial' ? 'inner-shadow active' : 'outer-shadow'} hover-in-shadow`}>Testimonial</a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')} className={`link-item ${activeSection === 'contact' ? 'inner-shadow active' : 'outer-shadow'} hover-in-shadow`}>Contact</a>
            </li>
          </ul>
        </div>
        <p className="copyright-text">Contact Copyright &copy; 2026 <a href="#home" className="copyright">Đinh Quang Đức</a></p>
      </nav>

      {/* Fade out effect overlay */}
      <div className={`fade-out-effect ${fadeActive ? 'active' : ''}`}></div>

      {/* Homepage section start */}
      <section className="home-section section active" id="home">
        {/* Effect wrap start */}
        <div className="effect-wrap">
          <div className="effect effect-1"></div>
          <div className="effect effect-2">
            {[...Array(28)].map((_, i) => <div key={i}></div>)}
          </div>
          <div className="effect effect-3"></div>
          <div className="effect effect-4"></div>
          <div className="effect effect-5">
            {[...Array(10)].map((_, i) => <div key={i}></div>)}
          </div>
          <div className="effect effect-6"></div>
          <div className="effect effect-7"></div>
        </div>

        <div className="container">
          <div className="row full-screen align-items-center">
            <div className="home-text col l-6 ml-6 m-6 sm-12 s-12">
              <p>Hello, guys</p>
              <h2>I'm <span className="typing" id="color" style={{ color: 'var(--skin-color)' }}>
                <TypeAnimation
                  sequence={['Đinh Quang Đức', 2000, '', 500]}
                  wrapper="span"
                  cursor={true}
                  repeat={Infinity}
                />
              </span></h2>
              <h1>Infomation Technology</h1>
              <a href="#about" onClick={(e) => handleLinkClick(e, '#about')} className="link-item btn-1 outer-shadow hover-in-shadow">More About Me</a>
            </div>
            <div className="home-img col l-6 ml-6 m-6 sm-12 s-12">
              <div className="img-box inner-shadow">
                <img src="https://duogbachdev.vercel.app/img/profile-img/code.gif" className="outer-shadow" alt="profile-avt" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About section start */}
      <section className="about-section section" id="about">
        <div className="effect-wrap">
          <div className="effect effect-1"></div>
          <div className="effect effect-2">
            {[...Array(28)].map((_, i) => <div key={i}></div>)}
          </div>
          <div className="effect effect-4"></div>
          <div className="effect effect-5">
            {[...Array(10)].map((_, i) => <div key={i}></div>)}
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="section-title col l-12 ml-12 m-12 sm-12 s-12">
              <h2 data-heading="main info">About Me</h2>
            </div>
          </div>
          <div className="row">
            <div className="about-img col l-5 ml-5 m-5 sm-10 s-10">
              <div className="img-box inner-shadow">
                <img src="/avatar.png" className="outer-shadow" alt="profile-avt" />
              </div>
              <div className="social-links">
                <a href="https://www.facebook.com/cenlove.2204" className="outer-shadow hover-in-shadow" target="_blank" title="facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="mailto:dqduc2204@gmail.com" className="outer-shadow hover-in-shadow"><i className="fab fa-google" title="gmail"></i></a>
              </div>
            </div>
            
            <div className="about-info col l-7 ml-7 m-7 sm-12 s-12">
              <div>
                <p>Full name: </p>
                <p className="typing-name" style={{ color: 'var(--skin-color)' }}>
                  <TypeAnimation
                    sequence={['Đinh Quang Đức', 2000, '', 500]}
                    wrapper="span"
                    cursor={true}
                    repeat={Infinity}
                  />
                </p>
              </div>
              <div>
                <p>Date of birth: </p>
                <p>22/04/2004</p>
              </div>
              <div>
                <p>Age: </p>
                <p>
                  <span id="years" style={{ color: '#ed4747', fontWeight: 'bold' }}>{age.years}</span><span className="paddingAge">years</span>
                  <span id="months" style={{ color: '#ed4747', fontWeight: 'bold' }}>{age.months}</span><span className="paddingAge">months</span>
                  <span id="days" style={{ color: '#ed4747', fontWeight: 'bold' }}>{age.days}</span><span className="paddingAge">days</span>
                  <span id="hours" style={{ color: '#0099ff', fontWeight: 'bold' }}>{age.hours}</span><span>h</span>
                  <span id="minutes" style={{ color: '#0099ff', fontWeight: 'bold' }}>{age.minutes}</span><span>m</span>
                  <span id="seconds" style={{ color: '#0099ff', fontWeight: 'bold' }}>{age.seconds}</span><span>s</span>
                </p>
              </div>
              <div>
                <p>Zodiac: </p>
                <p>Taurus</p>
              </div>
              <div>
                <p>Studying at: </p>
                <p>University of Transport Technology (UTT)</p>
              </div>
              <div>
                <p>Major: </p>
                <p>Information Systems (IT)</p>
              </div>
              <div>
                <p>Class: </p>
                <p>73DCHT23 (K73)</p>
              </div>
              <div>
                <p>In relationship: </p>
                <p>Single</p>
              </div>
              <div>
                <p>Hobby: </p>
                <p>Listen to music, watch films - youtube, game.</p>
              </div>
              <div>
                <p>Email: </p>
                <p style={{ wordBreak: 'break-all' }}>dqduc2204@gmail.com</p>
              </div>
              <div>
                <p>Living at: </p>
                <p>Bac Giang Province</p>
              </div>
              <div>
                <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')} className="link-item btn-1 outer-shadow hover-in-shadow">Hire Me</a>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="about-tabs col l-12 ml-12 m-12 sm-12 s-12">
              <span onClick={() => setActiveTab('skills')} className={`tab-item ${activeTab === 'skills' ? 'active outer-shadow' : 'hover-in-shadow'}`}>Skills</span>
              <span onClick={() => setActiveTab('education')} className={`tab-item ${activeTab === 'education' ? 'active outer-shadow' : 'hover-in-shadow'}`}>Education</span>
            </div>
          </div>

          <div className="row">
            <div className={`skills tab-content ${activeTab === 'skills' ? 'active' : ''} col l-12 ml-12 m-12 sm-12 s-12`}>
              <div className="row justify-content-center">
                <div className="skill-item">
                  <div>
                    <p>Language:</p>
                    <p>
                      <span className="outer-shadow hover-in-shadow">C</span>
                      <span className="outer-shadow hover-in-shadow">C#</span>
                      <span className="outer-shadow hover-in-shadow">C++</span>
                      <span className="outer-shadow hover-in-shadow">Java</span>
                    </p>
                  </div>
                  <div>
                    <p>Database:</p>
                    <p>
                      <span className="outer-shadow hover-in-shadow">MySQL</span>
                      <span className="outer-shadow hover-in-shadow">SQL Server</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className={`education tab-content ${activeTab === 'education' ? 'active' : ''}`}>
              <div className="row">
                <div className="timeline col l-12 ml-12 m-12 sm-12 s-12">
                  <div className="row">
                    <div className="timeline-item col l-12 ml-12 m-12 sm-12 s-12">
                      <div className="timeline-item-inner outer-shadow">
                        <i className="fas fa-graduation-cap icon"></i>
                        <span>2022 - 2026</span>
                        <h3>Information Systems</h3>
                        <h4>University of Transport Technology</h4>
                      </div>
                    </div>
                    <div className="timeline-item col l-12 ml-12 m-12 sm-12 s-12">
                      <div className="timeline-item-inner outer-shadow">
                        <i className="fas fa-graduation-cap icon"></i>
                        <span>2019 - 2022</span>
                        <h3>Student</h3>
                        <h4>Hiệp Hòa số 3 High school</h4>
                      </div>
                    </div>
                    <div className="timeline-item col l-12 ml-12 m-12 sm-12 s-12">
                      <div className="timeline-item-inner outer-shadow">
                        <i className="fas fa-graduation-cap icon"></i>
                        <span>2015 - 2019</span>
                        <h3>Student</h3>
                        <h4>Thường Thắng Secondary school</h4>
                      </div>
                    </div>
                    <div className="timeline-item col l-12 ml-12 m-12 sm-12 s-12">
                      <div className="timeline-item-inner outer-shadow">
                        <i className="fas fa-graduation-cap icon"></i>
                        <span>2010 - 2015</span>
                        <h3>Student</h3>
                        <h4>Thường Thắng Primary school</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial section start */}
      <section className="testimonial-section section" id="testimonial">
        <div className="container">
          <div className="row">
            <div className="section-title col l-12 ml-12 m-12 sm-12 s-12">
              <h2 data-heading="Testimonial">📑 My Favorites Quote 📑</h2>
            </div>
          </div>
          <div className="row">
            <div className="testi-box">
              <div className="testi-slider outer-shadow">
                <div className="testi-slider-container" style={{ marginLeft: `-${currentSlide * 100}%` }}>
                  {quotes.map((quote, idx) => (
                    <div key={idx} className="testi-item">
                      <i className="fas fa-quote-left left"></i>
                      <i className="fas fa-quote-right right"></i>
                      <p>"{quote.text}"</p>
                      <img src="/avatar.png" alt="testimonial" />
                      <span>{quote.author}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="testi-slider-nav">
                <span onClick={() => setCurrentSlide(currentSlide === 0 ? quotes.length - 1 : currentSlide - 1)} className="prev outer-shadow hover-in-shadow"><i className="fas fa-angle-left"></i></span>
                <span onClick={() => setCurrentSlide(currentSlide === quotes.length - 1 ? 0 : currentSlide + 1)} className="next outer-shadow hover-in-shadow"><i className="fas fa-angle-right"></i></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact section start */}
      <section className="contact-section section" id="contact">
        <div className="container">
          <div className="row">
            <div className="section-title col l-12 ml-12 m-12 sm-12 s-12">
              <h2 data-heading="contact">Get In Touch</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <a href="mailto:dqduc2204@gmail.com" className="contact-item col l-6 ml-6 m-6 sm-12 s-12">
              <div className="contact-item-inner outer-shadow hover-in-shadow">
                <i className="fas fa-envelope"></i>
                <span>Email</span>
                <p>dqduc2204@gmail.com</p>
              </div>
            </a>
            <a href="https://www.facebook.com/cenlove.2204" className="contact-item col l-6 ml-6 m-6 sm-12 s-12" target="_blank">
              <div className="contact-item-inner outer-shadow hover-in-shadow">
                <i className="fab fa-facebook"></i>
                <span>Facebook</span>
                <p>Đinh Quang Đức</p>
              </div>
            </a>
          </div>
          <div className="row">
            <div className="contact-form col l-12 ml-12 m-12 sm-12 s-12">
              <form onSubmit={handleFormSubmit}>
                <div className="row">
                  <div className="col l-6 ml-6 m-12 sm-12 s-12">
                    <div className="input-group outer-shadow hover-in-shadow">
                      <input type="text" placeholder="Name" className="input-control" required />
                    </div>
                    <div className="input-group outer-shadow hover-in-shadow">
                      <input type="text" placeholder="Email" className="input-control" required />
                    </div>
                    <div className="input-group outer-shadow hover-in-shadow">
                      <input type="text" placeholder="Subject" className="input-control" required />
                    </div>
                  </div>
                  <div className="col l-6 ml-6 m-12 sm-12 s-12">
                    <div className="input-group outer-shadow hover-in-shadow">
                      <textarea cols="30" rows="10" className="input-control" placeholder="Message"></textarea>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="submit-btn col l-12 ml-12 m-12 sm-12 s-12">
                    <button type="submit" className="btn-1 outer-shadow hover-in-shadow">Send Message</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer start */}
      <footer className="footer">
        <p>Contact Copyright &copy; 2026 Đinh Quang Đức</p>
      </footer>

      {/* Switch light-dark mode start */}
      <div className={`style-switcher outer-shadow ${switcherOpen ? 'open' : ''}`}>
        <div onClick={() => setSwitcherOpen(!switcherOpen)} className="style-switcher-toggler s-icon outer-shadow hover-in-shadow">
          <i className="fas fa-cog fa-spin"></i>
        </div>
        <div onClick={toggleTheme} className="day-night s-icon outer-shadow hover-in-shadow">
          <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
        </div>

        <h4>Theme Colors</h4>
        <div className="colors">
          <span className="color-1" onClick={() => setSkinColor('#fd456f')}></span>
          <span className="color-2" onClick={() => setSkinColor('#ec9142')}></span>
          <span className="color-3" onClick={() => setSkinColor('#0bd53e')}></span>
          <span className="color-4" onClick={() => setSkinColor('#2eb1ed')}></span>
          <span className="color-5" onClick={() => setSkinColor('#ff5f36')}></span>
        </div>
      </div>

      {/* Audio start */}
      <audio id="myAudio" src="/music.mp3" loop type="audio/mp3"></audio>
      <div onClick={toggleMusic} className={`music outer-shadow hover-in-shadow ${isPlaying ? '' : 'pause'}`} title="Ed Sheeran - Photograph">
        <i className="fas fa-music"></i>
      </div>

      {/* Custom Popup Notification */}
      {showNotification && (
        <div className="custom-notification-overlay">
          <div className="custom-notification outer-shadow">
            <i className="fas fa-music" style={{ color: 'var(--skin-color)', fontSize: '28px', marginBottom: '10px' }}></i>
            <p>Nhớ bật nhạc ở góc phải để chill nha 💕 Cen 💕</p>
            <button onClick={() => setShowNotification(false)} className="btn-1 outer-shadow hover-in-shadow">Ok luôn</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
