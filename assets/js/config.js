/* ==========================================================
   OPN Stake Protocol
   config.js
   Global Configuration
   ========================================================== */

const CONFIG = {

     CHAIN: {

        chainId: 984,

        chainIdHex:
            "0x800",

        chainName:
            "OPN Chain",

        rpcUrl:
            "https://rpc.opnchain.io"
    },

    CONTRACTS: {

        stOPN:
            "0x0000000000000000000000000000000000000000",

        rstOPN:
            "0x0000000000000000000000000000000000000000",

        restaking:
            "0x0000000000000000000000000000000000000000"
    }
};
    /* ======================================================
       APP
    ====================================================== */

    APP: {

        NAME: "OPN Stake",

        VERSION: "2.0.0",

        ENVIRONMENT: "production",

        DESCRIPTION:
            "Liquid Staking & Restaking Protocol on OPN Chain"
    },

    /* ======================================================
       CHAIN
    ====================================================== */

    CHAIN: {

        chainId: 900,

        chainIdHex: "0x384",

        name: "OPN Chain",

        rpcUrls: [

            "https://rpc.opnchain.io",

            "https://rpc2.opnchain.io"

        ],

        blockExplorerUrls: [

            "https://scan.opnchain.io"

        ],

        nativeCurrency: {

            name: "OPN",

            symbol: "OPN",

            decimals: 18
        }
    },

    /* ======================================================
       WALLETCONNECT
    ====================================================== */

    WALLETCONNECT_PROJECT_ID:

        "YOUR_WALLETCONNECT_PROJECT_ID",

    /* ======================================================
       CONTRACTS
    ====================================================== */

    CONTRACTS: {

        STAKING_MANAGER:
            "0x1111111111111111111111111111111111111111",

        STOPN:
            "0x2222222222222222222222222222222222222222",

        RSTOPN:
            "0x3333333333333333333333333333333333333333",

        RESTAKING_MANAGER:
            "0x4444444444444444444444444444444444444444",

        GOVERNOR:
            "0x5555555555555555555555555555555555555555",

        TREASURY:
            "0x6666666666666666666666666666666666666666"
    },

    /* ======================================================
       API
    ====================================================== */

    API: {

        BASE_URL:

            "https://api.opnstake.io",

        TVL:

            "/analytics/tvl",

        APR:

            "/analytics/apr",

        VALIDATORS:

            "/validators",

        TREASURY:

            "/treasury",

        GOVERNANCE:

            "/governance",

        RESTAKING:

            "/restaking",

        REWARDS:

            "/rewards"
    },

    /* ======================================================
       STAKING CONFIG
    ====================================================== */

    STAKING: {

        MIN_STAKE:

            1,

        MAX_STAKE:

            10000000,

        DEFAULT_APR:

            7.5,

        UNBONDING_DAYS:

            7,

        TOKEN_SYMBOL:

            "OPN",

        RECEIPT_TOKEN:

            "stOPN"
    },

    /* ======================================================
       RESTAKING CONFIG
    ====================================================== */

    RESTAKING: {

        DEFAULT_APR:

            9.8,

        TOKEN_SYMBOL:

            "rstOPN",

        MAX_OPERATORS:

            100,

        MAX_AVS:

            50
    },

    /* ======================================================
       GOVERNANCE
    ====================================================== */

    GOVERNANCE: {

        VOTING_DELAY:

            1,

        VOTING_PERIOD:

            7,

        PROPOSAL_THRESHOLD:

            10000,

        QUORUM_PERCENTAGE:

            4
    },

    /* ======================================================
       TREASURY
    ====================================================== */

    TREASURY: {

        RESERVE_TARGET:

            0.30,

        ECOSYSTEM_ALLOCATION:

            0.25,

        OPERATIONS_ALLOCATION:

            0.20,

        INCENTIVES_ALLOCATION:

            0.25
    },

    /* ======================================================
       DASHBOARD
    ====================================================== */

    DASHBOARD: {

        REFRESH_INTERVAL:

            30000,

        CHART_POINTS:

            30
    },

    /* ======================================================
       FEATURE FLAGS
    ====================================================== */

    FEATURES: {

        STAKING:

            true,

        RESTAKING:

            true,

        GOVERNANCE:

            true,

        TREASURY:

            true,

        ANALYTICS:

            true,

        NOTIFICATIONS:

            true
    }
};

/* ==========================================================
   CONTRACT ABI PLACEHOLDERS
   ========================================================== */

const CONTRACT_ABIS = {

    STOPN: [],

    RSTOPN: [],

    RESTAKING_MANAGER: [],

    GOVERNOR: [],

    TREASURY: []
};

/* ==========================================================
   NETWORK HELPERS
   ========================================================== */

function getRPC() {

    return CONFIG.CHAIN.rpcUrls[0];
}

function getExplorer() {

    return CONFIG.CHAIN.blockExplorerUrls[0];
}

function getExplorerTx(hash) {

    return `${getExplorer()}/tx/${hash}`;
}

function getExplorerAddress(address) {

    return `${getExplorer()}/address/${address}`;
}

function formatAddress(address) {

    if (!address)
        return "";

    return (
        address.slice(0, 6) +
        "..." +
        address.slice(-4)
    );
}

/* ==========================================================
   CONTRACT HELPERS
   ========================================================== */

function getContractAddress(name) {

    return CONFIG.CONTRACTS[name];
}

function getContractABI(name) {

    return CONTRACT_ABIS[name];
}

/* ==========================================================
   DASHBOARD HELPERS
   ========================================================== */

function formatUSD(value) {

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }
    ).format(value);
}

function formatToken(value) {

    return Number(value).toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 4
        }
    );
}

function formatPercent(value) {

    return `${Number(value).toFixed(2)}%`;
}

/* ==========================================================
   GLOBAL EXPORTS
   ========================================================== */

window.CONFIG = {

  API: {
    BASE_URL: "https://opn-api.vercel.app",

    TVL: "/tvl",
    APR: "/apr",
    VALIDATORS: "/validators",
    TREASURY: "/treasury",
    GOVERNANCE: "/governance",
    RESTAKING: "/restaking",
    REWARDS: "/rewards"
  },

  DASHBOARD: {
    REFRESH_INTERVAL: 30000
  },

  CHAIN: {
    chainId: 1,
    name: "OPN Chain",
    rpc: "https://rpc.opnchain.io"
  },

  CONTRACTS: {
    stOPN: "0x0000000000000000000000000000000000000000",
    rstOPN: "0x0000000000000000000000000000000000000000",
    RestakingManager: "0x0000000000000000000000000000000000000000"
  }
};

window.CONTRACT_ABIS = CONTRACT_ABIS;

window.getRPC = getRPC;

window.getExplorer = getExplorer;

window.getExplorerTx = getExplorerTx;

window.getExplorerAddress = getExplorerAddress;

window.getContractAddress =
    getContractAddress;

window.getContractABI =
    getContractABI;

window.formatAddress =
    formatAddress;

window.formatUSD =
    formatUSD;

window.formatToken =
    formatToken;

window.formatPercent =
    formatPercent;

/* ==========================================================
   READY
   ========================================================== */

console.log(
    `%c${CONFIG.APP.NAME} v${CONFIG.APP.VERSION}`,
    "color:#00ffae;font-weight:bold;"
);

console.log(
    "Config Loaded"
);
