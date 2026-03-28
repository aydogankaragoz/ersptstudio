// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking on a link
    mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            mobileMenu.classList.add('hidden');
        }
    });
}

// Smooth Scrolling with event delegation and URL update
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            // Update URL without page jump
            history.pushState(null, null, targetId);

            // Update active state in navigation
            updateActiveNavLink(targetId);
        }
    }
});

// Scroll to section if URL has hash on page load
window.addEventListener('load', function() {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(function() {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                updateActiveNavLink(window.location.hash);
            }, 100);
        }
    }
});

// Update active navigation link
function updateActiveNavLink(hash) {
    // Remove active class from all links
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.classList.remove('active-section');
    });

    // Add active class to current link
    document.querySelectorAll(`nav a[href="${hash}"]`).forEach(link => {
        link.classList.add('active-section');
    });
}

// Update active link on scroll
let scrollTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = '#' + section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                history.replaceState(null, null, sectionId);
                updateActiveNavLink(sectionId);
            }
        });
    }, 100);
});

// Google Analytics Event Tracking
if (typeof gtag !== 'undefined') {
    // WhatsApp CTA tracking
    document.querySelectorAll('[data-ga-event="whatsapp-cta"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const location = this.getAttribute('data-ga-location') || 'unknown';
            gtag('event', 'click_whatsapp', {
                event_category: 'engagement',
                event_label: location,
                value: 1
            });
        });
    });

    // Instagram CTA tracking
    document.querySelectorAll('[data-ga-event="instagram-cta"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const location = this.getAttribute('data-ga-location') || 'unknown';
            gtag('event', 'click_instagram', {
                event_category: 'engagement',
                event_label: location,
                value: 1
            });
        });
    });

    // Package CTA tracking
    document.querySelectorAll('[data-ga-event="package-cta"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const packageType = this.getAttribute('data-ga-package') || 'unknown';
            gtag('event', 'click_package', {
                event_category: 'conversion',
                event_label: packageType,
                value: 1
            });
        });
    });

    // Schedule CTA tracking
    document.querySelectorAll('[data-ga-event="schedule-cta"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const location = this.getAttribute('data-ga-location') || 'unknown';
            gtag('event', 'click_schedule', {
                event_category: 'conversion',
                event_label: location,
                value: 1
            });
        });
    });

    // Google Reviews tracking
    document.querySelectorAll('[data-ga-event="google-reviews"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const location = this.getAttribute('data-ga-location') || 'unknown';
            gtag('event', 'click_google_reviews', {
                event_category: 'engagement',
                event_label: location,
                value: 1
            });
        });
    });

    // Calculator WhatsApp CTA tracking
    document.querySelectorAll('[data-ga-event="calculator-whatsapp-cta"]').forEach(btn => {
        btn.addEventListener('click', function() {
            gtag('event', 'calculator_whatsapp_cta', {
                event_category: 'conversion',
                event_label: 'post_calculation',
                value: 1
            });
        });
    });
}

// Scroll Animations with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

// Track when calculator section comes into view
const calculatorSection = document.getElementById('calculator');
if (calculatorSection && typeof gtag !== 'undefined') {
    const calculatorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gtag('event', 'calculator_section_view', {
                    event_category: 'calculator',
                    event_label: 'section_in_viewport',
                    value: 1
                });
                calculatorObserver.unobserve(entry.target); // Track only once per page load
            }
        });
    }, { threshold: 0.3 });

    calculatorObserver.observe(calculatorSection);
}

// Use requestIdleCallback for non-critical animations
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        document.querySelectorAll('section > div').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    });
} else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(() => {
        document.querySelectorAll('section > div').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    }, 0);
}

// Body Fat Calculator
let selectedGender = null;
let calculationResults = null; // Store results for WhatsApp message

function selectGender(gender) {
    selectedGender = gender;
    const maleBtn = document.getElementById('maleBtn');
    const femaleBtn = document.getElementById('femaleBtn');
    const hipContainer = document.getElementById('hipContainer');
    const hipInput = document.getElementById('hip');

    // Reset both buttons
    maleBtn.classList.remove('bg-indigo-50', 'border-indigo-500', 'shadow-lg');
    femaleBtn.classList.remove('bg-pink-50', 'border-pink-500', 'shadow-lg');

    if (gender === 'male') {
        maleBtn.classList.add('bg-indigo-50', 'border-indigo-500', 'shadow-lg');
        hipContainer.style.display = 'none';
        hipInput.removeAttribute('required');
    } else {
        femaleBtn.classList.add('bg-pink-50', 'border-pink-500', 'shadow-lg');
        hipContainer.style.display = 'block';
        hipInput.setAttribute('required', 'required');
    }

    // Track gender selection
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculator_gender_select', {
            event_category: 'calculator',
            event_label: gender,
            value: 1
        });
    }
}

// Make selectGender available globally
window.selectGender = selectGender;

