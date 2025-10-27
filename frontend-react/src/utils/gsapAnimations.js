// ========================================
// src/utils/gsapAnimations.js
// ========================================
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initializeGSAP = () => {
  // Stats Counter Animation
  gsap.utils.toArray('.counter-number').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    
    gsap.fromTo(counter, {
      innerText: 0
    }, {
      innerText: target,
      duration: 2,
      ease: "power2.out",
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: counter,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      onUpdate: function() {
        counter.innerText = Math.ceil(counter.innerText);
      }
    });
  });

  // Fade in animations
  gsap.utils.toArray('.gsap-fade').forEach(element => {
    gsap.fromTo(element, {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // Slide left animations
  gsap.utils.toArray('.gsap-slide-left').forEach(element => {
    gsap.fromTo(element, {
      opacity: 0,
      x: -100
    }, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // Slide right animations
  gsap.utils.toArray('.gsap-slide-right').forEach(element => {
    gsap.fromTo(element, {
      opacity: 0,
      x: 100
    }, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // Scale animations
  gsap.utils.toArray('.gsap-scale').forEach(element => {
    gsap.fromTo(element, {
      opacity: 0,
      scale: 0.8
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // Stagger animations for service cards
  gsap.fromTo('.services-grid .gsap-scale', {
    opacity: 0,
    y: 50,
    scale: 0.8
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    stagger: 0.2,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: '.services-grid',
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });

  // About features stagger
  gsap.fromTo('.about-features > *', {
    opacity: 0,
    x: -30
  }, {
    opacity: 1,
    x: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: '.about-features',
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });

  // Progress bar animation for about section
  gsap.fromTo('.about-line', {
    width: '0%'
  }, {
    width: '6rem',
    duration: 1.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: '.about-line',
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });

  // Floating particles enhanced animation
  gsap.utils.toArray('.animate-float').forEach((particle, index) => {
    gsap.to(particle, {
      y: "random(-20, 20)",
      x: "random(-10, 10)",
      duration: "random(3, 6)",
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: index * 0.5
    });
  });

  // Parallax effect for hero section
  gsap.to('#home', {
    backgroundPosition: "50% 100%",
    ease: "none",
    scrollTrigger: {
      trigger: '#home',
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });

  // Smooth scroll reveal for footer elements
  gsap.utils.toArray('footer .gsap-fade').forEach((element, index) => {
    gsap.fromTo(element, {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: index * 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // Text reveal animation for headings
  gsap.utils.toArray('h2, h3').forEach(heading => {
    gsap.fromTo(heading, {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: heading,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });
};

// Animation presets (optional - if you need them elsewhere)
export const animationPresets = {
  fade: {
    opacity: 0
  },
  slideLeft: {
    opacity: 0,
    x: -100
  },
  slideRight: {
    opacity: 0,
    x: 100
  },
  slideUp: {
    opacity: 0,
    y: 50
  },
  slideDown: {
    opacity: 0,
    y: -50
  },
  scale: {
    opacity: 0,
    scale: 0.8
  }
};