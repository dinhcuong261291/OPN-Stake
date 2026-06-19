/* ==========================================================
   OPN STAKE
   wallet.js
   Production Wallet Manager
   ========================================================== */

class WalletManager {

    constructor() {

        this.provider = null;
        this.signer = null;

        this.account = null;
        this.chainId = null;

        this.connected = false;

        this.OPN_CHAIN = {
            chainId: "0x7A69", // replace with real OPN chain
            chainName: "OPN Chain",
            nativeCurrency: {
                name: "OPN",
                symbol: "OPN",
                decimals: 18
            },
            rpcUrls: [
                "https://rpc.opnchain.io"
            ],
            blockExplorerUrls: [
                "https://scan.opnchain.io"
            ]
        };

        this.init();
    }

    /* ==========================================================
       INIT
       ========================================================== */

    async init() {

        this.cacheElements();

        this.registerEvents();

        await this.autoReconnect();
    }

    cacheElements() {

        this.walletModal =
            document.getElementById("walletModal");

        this.openWalletBtn =
            document.getElementById("openWalletModal");

        this.closeWalletBtn =
            document.getElementById("closeWalletModal");

        this.connectButtons =
            document.querySelectorAll(".wallet-option");

        this.connectWalletButton =
            document.querySelector(".connect-wallet-btn");
    }

