/* ==========================================================
   OPN STAKE
   staking.js
   Production Staking Manager
   ========================================================== */

class StakingManager {

    constructor() {

        /* ==================================================
           CONTRACTS
           ================================================== */

        this.contracts = {

            stOPN:
            "0x0000000000000000000000000000000000001001",

            rstOPN:
            "0x0000000000000000000000000000000000001002",

            restakingManager:
            "0x0000000000000000000000000000000000001003"
        };

        /* ==================================================
           STATE
           ================================================== */

        this.apr = 7.85;
        this.restakeAPR = 5.18;
        this.tvl = 287000000;

        this.init();
    }

    /* ==================================================
       INIT
       ================================================== */

    async init() {

        this.cacheElements();

        this.bindEvents();

        await this.loadProtocolData();

        this.startRealtimeRefresh();
    }

    cacheElements() {

        this.stakeInput =
            document.getElementById(
                "stakeAmount"
            );

        this.receiveAmount =
            document.getElementById(
                "receiveAmount"
            );

        this.stakeButton =
            document.querySelector(
                ".stake-btn-full"
            );

        this.calcInput =
            document.getElementById(
                "calculatorAmount"
            );

        this.stakingRewards =
            document.getElementById(
                "stakingRewards"
            );

        this.restakingRewards =
            document.getElementById(
                "restakingRewards"
            );

        this.totalRewards =
            document.getElementById(
                "totalRewards"
            );
    }

    bindEvents() {

        if(this.stakeInput){

            this.stakeInput.addEventListener(
                "input",
                () => {

                    this.updateReceiveAmount();
                }
            );
        }

        if(this.calcInput){

            this.calcInput.addEventListener(
                "input",
                () => {

                    this.calculateRewards();
                }
            );
        }

        if(this.stakeButton){

            this.stakeButton.addEventListener(
                "click",
                () => {

                    this.handleStake();
                }
            );
        }
    }

    /* ==================================================
       ABI
       ================================================== */

    get stOPNAbi() {

        return [

            "function stake() payable",

            "function unstake(uint256 amount)",

            "function balanceOf(address account) view returns(uint256)",

            "event Staked(address indexed user,uint256 amount)",

            "event Unstaked(address indexed user,uint256 amount)"
        ];
    }

    get rstOPNAbi() {

        return [

            "function balanceOf(address account) view returns(uint256)"
        ];
    }

    get restakingAbi() {

        return [

            "function restake(uint256 amount)",

            "function totalRestaked() view returns(uint256)",

            "event Restaked(address indexed user,uint256 amount)"
        ];
    }

    /* ==================================================
       CONTRACTS
       ================================================== */

    async getStOPNContract() {

        return await walletManager.getContract(
            this.contracts.stOPN,
            this.stOPNAbi
        );
    }

    async getRstOPNContract() {

        return await walletManager.getContract(
            this.contracts.rstOPN,
            this.rstOPNAbi
        );
    }

    async getRestakingContract() {

        return await walletManager.getContract(
            this.contracts.restakingManager,
            this.restakingAbi
        );
    }

    /* ==================================================
       STAKE
       ================================================== */

    async handleStake() {

        try {

            if (!walletManager.isConnected()) {

    console.log(
        "Wallet not connected"
    );

    return;
}

const contract =
    await walletManager.getContract();

            walletManager.notify(
                "Submitting stake transaction..."
            );

            const tx =
                await contract.stake({

                    value:
                    ethers.parseEther(
                        amount
                    )
                });

            await tx.wait();

            walletManager.notify(
                "Stake successful",
                "success"
            );

            await this.refreshUserData();

        } catch(error){

            console.error(error);

            walletManager.notify(
                error.message,
                "error"
            );
        }
    }

    /* ==================================================
       UNSTAKE
       ================================================== */

    async unstake(amount) {

        try {

            const contract =
                await this.getStOPNContract();

            const tx =
                await contract.unstake(

                    ethers.parseEther(
                        amount.toString()
                    )
                );

            await tx.wait();

            walletManager.notify(
                "Unstake completed",
                "success"
            );

        } catch(error){

            walletManager.notify(
                error.message,
                "error"
            );
        }
    }

    /* ==================================================
       RESTAKE
       ================================================== */

