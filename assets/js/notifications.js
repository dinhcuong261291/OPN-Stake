/* ==========================================================
   OPN Stake
   notifications.js
   Production Notification System
   ========================================================== */

class NotificationManager {

    constructor() {

        this.container = null;

        this.queue = [];

        this.maxNotifications = 5;

        this.defaultDuration = 5000;

        this.init();
    }

    /* ==================================================
       INIT
       ================================================== */

    init() {

        this.createContainer();

        console.log(
            "Notification Manager Ready"
        );
    }

    createContainer() {

    let container =
        document.getElementById(
            "toastContainer"
        );

    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.id =
            "toastContainer";

        container.className =
            "toast-container";

        if (document.body) {

            document.body.appendChild(
                container
            );

        } else {

            window.addEventListener(
                "DOMContentLoaded",
                () => {

                    document.body.appendChild(
                        container
                    );
                }
            );
        }
    }

    this.container =
        container;
}

    /* ==================================================
       CREATE TOAST
       ================================================== */

    show(
    message,
    type = "info",
    duration = null
){

    if (!this.container) {

        this.createContainer();
    }

    if (!this.container) {

        console.warn(
            "Toast container unavailable"
        );

        return;
    }

    duration =
        duration ||
        this.defaultDuration;

        if(
            this.container.children.length
            >=
            this.maxNotifications
        ){

            this.container
            .firstElementChild
            ?.remove();
        }

        const toast =
            document.createElement(
                "div"
            );

        toast.className =
            `toast toast-${type}`;

        toast.innerHTML = `
            <div class="toast-content">

                <div class="toast-icon">
                    ${this.getIcon(type)}
                </div>

                <div class="toast-message">
                    ${message}
                </div>

                <button class="toast-close">
                    ×
                </button>

            </div>
        `;

        this.container.appendChild(
            toast
        );

        requestAnimationFrame(()=>{

            toast.classList.add(
                "show"
            );
        });

        toast
        .querySelector(".toast-close")
        .addEventListener(

            "click",

            ()=>{

                this.remove(toast);
            }
        );

        setTimeout(()=>{

            this.remove(toast);

        }, duration);

        return toast;
    }

    /* ==================================================
       REMOVE
       ================================================== */

    remove(toast) {

        if(!toast)
            return;

        toast.classList.remove(
            "show"
        );

        setTimeout(()=>{

            toast.remove();

        },300);
    }

    /* ==================================================
       TYPES
       ================================================== */

    success(message){

        return this.show(
            message,
            "success"
        );
    }

    error(message){

        return this.show(
            message,
            "error",
            7000
        );
    }

    warning(message){

        return this.show(
            message,
            "warning"
        );
    }

    info(message){

        return this.show(
            message,
            "info"
        );
    }

    /* ==================================================
       ICONS
       ================================================== */

    getIcon(type){

        switch(type){

            case "success":
                return "✅";

            case "error":
                return "❌";

            case "warning":
                return "⚠️";

            default:
                return "ℹ️";
        }
    }

    /* ==================================================
       TX TRACKER
       ================================================== */

    async trackTransaction(

        tx,

        pendingMessage =
        "Transaction submitted",

        successMessage =
        "Transaction confirmed"

    ){

        try {

            const pendingToast =
                this.info(
                    pendingMessage
                );

            const receipt =
                await tx.wait();

            this.remove(
                pendingToast
            );

            let explorerUrl = "";

            try {

                explorerUrl =
                CONFIG.CHAIN
                .blockExplorerUrls[0]
                +
                "/tx/"
                +
                receipt.hash;

            } catch(e){}

            this.success(

                `
                ${successMessage}
                <br>
                ${
                    explorerUrl

                    ?

                    `<a
                     href="${explorerUrl}"
                     target="_blank">
                     View Transaction
                     </a>`

                    :

                    ""
                }
                `
            );

            return receipt;

        } catch(error){

            this.error(

                error.reason ||

                error.message ||

                "Transaction Failed"
            );

            throw error;
        }
    }

    /* ==================================================
       PROMISE WRAPPER
       ================================================== */

    async promise(

        promise,

        messages = {

            loading:
            "Loading...",

            success:
            "Success",

            error:
            "Failed"
        }

    ){

        const loadingToast =
            this.info(
                messages.loading
            );

        try {

            const result =
                await promise;

            this.remove(
                loadingToast
            );

            this.success(
                messages.success
            );

            return result;

        } catch(error){

            this.remove(
                loadingToast
            );

            this.error(

                error.message ||

                messages.error
            );

            throw error;
        }
    }

    /* ==================================================
       WALLET EVENTS
       ================================================== */

    walletConnected(address){

        this.success(

            `
            Wallet Connected
            <br>
            ${address.slice(0,6)}
            ...
            ${address.slice(-4)}
            `
        );
    }

    walletDisconnected(){

        this.warning(
            "Wallet Disconnected"
        );
    }

    networkChanged(chainId){

        this.info(

            `
            Network Changed
            <br>
            Chain:
            ${chainId}
            `
        );
    }

    /* ==================================================
       STAKING EVENTS
       ================================================== */

    stakingSuccess(

        amount

    ){

        this.success(

            `
            Successfully Staked
            ${amount}
            OPN
            `
        );
    }

    unstakeSuccess(

        amount

    ){

        this.success(

            `
            Unstaked
            ${amount}
            stOPN
            `
        );
    }

    restakeSuccess(

        amount

    ){

        this.success(

            `
            Restaked
            ${amount}
            stOPN
            `
        );
    }

    claimSuccess(

        amount

    ){

        this.success(

            `
            Claimed
            ${amount}
            Rewards
            `
        );
    }

    /* ==================================================
       GOVERNANCE
       ================================================== */

    voteSubmitted(){

        this.info(
            "Vote Submitted"
        );
    }

    voteConfirmed(){

        this.success(
            "Vote Confirmed"
        );
    }

    proposalCreated(id){

        this.success(

            `
            Proposal #${id}
            Created
            `
        );
    }
}

/* ==========================================================
   GLOBAL INSTANCE
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.notify =
            new NotificationManager();

        console.log(
            "Notifications Loaded"
        );
    }
);

/* ==========================================================
   SHORTCUTS
   ========================================================== */

window.toast = {

    success:
    (...args)=>
    notify.success(...args),

    error:
    (...args)=>
    notify.error(...args),

    warning:
    (...args)=>
    notify.warning(...args),

    info:
    (...args)=>
    notify.info(...args)
};
