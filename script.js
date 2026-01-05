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

// Smooth Scrolling with event delegation
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
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
}

// Make selectGender available globally
window.selectGender = selectGender;

// Body Fat Form Submission
const bodyFatForm = document.getElementById('bodyFatForm');
if (bodyFatForm) {
    bodyFatForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!selectedGender) {
            alert('Lütfen cinsiyetinizi seçin');
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

        // Display results
        displayResults(bodyFatPercentage, bmi, fatMass, leanMass, idealWeightMin, idealWeightMax, selectedGender, age);

        // Track calculator usage
        if (typeof gtag !== 'undefined') {
            gtag('event', 'calculate_body_fat', {
                event_category: 'calculator',
                event_label: selectedGender,
                value: Math.round(bodyFatPercentage)
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
