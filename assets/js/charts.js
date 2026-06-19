/* ==========================================================
   OPN STAKE
   charts.js
   Production Analytics Engine
   ========================================================== */

class ChartsManager {

    constructor() {

        this.charts = {};

        this.refreshInterval = 30000;

        this.init();
    }

    /* ==================================================
       INIT
       ================================================== */

    async init() {

        await this.loadAllCharts();

        this.startRealtimeUpdates();

        this.bindThemeEvents();
    }

    /* ==================================================
       THEME
       ================================================== */

    isDarkMode() {

        return document.body.classList.contains(
            "dark-theme"
        );
    }

    getThemeColors() {

        return {

            text:
                this.isDarkMode()
                ? "#ffffff"
                : "#111827",

            grid:
                this.isDarkMode()
                ? "rgba(255,255,255,.08)"
                : "rgba(0,0,0,.08)",

            primary:
                "#00ffae",

            secondary:
                "#4f7cff",

            warning:
                "#ffcf54",

            danger:
                "#ff5a76"
        };
    }

    /* ==================================================
       LOAD ALL
       ================================================== */

    async loadAllCharts() {

        await this.renderTVLChart();

        await this.renderAPRChart();

        await this.renderValidatorChart();

        await this.renderRevenueChart();

        await this.renderRevenueSourcesChart();
    }

    /* ==================================================
       COMMON OPTIONS
       ================================================== */

    createOptions(title) {

        const colors =
            this.getThemeColors();

        return {

            responsive:true,

            maintainAspectRatio:false,

            interaction:{
                intersect:false,
                mode:"index"
            },

            plugins:{

                legend:{
                    labels:{
                        color:colors.text
                    }
                },

                title:{
                    display:true,
                    text:title,
                    color:colors.text
                }
            },

            scales:{

                x:{
                    ticks:{
                        color:colors.text
                    },
                    grid:{
                        color:colors.grid
                    }
                },

                y:{
                    ticks:{
                        color:colors.text
                    },
                    grid:{
                        color:colors.grid
                    }
                }
            }
        };
    }

    /* ==================================================
       TVL CHART
       ================================================== */

    async renderTVLChart() {

        const canvas =
            document.getElementById(
                "tvlChart"
            );

        if(!canvas) return;

        const data =
            await this.getTVLHistory();

        if(this.charts.tvl){

            this.charts.tvl.destroy();
        }

        this.charts.tvl =
        new Chart(canvas, {

            type:"line",

            data:{

                labels:data.labels,

                datasets:[{

                    label:"TVL",

                    data:data.values,

                    borderWidth:3,

                    tension:.4,

                    fill:true,

                    borderColor:"#00ffae",

                    backgroundColor:
                    "rgba(0,255,174,.1)"
                }]
            },

            options:
            this.createOptions(
                "Total Value Locked"
            )
        });
    }

    /* ==================================================
       APR CHART
       ================================================== */

    async renderAPRChart() {

        const canvas =
            document.getElementById(
                "aprChart"
            );

        if(!canvas) return;

        const data =
            await this.getAPRHistory();

        if(this.charts.apr){

            this.charts.apr.destroy();
        }

        this.charts.apr =
        new Chart(canvas, {

            type:"line",

            data:{

                labels:data.labels,

                datasets:[{

                    label:"APR %",

                    data:data.values,

                    borderColor:"#4f7cff",

                    borderWidth:3,

                    tension:.35,

                    fill:false
                }]
            },

            options:
            this.createOptions(
                "APR Trend"
            )
        });
    }

    /* ==================================================
       VALIDATOR DISTRIBUTION
       ================================================== */