// Body Fat Form Submission
const bodyFatForm = document.getElementById('bodyFatForm');
if (bodyFatForm) {
    // Track when user starts filling the form (focus on first input)
    let formStartTracked = false;
    bodyFatForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function() {
            if (!formStartTracked && typeof gtag !== 'undefined') {
                gtag('event', 'calculator_form_start', {
                    event_category: 'calculator',
                    event_label: 'user_started_filling',
                    value: 1
                });
                formStartTracked = true;
            }
        });
    });

    bodyFatForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!selectedGender) {
            alert('Lütfen cinsiyetinizi seçin');

            // Track incomplete submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'calculator_incomplete', {
                    event_category: 'calculator',
                    event_label: 'missing_gender',
                    value: 0
                });
            }
            return;
        }

        // Get form values
        const age = parseFloat(document.getElementById('age').value);
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const neck = parseFloat(document.getElementById('neck').value);
        const waist = parseFloat(document.getElementById('waist').value);
        const hip = selectedGender === 'female' ? parseFloat(document.getElementById('hip').value) : 0;

        // Calculate body fat percentage using US Navy formula
        let bodyFatPercentage;

        if (selectedGender === 'male') {
            // Male formula
            bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
        } else {
            // Female formula
            bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
        }

        // Calculate BMI
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);

        // Calculate fat mass and lean mass
        const fatMass = (bodyFatPercentage / 100) * weight;
        const leanMass = weight - fatMass;

        // Calculate ideal weight range (using BMI 18.5-24.9)
        const idealWeightMin = 18.5 * heightInMeters * heightInMeters;
        const idealWeightMax = 24.9 * heightInMeters * heightInMeters;

        // Store results globally
        calculationResults = {
            gender: selectedGender === 'male' ? 'Erkek' : 'Kadın',
            age: age,
            height: height,
            weight: weight,
            bodyFatPercentage: bodyFatPercentage,
            bmi: bmi,
            fatMass: fatMass,
            leanMass: leanMass,
            idealWeightMin: idealWeightMin,
            idealWeightMax: idealWeightMax
        };

        // Display results
        displayResults(bodyFatPercentage, bmi, fatMass, leanMass, idealWeightMin, idealWeightMax, selectedGender, age);

        // Update WhatsApp CTA with calculation results
        updateWhatsAppCTA();

        // Track calculator usage with detailed data
        if (typeof gtag !== 'undefined') {
            // Main calculation event with full user data
            gtag('event', 'calculate_body_fat', {
                event_category: 'calculator',
                event_label: selectedGender,
                value: Math.round(bodyFatPercentage),
                // Detailed measurement data
                user_gender: selectedGender,
                user_age: age,
                user_height: height,
                user_weight: weight,
                user_neck: neck,
                user_waist: waist,
                user_hip: hip || 0,
                // Calculated results
                result_bodyfat: bodyFatPercentage.toFixed(1),
                result_bmi: bmi.toFixed(1),
                result_fat_mass: fatMass.toFixed(1),
                result_lean_mass: leanMass.toFixed(1),
                result_ideal_min: idealWeightMin.toFixed(1),
                result_ideal_max: idealWeightMax.toFixed(1),
                // Timestamp
                calculation_date: new Date().toISOString()
            });

            // Track BMI category
            let bmiCategory;
            if (bmi < 18.5) bmiCategory = 'underweight';
            else if (bmi <= 24.9) bmiCategory = 'normal';
            else if (bmi <= 29.9) bmiCategory = 'overweight';
            else bmiCategory = 'obese';

            gtag('event', 'calculator_bmi_category', {
                event_category: 'calculator',
                event_label: bmiCategory,
                value: Math.round(bmi),
                bmi_value: bmi.toFixed(1),
                gender: selectedGender,
                age: age
            });

            // Track body fat category
            let bfCategory;
            if (selectedGender === 'male') {
                if (bodyFatPercentage < 6) bfCategory = 'very_low';
                else if (bodyFatPercentage <= 13) bfCategory = 'athletic';
                else if (bodyFatPercentage <= 17) bfCategory = 'ideal';
                else if (bodyFatPercentage <= 24) bfCategory = 'average';
                else bfCategory = 'high';
            } else {
                if (bodyFatPercentage < 14) bfCategory = 'very_low';
                else if (bodyFatPercentage <= 20) bfCategory = 'athletic';
                else if (bodyFatPercentage <= 24) bfCategory = 'ideal';
                else if (bodyFatPercentage <= 31) bfCategory = 'average';
                else bfCategory = 'high';
            }

            gtag('event', 'calculator_bodyfat_category', {
                event_category: 'calculator',
                event_label: `${selectedGender}_${bfCategory}`,
                value: Math.round(bodyFatPercentage),
                bodyfat_percentage: bodyFatPercentage.toFixed(1),
                category: bfCategory,
                gender: selectedGender
            });

            // Track age group
            let ageGroup;
            if (age < 25) ageGroup = '18-24';
            else if (age < 35) ageGroup = '25-34';
            else if (age < 45) ageGroup = '35-44';
            else if (age < 55) ageGroup = '45-54';
            else ageGroup = '55+';

            gtag('event', 'calculator_age_group', {
                event_category: 'calculator',
                event_label: ageGroup,
                value: 1,
                exact_age: age,
                gender: selectedGender
            });
        }

        // Smooth scroll to results
        document.getElementById('resultsContainer').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    });
}

