// class LocalizationManager {
//     constructor() {
//         this.supportedLanguages = ['ar', 'en'];
//         this.defaultLanguage = 'ar';
//         this.currentLanguage = this.detectLanguage();
//         this.translations = {};
//         this.isRTL = this.currentLanguage === 'ar';
//         this.useUrlRouting = true; // Enable URL routing for better SEO
        
//         // Initialize
//         this.init();
//     }

//     async init() {
//         try {
//             console.log('🌐 Initializing localization with language:', this.currentLanguage);
            
//             await this.loadTranslations(this.currentLanguage);
//             console.log('✅ Translations loaded successfully:', Object.keys(this.translations));
            
//             this.applyTranslations();
//             console.log('✅ Translations applied to DOM elements');
            
//             this.setupLanguageDirection();
//             console.log('✅ Language direction set:', this.isRTL ? 'RTL' : 'LTR');
            
//             this.updatePageMeta();
//             console.log('✅ Meta tags updated');
            
//             this.setupEventListeners();
//             console.log('✅ Event listeners set up');
            
//             this.handleUrlRouting();
//             console.log('✅ URL routing handled');
            
//             console.log(`🌐 Localization initialized successfully with language: ${this.currentLanguage}`);
//         } catch (error) {
//             console.error('❌ Failed to initialize localization:', error);
//             // Fallback to default language
//             if (this.currentLanguage !== this.defaultLanguage) {
//                 console.log('🔄 Falling back to default language:', this.defaultLanguage);
//                 this.currentLanguage = this.defaultLanguage;
//                 await this.init();
//             }
//         }
//     }

//     detectLanguage() {
//         try {
//         // Priority: localStorage > browser language > default
//         // Simplified approach - no URL parameter routing

//             // Check localStorage first (user preference)
//             const savedLang = localStorage.getItem('preferred-language');
//             if (savedLang && this.supportedLanguages && this.supportedLanguages.includes(savedLang)) {
//                 console.log('🔍 Language detected from localStorage:', savedLang);
//                 return savedLang;
//             }

//             // Fallback to browser language
//             const browserLang = navigator.language ? navigator.language.split('-')[0] : 'ar';
//             if (this.supportedLanguages && this.supportedLanguages.includes(browserLang)) {
//                 console.log('🔍 Language detected from browser:', browserLang);
//                 return browserLang;
//             }

//             console.log('🔍 Using default language:', this.defaultLanguage || 'ar');
//             return this.defaultLanguage || 'ar';
//         } catch (error) {
//             console.error('Error detecting language:', error);
//             return 'ar'; // Safe fallback
//         }
//     }

//     handleUrlRouting() {
//         // No URL parameter routing - language detection through localStorage and browser
//         console.log('🔄 Language routing handled via localStorage');
//     }

//     async loadTranslations(language) {
//         try {
//             console.log(`📌 Loading translations for: ${language}`);
//             const response = await fetch(`./asstes/locales/${language}.json`);
//             if (!response.ok) {
//                 throw new Error(`Failed to load translations for ${language} - Status: ${response.status}`);
//             }
//             const translations = await response.json();
//             console.log(`✅ Loaded translations:`, Object.keys(translations));
//             this.translations = translations;
//         } catch (error) {
//             console.error(`❌ Error loading translations for ${language}:`, error);
//             if (language !== this.defaultLanguage) {
//                 // Fallback to default language
//                 console.log(`🔄 Attempting fallback to default language: ${this.defaultLanguage}`);
//                 const fallbackResponse = await fetch(`./asstes/locales/${this.defaultLanguage}.json`);
//                 if (fallbackResponse.ok) {
//                     this.translations = await fallbackResponse.json();
//                     console.log(`✅ Fallback translations loaded successfully`);
//                 } else {
//                     console.error(`❌ Failed to load fallback translations`);
//                 }
//             } else {
//                 console.error(`❌ Critical: Cannot load default language translations`);
//             }
//         }
//     }

//     translate(key, fallback = key) {
//         const keys = key.split('.');
//         let value = this.translations;
        
//         for (const k of keys) {
//             if (value && typeof value === 'object' && k in value) {
//                 value = value[k];
//             } else {
//                 return fallback;
//             }
//         }
        
//         return typeof value === 'string' ? value : fallback;
//     }

//     applyTranslations() {
//         console.log('🔄 Applying translations...');
        
//         // Update elements with data-i18n attributes
//         const elements = document.querySelectorAll('[data-i18n]');
//         console.log(`Found ${elements.length} elements with data-i18n attributes`);
        
//         let translatedCount = 0;
        
//         elements.forEach(element => {
//             const key = element.getAttribute('data-i18n');
//             const translation = this.translate(key);
            
