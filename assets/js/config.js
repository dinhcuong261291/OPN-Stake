window.CONFIG = {

    APP: {
        NAME: "OPN Stake",
        VERSION: "2.0.0",
        ENVIRONMENT: "production"
    },

    CHAIN: {
        chainId: 984,
        chainIdHex: "0x384",
        name: "OPN Chain",
        rpcUrls: [
            "https://rpc.opnchain.io"
        ],
        blockExplorerUrls: [
            "https://scan.opnchain.io"
        ]
    },

    WALLETCONNECT_PROJECT_ID:
        "YOUR_PROJECT_ID",

    CONTRACTS: {

        STAKING_MANAGER:
            "0x1111111111111111111111111111111111111111",

        STOPN:
            "0x2222222222222222222222222222222222222222",

        RSTOPN:
            "0x3333333333333333333333333333333333333333",

        RESTAKING_MANAGER:
            "0x4444444444444444444444444444444444444444"
    },

    API: {
        BASE_URL:
            "https://api.opnstake.io"
    },

    DASHBOARD: {
        REFRESH_INTERVAL:
            30000
    }
};

console.log("Config Loaded");