function displayResults(bodyFatPercentage, bmi, fatMass, leanMass, idealWeightMin, idealWeightMax, gender, age) {
    // Show results container, hide info card
    document.getElementById('resultsContainer').style.display = 'block';
    document.getElementById('infoCard').style.display = 'none';

    // Display body fat percentage
    document.getElementById('bodyFatPercentage').textContent = bodyFatPercentage.toFixed(1) + '%';

    // Update body fat bar
    const bodyFatBar = document.getElementById('bodyFatBar');
    const percentage = Math.min(bodyFatPercentage, 50); // Cap at 50% for display
    bodyFatBar.style.width = percentage + '%';

    // Set bar color based on category
    let barColor, category;
    if (gender === 'male') {
        if (bodyFatPercentage < 6) {
            barColor = 'bg-red-500';
            category = '⚠️ Çok Düşük (Sağlıksız)';
        } else if (bodyFatPercentage <= 13) {
            barColor = 'bg-blue-500';
            category = '💪 Atletik';
        } else if (bodyFatPercentage <= 17) {
            barColor = 'bg-green-500';
            category = '✅ İdeal';
        } else if (bodyFatPercentage <= 24) {
            barColor = 'bg-yellow-500';
            category = '📊 Ortalama';
        } else {
            barColor = 'bg-orange-500';
            category = '⚠️ Yüksek';
        }
    } else {
        if (bodyFatPercentage < 14) {
            barColor = 'bg-red-500';
            category = '⚠️ Çok Düşük (Sağlıksız)';
        } else if (bodyFatPercentage <= 20) {
            barColor = 'bg-blue-500';
            category = '💪 Atletik';
        } else if (bodyFatPercentage <= 24) {
            barColor = 'bg-green-500';
            category = '✅ İdeal';
        } else if (bodyFatPercentage <= 31) {
            barColor = 'bg-yellow-500';
            category = '📊 Ortalama';
        } else {
            barColor = 'bg-orange-500';
            category = '⚠️ Yüksek';
        }
    }

    bodyFatBar.className = 'h-4 rounded-full transition-all duration-1000 ' + barColor;
    document.getElementById('bodyFatCategory').textContent = category;

    // Display BMI
    document.getElementById('bmiValue').textContent = bmi.toFixed(1);

    let bmiCategory;
    if (bmi < 18.5) {
        bmiCategory = '⚠️ Zayıf';
    } else if (bmi <= 24.9) {
        bmiCategory = '✅ Normal';
    } else if (bmi <= 29.9) {
        bmiCategory = '📊 Fazla Kilolu';
    } else {
        bmiCategory = '⚠️ Obez';
    }
    document.getElementById('bmiCategory').textContent = bmiCategory;

    // Display masses
    document.getElementById('fatMass').textContent = fatMass.toFixed(1) + ' kg';
    document.getElementById('leanMass').textContent = leanMass.toFixed(1) + ' kg';

    // Display ideal weight
    document.getElementById('idealWeight').textContent =
        idealWeightMin.toFixed(1) + ' - ' + idealWeightMax.toFixed(1) + ' kg';

    // Generate recommendations
    const recommendations = generateRecommendations(bodyFatPercentage, bmi, gender, age);
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-2';
        li.innerHTML = '<i class="fas fa-check-circle text-green-500 mt-1"></i><span>' + rec + '</span>';
        recommendationsList.appendChild(li);
    });
}

function generateRecommendations(bodyFatPercentage, bmi, gender, age) {
    const recommendations = [];

    const isHighBodyFat = (gender === 'male' && bodyFatPercentage > 24) ||
                          (gender === 'female' && bodyFatPercentage > 31);
    const isLowBodyFat = (gender === 'male' && bodyFatPercentage < 6) ||
                         (gender === 'female' && bodyFatPercentage < 14);

    if (isHighBodyFat) {
        recommendations.push('Kardiyovasküler egzersizleri haftada 3-4 kez yapmaya özen gösterin');
        recommendations.push('Kalori açığı oluşturmak için beslenme programı düzenleyin');
        recommendations.push('Güç antrenmanları ile kas kütlenizi koruyun');
        recommendations.push('Günlük su tüketiminizi artırın (2-3 litre)');
    } else if (isLowBodyFat) {
        recommendations.push('Kalori artışı için profesyonel beslenme desteği alın');
        recommendations.push('Aşırı kardiyodan kaçının, güç antrenmanlarına odaklanın');
        recommendations.push('Düzenli sağlık kontrolleri yaptırın');
    } else {
        recommendations.push('Mevcut formunuzu korumak için düzenli egzersiz yapın');
        recommendations.push('Dengeli beslenme düzeninizi sürdürün');
        recommendations.push('Haftada 2-3 gün güç antrenmanı yapın');
        recommendations.push('Yeterli dinlenme ve uyku düzenine dikkat edin');
    }

    recommendations.push('Kişiselleştirilmiş program için profesyonel destek alın');

    return recommendations;
}