//             if (translation !== key) {
//                 translatedCount++;
//                 if (element.tagName === 'INPUT' && element.type === 'submit') {
//                     element.value = translation;
//                 } else if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
//                     element.placeholder = translation;
//                 } else {
//                     element.textContent = translation;
//                 }
//             } else {
//                 console.warn(`⚠️ Translation not found for key: ${key}`);
//             }
//         });
        
//         console.log(`✅ Successfully translated ${translatedCount} elements`);

//         // Update elements with data-i18n-html attributes (for HTML content)
//         const htmlElements = document.querySelectorAll('[data-i18n-html]');
//         htmlElements.forEach(element => {
//             const key = element.getAttribute('data-i18n-html');
//             const translation = this.translate(key);
//             if (translation !== key) {
//                 element.innerHTML = translation;
//             }
//         });

//         // Update meta tags
//         this.updatePageMeta();
//     }

//     updatePageMeta() {
//         const title = this.translate('meta.title');
//         const description = this.translate('meta.description');
//         const keywords = this.translate('meta.keywords');

//         document.title = title;
        
//         // Update meta description
//         let metaDesc = document.querySelector('meta[name="description"]');
//         if (metaDesc) {
//             metaDesc.setAttribute('content', description);
//         }

//         // Update meta keywords
//         let metaKeywords = document.querySelector('meta[name="keywords"]');
//         if (metaKeywords) {
//             metaKeywords.setAttribute('content', keywords);
//         }

//         // Update Open Graph tags
//         let ogTitle = document.querySelector('meta[property="og:title"]');
//         if (ogTitle) {
//             ogTitle.setAttribute('content', title);
//         }

//         let ogDesc = document.querySelector('meta[property="og:description"]');
//         if (ogDesc) {
//             ogDesc.setAttribute('content', description);
//         }

//         // Update lang attribute
//         document.documentElement.setAttribute('lang', this.currentLanguage);
        
//         // Update canonical URL with language parameter
//         this.updateCanonicalUrl();
//     }
    
//     updateCanonicalUrl() {
//         let canonical = document.querySelector('link[rel="canonical"]');
//         if (canonical) {
//             const baseUrl = canonical.getAttribute('href').split('?')[0];
            
//             // Keep canonical URL clean without language parameters
//             canonical.setAttribute('href', baseUrl);
//             console.log('🔗 Updated canonical URL to:', baseUrl);
//         }
//     }

//     setupLanguageDirection() {
//         this.isRTL = this.currentLanguage === 'ar';
//         const html = document.documentElement;
        
//         if (this.isRTL) {
//             html.setAttribute('dir', 'rtl');
//             html.classList.add('rtl');
//             html.classList.remove('ltr');
//         } else {
//             html.setAttribute('dir', 'ltr');
//             html.classList.add('ltr');
//             html.classList.remove('rtl');
//         }

//         // Update body class for styling hooks
//         document.body.className = document.body.className.replace(/lang-\w+/, '');
//         document.body.classList.add(`lang-${this.currentLanguage}`);
//     }

//     async switchLanguage(newLanguage) {
//         if (!this.supportedLanguages.includes(newLanguage) || newLanguage === this.currentLanguage) {
//             return;
//         }

//         // Show loading indicator
//         this.showLoadingIndicator();

//         try {
//             await this.loadTranslations(newLanguage);
//             this.currentLanguage = newLanguage;
            
//             // Save preference
//             localStorage.setItem('preferred-language', newLanguage);
            
//             // Enhanced URL handling for better routing support
//             this.updateUrlForLanguage(newLanguage);
            
//             // Apply changes with enhanced animations
//             this.setupLanguageDirection();
//             await this.animateContentTransition();
//             this.applyTranslations();
//             this.updateLanguageSwitcher();
//             this.updateServiceCards(); // Update dynamic content
            
//             // Trigger custom event
//             window.dispatchEvent(new CustomEvent('languageChanged', {
//                 detail: { language: newLanguage, isRTL: this.isRTL }
//             }));
            
//             console.log(`🌐 Language switched to: ${newLanguage}`);
//         } catch (error) {
//             console.error('Error switching language:', error);
//         } finally {
//             this.hideLoadingIndicator();
//         }
//     }
    
//     updateUrlForLanguage(language) {
//         // No URL parameter updates - language switching is handled via localStorage
//         console.log('🔄 Language switch handled via localStorage for:', language);
        
//         // Update canonical URL and meta tags
//         this.updateCanonicalUrl();
//     }

//     setupEventListeners() {
//         console.log('🎧 Setting up event listeners');
        
//         try {
//             // Language switcher buttons with defensive programming
//             document.addEventListener('click', (e) => {
//                 try {
//                     if (!e || !e.target) {
//                         console.warn('⚠️ Invalid click event or target');
//                         return;
//                     }
                    
