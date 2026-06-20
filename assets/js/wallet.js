/* ==========================================================
   OPN Stake Wallet Manager
   ========================================================== */

class WalletManager {

    constructor() {

        this.provider = null;
        this.signer = null;
        this.address = null;
        this.chainId = null;
    }

    async connectMetaMask() {

        try {

            if (!window.ethereum) {

                alert(
                    "MetaMask is not installed"
                );

                return null;
            }

            const accounts =
                await window.ethereum.request({
                    method:
                        "eth_requestAccounts"
                });

            this.provider =
                new ethers.BrowserProvider(
                    window.ethereum
                );

            this.signer =
                await this.provider.getSigner();

            this.address =
                accounts[0];

            const network =
                await this.provider.getNetwork();

            this.chainId =
                Number(network.chainId);

            console.log(
                "Wallet Connected:",
                this.address
            );

            return this.address;

        } catch (error) {

            console.error(
                "MetaMask connection failed",
                error
            );

            return null;
        }
    }

    disconnect() {

        this.provider = null;
        this.signer = null;
        this.address = null;
        this.chainId = null;
    }

    isConnected() {

        return !!this.signer;
    }

    getAddress() {

        return this.address;
    }

    getSigner() {

        return this.signer;
    }

    getProvider() {

        return this.provider;
    }

    getContract(
        address,
        abi
    ) {

        if (!this.signer) {

            return null;
        }

        return new ethers.Contract(
            address,
            abi,
            this.signer
        );
    }
}

window.walletManager =
    new WalletManager();

console.log(
    "Wallet Manager Ready"
);

if (window.ethereum) {

    window.ethereum.on(
        "accountsChanged",
        accounts => {

            if (
                accounts.length === 0
            ) {

                location.reload();

                return;
            }

            walletManager.address =
                accounts[0];
        }
    );

    window.ethereum.on(
        "chainChanged",
        () => {

            location.reload();
        }
    );
}
