/* ==========================================================
   OPN DAO GOVERNANCE
   governance.js
   ========================================================== */

class GovernanceManager {

    constructor() {

        this.proposals = [];

        this.refreshInterval =
            CONFIG?.REFRESH_INTERVAL || 30000;

        this.governorAddress =
            CONFIG?.CONTRACTS?.governor ||
            null;

        this.init();
    }

    /* ==================================================
       INIT
       ================================================== */

    async init() {

        this.cacheElements();

        await this.loadGovernanceData();

        this.startRealtimeRefresh();
    }

    cacheElements() {

        this.proposalContainer =
            document.getElementById(
                "proposalContainer"
            );

        this.treasuryValue =
            document.getElementById(
                "treasuryValue"
            );

        this.activeProposalCount =
            document.getElementById(
                "activeProposalCount"
            );

        this.totalVotesEl =
            document.getElementById(
                "totalVotes"
            );

        this.modal =
            document.getElementById(
                "governanceModal"
            );

        this.modalContent =
            document.getElementById(
                "proposalDetails"
            );
    }

    /* ==================================================
       ABI
       ================================================== */

    get governorABI() {

        return [

            "function state(uint256 proposalId) view returns(uint8)",

            "function castVote(uint256 proposalId,uint8 support)",

            "function proposalVotes(uint256 proposalId) view returns(uint256 againstVotes,uint256 forVotes,uint256 abstainVotes)",

            "function getVotes(address account,uint256 blockNumber) view returns(uint256)"
        ];
    }

    /* ==================================================
       GOVERNOR
       ================================================== */

    async getGovernorContract() {

        if(!walletManager.connected){

            throw new Error(
                "Wallet not connected"
            );
        }

        return await walletManager.getContract(
            this.governorAddress,
            this.governorABI
        );
    }

    /* ==================================================
       LOAD
       ================================================== */

    async loadGovernanceData() {

        try {

            await this.loadTreasury();

            await this.loadProposals();

            this.renderProposals();

        } catch(error){

            console.error(error);
        }
    }

    /* ==================================================
       TREASURY
       ================================================== */

    async loadTreasury() {

        try {

            let treasury = {

                total:
                12850000
            };

            if(window.api){

                try {

                    treasury =
                    await api.getTreasury();

                } catch(e){}
            }

            if(this.treasuryValue){

                this.treasuryValue.innerText =
                    "$" +
                    Number(
                        treasury.total
                    ).toLocaleString();
            }

        } catch(error){

            console.error(error);
        }
    }

    /* ==================================================
       PROPOSALS
       ================================================== */

    async loadProposals() {

        try {

            if(window.api){

                try {

                    this.proposals =
                    await api.getProposals();

                    this.updateStats();

                    return;

                } catch(e){}
            }

            this.proposals = [

                {
                    id:1,
                    title:"Increase Restaking Rewards",
                    description:
                    "Increase AVS rewards from 5% to 7%.",
                    status:"active",
                    forVotes:125000,
                    againstVotes:28000
                },

                {
                    id:2,
                    title:"Treasury Diversification",
                    description:
                    "Allocate 10% treasury into RWA.",
                    status:"passed",
                    forVotes:310000,
                    againstVotes:55000
                },

                {
                    id:3,
                    title:"Validator Expansion",
                    description:
                    "Add 25 new validators.",
                    status:"pending",
                    forVotes:0,
                    againstVotes:0
                }
            ];

            this.updateStats();

        } catch(error){

            console.error(error);
        }
    }

    /* ==================================================
       STATS
       ================================================== */

    updateStats() {

        const active =
            this.proposals.filter(

                p =>
                p.status === "active"

            ).length;

        const totalVotes =
            this.proposals.reduce(

                (sum,p)=>

                sum +
                p.forVotes +
                p.againstVotes,

                0
            );

        if(this.activeProposalCount){

            this.activeProposalCount.innerText =
                active;
        }

        if(this.totalVotesEl){

            this.totalVotesEl.innerText =
                totalVotes.toLocaleString();
        }
    }

    /* ==================================================
       RENDER
       ================================================== */