//                     const langButton = e.target.closest('[data-lang-switch]');
//                     if (langButton) {
//                         e.preventDefault();
//                         const targetLang = langButton.getAttribute('data-lang-switch');
//                         if (targetLang && this.supportedLanguages.includes(targetLang)) {
//                             console.log('🖱️ Language button clicked, switching to:', targetLang);
//                             this.switchLanguage(targetLang);
//                         } else {
//                             console.warn('⚠️ Invalid target language:', targetLang);
//                         }
//                     }
//                 } catch (error) {
//                     console.error('❌ Error in click event handler:', error);
//                 }
//             });

//             // Listen for language change events from other components
//             window.addEventListener('languageChangeRequest', (e) => {
//                 try {
//                     if (e && e.detail && e.detail.language) {
//                         console.log('📡 Language change request received:', e.detail.language);
//                         this.switchLanguage(e.detail.language);
//                     } else {
//                         console.warn('⚠️ Invalid language change request event');
//                     }
//                 } catch (error) {
//                     console.error('❌ Error in language change request handler:', error);
//                 }
//             });
            
//             console.log('✅ Event listeners set up successfully');
//         } catch (error) {
//             console.error('❌ Error setting up event listeners:', error);
//         }
//     }

//     updateLanguageSwitcher() {
//         console.log('🔄 Updating language switcher for language:', this.currentLanguage);
        
//         try {
//             // Update toggle button states with smooth animations
//             const toggleBtns = document.querySelectorAll('[data-lang-switch]');
//             const sliders = document.querySelectorAll('.toggle-slider');
            
//             console.log('Found toggle buttons:', toggleBtns?.length || 0);
//             console.log('Found sliders:', sliders?.length || 0);
            
//             if (toggleBtns && toggleBtns.length > 0) {
//                 toggleBtns.forEach(btn => {
//                     if (!btn) {
//                         console.warn('⚠️ Invalid toggle button element');
//                         return;
//                     }
                    
//                     const lang = btn.getAttribute('data-lang-switch');
//                     console.log('Processing button for language:', lang, 'Current language:', this.currentLanguage);
                    
//                     if (lang === this.currentLanguage) {
//                         if (btn.classList) {
//                             btn.classList.add('active');
//                             btn.setAttribute('aria-current', 'true');
//                             console.log('✅ Activated button for:', lang);
                            
//                             // Add pulse animation for active state
//                             if (btn.style) {
//                                 btn.style.animation = 'none';
//                                 setTimeout(() => {
//                                     if (btn.style) {
//                                         btn.style.animation = 'activePulse 0.6s ease-out';
//                                     }
//                                 }, 10);
//                             }
//                         }
//                     } else {
//                         if (btn.classList) {
//                             btn.classList.remove('active');
//                             btn.removeAttribute('aria-current');
//                             if (btn.style) {
//                                 btn.style.animation = 'none';
//                             }
//                             console.log('⚪ Deactivated button for:', lang);
//                         }
//                     }
//                 });
//             } else {
//                 console.warn('⚠️ No toggle buttons found');
//             }
            
//             // Update slider position with enhanced animation
//             if (sliders && sliders.length > 0) {
//                 sliders.forEach(slider => {
//                     if (!slider || !slider.style) {
//                         console.warn('⚠️ Invalid slider element');
//                         return;
//                     }
                    
//                     console.log('🎛️ Updating slider position for language:', this.currentLanguage);
                    
//                     // Add changing class for pulse animation
//                     if (slider.classList) {
//                         slider.classList.add('changing');
//                     }
                    
//                     // Apply transform with staggered timing
//                     setTimeout(() => {
//                         if (slider && slider.style) {
//                             if (this.currentLanguage === 'en') {
//                                 slider.style.transform = 'translateX(100%) scale(1)';
//                                 console.log('🔄 Slider moved to English position (right)');
//                             } else {
//                                 slider.style.transform = 'translateX(0) scale(1)';
//                                 console.log('🔄 Slider moved to Arabic position (left)');
//                             }
//                         }
//                     }, 100);
                    
//                     // Remove changing class after animation
//                     setTimeout(() => {
//                         if (slider && slider.classList) {
//                             slider.classList.remove('changing');
//                         }
//                     }, 600);
//                 });
//             } else {
//                 console.warn('⚠️ No slider elements found');
//             }
            
//             // Update document data attribute for CSS targeting
//             if (document.documentElement && document.documentElement.setAttribute) {
//                 document.documentElement.setAttribute('data-current-lang', this.currentLanguage);
//                 console.log('📄 Updated document data-current-lang to:', this.currentLanguage);
//             }

//             // Update current language display with fade effect
//             const currentLangDisplays = document.querySelectorAll('[data-current-lang]');
//             if (currentLangDisplays && currentLangDisplays.length > 0) {
//                 currentLangDisplays.forEach(display => {
//                     if (!display || !display.style) {
//                         return;
//                     }
                    
//                     const langName = this.currentLanguage === 'ar' ? 'العربية' : 'English';
                    
