// Mobile menu
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

function setMobileMenu(open) {
    mobileMenu.hidden = !open;
    mobileMenuBtn.setAttribute('aria-expanded', String(open));
    mobileMenuBtn.textContent = open ? 'Kapat' : 'Menü';
}

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => setMobileMenu(mobileMenu.hidden));
    mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') setMobileMenu(false);
    });
}

// Which section is on screen: marks the nav link and changes the photo on the stage
const stageImages = document.querySelectorAll('.stage img');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]:not(.btn)');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link => link.classList.toggle('is-current', link.getAttribute('href') === '#' + id));
        const chapter = entry.target.dataset.chapter;
        if (chapter) {
            stageImages.forEach(img => img.classList.toggle('is-active', img.dataset.stage === chapter));
        }
    });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('section[id]').forEach(section => sectionObserver.observe(section));

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

// Section entrances. Content is visible by default; the hidden start exists only under .motion in the CSS
// The class is set here, not in the page, so an old or blocked script can never leave content hidden
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('motion');
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

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

// Body Fat Calculator
function showCalcError(message) {
    const box = document.getElementById('calcError');
    box.textContent = message;
    box.hidden = !message;
}

let selectedGender = null;
let calculationResults = null; // Store results for WhatsApp message

function selectGender(gender) {
    selectedGender = gender;
    const maleBtn = document.getElementById('maleBtn');
    const femaleBtn = document.getElementById('femaleBtn');
    const hipContainer = document.getElementById('hipContainer');
    const hipInput = document.getElementById('hip');

    maleBtn.setAttribute('aria-pressed', String(gender === 'male'));
    femaleBtn.setAttribute('aria-pressed', String(gender === 'female'));
    hipContainer.hidden = gender !== 'female';
    hipInput.required = gender === 'female';
    showCalcError('');

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
            showCalcError('Hesaplama için önce cinsiyetinizi seçin.');

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

        // Every field needs a value inside its allowed range
        const invalidInput = Array.from(bodyFatForm.querySelectorAll('input')).find(input => !input.checkValidity());
        if (invalidInput) {
            const label = bodyFatForm.querySelector(`label[for="${invalidInput.id}"]`).textContent;
            showCalcError(`${label} için ${invalidInput.min} ile ${invalidInput.max} arasında bir değer girin.`);
            invalidInput.focus();
            return;
        }

        // The formula takes the log of this difference, so it must be positive
        if ((selectedGender === 'male' ? waist : waist + hip) <= neck) {
            showCalcError('Bel ölçünüz boyun ölçünüzden büyük olmalı. Ölçümlerinizi kontrol edin.');
            document.getElementById('waist').focus();
            return;
        }
        showCalcError('');

        // Calculate body fat percentage using US Navy formula
        let bodyFatPercentage;

        if (selectedGender === 'male') {
            // Male formula
            bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
        } else {
            // Female formula
            bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
        }

        // Anything outside this range means a mistyped measurement, not a real body
        if (!Number.isFinite(bodyFatPercentage) || bodyFatPercentage < 2 || bodyFatPercentage > 70) {
            showCalcError('Bu ölçülerle güvenilir bir sonuç çıkmıyor. Boyun, bel ve boy değerlerinizi kontrol edin.');
            return;
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

        // Count the calculation only. Measurements and results stay in the visitor's browser.
        if (typeof gtag !== 'undefined') {
            gtag('event', 'calculate_body_fat', { event_category: 'calculator' });
        }

        // Smooth scroll to results
        const resultsTitle = document.getElementById('resultsTitle');
        resultsTitle.focus({ preventScroll: true });
        document.getElementById('resultsContainer').scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start'
        });
    });
}

const trNumber = (value) => value.toFixed(1).replace('.', ',');