// Update WhatsApp CTA with calculation results
function updateWhatsAppCTA() {
    if (!calculationResults) return;

    const results = calculationResults;

    // Determine body fat category
    let bfCategory;
    if (results.gender === 'Erkek') {
        if (results.bodyFatPercentage < 6) bfCategory = 'Çok Düşük';
        else if (results.bodyFatPercentage <= 13) bfCategory = 'Atletik';
        else if (results.bodyFatPercentage <= 17) bfCategory = 'İdeal';
        else if (results.bodyFatPercentage <= 24) bfCategory = 'Ortalama';
        else bfCategory = 'Yüksek';
    } else {
        if (results.bodyFatPercentage < 14) bfCategory = 'Çok Düşük';
        else if (results.bodyFatPercentage <= 20) bfCategory = 'Atletik';
        else if (results.bodyFatPercentage <= 24) bfCategory = 'İdeal';
        else if (results.bodyFatPercentage <= 31) bfCategory = 'Ortalama';
        else bfCategory = 'Yüksek';
    }

    // Determine BMI category
    let bmiCategory;
    if (results.bmi < 18.5) bmiCategory = 'Zayıf';
    else if (results.bmi <= 24.9) bmiCategory = 'Normal';
    else if (results.bmi <= 29.9) bmiCategory = 'Fazla Kilolu';
    else bmiCategory = 'Obez';

    // Create personalized WhatsApp message
    const message = `Merhaba! Vücut yağ oranı hesaplama yaptım ve sonuçlarım şöyle:

Cinsiyet: ${results.gender}
Yaş: ${results.age}
Boy: ${results.height} cm
Kilo: ${results.weight} kg

SONUÇLARIM:
- Vücut Yağ Oranı: %${results.bodyFatPercentage.toFixed(1)} (${bfCategory})
- BMI: ${results.bmi.toFixed(1)} (${bmiCategory})
- Yağ Kütlesi: ${results.fatMass.toFixed(1)} kg
- Yağsız Kütle: ${results.leanMass.toFixed(1)} kg
- İdeal Kilo Aralığım: ${results.idealWeightMin.toFixed(1)} - ${results.idealWeightMax.toFixed(1)} kg

Hedeflerime ulaşmak için kişisel antrenman programı ve beslenme desteği almak istiyorum. Detaylı bilgi alabilir miyim?`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Update WhatsApp CTA button
    const whatsappCTA = document.querySelector('[data-ga-event="calculator-whatsapp-cta"]');
    if (whatsappCTA) {
        whatsappCTA.href = `https://wa.me/905332470660?text=${encodedMessage}`;
    }
}

// Smooth Scroll to Top - handled by main click handler now
// Just ensure #home exists and works
document.querySelectorAll('.scroll-to-top').forEach(button => {
    // Anchor links will be handled by the main click handler above
    // This is just for any custom behavior if needed
});

// Show/Hide Floating Navigation based on scroll
let lastScrollTop = 0;
const floatingNav = document.querySelector('.fixed.bottom-8.right-8');

if (floatingNav) {
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Show after scrolling down 300px
        if (scrollTop > 300) {
            floatingNav.style.opacity = '1';
            floatingNav.style.pointerEvents = 'auto';
        } else {
            floatingNav.style.opacity = '0';
            floatingNav.style.pointerEvents = 'none';
        }

        lastScrollTop = scrollTop;
    });

    // Initially hide
    floatingNav.style.opacity = '0';
    floatingNav.style.pointerEvents = 'none';
    floatingNav.style.transition = 'opacity 0.3s ease';
}