//                     // Fade out, change text, fade in
//                     display.style.opacity = '0';
//                     display.style.transform = 'translateY(-10px)';
                    
//                     setTimeout(() => {
//                         if (display) {
//                             display.textContent = langName;
//                             if (display.style) {
//                                 display.style.opacity = '1';
//                                 display.style.transform = 'translateY(0)';
//                             }
//                         }
//                     }, 150);
//                 });
//             }
            
//             // Add ripple effect to container
//             this.addRippleEffect();
            
//             console.log('✅ Language switcher updated successfully');
//         } catch (error) {
//             console.error('❌ Error in updateLanguageSwitcher:', error);
//         }
//     }

//     showLoadingIndicator() {
//         const loader = document.getElementById('language-loader');
//         if (loader) {
//             loader.style.display = 'flex';
//         }
//     }

//     hideLoadingIndicator() {
//         const loader = document.getElementById('language-loader');
//         if (loader) {
//             loader.style.display = 'none';
//         }
//     }

//     // Utility methods
//     getCurrentLanguage() {
//         return this.currentLanguage;
//     }
    
//     // Debug method to check localization status
//     debug() {
//         console.log('🔍 LOCALIZATION DEBUG INFO:');
//         console.log('Current Language:', this.currentLanguage);
//         console.log('Is RTL:', this.isRTL);
//         console.log('Supported Languages:', this.supportedLanguages);
//         console.log('Translations loaded:', Object.keys(this.translations).length > 0);
//         console.log('Translation keys:', Object.keys(this.translations));
        
//         const toggleBtns = document.querySelectorAll('[data-lang-switch]');
//         const sliders = document.querySelectorAll('.toggle-slider');
//         console.log('Toggle buttons found:', toggleBtns.length);
//         console.log('Sliders found:', sliders.length);
        
//         toggleBtns.forEach((btn, index) => {
//             const lang = btn.getAttribute('data-lang-switch');
//             const isActive = btn.classList.contains('active');
//             console.log(`Button ${index + 1}: lang=${lang}, active=${isActive}`);
//         });
        
//         const docLang = document.documentElement.getAttribute('data-current-lang');
//         console.log('Document current lang attribute:', docLang);
        
//         return {
//             currentLanguage: this.currentLanguage,
//             isRTL: this.isRTL,
//             translationsLoaded: Object.keys(this.translations).length > 0,
//             buttonsFound: toggleBtns.length,
//             slidersFound: sliders.length
//         };
//     }

//     isCurrentLanguageRTL() {
//         return this.isRTL;
//     }

//     getSupportedLanguages() {
//         return [...this.supportedLanguages];
//     }

//     // Format numbers according to current locale
//     formatNumber(number) {
//         try {
//             const locale = this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
//             return new Intl.NumberFormat(locale).format(number);
//         } catch (error) {
//             return number.toString();
//         }
//     }

//     // Format dates according to current locale
//     formatDate(date) {
//         try {
//             const locale = this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
//             return new Intl.DateTimeFormat(locale, {
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//             }).format(new Date(date));
//         } catch (error) {
//             return date.toString();
//         }
//     }

//     // Add ripple effect to language toggle
//     addRippleEffect() {
//         try {
//             const containers = document.querySelectorAll('.language-toggle-container');
//             if (!containers || containers.length === 0) {
//                 console.warn('⚠️ No language toggle containers found for ripple effect');
//                 return;
//             }
            
//             containers.forEach(container => {
//                 if (!container) {
//                     console.warn('⚠️ Invalid container element for ripple effect');
//                     return;
//                 }
                
//                 // Remove existing ripples
//                 const existingRipples = container.querySelectorAll('.ripple');
//                 if (existingRipples) {
//                     existingRipples.forEach(ripple => {
//                         if (ripple && ripple.remove) {
//                             ripple.remove();
//                         }
//                     });
//                 }
                
//                 // Create new ripple
//                 const ripple = document.createElement('div');
//                 if (!ripple) {
//                     console.warn('⚠️ Failed to create ripple element');
//                     return;
//                 }
                
//                 ripple.className = 'ripple';
//                 ripple.style.cssText = `
//                     position: absolute;
//                     top: 50%;
//                     left: 50%;
//                     width: 0;
//                     height: 0;
//                     border-radius: 50%;
//                     background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 50%, transparent 100%);
//                     transform: translate(-50%, -50%);
//                     animation: rippleEffect 0.8s ease-out forwards;
//                     pointer-events: none;
//                     z-index: 0;
//                 `;
                
//                 if (container.appendChild) {
//                     container.appendChild(ripple);
//                 }
                
