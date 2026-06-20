/* ==========================================================
   OPN Stake
   app.js
   Production Frontend Controller
   ========================================================== */

class App {

    constructor() {

        this.counterObservers = [];

        this.init();
    }

    /* ==================================================
       INIT
       ================================================== */

    async init() {

        this.cacheElements();

        this.registerEvents();

        this.initFAQ();

        this.initTheme();

        this.initNavbar();

        this.initCounters();

        this.initScrollReveal();

        this.initSmoothScroll();

        this.startRealtimeUpdates();

        console.log(
            "OPN Stake App Ready"
        );
    }

    /* ==================================================
       ELEMENTS
       ================================================== */

    cacheElements() {

        this.navbar =
            document.querySelector(
                ".navbar"
            );

        this.themeToggle =
            document.getElementById(
                "themeToggle"
            );

        this.mobileMenuBtn =
            document.getElementById(
                "mobileMenuBtn"
            );

        this.mobileMenu =
            document.getElementById(
                "mobileMenu"
            );
    }

    /* ==================================================
       EVENTS
       ================================================== */

    registerEvents() {

        window.addEventListener(
            "scroll",
            () => {

                this.handleNavbar();
            }
        );

        if(this.themeToggle){

            this.themeToggle.addEventListener(
                "click",
                () => {

                    this.toggleTheme();
                }
            );
        }

        if(this.mobileMenuBtn){

            this.mobileMenuBtn.addEventListener(
                "click",
                () => {

                    this.toggleMobileMenu();
                }
            );
        }
    }

    /* ==================================================
       FAQ
       ================================================== */

    initFAQ() {

        const items =
            document.querySelectorAll(
                ".faq-item"
            );

        items.forEach(item=>{

            const question =
                item.querySelector(
                    ".faq-question"
                );

            if(!question)
                return;

            question.addEventListener(
                "click",
                ()=>{

                    item.classList.toggle(
                        "active"
                    );
                }
            );
        });
    }

    /* ==================================================
       THEME
       ================================================== */

    initTheme() {

        const stored =
            localStorage.getItem(
                "theme"
            );

        if(stored){

            document.body.classList.add(
                stored
            );
        }
    }

    toggleTheme() {

        document.body.classList.toggle(
            "dark-theme"
        );

        const enabled =
            document.body.classList.contains(
                "dark-theme"
            );

        localStorage.setItem(

            "theme",

            enabled
            ? "dark-theme"
            : ""
        );

        document.dispatchEvent(

            new Event(
                "themeChanged"
            )
        );
    }

    /* ==================================================
       NAVBAR
       ================================================== */

    initNavbar() {

        this.handleNavbar();
    }

    handleNavbar() {

        if(!this.navbar)
            return;

        if(window.scrollY > 50){

            this.navbar.classList.add(
                "scrolled"
            );

        } else {

            this.navbar.classList.remove(
                "scrolled"
            );
        }
    }

    /* ==================================================
       MOBILE MENU
       ================================================== */

    toggleMobileMenu() {

        if(!this.mobileMenu)
            return;

        this.mobileMenu.classList.toggle(
            "active"
        );
    }

    /* ==================================================
       COUNTERS
       ================================================== */

    initCounters() {

        const counters =
            document.querySelectorAll(
                "[data-counter]"
            );

        counters.forEach(counter=>{

            const target =
                Number(
                    counter.dataset.counter
                );

            this.animateCounter(
                counter,
                target
            );
        });
    }

    animateCounter(
        element,
        target
    ){

        let current = 0;

        const step =
            target / 100;

        const interval =
            setInterval(()=>{

                current += step;

                if(current >= target){

                    current = target;

                    clearInterval(
                        interval
                    );
                }

                element.innerText =
                    Math.floor(
                        current
                    ).toLocaleString();

            },15);
    }

    /* ==================================================
       SCROLL REVEAL
       ================================================== */