// Service Modal Functions
const serviceContent = {
    functional: {
        icon: 'fa-running',
        gradient: 'from-indigo-500 to-purple-500',
        title: 'Functional Fitness',
        subtitle: 'Günlük Hayatınızı Kolaylaştıran Antrenman',
        description: 'Functional Fitness, günlük hayatta yaptığınız hareketleri daha kolay ve güvenli yapmanızı sağlayan özel bir antrenman yöntemidir.',
        benefits: [
            {
                icon: 'fa-home',
                title: 'Günlük Aktivitelerde Kolaylık',
                desc: 'Merdiven çıkma, eşya taşıma, yerden kalkma gibi günlük hareketlerinizi daha kolay yaparsınız'
            },
            {
                icon: 'fa-shield-alt',
                title: 'Sakatlık Riskini Azaltma',
                desc: 'Doğru hareket kalıplarını öğrenerek yaralanma riskini en aza indirirsiniz'
            },
            {
                icon: 'fa-balance-scale',
                title: 'Denge ve Koordinasyon',
                desc: 'Vücudunuzun farklı kaslarını birlikte çalıştırarak denge ve koordinasyonunuzu geliştirirsiniz'
            },
            {
                icon: 'fa-bolt',
                title: 'Enerji ve Canlılık',
                desc: 'Genel fitness seviyeniz artar, kendinizi daha enerjik ve canlı hissedersiniz'
            }
        ],
        forWhom: [
            'Günlük işlerini daha kolay yapmak isteyenler',
            'Spor geçmişi olmayanlar ve başlangıç seviyesindekiler',
            'Yaşlanan vücudunu aktif tutmak isteyenler',
            'Ofis çalışanları ve hareketsiz yaşayanlar'
        ],
        examples: [
            'Squat (Çömelme) - Otururken ve kalkarken',
            'Deadlift (Yerden kaldırma) - Eşya kaldırırken',
            'Lunge (Hamle) - Yürürken ve merdiven çıkarken',
            'Push/Pull (İtme/Çekme) - Kapı açarken, alışveriş torbaları taşırken'
        ]
    },
    strength: {
        icon: 'fa-dumbbell',
        gradient: 'from-purple-500 to-pink-500',
        title: 'Strength Training',
        subtitle: 'Kas ve Kuvvet Geliştirme Programı',
        description: 'Strength Training, kaslarınızı güçlendirerek fiziksel gücünüzü ve vücut kompozisyonunuzu geliştiren sistemli bir antrenman yöntemidir.',
        benefits: [
            {
                icon: 'fa-fire',
                title: 'Metabolizma Hızlanması',
                desc: 'Kas kütleniz arttıkça metabolizmanız hızlanır ve daha fazla kalori yakarırsınız'
            },
            {
                icon: 'fa-chart-line',
                title: 'Kas Gelişimi',
                desc: 'Hedef aldığınız kas gruplarında görünür büyüme ve tanımlama sağlarsınız'
            },
            {
                icon: 'fa-bone',
                title: 'Kemik Yoğunluğu',
                desc: 'Kemikleriniz güçlenir, osteoporoz riskini azaltırsınız'
            },
            {
                icon: 'fa-battery-full',
                title: 'Fiziksel Güç',
                desc: 'Günlük aktivitelerde daha güçlü hisseder, yorulmanız azalır'
            }
        ],
        forWhom: [
            'Kas kütlesi kazanmak isteyenler',
            'Vücut şekillendirme hedefi olanlar',
            'Fiziksel gücünü artırmak isteyenler',
            'Spor performansını geliştirmek isteyenler'
        ],
        examples: [
            'Bench Press - Göğüs ve kol kasları',
            'Squat & Deadlift - Bacak ve sırt kasları',
            'Overhead Press - Omuz ve kol kasları',
            'Pull-ups & Rows - Sırt ve kol kasları'
        ]
    },
    mobility: {
        icon: 'fa-person-walking',
        gradient: 'from-pink-500 to-rose-500',
        title: 'Mobility & Flexibility',
        subtitle: 'Hareket Kabiliyeti ve Esneklik',
        description: 'Mobility ve Flexibility çalışmaları, eklemlerinizin hareket genişliğini artırarak daha sağlıklı ve ağrısız hareket etmenizi sağlar.',
        benefits: [
            {
                icon: 'fa-hand-sparkles',
                title: 'Ağrı Azalması',
                desc: 'Sırt, boyun, bel ağrılarınız azalır, eklemleriniz daha rahat hareket eder'
            },
            {
                icon: 'fa-expand',
                title: 'Hareket Genişliği',
                desc: 'Eklemlerinizin hareket aralığı artar, daha geniş ve serbest hareket edersiniz'
            },
            {
                icon: 'fa-running',
                title: 'Performans Artışı',
                desc: 'Diğer antrenmanlarınızda daha iyi performans gösterirsiniz'
            },
            {
                icon: 'fa-bed',
                title: 'Yaşam Kalitesi',
                desc: 'Günlük yaşamınızda daha rahat ve konforlu hareket edersiniz'
            }
        ],
        forWhom: [
            'Ofis çalışanları ve uzun süre oturanlar',
            'Eklem ağrısı ve sertliği çekenler',
            'Spor performansını artırmak isteyenler',
            'Yaşlılıkta aktif kalmak isteyenler'
        ],
        examples: [
            'Dynamic Stretching - Dinamik esneme hareketleri',
            'Foam Rolling - Kas gevşetme teknikleri',
            'Joint Mobilization - Eklem hareketliliği çalışmaları',
            'Yoga & Pilates Elements - Yoga ve pilates unsurları'
        ]
    },
    conditioning: {
        icon: 'fa-heartbeat',
        gradient: 'from-blue-500 to-cyan-500',
        title: 'Conditioning',
        subtitle: 'Kardiyovasküler Dayanıklılık Geliştirme',
        description: 'Conditioning antrenmanları, kalp-damar sağlığınızı ve genel dayanıklılığınızı geliştirerek enerjinizi artırır.',
        benefits: [
            {
                icon: 'fa-heart',
                title: 'Kalp Sağlığı',
                desc: 'Kalp kasınız güçlenir, kan dolaşımınız iyileşir, hastalık riski azalır'
            },
            {
                icon: 'fa-lungs',
                title: 'Solunum Kapasitesi',
                desc: 'Akciğer kapasitesi artar, daha verimli nefes alıp verirsiniz'
            },
            {
                icon: 'fa-weight-scale',
                title: 'Yağ Yakımı',
                desc: 'Yüksek kalori yakımı ile kilo verme ve fit kalmanızı destekler'
            },
            {
                icon: 'fa-mountain',
                title: 'Dayanıklılık',
                desc: 'Uzun süreli aktivitelerde yorulmadan performans gösterirsiniz'
            }
        ],
        forWhom: [
            'Kilo vermek isteyenler',
            'Dayanıklılığını artırmak isteyenler',
            'Kalp sağlığını iyileştirmek isteyenler',
            'Spor müsabakalarına hazırlananlar'
        ],
        examples: [
            'HIIT Training - Yüksek yoğunluklu interval antrenman',
            'Circuit Training - Devre antrenmanı',
            'Cardio Intervals - Kardiyo aralıkları',
            'Endurance Work - Dayanıklılık çalışmaları'
        ]
    },
    corrective: {
        icon: 'fa-user-md',
        gradient: 'from-green-500 to-emerald-500',
        title: 'Corrective Exercises',
        subtitle: 'Postür Düzeltme ve Koruyucu Egzersizler',
        description: 'Corrective Exercises, vücudunuzdaki kas dengesizliklerini ve postür bozukluklarını düzelterek ağrısız bir yaşam sürmenizi sağlar.',
        benefits: [
            {
                icon: 'fa-user-check',
                title: 'Postür Düzeltme',
                desc: 'Kamburluk, omuz düşüklüğü gibi postür bozukluklarınız düzelir'
            },
            {
                icon: 'fa-ban',
                title: 'Ağrı Önleme',
                desc: 'Kronik ağrılarınız azalır veya tamamen geçer'
            },
            {
                icon: 'fa-balance-scale',
                title: 'Kas Dengesi',
                desc: 'Zayıf kaslarınız güçlenir, gergin kaslarınız gevşer'
            },
            {
                icon: 'fa-shield',
                title: 'Sakatlık Koruması',
                desc: 'Gelecekteki sakatlıklara karşı korunmanızı sağlar'
            }
        ],
        forWhom: [
            'Kronik ağrısı olanlar (bel, boyun, omuz)',
            'Postür problemi yaşayanlar',
            'Sakatlık geçmişi olanlar',
            'Önleyici sağlık yaklaşımı isteyenler'
        ],
        examples: [
            'Postural Assessment - Postür değerlendirmesi',
            'Muscle Activation - Kas aktivasyonu çalışmaları',
            'Movement Pattern Correction - Hareket kalıbı düzeltme',
            'Therapeutic Exercises - Terapötik egzersizler'
        ]
    },
    personal: {
        icon: 'fa-users',
        gradient: 'from-indigo-500 to-blue-500',
        title: '1-1 Personal Training',
        subtitle: 'Tamamen Size Özel Bireysel Antrenman',
        description: '1-1 Personal Training, sadece sizin hedeflerinize ve ihtiyaçlarınıza odaklanan, %100 kişiselleştirilmiş antrenman deneyimidir.',
        benefits: [
            {
                icon: 'fa-bullseye',
                title: 'Hedefe Odaklı',
                desc: 'Antrenmanlar tamamen sizin özel hedeflerinize göre tasarlanır'
            },
            {
                icon: 'fa-user-clock',
                title: 'Kişisel İlgi',
                desc: 'Antrenörünüzün tüm dikkatini alırsınız, her harekette destek görürsünız'
            },
            {
                icon: 'fa-calendar-check',
                title: 'Esnek Program',
                desc: 'Kendi programınıza uygun saatlerde antrenman yaparsınız'
            },
            {
                icon: 'fa-chart-line',
                title: 'Hızlı İlerleme',
                desc: 'Bireysel rehberlik sayesinde daha hızlı ve etkili sonuçlar alırsınız'
            }
        ],
        forWhom: [
            'Maksimum sonuç almak isteyenler',
            'Özel sağlık durumu olanlar',
            'Motivasyon desteği isteyenler',
            'Zamanını verimli kullanmak isteyenler'
        ],
        examples: [
            'Individual Assessment - Kişisel değerlendirme',
            'Custom Programming - Özel program tasarımı',
            'Form Correction - Form düzeltme ve rehberlik',
            'Progress Tracking - İlerleme takibi ve program güncellemeleri'
        ]
    }
};