    renderProposals() {

        if(!this.proposalContainer)
            return;

        this.proposalContainer.innerHTML =
            "";

        this.proposals.forEach(

            proposal => {

                const card =
                document.createElement(
                    "div"
                );

                card.className =
                    "proposal-card";

                card.innerHTML =

                `
                <div class="proposal-status ${proposal.status}">
                    ${proposal.status}
                </div>

                <h3>
                    Proposal #${proposal.id}
                </h3>

                <h4>
                    ${proposal.title}
                </h4>

                <p>
                    ${proposal.description}
                </p>

                <div class="vote-stats">

                    <span>
                        For:
                        ${proposal.forVotes.toLocaleString()}
                    </span>

                    <span>
                        Against:
                        ${proposal.againstVotes.toLocaleString()}
                    </span>

                </div>

                <button
                    class="primary-btn vote-btn"
                    data-id="${proposal.id}">
                    View Proposal
                </button>
                `;

                this.proposalContainer.appendChild(
                    card
                );
            }
        );

        this.bindProposalEvents();
    }

    /* ==================================================
       EVENTS
       ================================================== */

    bindProposalEvents() {

        document
        .querySelectorAll(".vote-btn")

        .forEach(btn=>{

            btn.addEventListener(
                "click",
                ()=>{

                    const id =
                    Number(
                        btn.dataset.id
                    );

                    this.openProposal(
                        id
                    );
                }
            );
        });
    }

    /* ==================================================
       DETAIL MODAL
       ================================================== */

    openProposal(id) {

        const proposal =
            this.proposals.find(

                p => p.id === id
            );

        if(!proposal)
            return;

        if(!this.modal)
            return;

        this.modal.classList.add(
            "active"
        );

        this.modalContent.innerHTML =

        `
        <h2>
            ${proposal.title}
        </h2>

        <p>
            ${proposal.description}
        </p>

        <hr>

        <div class="vote-actions">

            <button
                onclick="governance.vote(${proposal.id},1)"
                class="primary-btn">
                Vote For
            </button>

            <button
                onclick="governance.vote(${proposal.id},0)"
                class="secondary-btn">
                Vote Against
            </button>

        </div>
        `;
    }

    closeModal() {

        if(!this.modal)
            return;

        this.modal.classList.remove(
            "active"
        );
    }

    /* ==================================================
       VOTE POWER
       ================================================== */

    async getVotingPower() {

        try {

            if(
                !walletManager.connected
            ){

                return 0;
            }

            const governor =
                await this.getGovernorContract();

            const latest =
                await walletManager.provider
                .getBlockNumber();

            const votes =
                await governor.getVotes(

                    walletManager.account,
                    latest - 1
                );

            return Number(
                ethers.formatEther(
                    votes
                )
            );

        } catch(error){

            console.error(error);

            return 0;
        }
    }

    /* ==================================================
       VOTE
       ================================================== */

    async vote(
        proposalId,
        support
    ){

        try {

            if(
                !walletManager.connected
            ){

                walletManager.openModal();

                return;
            }

            const governor =
                await this.getGovernorContract();

            const tx =
                await governor.castVote(

                    proposalId,
                    support
                );

            if(window.notify){

                notify.info(
                    "Vote submitted"
                );
            }

            await tx.wait();

            if(window.notify){

                notify.success(
                    "Vote confirmed"
                );
            }

            await this.loadGovernanceData();

        } catch(error){

            console.error(error);

            if(window.notify){

                notify.error(
                    error.message
                );
            }
        }
    }

    /* ==================================================
       STATE
       ================================================== */

    async getProposalState(
        proposalId
    ){

        try {

            const governor =
                await this.getGovernorContract();

            const state =
                await governor.state(
                    proposalId
                );

            return Number(state);

        } catch(error){

            return -1;
        }
    }

    /* ==================================================
       REFRESH
       ================================================== */

    startRealtimeRefresh() {

        setInterval(

            async ()=>{

                await this.loadGovernanceData();

            },

            this.refreshInterval
        );
    }
}

/* ==========================================================
   GLOBAL
   ========================================================== */

window.governance =
    new GovernanceManager();

/* ==========================================================
   MODAL CLOSE
   ========================================================== */

document.addEventListener(

    "click",

    (e)=>{

        if(
            e.target.id ===
            "governanceModal"
        ){

            governance.closeModal();
        }
    }
);

/* ==========================================================
   READY
   ========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        console.log(
            "Governance Manager Ready"
        );
    }
);