function displayResults(bodyFatPercentage, bmi, fatMass, leanMass, idealWeightMin, idealWeightMax, gender, age) {
    // Show results, hide the measuring guide
    document.getElementById('resultsContainer').hidden = false;
    document.getElementById('infoCard').hidden = true;

    document.getElementById('bodyFatPercentage').textContent = '%' + trNumber(bodyFatPercentage);

    // The bar runs from 0 to 50%
    document.getElementById('bodyFatBar').style.width = (Math.min(bodyFatPercentage, 50) / 50 * 100) + '%';

    let category;
    if (gender === 'male') {
        if (bodyFatPercentage < 6) category = 'Çok düşük, sağlıklı aralığın altında';
        else if (bodyFatPercentage <= 13) category = 'Atletik';
        else if (bodyFatPercentage <= 17) category = 'İdeal';
        else if (bodyFatPercentage <= 24) category = 'Ortalama';
        else category = 'Yüksek';
    } else {
        if (bodyFatPercentage < 14) category = 'Çok düşük, sağlıklı aralığın altında';
        else if (bodyFatPercentage <= 20) category = 'Atletik';
        else if (bodyFatPercentage <= 24) category = 'İdeal';
        else if (bodyFatPercentage <= 31) category = 'Ortalama';
        else category = 'Yüksek';
    }
    document.getElementById('bodyFatCategory').textContent = category;

    // Display BMI
    document.getElementById('bmiValue').textContent = trNumber(bmi);

    let bmiCategory;
    if (bmi < 18.5) {
        bmiCategory = 'Zayıf';
    } else if (bmi <= 24.9) {
        bmiCategory = 'Normal';
    } else if (bmi <= 29.9) {
        bmiCategory = 'Fazla kilolu';
    } else {
        bmiCategory = 'Obez';
    }
    document.getElementById('bmiCategory').textContent = bmiCategory;

    // Display masses
    document.getElementById('fatMass').textContent = trNumber(fatMass) + ' kg';
    document.getElementById('leanMass').textContent = trNumber(leanMass) + ' kg';

    // Display ideal weight
    document.getElementById('idealWeight').textContent =
        trNumber(idealWeightMin) + ' - ' + trNumber(idealWeightMax) + ' kg';

    // Generate recommendations
    const recommendations = generateRecommendations(bodyFatPercentage, bmi, gender, age);
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
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

// Service Modal Functions
const serviceContent = {
    functional: {
        title: 'Fonksiyonel antrenman',
        subtitle: 'Günlük Hayatınızı Kolaylaştıran Antrenman',
        description: 'Fonksiyonel antrenman, günlük hayatta yaptığınız hareketleri daha kolay ve güvenli yapmanızı sağlayan özel bir antrenman yöntemidir.',
        benefits: [
            {
                title: 'Günlük Aktivitelerde Kolaylık',
                desc: 'Merdiven çıkma, eşya taşıma, yerden kalkma gibi günlük hareketlerinizi daha kolay yaparsınız'
            },
            {
                title: 'Sakatlık Riskini Azaltma',
                desc: 'Doğru hareket kalıplarını öğrenerek yaralanma riskini en aza indirirsiniz'
            },
            {
                title: 'Denge ve Koordinasyon',
                desc: 'Vücudunuzun farklı kaslarını birlikte çalıştırarak denge ve koordinasyonunuzu geliştirirsiniz'
            },
            {
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
        title: 'Güç antrenmanı',
        subtitle: 'Kas ve Kuvvet Geliştirme Programı',
        description: 'Güç antrenmanı, kaslarınızı güçlendirerek fiziksel gücünüzü ve vücut kompozisyonunuzu geliştiren sistemli bir antrenman yöntemidir.',
        benefits: [
            {
                title: 'Metabolizma Hızlanması',
                desc: 'Kas kütleniz arttıkça metabolizmanız hızlanır ve daha fazla kalori yakarsınız'
            },
            {
                title: 'Kas Gelişimi',
                desc: 'Hedef aldığınız kas gruplarında görünür büyüme ve tanımlama sağlarsınız'
            },
            {
                title: 'Kemik Yoğunluğu',
                desc: 'Düzenli yüklenme kemik sağlığınızı destekler'
            },
            {
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
        title: 'Mobilite ve esneklik',
        subtitle: 'Hareket Kabiliyeti ve Esneklik',
        description: 'Mobilite ve esneklik çalışmaları, eklemlerinizin hareket genişliğini artırarak daha rahat hareket etmenize yardımcı olur.',
        benefits: [
            {
                title: 'Ağrı Azalması',
                desc: 'Eklemleriniz daha rahat hareket eder; sırt, boyun ve bel gerginliğini azaltmaya yardımcı olur'
            },
            {
                title: 'Hareket Genişliği',
                desc: 'Eklemlerinizin hareket aralığı artar, daha geniş ve serbest hareket edersiniz'
            },
            {
                title: 'Performans Artışı',
                desc: 'Diğer antrenmanlarınızda daha iyi performans gösterirsiniz'
            },
            {
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
        title: 'Kondisyon',
        subtitle: 'Kardiyovasküler Dayanıklılık Geliştirme',
        description: 'Kondisyon antrenmanları, kalp-damar sağlığınızı ve genel dayanıklılığınızı geliştirerek enerjinizi artırır.',
        benefits: [
            {
                title: 'Kalp Sağlığı',
                desc: 'Düzenli kardiyo kalp ve dolaşım sağlığınızı destekler'
            },
            {
                title: 'Solunum Kapasitesi',
                desc: 'Akciğer kapasitesi artar, daha verimli nefes alıp verirsiniz'
            },
            {
                title: 'Yağ Yakımı',
                desc: 'Yüksek kalori yakımı ile kilo verme ve fit kalmanızı destekler'
            },
            {
                title: 'Dayanıklılık',
                desc: 'Uzun süreli aktivitelerde yorulmadan performans gösterirsiniz'
            }
        ],
        forWhom: [
            'Kilo vermek isteyenler',
            'Dayanıklılığını artırmak isteyenler',
            'Kalp ve dolaşım sağlığını desteklemek isteyenler',
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
        title: 'Düzeltici egzersiz',
        subtitle: 'Postür Düzeltme ve Koruyucu Egzersizler',
        description: 'Düzeltici egzersizler, kas dengesizlikleri ve postür bozuklukları üzerinde çalışarak günlük hareketlerinizi rahatlatmayı hedefler.',
        benefits: [
            {
                title: 'Postür Düzeltme',
                desc: 'Kamburluk, omuz düşüklüğü gibi postür bozuklukları üzerinde çalışırız'
            },
            {
                title: 'Ağrıya Karşı Destek',
                desc: 'Ağrıyı artıran duruş ve hareket alışkanlıklarını birlikte ele alırız'
            },
            {
                title: 'Kas Dengesi',
                desc: 'Zayıf kaslarınız güçlenir, gergin kaslarınız gevşer'
            },
            {
                title: 'Sakatlık Koruması',
                desc: 'Sakatlık riskini azaltmaya yardımcı olur'
            }
        ],
        forWhom: [
            'Bel, boyun veya omuz ağrısı yaşayanlar (doktor onayıyla)',
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
        title: 'Birebir takip',
        subtitle: 'Tamamen Size Özel Bireysel Antrenman',
        description: 'Birebir antrenman, sadece sizin hedeflerinize ve ihtiyaçlarınıza odaklanan, %100 kişiselleştirilmiş antrenman deneyimidir.',
        benefits: [
            {
                title: 'Hedefe Odaklı',
                desc: 'Antrenmanlar tamamen sizin özel hedeflerinize göre tasarlanır'
            },
            {
                title: 'Kişisel İlgi',
                desc: 'Antrenörünüzün tüm dikkatini alırsınız, her harekette destek görürsünız'
            },
            {
                title: 'Esnek Program',
                desc: 'Kendi programınıza uygun saatlerde antrenman yaparsınız'
            },
            {
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

    if (typeof gtag !== 'undefined') {
        gtag('event', 'service_modal_open', {
            'service_type': serviceType,
            'service_name': service.title
        });
    }

    modalContent.innerHTML = `
        <h2 id="modalTitle">${service.title}</h2>
        <p class="dialog-sub">${service.subtitle}</p>
        <p class="dialog-desc">${service.description}</p>

        <h3>Ne kazanırsınız?</h3>
        <ul class="benefits">
            ${service.benefits.map(benefit => `<li><strong>${benefit.title}</strong><span>${benefit.desc}</span></li>`).join('')}
        </ul>

        <h3>Kimler için uygun?</h3>
        <ul class="plain-list">
            ${service.forWhom.map(item => `<li>${item}</li>`).join('')}
        </ul>

        <h3>Örnek hareketler</h3>
        <ul class="plain-list">
            ${service.examples.map(example => `<li>${example}</li>`).join('')}
        </ul>

        <p class="dialog-note soft small">Teşhis konmuş bir rahatsızlığınız ya da devam eden bir ağrınız varsa başlamadan önce doktorunuza danışın.</p>

        <div class="dialog-cta">
            <h3>Size uygun mu, emin değil misiniz?</h3>
            <p>Yazın, hedefinize uyan programı birlikte netleştirelim.</p>
            <a class="btn" href="https://wa.me/905332470660?text=Merhaba!%20${encodeURIComponent(service.title)}%20hakkında%20detaylı%20bilgi%20almak%20istiyorum"
               target="_blank" rel="noopener"
               onclick="if(typeof gtag !== 'undefined'){gtag('event','whatsapp_from_modal',{'service':'${serviceType}'})}">WhatsApp'tan yaz</a>
        </div>
    `;

    modal.showModal();
    modalContent.scrollTop = 0;
}

function closeServiceModal() {
    document.getElementById('serviceModal').close();
}

// Close on a click on the backdrop (Esc is handled by <dialog>)
document.getElementById('serviceModal').addEventListener('click', function(e) {
    if (e.target === this) closeServiceModal();
});

// Certificate explanations used to be tooltips; keep measuring how often they are read
document.querySelectorAll('details[data-tooltip]').forEach(item => {
    item.addEventListener('toggle', () => {
        if (item.open && typeof gtag !== 'undefined') {
            gtag('event', 'tooltip_open', {
                event_category: 'engagement',
                event_label: item.dataset.tooltip,
                value: 1
            });
        }
    });
});

// Live opening hours, always in Istanbul time wherever the visitor is
(function() {
    const dots = document.querySelectorAll('[data-hours-dot]');
    const texts = document.querySelectorAll('[data-hours-text]');
    const details = document.querySelectorAll('[data-hours-detail]');
    if (!dots.length) return;

    const toMinutes = (h, m) => h * 60 + m;
    const formatTime = (mins) => {
        const pad = (v) => String(v).padStart(2, '0');
        return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
    };

    // 0 = Sunday ... 6 = Saturday (Date.getDay)
    const schedule = {
        0: { open: toMinutes(11, 30), close: toMinutes(18, 30) },
        1: { open: toMinutes(8, 0), close: toMinutes(22, 0) },
        2: { open: toMinutes(8, 0), close: toMinutes(22, 0) },
        3: { open: toMinutes(8, 0), close: toMinutes(22, 0) },
        4: { open: toMinutes(8, 0), close: toMinutes(22, 0) },
        5: { open: toMinutes(8, 0), close: toMinutes(22, 0) },
        6: { open: toMinutes(9, 0), close: toMinutes(22, 0) },
    };

    const setUI = (state, text, detail) => {
        dots.forEach(dot => { dot.className = `dot is-${state}`; });
        texts.forEach(el => { el.textContent = text; });
        details.forEach(el => { el.textContent = detail ? `, ${detail}` : ''; });
    };

    const updateStatus = () => {
        const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
        const day = now.getDay();
        const minutesNow = now.getHours() * 60 + now.getMinutes();
        const today = schedule[day];

        document.querySelectorAll('#hoursTable [data-days]').forEach(row => {
            row.classList.toggle('is-today', row.dataset.days.split(',').includes(String(day)));
        });

        if (minutesNow >= today.open && minutesNow < today.close) {
            if (today.close - minutesNow <= 60) {
                setUI('soon', 'Birazdan kapanıyor', `kapanış ${formatTime(today.close)}`);
            } else {
                setUI('open', 'Şimdi açık', `kapanış ${formatTime(today.close)}`);
            }
        } else if (minutesNow < today.open) {
            setUI('closed', 'Şu an kapalı', `bugün açılış ${formatTime(today.open)}`);
        } else {
            setUI('closed', 'Şu an kapalı', `yarın açılış ${formatTime(schedule[(day + 1) % 7].open)}`);
        }
    };

    updateStatus();
    setInterval(updateStatus, 60000);
})();