    initScrollReveal() {

        const elements =
            document.querySelectorAll(
                ".fade-in"
            );

        const observer =
        new IntersectionObserver(

            entries=>{

                entries.forEach(

                    entry=>{

                        if(
                            entry.isIntersecting
                        ){

                            entry.target.classList.add(
                                "visible"
                            );
                        }
                    }
                );

            },

            {
                threshold:.15
            }
        );

        elements.forEach(

            el=>observer.observe(el)
        );
    }

    /* ==================================================
       SMOOTH SCROLL
       ================================================== */

    initSmoothScroll() {

        document
        .querySelectorAll(
            'a[href^="#"]'
        )

        .forEach(link=>{

            link.addEventListener(
                "click",

                e=>{

                    const href =
                        link.getAttribute(
                            "href"
                        );

                    if(
                        href === "#"
                    ) return;

                    e.preventDefault();

                    const target =
                        document.querySelector(
                            href
                        );

                    if(target){

                        target.scrollIntoView({

                            behavior:
                            "smooth"
                        });
                    }
                }
            );
        });
    }

    /* ==================================================
       REALTIME
       ================================================== */

    startRealtimeUpdates() {

        setInterval(

            async ()=>{

                await this.updateProtocolMetrics();

            },

            CONFIG?.REFRESH_INTERVAL
            || 30000
        );
    }

    async updateProtocolMetrics() {

        try {

            if(!window.analytics)
                return;

            const metrics =
                await analytics.loadMetrics();

            this.updateMetricElement(
                "tvlCounter",
                "$" +
                metrics.tvl
                .toLocaleString()
            );

            this.updateMetricElement(
                "validatorCount",
                metrics.validatorCount
            );

            this.updateMetricElement(
                "averageAPR",
                metrics.averageAPR +
                "%"
            );

        } catch(error){

            console.error(error);
        }
    }

    updateMetricElement(
        id,
        value
    ){

        const element =
            document.getElementById(
                id
            );

        if(element){

            element.innerText =
                value;
        }
    }

    /* ==================================================
       TOASTS
       ================================================== */

    showToast(
        message,
        type = "info"
    ){

        const container =
            document.getElementById(
                "toastContainer"
            );

        if(!container)
            return;

        const toast =
            document.createElement(
                "div"
            );

        toast.className =
            `toast ${type}`;

        toast.innerHTML =
            message;

        container.appendChild(
            toast
        );

        setTimeout(()=>{

            toast.classList.add(
                "show"
            );

        },100);

        setTimeout(()=>{

            toast.remove();

        },5000);
    }

    /* ==================================================
       WALLET HELPERS
       ================================================== */

    openWallet() {

        if(window.walletManager){

            walletManager.openModal();
        }
    }

    closeWallet() {

        if(window.walletManager){

            walletManager.closeModal();
        }
    }
}

/* ==========================================================
   GLOBAL APP
   ========================================================== */

window.app =
    new App();

/* ==========================================================
   GLOBAL TOAST
   ========================================================== */

window.showToast =
function(
    message,
    type
){

    app.showToast(
        message,
        type
    );
};

/* ==========================================================
   PAGE READY
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const connectBtn =
            document.getElementById(
                "connectWalletBtn"
            );

        if (connectBtn) {

            connectBtn.addEventListener(
                "click",
                async () => {

                    const address =
                        await walletManager.connectMetaMask();

                    if (!address)
                        return;

                    const shortAddress =
                        address.substring(0, 6) +
                        "..." +
                        address.substring(
                            address.length - 4
                        );

                    connectBtn.innerText =
                        shortAddress;

                    const walletInfo =
                        document.getElementById(
                            "walletInfo"
                        );

                    const walletAddress =
                        document.getElementById(
                            "walletAddress"
                        );

                    if (
                        walletInfo &&
                        walletAddress
                    ) {

                        walletInfo.style.display =
                            "flex";

                        walletAddress.innerText =
                            address;
                    }
                }
            );
        }
    }
);