    registerEvents() {

        if(this.openWalletBtn){

            this.openWalletBtn.addEventListener(
                "click",
                () => this.openModal()
            );
        }

        if(this.closeWalletBtn){

            this.closeWalletBtn.addEventListener(
                "click",
                () => this.closeModal()
            );
        }

        window.addEventListener(
            "click",
            (e) => {

                if(e.target === this.walletModal){

                    this.closeModal();
                }
            }
        );

        this.connectButtons.forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const walletName =
                        button.innerText.trim();

                    await this.connect(walletName);
                }
            );
        });
    }

    /* ==========================================================
       MODAL
       ========================================================== */

    openModal() {

        if(!this.walletModal) return;

        this.walletModal.classList.add("active");
    }

    closeModal() {

        if(!this.walletModal) return;

        this.walletModal.classList.remove("active");
    }

    /* ==========================================================
       WALLET DETECTION
       ========================================================== */

    getInjectedProvider() {

        if(window.ethereum){

            return window.ethereum;
        }

        throw new Error(
            "No injected wallet found"
        );
    }

    /* ==========================================================
       CONNECT
       ========================================================== */

    async connect(walletType) {

        try {

            if(walletType.includes("MetaMask")) {

                await this.connectInjected();

            } else if(walletType.includes("Rabby")) {

                await this.connectInjected();

            } else if(walletType.includes("OKX")) {

                await this.connectInjected();

            } else if(walletType.includes("WalletConnect")) {

                await this.connectWalletConnect();

            }

        } catch(error){

            console.error(error);

            this.notify(
                error.message,
                "error"
            );
        }
    }

    async connectInjected() {

        const injected =
            this.getInjectedProvider();

        await injected.request({

            method:
            "eth_requestAccounts"

        });

        this.provider =
            new ethers.BrowserProvider(
                injected
            );

        this.signer =
            await this.provider.getSigner();

        this.account =
            await this.signer.getAddress();

        const network =
            await this.provider.getNetwork();

        this.chainId =
            Number(network.chainId);

        this.connected = true;

        localStorage.setItem(
            "wallet_connected",
            "true"
        );

        await this.ensureCorrectChain();

        this.registerWalletListeners();

        this.updateUI();

        this.closeModal();

        this.notify(
            "Wallet Connected",
            "success"
        );
    }

    /* ==========================================================
       WALLETCONNECT
       ========================================================== */

    async connectWalletConnect() {

        this.notify(
            "WalletConnect SDK integration required",
            "info"
        );

        /*
        Example:

        const provider =
        await EthereumProvider.init({...})

        await provider.enable()

        */
    }

    /* ==========================================================
       SWITCH NETWORK
       ========================================================== */

    async ensureCorrectChain() {

        try {

            await window.ethereum.request({

                method:
                "wallet_switchEthereumChain",

                params:[
                    {
                        chainId:
                        this.OPN_CHAIN.chainId
                    }
                ]

            });

        } catch(error){

            if(error.code === 4902){

                await this.addNetwork();
            }
        }
    }

    async addNetwork() {

        await window.ethereum.request({

            method:
            "wallet_addEthereumChain",

            params:[
                this.OPN_CHAIN
            ]
        });
    }

    /* ==========================================================
       LISTENERS
       ========================================================== */

    registerWalletListeners() {

        if(!window.ethereum) return;

        window.ethereum.on(
            "accountsChanged",
            async(accounts)=>{

                if(accounts.length === 0){

                    this.disconnect();

                    return;
                }

                this.account =
                    accounts[0];

                this.updateUI();
            }
        );

        window.ethereum.on(
            "chainChanged",
            ()=>{

                window.location.reload();
            }
        );
    }

    /* ==========================================================
       AUTO RECONNECT
       ========================================================== */

    async autoReconnect() {

        const saved =
            localStorage.getItem(
                "wallet_connected"
            );

        if(
            saved !== "true"
        ) return;

        if(!window.ethereum)
            return;

        try {

            const accounts =
                await window.ethereum.request({

                    method:
                    "eth_accounts"
                });

            if(
                !accounts ||
                accounts.length === 0
            ) return;

            await this.connectInjected();

        } catch(err){

            console.warn(
                "Reconnect failed"
            );
        }
    }

    /* ==========================================================
       DISCONNECT
       ========================================================== */

    disconnect() {

        this.provider = null;
        this.signer = null;

        this.account = null;

        this.connected = false;

        localStorage.removeItem(
            "wallet_connected"
        );

        this.updateUI();

        this.notify(
            "Disconnected",
            "info"
        );
    }

    /* ==========================================================
       UI
       ========================================================== */

    shorten(address){

        if(!address)
            return "";

        return (
            address.slice(0,6)
            + "..."
            + address.slice(-4)
        );
    }

    updateUI() {

        if(
            !this.connectWalletButton
        ) return;

        if(this.connected){

            this.connectWalletButton.innerText =
                this.shorten(
                    this.account
                );

            this.connectWalletButton.classList.add(
                "wallet-connected"
            );

        } else {

            this.connectWalletButton.innerText =
                "Connect Wallet";

            this.connectWalletButton.classList.remove(
                "wallet-connected"
            );
        }

        this.updateWalletData();
    }

    async updateWalletData() {

        if(
            !this.connected ||
            !this.provider
        ) return;

        try {

            const balance =
                await this.provider.getBalance(
                    this.account
                );

            const formatted =
                ethers.formatEther(
                    balance
                );

            const balanceEl =
                document.getElementById(
                    "walletBalance"
                );

            if(balanceEl){

                balanceEl.innerText =
                Number(
                    formatted
                ).toFixed(4)
                + " OPN";
            }

        } catch(error){

            console.error(error);
        }
    }

    /* ==========================================================
       CONTRACT HELPERS
       ========================================================== */

    async getContract(
        address,
        abi
    ){

        if(!this.signer){

            throw new Error(
                "Wallet not connected"
            );
        }

        return new ethers.Contract(
            address,
            abi,
            this.signer
        );
    }

    /* ==========================================================
       SIGN MESSAGE
       ========================================================== */

    async signMessage(message){

        if(!this.signer){

            throw new Error(
                "Wallet not connected"
            );
        }

        return await this.signer.signMessage(
            message
        );
    }

    /* ==========================================================
       NOTIFICATION
       ========================================================== */

    notify(
        message,
        type = "info"
    ){

        console.log(
            `[${type}]`,
            message
        );

        if(
            window.showToast
        ){

            window.showToast(
                message,
                type
            );
        }
    }

}

/* ==========================================================
   GLOBAL INSTANCE
   ========================================================== */

window.walletManager =
    new WalletManager();

/* ==========================================================
   HELPERS
   ========================================================== */

window.connectWallet =
    async function(){

        await walletManager.openModal();
    };

window.disconnectWallet =
    async function(){

        walletManager.disconnect();
    };

/* ==========================================================
   EVENTS
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        console.log(
            "Wallet Manager Ready"
        );
    }
);