function openServiceModal(serviceType) {
    const modal = document.getElementById('serviceModal');
    const modalContent = document.getElementById('modalContent');
    const service = serviceContent[serviceType];

    if (!service) return;

    // Track modal open in Google Analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'service_modal_open', {
            'service_type': serviceType,
            'service_name': service.title
        });
    }

    modalContent.innerHTML = `
        <div class="mb-8">
            <div class="w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-3xl flex items-center justify-center mb-6 mx-auto">
                <i class="fas ${service.icon} text-white text-4xl"></i>
            </div>
            <h2 class="text-4xl font-bold text-center text-slate-900 mb-2">${service.title}</h2>
            <p class="text-center text-lg text-slate-600 mb-6">${service.subtitle}</p>
            <p class="text-slate-700 text-center leading-relaxed">${service.description}</p>
        </div>

        <div class="mb-8">
            <h3 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <i class="fas fa-star text-yellow-500"></i>
                Faydaları
            </h3>
            <div class="grid md:grid-cols-2 gap-4">
                ${service.benefits.map(benefit => `
                    <div class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
                        <div class="flex items-start gap-3">
                            <div class="w-10 h-10 bg-gradient-to-br ${service.gradient} rounded-lg flex items-center justify-center flex-shrink-0">
                                <i class="fas ${benefit.icon} text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900 mb-1">${benefit.title}</h4>
                                <p class="text-sm text-slate-600">${benefit.desc}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="mb-8">
            <h3 class="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i class="fas fa-user-check text-green-500"></i>
                Kimler İçin Uygundur?
            </h3>
            <ul class="space-y-3">
                ${service.forWhom.map(item => `
                    <li class="flex items-start gap-3 text-slate-700">
                        <i class="fas fa-check-circle text-green-500 mt-1"></i>
                        <span>${item}</span>
                    </li>
                `).join('')}
            </ul>
        </div>

        <div class="mb-8">
            <h3 class="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i class="fas fa-dumbbell text-indigo-500"></i>
                Örnek Hareketler
            </h3>
            <div class="grid md:grid-cols-2 gap-3">
                ${service.examples.map(example => `
                    <div class="bg-white border-2 border-slate-200 rounded-lg p-4 flex items-center gap-3">
                        <i class="fas fa-circle text-indigo-500 text-xs"></i>
                        <span class="text-slate-700">${example}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="bg-gradient-to-br ${service.gradient} rounded-2xl p-6 text-center">
            <h3 class="text-white text-xl font-bold mb-3">Bu Antrenman Size Uygun mu?</h3>
            <p class="text-white/90 mb-5">Hemen iletişime geçin, size özel bir program oluşturalım!</p>
            <a href="https://wa.me/905332470660?text=Merhaba!%20${encodeURIComponent(service.title)}%20hakkında%20detaylı%20bilgi%20almak%20istiyorum" 
               target="_blank"
               onclick="if(typeof gtag !== 'undefined'){gtag('event','whatsapp_from_modal',{'service':'${serviceType}'})}"
               class="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:shadow-xl transition-all duration-300">
                <i class="fab fa-whatsapp text-green-500 text-2xl"></i>
                WhatsApp ile İletişime Geç
            </a>
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Close on backdrop click
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeServiceModal();
        }
    };
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeServiceModal();
        closeTooltipModal();
    }
});

// Tooltip Modal Functions for Mobile
const tooltipContents = {
    'navy-formula': {
        title: '🎖️ US Navy Formülü',
        content: 'ABD Deniz Kuvvetleri tarafından askeri personelin vücut yağ oranını ölçmek için geliştirilmiş bilimsel bir yöntemdir. Basit ölçümlerle (boyun, bel, kalça) yüksek doğruluk oranı sağlar ve dünya çapında fitness profesyonelleri tarafından kullanılır.',
        color: 'indigo'
    },
    'navy-formula-2': {
        title: 'ℹ️ US Navy Formülü',
        content: '1984\'te ABD Deniz Kuvvetleri tarafından geliştirilen, çevre ölçümlerine dayalı vücut kompozisyonu hesaplama yöntemi. Caliperler veya pahalı ekipman gerektirmeden %3-4 doğruluk oranı sağlar.',
        color: 'amber'
    },
    'bmi': {
        title: '📊 BMI (Body Mass Index)',
        content: 'Vücut Kitle İndeksi, kilo ve boy oranınıza göre hesaplanan bir ölçüttür. Dünya Sağlık Örgütü (WHO) tarafından kabul edilen, kişinin sağlıklı kilo aralığında olup olmadığını gösteren standart bir değerdir. Formül: Kilo (kg) / Boy² (m)',
        color: 'blue'
    },
    'tvgbf': {
        title: '🏆 TVGBF 2nd Level',
        content: 'Türkiye Vücut Geliştirme ve Fitness Federasyonu tarafından verilen 2. Seviye Antrenörlük Sertifikası. İleri düzey antrenman programlama, spor fizyolojisi ve beslenme konularında yetkinlik belgesidir.',
        color: 'indigo'
    },
    'eqf': {
        title: '🎓 EQF Level 4 Personal Trainer',
        content: 'European Qualifications Framework (Avrupa Yeterlilik Çerçevesi) 4. Seviye Personal Trainer sertifikası. AB ülkelerinde tanınan, uluslararası standartlarda eğitim yeterliliği belgesidir.',
        color: 'purple'
    },
    'issa': {
        title: '🌟 ISSA Certified Personal Trainer',
        content: 'International Sports Sciences Association - 1988\'den beri dünya çapında 140+ ülkede tanınan, bilimsel temelli personal training sertifikası. Spor bilimi, anatomi ve egzersiz fizyolojisi alanlarında kapsamlı eğitim.',
        color: 'pink'
    }
};

function openTooltipModal(tooltipId) {
    // Only for mobile devices
    if (window.innerWidth > 768) return;

    const modal = document.getElementById('mobileTooltipModal');
    const content = document.getElementById('mobileTooltipContent');
    const tooltip = tooltipContents[tooltipId];

    if (!tooltip) return;

    const colorClasses = {
        'indigo': 'text-indigo-600 bg-indigo-50 border-indigo-200',
        'amber': 'text-amber-600 bg-amber-50 border-amber-200',
        'blue': 'text-blue-600 bg-blue-50 border-blue-200',
        'purple': 'text-purple-600 bg-purple-50 border-purple-200',
        'pink': 'text-pink-600 bg-pink-50 border-pink-200'
    };

    content.innerHTML = `
        <div class="mb-4 p-4 ${colorClasses[tooltip.color]} border-2 rounded-xl">
            <h3 class="font-bold text-lg mb-2">${tooltip.title}</h3>
        </div>
        <p class="text-slate-700 leading-relaxed">${tooltip.content}</p>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Track in Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'tooltip_open', {
            event_category: 'engagement',
            event_label: tooltipId,
            value: 1
        });
    }
}

