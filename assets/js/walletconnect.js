/* ==========================================================
   OPN Stake
   walletconnect.js
   WalletConnect v2 Integration
   ========================================================== */

class WalletConnectManager {

    constructor() {

        this.provider = null;

        this.initialized = false;

        this.projectId =
            CONFIG.WALLETCONNECT_PROJECT_ID;

        this.requiredChains = [
            CONFIG.CHAIN.chainId
        ];
    }

    /* ==================================================
       INIT
       ================================================== */

    async init() {

        if (this.initialized)
            return this.provider;

        try {

            this.provider =
                await window.EthereumProvider.init({

                    projectId:
                        this.projectId,

                    chains:
                        this.requiredChains,

                    showQrModal: true,

                    methods: [

                        "eth_sendTransaction",
                        "eth_sign",
                        "personal_sign",
                        "eth_signTypedData",
                        "eth_signTypedData_v4"

                    ],

                    events: [

                        "chainChanged",
                        "accountsChanged",
                        "disconnect"

                    ],

                    rpcMap: {

                        [CONFIG.CHAIN.chainId]:
                            CONFIG.CHAIN.rpcUrls[0]

                    }

                });

            this.registerEvents();

            this.initialized = true;

            console.log(
                "WalletConnect Ready"
            );

            return this.provider;

        } catch (error) {

            console.error(
                "WalletConnect Init Failed",
                error
            );

            throw error;
        }
    }

    /* ==================================================
       CONNECT
       ================================================== */

    async connect() {

        try {

            if (!this.provider)
                await this.init();

            await this.provider.enable();

            const accounts =
                this.provider.accounts;

            const address =
                accounts[0];

            const ethersProvider =
                new ethers.BrowserProvider(
                    this.provider
                );

            const signer =
                await ethersProvider.getSigner();

            window.walletProvider =
                ethersProvider;

            window.walletSigner =
                signer;

            window.walletAddress =
                address;

            if (window.notify) {

                notify.walletConnected(
                    address
                );
            }

            this.updateWalletUI(
                address
            );

            return {

                provider:
                    ethersProvider,

                signer,

                address

            };

        } catch (error) {

            console.error(
                "WalletConnect Error",
                error
            );

            if (window.notify) {

                notify.error(
                    error.message
                );
            }

            throw error;
        }
    }

    /* ==================================================
       DISCONNECT
       ================================================== */

    async disconnect() {

        try {

            if (!this.provider)
                return;

            await this.provider.disconnect();

            window.walletProvider = null;
            window.walletSigner = null;
            window.walletAddress = null;

            if (window.notify)
                notify.walletDisconnected();

            this.resetWalletUI();

        } catch (error) {

            console.error(
                error
            );
        }
    }

    /* ==================================================
       EVENTS
       ================================================== */

    registerEvents() {

        this.provider.on(

            "accountsChanged",

            async accounts => {

                if (
                    !accounts ||
                    accounts.length === 0
                ) {

                    await this.disconnect();

                    return;
                }

                const address =
                    accounts[0];

                window.walletAddress =
                    address;

                this.updateWalletUI(
                    address
                );

                if (window.notify) {

                    notify.walletConnected(
                        address
                    );
                }
            }
        );

        this.provider.on(

            "chainChanged",

            chainId => {

                const id =
                    parseInt(
                        chainId,
                        16
                    );

                if (window.notify) {

                    notify.networkChanged(
                        id
                    );
                }

                window.location.reload();
            }
        );

        this.provider.on(

            "disconnect",

            async () => {

                await this.disconnect();
            }
        );
    }

    /* ==================================================
       SWITCH NETWORK
       ================================================== */

    async switchNetwork() {

        try {

            await this.provider.request({

                method:
                    "wallet_switchEthereumChain",

                params: [

                    {
                        chainId:
                            "0x" +
                            CONFIG.CHAIN.chainId.toString(
                                16
                            )
                    }

                ]
            });

        } catch (error) {

            if (
                error.code === 4902
            ) {

                await this.addNetwork();
            }

            throw error;
        }
    }

    /* ==================================================
       ADD NETWORK
       ================================================== */

    async addNetwork() {

        return this.provider.request({

            method:
                "wallet_addEthereumChain",

            params: [

                {
                    chainId:
                        "0x" +
                        CONFIG.CHAIN.chainId.toString(
                            16
                        ),

                    chainName:
                        CONFIG.CHAIN.name,

                    nativeCurrency:
                        CONFIG.CHAIN.nativeCurrency,

                    rpcUrls:
                        CONFIG.CHAIN.rpcUrls,

                    blockExplorerUrls:
                        CONFIG.CHAIN.blockExplorerUrls
                }

            ]
        });
    }

    /* ==================================================
       UI
       ================================================== */

    updateWalletUI(
        address
    ) {

        const button =
            document.getElementById(
                "openWalletModal"
            );

        if (!button)
            return;

        button.innerHTML =
            address.substring(
                0,
                6
            ) +
            "..." +
            address.substring(
                address.length - 4
            );
    }

    resetWalletUI() {

        const button =
            document.getElementById(
                "openWalletModal"
            );

        if (!button)
            return;

        button.innerHTML =
            "Connect Wallet";
    }

    /* ==================================================
       IS CONNECTED
       ================================================== */

    isConnected() {

        return !!window.walletAddress;
    }

    /* ==================================================
       GET ACCOUNT
       ================================================== */

    getAccount() {

        return window.walletAddress;
    }
}

/* ==========================================================
   GLOBAL INSTANCE
   ========================================================== */

window.walletConnectManager =
    new WalletConnectManager();

/* ==========================================================
   CONNECT BUTTON
   ========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        const wcButtons =
            document.querySelectorAll(
                ".walletconnect-btn"
            );

        wcButtons.forEach(

            button => {

                button.addEventListener(

                    "click",

                    async () => {

                        try {

                            await walletConnectManager.connect();

                        } catch (error) {

                            console.error(
                                error
                            );
                        }
                    }
                );
            }
        );
    }
);

/* ==========================================================
   EXPORTED HELPERS
   ========================================================== */

window.connectWalletConnect =
    async () =>
        walletConnectManager.connect();

window.disconnectWalletConnect =
    async () =>
        walletConnectManager.disconnect();

window.isWalletConnectConnected =
    () =>
        walletConnectManager.isConnected();

console.log(
    "walletconnect.js loaded"
);