//                 // Remove ripple after animation
//                 setTimeout(() => {
//                     if (ripple && ripple.parentNode && ripple.parentNode.removeChild) {
//                         try {
//                             ripple.parentNode.removeChild(ripple);
//                         } catch (error) {
//                             console.warn('⚠️ Error removing ripple element:', error);
//                         }
//                     }
//                 }, 800);
//             });
//         } catch (error) {
//             console.error('❌ Error in addRippleEffect:', error);
//         }
//     }
    
//     // Enhanced page transition with staggered animations and premium effects
//     async animateContentTransition() {
//         try {
//             const elements = document.querySelectorAll('[data-i18n], [data-i18n-html], [data-dynamic-content]');
//             if (!elements || elements.length === 0) {
//                 console.warn('⚠️ No elements found for animation');
//                 return;
//             }
            
//             // Create overlay for smooth transition
//             this.createTransitionOverlay();
            
//             const chunks = [];
//             const chunkSize = 8;
            
//             // Group elements into chunks for staggered animation
//             for (let i = 0; i < elements.length; i += chunkSize) {
//                 chunks.push(Array.from(elements).slice(i, i + chunkSize));
//             }
            
//             // Phase 1: Fade out with glass morphism effect
//             for (let i = 0; i < chunks.length; i++) {
//                 setTimeout(() => {
//                     if (chunks[i]) {
//                         chunks[i].forEach(element => {
//                             if (element && element.style) {
//                                 // Enhanced fade out with glass effect
//                                 element.style.opacity = '0';
//                                 element.style.transform = 'translateY(15px) scale(0.98)';
//                                 element.style.filter = 'blur(2px)';
//                                 element.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
//                                 element.style.backdropFilter = 'blur(10px)';
//                             }
//                         });
//                     }
//                 }, i * 50);
//             }
            
//             // Wait for fade out to complete
//             await new Promise(resolve => setTimeout(resolve, 600));
            
//             // Phase 2: Update content
//             this.applyTranslations();
//             this.updateDynamicContent();
            
//             // Phase 3: Fade in with premium animation
//             for (let i = 0; i < chunks.length; i++) {
//                 setTimeout(() => {
//                     if (chunks[i]) {
//                         chunks[i].forEach(element => {
//                             if (element && element.style) {
//                                 // Premium fade in effect
//                                 element.style.opacity = '1';
//                                 element.style.transform = 'translateY(0) scale(1)';
//                                 element.style.filter = 'blur(0px)';
//                                 element.style.backdropFilter = 'none';
//                                 element.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
//                             }
//                         });
//                     }
//                 }, i * 60);
//             }
            
//             // Remove overlay after animation
//             setTimeout(() => {
//                 this.removeTransitionOverlay();
//             }, 800);
            
//         } catch (error) {
//             console.error('❌ Error in animateContentTransition:', error);
//         }
//     }
    
//     // Create premium transition overlay
//     createTransitionOverlay() {
//         try {
//             let overlay = document.getElementById('transition-overlay');
//             if (!overlay) {
//                 overlay = document.createElement('div');
//                 overlay.id = 'transition-overlay';
//                 overlay.style.cssText = `
//                     position: fixed;
//                     top: 0;
//                     left: 0;
//                     width: 100%;
//                     height: 100%;
//                     background: linear-gradient(135deg, 
//                         rgba(0, 84, 77, 0.05) 0%, 
//                         rgba(251, 191, 36, 0.05) 50%, 
//                         rgba(0, 84, 77, 0.05) 100%);
//                     backdrop-filter: blur(8px) saturate(180%);
//                     -webkit-backdrop-filter: blur(8px) saturate(180%);
//                     z-index: 9998;
//                     opacity: 0;
//                     transition: opacity 0.3s ease;
//                     pointer-events: none;
//                 `;
//                 document.body.appendChild(overlay);
//             }
            
//             // Fade in overlay
//             setTimeout(() => {
//                 if (overlay) overlay.style.opacity = '0.3';
//             }, 10);
//         } catch (error) {
//             console.warn('⚠️ Error creating transition overlay:', error);
//         }
//     }
    
//     // Remove transition overlay
//     removeTransitionOverlay() {
//         try {
//             const overlay = document.getElementById('transition-overlay');
//             if (overlay) {
//                 overlay.style.opacity = '0';
//                 setTimeout(() => {
//                     if (overlay.parentNode) {
//                         overlay.parentNode.removeChild(overlay);
//                     }
//                 }, 300);
//             }
//         } catch (error) {
//             console.warn('⚠️ Error removing transition overlay:', error);
//         }
//     }

//     // Update dynamic content (enhanced system)
//     updateDynamicContent() {
//         try {
//             console.log('🔄 Updating dynamic content for language:', this.currentLanguage);
            
//             // Update service cards with dynamic content
//             this.updateServiceCards();
            
//             // Update dynamic sections
//             this.updateDynamicSections();
            
//             // Update image sources based on language
//             this.updateLocalizedImages();
            
//             // Update form placeholders and labels
//             this.updateFormElements();
            
