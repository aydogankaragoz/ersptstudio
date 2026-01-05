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
            gtag('event', 'calculate_body_fat', {
                event_category: 'calculator',
                event_label: selectedGender,
                value: Math.round(bodyFatPercentage)
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
                value: Math.round(bmi)
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
                value: Math.round(bodyFatPercentage)
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
                value: 1
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