function closeTooltipModal() {
    const modal = document.getElementById('mobileTooltipModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close tooltip modal on backdrop click
document.getElementById('mobileTooltipModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeTooltipModal();
    }
});

// Live working hours status (Google Maps style)
(function() {
  const statusDot = document.getElementById('workingHoursStatusDot');
  const statusText = document.getElementById('workingHoursStatusText');
  const statusDetail = document.getElementById('workingHoursStatusDetail');
  if (!statusDot || !statusText || !statusDetail) return;

  // Minutes from midnight
  const toMinutes = (h, m) => h * 60 + m;
  const formatTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const pad = (v) => String(v).padStart(2, '0');
    return `${pad(h)}:${pad(m)}`;
  };

  // Weekly schedule: 0=Sunday ... 6=Saturday (Date.getDay)
  const schedule = {
    0: { open: toMinutes(11, 30), close: toMinutes(18, 30) },   // Pazar
    1: { open: toMinutes(8, 0), close: toMinutes(22, 0) },   // Pazartesi
    2: { open: toMinutes(8, 0), close: toMinutes(22, 0) },   // Salı
    3: { open: toMinutes(8, 0), close: toMinutes(22, 0) },   // Çarşamba
    4: { open: toMinutes(8, 0), close: toMinutes(22, 0) },   // Perşembe
    5: { open: toMinutes(8, 0), close: toMinutes(22, 0) },   // Cuma
    6: { open: toMinutes(9, 0), close: toMinutes(22, 0) },   // Cumartesi
  };

  const updateStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    const today = schedule[day];

    const setUI = (dotColor, text, detail = '') => {
      statusDot.className = `inline-block h-2.5 w-2.5 rounded-full ${dotColor}`;
      statusText.textContent = text;
      statusDetail.textContent = detail ? ` - ${detail}` : '';
    };

    const findNextOpen = () => {
      for (let i = 1; i <= 7; i++) {
        const nextDay = (day + i) % 7;
        const next = schedule[nextDay];
        if (next) return { dayOffset: i, time: next.open };
      }
      return null;
    };

    if (today && minutesNow >= today.open && minutesNow < today.close) {
      const minutesToClose = today.close - minutesNow;
      if (minutesToClose <= 60) {
        setUI('bg-amber-400', 'Yakında kapanıyor', `${formatTime(today.close)}'de kapanacak`);
      } else {
        setUI('bg-emerald-400', 'Şimdi açık', `${formatTime(today.close)}'e kadar acik`);
      }
      return;
    }

    // Kapali durum: bugun daha acilmadiysa veya kapandiysa
    if (today && minutesNow < today.open) {
      setUI('bg-red-400', 'Kapalı', `Bugün ${formatTime(today.open)}'de acilacak`);
      return;
    }

    const next = findNextOpen();
    if (next) {
      const isTomorrow = next.dayOffset === 1;
      const dayText = isTomorrow ? 'Yarın' : `${next.dayOffset} gün sonra`;
      setUI('bg-red-400', 'Kapalı', `${dayText} ${formatTime(next.time)}'de açılacak`);
    } else {
      setUI('bg-red-400', 'Kapalı', 'Randevu için arayınız.');
    }
  };

  updateStatus();
  setInterval(updateStatus, 60000);
})();