//             // Update navigation and links
//             this.updateNavigationElements();
            
//             // Update testimonials and reviews
//             this.updateTestimonials();
            
//             // Update hero section content
//             this.updateHeroSection();
            
//             // Update footer content
//             this.updateFooterContent();
            
//             // Update banner content
//             this.updateBannerContent();
            
//             console.log('✅ Dynamic content updated successfully');
//         } catch (error) {
//             console.error('❌ Error updating dynamic content:', error);
//         }
//     }

//     // Original service cards update method (preserved)
//     updateServiceCards() {
//             const serviceCards = document.querySelectorAll('[data-service-id]');
//             if (!serviceCards || serviceCards.length === 0) {
//                 console.log('📄 No service cards found with data-service-id attribute');
//                 return;
//             }
            
//             serviceCards.forEach(card => {
//                 if (!card) {
//                     console.warn('⚠️ Invalid service card element');
//                     return;
//                 }
                
//                 const serviceId = card.getAttribute('data-service-id');
//                 if (!serviceId) {
//                     console.warn('⚠️ Service card missing service ID');
//                     return;
//                 }
                
//                 const service = this.translations?.services?.categories?.find(s => s.id === serviceId);
                
//                 if (service) {
//                     const titleElement = card.querySelector('[data-service-title]');
//                     const descElement = card.querySelector('[data-service-description]');
//                     const subDescElement = card.querySelector('[data-service-sub-description]');
//                     const servicesList = card.querySelector('[data-services-list]');
                    
//                     if (titleElement && service.title) {
//                         titleElement.textContent = service.title;
//                     }
//                     if (descElement && service.description) {
//                         descElement.textContent = service.description;
//                     }
//                     if (subDescElement && service.subDescription) {
//                         subDescElement.textContent = service.subDescription;
//                     }
                    
//                     if (servicesList && service.services && Array.isArray(service.services)) {
//                         servicesList.innerHTML = service.services
//                             .map(s => `<li class="bullet-point text-gray-700">${s}</li>`)
//                             .join('');
//                     }
//                 } else {
//                     console.warn(`⚠️ Service not found for ID: ${serviceId}`);
//                 }
//             });

//             // Update action buttons with defensive checks
//             const callButtons = document.querySelectorAll('[data-call-button]');
//             const whatsappButtons = document.querySelectorAll('[data-whatsapp-button]');
            
//             if (callButtons) {
//                 callButtons.forEach(btn => {
//                     if (btn && this.translate) {
//                         const callText = this.translate('services.buttons.callUs');
//                         if (callText) {
//                             btn.innerHTML = `<i class="fas fa-phone-alt"></i> ${callText}`;
//                         }
//                     }
//                 });
//             }
            
//             if (whatsappButtons) {
//                 whatsappButtons.forEach(btn => {
//                     if (btn && this.translate) {
//                         const whatsappText = this.translate('services.buttons.whatsapp');
//                         if (whatsappText) {
//                             btn.innerHTML = `<i class="fab fa-whatsapp"></i> ${whatsappText}`;
//                         }
//                     }
//                 });
//             }
//     }

//     // Update sections with dynamic content based on language
//     updateDynamicSections() {
//         try {
//             const dynamicSections = document.querySelectorAll('[data-dynamic-section]');
            
//             dynamicSections.forEach(section => {
//                 if (!section) return;
                
//                 const sectionKey = section.getAttribute('data-dynamic-section');
//                 const sectionData = this.translations[sectionKey];
                
//                 if (sectionData) {
//                     // Update section title
//                     const titleElement = section.querySelector('[data-section-title]');
//                     if (titleElement && sectionData.title) {
//                         titleElement.textContent = sectionData.title;
//                     }
                    
//                     // Update section description
//                     const descElement = section.querySelector('[data-section-description]');
//                     if (descElement && sectionData.description) {
//                         descElement.textContent = sectionData.description;
//                     }
                    
//                     // Update dynamic list items
//                     const listContainer = section.querySelector('[data-dynamic-list]');
//                     if (listContainer && sectionData.items && Array.isArray(sectionData.items)) {
//                         listContainer.innerHTML = sectionData.items
//                             .map(item => `<li class="dynamic-list-item">${item}</li>`)
//                             .join('');
//                     }
//                 }
//             });
//         } catch (error) {
//             console.error('❌ Error updating dynamic sections:', error);
//         }
//     }
    
//     // Update localized images based on language
//     updateLocalizedImages() {
//         try {
//             const localizedImages = document.querySelectorAll('[data-localized-img]');
            
//             localizedImages.forEach(img => {
//                 if (!img) return;
                
//                 const baseImagePath = img.getAttribute('data-localized-img');
//                 if (baseImagePath) {
//                     // Construct language-specific image path
//                     const langSuffix = this.currentLanguage === 'ar' ? '_ar' : '_en';
//                     const newImagePath = baseImagePath.replace(/\.(jpg|jpeg|png|webp)$/i, `${langSuffix}.$1`);
                    
