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

    OPN:
        "0xc243b77C228E62131e1D103C5A6e2Bc843A119D9",

    STOPN:
        "0x93790bDf1a402f048F6a516fe1FD7831587b8842",

    RSTOPN:
        "0x99c84a6dAC60badA5713CaC133233EE95E9130D2",

    STAKING_MANAGER:
        "0x91d68C1a0d9247dCFAa69AE6E6AAd7a8b77176aC",

    RESTAKING_MANAGER:
        "0x59024E79CdD6C07aEA610AeCf01Ac310a1da6FC7"
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