    async restake(amount) {

        try {

            const contract =
                await this.getRestakingContract();

            const tx =
                await contract.restake(

                    ethers.parseEther(
                        amount.toString()
                    )
                );

            await tx.wait();

            walletManager.notify(
                "Restake successful",
                "success"
            );

        } catch(error){

            walletManager.notify(
                error.message,
                "error"
            );
        }
    }

    /* ==================================================
       CALCULATOR
       ================================================== */

    calculateRewards() {

        if(!this.calcInput)
            return;

        const amount =
            Number(
                this.calcInput.value || 0
            );

        const stakingReward =
            amount *
            (this.apr / 100);

        const restakingReward =
            amount *
            (this.restakeAPR / 100);

        const total =
            stakingReward +
            restakingReward;

        if(this.stakingRewards){

            this.stakingRewards.innerText =
                stakingReward.toFixed(2)
                + " OPN";
        }

        if(this.restakingRewards){

            this.restakingRewards.innerText =
                restakingReward.toFixed(2)
                + " OPN";
        }

        if(this.totalRewards){

            this.totalRewards.innerText =
                total.toFixed(2)
                + " OPN";
        }
    }

    /* ==================================================
       RECEIVE AMOUNT
       ================================================== */

    updateReceiveAmount() {

        if(
            !this.stakeInput ||
            !this.receiveAmount
        ) return;

        const amount =
            Number(
                this.stakeInput.value || 0
            );

        const fee = 0.005;

        const receive =
            amount *
            (1 - fee);

        this.receiveAmount.innerText =
            receive.toFixed(4);
    }

    /* ==================================================
       TVL
       ================================================== */

    async loadProtocolData() {

        try {

            const tvlEl =
                document.getElementById(
                    "tvlCounter"
                );

            const aprEl =
                document.getElementById(
                    "aprCounter"
                );

            if(tvlEl){

                tvlEl.innerText =
                    "$" +
                    this.tvl
                    .toLocaleString();
            }

            if(aprEl){

                aprEl.innerText =
                    this.apr + "%";
            }

        } catch(error){

            console.error(error);
        }
    }

    /* ==================================================
       USER DATA
       ================================================== */

    async refreshUserData() {

        if(
            !walletManager.connected
        ) return;

        try {

            const stContract =
                await this.getStOPNContract();

            const balance =
                await stContract.balanceOf(

                    walletManager.account
                );

            const formatted =
                ethers.formatEther(
                    balance
                );

            const el =
                document.getElementById(
                    "stOPNBalance"
                );

            if(el){

                el.innerText =
                    Number(formatted)
                    .toFixed(4);
            }

        } catch(error){

            console.error(error);
        }
    }

    /* ==================================================
       EVENTS
       ================================================== */

    async registerEvents() {

        try {

            const stContract =
                await this.getStOPNContract();

            stContract.on(
                "Staked",
                (
                    user,
                    amount
                ) => {

                    console.log(
                        "Stake Event",
                        user,
                        amount.toString()
                    );

                    this.loadProtocolData();
                }
            );

            stContract.on(
                "Unstaked",
                (
                    user,
                    amount
                ) => {

                    console.log(
                        "Unstake Event",
                        user,
                        amount.toString()
                    );

                    this.loadProtocolData();
                }
            );

            const restaking =
                await this.getRestakingContract();

            restaking.on(
                "Restaked",
                (
                    user,
                    amount
                ) => {

                    console.log(
                        "Restake Event",
                        user,
                        amount.toString()
                    );

                    this.loadProtocolData();
                }
            );

        } catch(error){

            console.error(error);
        }
    }

    /* ==================================================
       REALTIME REFRESH
       ================================================== */

    startRealtimeRefresh() {

        setInterval(
            async () => {

                await this.loadProtocolData();

                await this.refreshUserData();

            },
            30000
        );
    }

}

/* ==========================================================
   GLOBAL INSTANCE
   ========================================================== */

window.stakingManager =
    new StakingManager();

/* ==========================================================
   HELPERS
   ========================================================== */

window.stakeOPN =
    async(amount) => {

        await stakingManager.handleStake(
            amount
        );
    };

window.unstakeOPN =
    async(amount) => {

        await stakingManager.unstake(
            amount
        );
    };

window.restakeOPN =
    async(amount) => {

        await stakingManager.restake(
            amount
        );
    };

/* ==========================================================
   BOOT
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Staking Manager Ready"
        );

        await stakingManager.calculateRewards();

        await stakingManager.registerEvents();
    }
);