//                     // Update image source with fallback
//                     img.src = newImagePath;
//                     img.onerror = () => {
//                         img.src = baseImagePath; // Fallback to original image
//                     };
//                 }
//             });
//         } catch (error) {
//             console.error('❌ Error updating localized images:', error);
//         }
//     }
    
    
//     // Update form elements with dynamic content
//     updateFormElements() {
//         try {
//             const forms = document.querySelectorAll('[data-dynamic-form]');
            
//             forms.forEach(form => {
//                 if (!form) return;
                
//                 const formKey = form.getAttribute('data-dynamic-form');
//                 const formData = this.translations.forms?.[formKey];
                
//                 if (formData) {
//                     // Update input placeholders
//                     const inputs = form.querySelectorAll('input[data-placeholder-key]');
//                     inputs.forEach(input => {
//                         const placeholderKey = input.getAttribute('data-placeholder-key');
//                         if (formData.placeholders?.[placeholderKey]) {
//                             input.placeholder = formData.placeholders[placeholderKey];
//                         }
//                     });
                    
//                     // Update labels
//                     const labels = form.querySelectorAll('label[data-label-key]');
//                     labels.forEach(label => {
//                         const labelKey = label.getAttribute('data-label-key');
//                         if (formData.labels?.[labelKey]) {
//                             label.textContent = formData.labels[labelKey];
//                         }
//                     });
                    
//                     // Update submit button
//                     const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
//                     if (submitBtn && formData.submitText) {
//                         if (submitBtn.tagName === 'INPUT') {
//                             submitBtn.value = formData.submitText;
//                         } else {
//                             submitBtn.textContent = formData.submitText;
//                         }
//                     }
//                 }
//             });
//         } catch (error) {
//             console.error('❌ Error updating form elements:', error);
//         }
//     }
    
    
//     // Update navigation elements with dynamic content
//     updateNavigationElements() {
//         try {
//             // Update dynamic navigation links
//             const navLinks = document.querySelectorAll('[data-nav-key]');
//             navLinks.forEach(link => {
//                 if (!link) return;
                
//                 const navKey = link.getAttribute('data-nav-key');
//                 const navText = this.translations.navigation?.[navKey];
                
//                 if (navText) {
//                     link.textContent = navText;
//                 }
//             });
            
//             // Update breadcrumbs
//             const breadcrumbs = document.querySelectorAll('[data-breadcrumb-key]');
//             breadcrumbs.forEach(breadcrumb => {
//                 if (!breadcrumb) return;
                
//                 const breadcrumbKey = breadcrumb.getAttribute('data-breadcrumb-key');
//                 const breadcrumbText = this.translations.breadcrumbs?.[breadcrumbKey];
                
//                 if (breadcrumbText) {
//                     breadcrumb.textContent = breadcrumbText;
//                 }
//             });
//         } catch (error) {
//             console.error('❌ Error updating navigation elements:', error);
//         }
//     }
    
    
//     // Update testimonials with language-specific content
//     updateTestimonials() {
//         try {
//             const testimonialContainers = document.querySelectorAll('[data-testimonials-container]');
            
//             testimonialContainers.forEach(container => {
//                 if (!container) return;
                
//                 const testimonialsData = this.translations.testimonials;
//                 if (testimonialsData && testimonialsData.reviews) {
//                     // Clear existing testimonials
//                     container.innerHTML = '';
                    
//                     // Generate testimonials HTML
//                     testimonialsData.reviews.forEach(review => {
//                         const testimonialHTML = this.generateTestimonialHTML(review);
//                         container.appendChild(testimonialHTML);
//                     });
//                 }
//             });
//         } catch (error) {
//             console.error('❌ Error updating testimonials:', error);
//         }
//     }
    
    
//     // Generate testimonial HTML with premium styling
//     generateTestimonialHTML(review) {
//         try {
//             const testimonialElement = document.createElement('div');
//             testimonialElement.className = 'testimonial-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300';
            
//             const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            
//             testimonialElement.innerHTML = `
//                 <div class="testimonial-content">
//                     <div class="flex items-center mb-4">
//                         <div class="testimonial-avatar w-12 h-12 bg-gradient-to-r from-saudi-green to-gold rounded-full flex items-center justify-center text-white font-bold">
//                             ${review.name.charAt(0)}
//                         </div>
//                         <div class="ml-3">
//                             <h4 class="font-semibold text-gray-800">${review.name}</h4>
//                             <p class="text-sm text-gray-500">${review.location}</p>
//                         </div>
//                         <div class="ml-auto text-right">
//                             <div class="text-gold text-sm">${stars}</div>
//                             <p class="text-xs text-gray-400">${review.timeAgo}</p>
//                         </div>
//                     </div>
//                     <p class="text-gray-700 leading-relaxed">${review.comment}</p>
//                 </div>
//             `;
            