    async renderValidatorChart() {

        const canvas =
            document.getElementById(
                "validatorChart"
            );

        if(!canvas) return;

        const validators =
            await this.getValidatorDistribution();

        if(this.charts.validators){

            this.charts.validators.destroy();
        }

        this.charts.validators =
        new Chart(canvas, {

            type:"doughnut",

            data:{

                labels:
                validators.labels,

                datasets:[{

                    data:
                    validators.values,

                    backgroundColor:[

                        "#00ffae",
                        "#4f7cff",
                        "#ffcf54",
                        "#ff5a76",
                        "#a855f7",
                        "#14b8a6"
                    ]
                }]
            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        position:"bottom"
                    }
                }
            }
        });
    }

    /* ==================================================
       REVENUE ANALYTICS
       ================================================== */

    async renderRevenueChart() {

        const canvas =
            document.getElementById(
                "revenueChart"
            );

        if(!canvas) return;

        const revenue =
            await this.getRevenueHistory();

        if(this.charts.revenue){

            this.charts.revenue.destroy();
        }

        this.charts.revenue =
        new Chart(canvas, {

            type:"line",

            data:{

                labels:
                revenue.labels,

                datasets:[{

                    label:
                    "Protocol Revenue",

                    data:
                    revenue.values,

                    borderColor:
                    "#00ffae",

                    backgroundColor:
                    "rgba(0,255,174,.1)",

                    fill:true,

                    tension:.4
                }]
            },

            options:
            this.createOptions(
                "Revenue Analytics"
            )
        });
    }

    /* ==================================================
       REVENUE SOURCES
       ================================================== */

    async renderRevenueSourcesChart() {

        const canvas =
            document.getElementById(
                "revenueSourcesChart"
            );

        if(!canvas) return;

        const sources =
            await this.getRevenueSources();

        if(this.charts.sources){

            this.charts.sources.destroy();
        }

        this.charts.sources =
        new Chart(canvas, {

            type:"pie",

            data:{

                labels:
                sources.labels,

                datasets:[{

                    data:
                    sources.values,

                    backgroundColor:[

                        "#00ffae",
                        "#4f7cff",
                        "#ffcf54",
                        "#ff5a76"
                    ]
                }]
            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        position:"bottom"
                    }
                }
            }
        });
    }

    /* ==================================================
       API LAYER
       ================================================== */

    async getTVLHistory() {

        try {

            if(window.api){

                const result =
                    await api.getTVLHistory();

                return result;
            }

        } catch(e){}

        return {

            labels:[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun"
            ],

            values:[
                120,
                145,
                175,
                220,
                260,
                287
            ]
        };
    }

    async getAPRHistory() {

        try {

            if(window.api){

                return await api.getAPRHistory();
            }

        } catch(e){}

        return {

            labels:[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun"
            ],

            values:[
                6.8,
                7.1,
                7.4,
                7.6,
                7.7,
                7.85
            ]
        };
    }

    async getValidatorDistribution() {

        try {

            if(window.api){

                return await api.getValidatorDistribution();
            }

        } catch(e){}

        return {

            labels:[
                "Validator A",
                "Validator B",
                "Validator C",
                "Validator D",
                "Validator E"
            ],

            values:[
                28,
                22,
                18,
                17,
                15
            ]
        };
    }

    async getRevenueHistory() {

        try {

            if(window.api){

                return await api.getRevenueHistory();
            }

        } catch(e){}

        return {

            labels:[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun"
            ],

            values:[
                15000,
                22000,
                29000,
                35000,
                41000,
                52000
            ]
        };
    }

    async getRevenueSources() {

        try {

            if(window.api){

                return await api.getRevenueSources();
            }

        } catch(e){}

        return {

            labels:[
                "Staking Fees",
                "Restaking Fees",
                "MEV",
                "Treasury Yield"
            ],

            values:[
                45,
                30,
                15,
                10
            ]
        };
    }

    /* ==================================================
       REFRESH
       ================================================== */

    async refreshAll() {

        await this.loadAllCharts();
    }

    startRealtimeUpdates() {

        setInterval(
            async () => {

                await this.refreshAll();

            },
            this.refreshInterval
        );
    }

    /* ==================================================
       THEME CHANGE
       ================================================== */

    bindThemeEvents() {

        document.addEventListener(
            "themeChanged",
            async () => {

                await this.refreshAll();
            }
        );
    }
}

/* ==========================================================
   GLOBAL INSTANCE
   ========================================================== */

window.chartsManager =
    new ChartsManager();

/* ==========================================================
   BOOT
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Charts Manager Ready"
        );
    }
);