//             return testimonialElement;
//         } catch (error) {
//             console.error('❌ Error generating testimonial HTML:', error);
//             return document.createElement('div');
//         }
//     }
// }

// // Auto-initialize when DOM is loaded with enhanced error handling
// document.addEventListener('DOMContentLoaded', () => {
//     console.log('🚀 DOM loaded, initializing localization manager');
    
//     try {
//         // Initialize localization manager
//         if (typeof LocalizationManager === 'function') {
//             window.localizationManager = new LocalizationManager();
//             console.log('✅ Localization manager created successfully');
//         } else {
//             console.error('❌ LocalizationManager class not available');
//             return;
//         }
        
//         // Initialize toggle button states after a short delay
//         setTimeout(() => {
//             try {
//                 if (window.localizationManager && typeof window.localizationManager.updateLanguageSwitcher === 'function') {
//                     console.log('🔄 Updating language switcher after DOM load');
//                     window.localizationManager.updateLanguageSwitcher();
//                 } else {
//                     console.error('❌ Localization manager not available or missing updateLanguageSwitcher method');
//                 }
//             } catch (error) {
//                 console.error('❌ Error updating language switcher:', error);
//             }
//         }, 100);
        
//         // Additional initialization for toggle buttons with validation
//         setTimeout(() => {
//             try {
//                 const toggleBtns = document.querySelectorAll('[data-lang-switch]');
//                 console.log('🔍 Found toggle buttons on DOM load:', toggleBtns?.length || 0);
                
//                 if (toggleBtns && toggleBtns.length > 0) {
//                     toggleBtns.forEach((btn, index) => {
//                         if (btn && btn.getAttribute) {
//                             const lang = btn.getAttribute('data-lang-switch');
//                             console.log(`Button ${index + 1}: language=${lang}`);
//                         } else {
//                             console.warn(`⚠️ Invalid button at index ${index}`);
//                         }
//                     });
//                 } else {
//                     console.warn('⚠️ No toggle buttons found during initialization');
//                 }
//             } catch (error) {
//                 console.error('❌ Error during toggle button initialization:', error);
//             }
//         }, 200);
        
//     } catch (error) {
//         console.error('❌ Critical error during localization initialization:', error);
//     }
// });

// // Handle browser navigation (back/forward) with enhanced debugging and error handling
// window.addEventListener('popstate', () => {
//     try {
//         console.log('🔙 Browser navigation detected, current URL:', window.location?.href || 'unknown');
        
//         if (window.localizationManager && typeof window.localizationManager.detectLanguage === 'function') {
//             const newLang = window.localizationManager.detectLanguage();
//             const currentLang = window.localizationManager.currentLanguage;
            
//             console.log('🔍 Detected language from URL:', newLang);
//             console.log('🔍 Current language:', currentLang);
            
//             if (newLang && currentLang && newLang !== currentLang) {
//                 console.log('🔄 Language changed via navigation, switching to:', newLang);
//                 window.localizationManager.switchLanguage(newLang);
//             } else {
//                 console.log('✅ Language unchanged, no action needed');
//             }
//         } else {
//             console.error('❌ Localization manager not available or missing methods during navigation');
//         }
//     } catch (error) {
//         console.error('❌ Error handling browser navigation:', error);
//     }
// });

// // Expose globally for manual control and debugging
// window.LocalizationManager = LocalizationManager;

// // Global debug function for easy testing with enhanced error handling
// window.debugLocalization = function() {
//     try {
//         if (window.localizationManager && typeof window.localizationManager.debug === 'function') {
//             return window.localizationManager.debug();
//         } else {
//             console.error('❌ Localization manager not initialized or missing debug method');
//             return {
//                 error: 'Localization manager not available',
//                 available: false,
//                 timestamp: new Date().toISOString()
//             };
//         }
//     } catch (error) {
//         console.error('❌ Error in debugLocalization:', error);
//         return {
//             error: error.message,
//             available: false,
//             timestamp: new Date().toISOString()
//         };
//     }
// };

// // Global function to manually switch language for testing with validation
// window.switchLanguage = function(lang) {
//     try {
//         if (!lang || typeof lang !== 'string') {
//             console.error('❌ Invalid language parameter:', lang);
//             return false;
//         }
        
//         if (window.localizationManager && typeof window.localizationManager.switchLanguage === 'function') {
//             console.log('🔄 Manual language switch to:', lang);
//             window.localizationManager.switchLanguage(lang);
//             return true;
//         } else {
//             console.error('❌ Localization manager not initialized or missing switchLanguage method');
//             return false;
//         }
//     } catch (error) {
//         console.error('❌ Error in manual language switch:', error);
//         return false;
//     }
// };