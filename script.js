let balance =
    Number(localStorage.getItem("neon_balance")) || 100000;

let selectedAmount = 100;

let selectedSide = null;

let rolling = false;

let round =
    Number(localStorage.getItem("neon_round")) || 1827;

let history =
    JSON.parse(
        localStorage.getItem("neon_history") || "[]"
    );

let soundOn = true;

let taiCount = 0;
let xiuCount = 0;

const balanceEl =
    document.getElementById("balance");

const taiTotalEl =
    document.getElementById("taiTotal");

const xiuTotalEl =
    document.getElementById("xiuTotal");

const selectedAmountEl =
    document.getElementById("selectedAmount");

const messageEl =
    document.getElementById("message");

const resultText =
    document.getElementById("resultText");

const timerEl =
    document.getElementById("timer");

const rollButton =
    document.getElementById("rollButton");


function updateBalance(){

    balanceEl.textContent =
        balance.toLocaleString("vi-VN");

    localStorage.setItem(
        "neon_balance",
        balance
    );
}


updateBalance();


/* ================= CHIP ================= */

function selectChip(amount){

    selectedAmount = amount;

    selectedAmountEl.textContent =
        amount.toLocaleString("vi-VN");

    document
        .querySelectorAll(".chip")
        .forEach(c => c.classList.remove("selected"));

    const buttons =
        document.querySelectorAll(".chip");

    buttons.forEach(button => {

        const text =
            button.textContent
                .replace("K","000")
                .replace("1K","1000")
                .replace("5K","5000")
                .replace("10K","10000");

        if(
            Number(text) === amount ||
            button.textContent.includes(
                amount >= 1000
                    ? (amount / 1000) + "K"
                    : amount
            )
        ){

            button.classList.add("selected");

        }

    });

}


/* ================= BET ================= */

function placeBet(side){

    if(rolling) return;

    if(balance < selectedAmount){

        showToast("Không đủ điểm ảo!");

        return;
    }

    selectedSide = side;

    if(side === "tai"){

        taiTotalEl.textContent =
            (
                Number(taiTotalEl.textContent.replace(/,/g,"")) +
                selectedAmount
            ).toLocaleString("vi-VN");

        messageEl.textContent =
            `Đã chọn TÀI — ${selectedAmount.toLocaleString("vi-VN")} điểm`;

    }else{

        xiuTotalEl.textContent =
            (
                Number(xiuTotalEl.textContent.replace(/,/g,"")) +
                selectedAmount
            ).toLocaleString("vi-VN");

        messageEl.textContent =
            `Đã chọn XỈU — ${selectedAmount.toLocaleString("vi-VN")} điểm`;

    }

    document.querySelectorAll(".big-bet")
        .forEach(x => x.style.filter = "");

    document.querySelector(
        side === "tai"
            ? ".tai-button"
            : ".xiu-button"
    ).style.filter =
        "brightness(1.4)";

}


/* ================= ROLL ================= */

function rollDice(){

    if(rolling) return;

    if(!selectedSide){

        showToast("Hãy chọn TÀI hoặc XỈU!");

        return;
    }

    if(balance < selectedAmount){

        showToast("Không đủ điểm!");

        return;
    }

    rolling = true;

    rollButton.disabled = true;

    const stage =
        document.querySelector(".dice-stage");

    stage.classList.remove("open");

    stage.classList.add("rolling");

    resultText.textContent =
        "ĐANG LẮC...";

    messageEl.textContent =
        "🎲 Xúc xắc đang được tung...";


    balance -= selectedAmount;

    updateBalance();


    let seconds = 3;

    timerEl.textContent = seconds;


    const countdown =
        setInterval(() => {

            seconds--;

            timerEl.textContent =
                seconds;

            if(seconds <= 0){

                clearInterval(countdown);

                finishRoll();

            }

        },1000);

}


/* ================= RESULT ================= */

function finishRoll(){

    const stage =
        document.querySelector(".dice-stage");

    const d1 =
        randomDice();

    const d2 =
        randomDice();

    const d3 =
        randomDice();

    setDice(
        document.getElementById("dice1"),
        d1
    );

    setDice(
        document.getElementById("dice2"),
        d2
    );

    setDice(
        document.getElementById("dice3"),
        d3
    );


    stage.classList.remove("rolling");

    setTimeout(() => {

        stage.classList.add("open");

        const total =
            d1 + d2 + d3;

        let result;

        if(total >= 11){

            result = "tai";

        }else{

            result = "xiu";

        }


        setTimeout(() => {

            showResult(
                d1,
                d2,
                d3,
                total,
                result
            );

        },500);

    },300);


}


/* ================= DICE ================= */

function randomDice(){

    return Math.floor(
        Math.random() * 6
    ) + 1;

}


function setDice(element,value){

    element.dataset.value =
        value;

}


/* ================= SHOW RESULT ================= */

function showResult(
    d1,
    d2,
    d3,
    total,
    result
){

    const text =
        result === "tai"
            ? "TÀI"
            : "XỈU";

    resultText.textContent =
        `${d1} + ${d2} + ${d3} = ${total}  •  ${text}`;


    if(result === selectedSide){

        const reward =
            selectedAmount * 2;

        balance += reward;

        messageEl.textContent =
            `🎉 CHÚC MỪNG! +${reward.toLocaleString("vi-VN")} điểm`;

    }else{

        messageEl.textContent =
            `Kết quả ${text}. Bạn chưa đoán đúng.`;

    }


    updateBalance();

    addHistory(
        d1,
        d2,
        d3,
        total,
        result
    );


    taiTotalEl.textContent = "0";

    xiuTotalEl.textContent = "0";

    selectedSide = null;

    document.querySelectorAll(".big-bet")
        .forEach(x => x.style.filter = "");

    round++;

    document.getElementById(
        "round"
    ).textContent =
        String(round).padStart(6,"0");

    localStorage.setItem(
        "neon_round",
        round
    );


    setTimeout(() => {

        document
            .querySelector(".dice-stage")
            .classList.remove("open");

        rolling = false;

        rollButton.disabled = false;

        timerEl.textContent = "10";

        resultText.textContent =
            "CHỌN CỬA";

    },2500);

}


/* ================= HISTORY ================= */

function addHistory(
    d1,
    d2,
    d3,
    total,
    result
){

    history.unshift({

        round: round,

        d1:d1,

        d2:d2,

        d3:d3,

        total:total,

        result:result

    });


    if(history.length > 20){

        history.pop();

    }


    localStorage.setItem(
        "neon_history",
        JSON.stringify(history)
    );


    renderHistory();

}


function renderHistory(){

    const list =
        document.getElementById(
            "historyList"
        );

    list.innerHTML = "";

    taiCount = 0;

    xiuCount = 0;


    history.forEach(item => {

        if(item.result === "tai"){

            taiCount++;

        }else{

            xiuCount++;

        }


        const row =
            document.createElement("div");

        row.className =
            "history-row";

        row.innerHTML = `

            <span class="history-round">
                #${String(item.round).slice(-4)}
            </span>

            <span class="history-result ${item.result}">
                ${item.result === "tai" ? "TÀI" : "XỈU"}
            </span>

            <span class="history-sum">
                ${item.d1}-${item.d2}-${item.d3}
            </span>

            <b>
                ${item.total}
            </b>

        `;

        list.appendChild(row);

    });


    document.getElementById(
        "taiCount"
    ).textContent = taiCount;

    document.getElementById(
        "xiuCount"
    ).textContent = xiuCount;

}


renderHistory();


/* ================= SOUND ================= */

function toggleSound(){

    soundOn = !soundOn;

    document.querySelector(
        ".sound"
    ).textContent =
        soundOn ? "🔊" : "🔇";

}


/* ================= TOAST ================= */

function showToast(text){

    const toast =
        document.getElementById("toast");

    toast.textContent = text;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },2200);

}


/* ================= MINI GAME ================= */

function miniGame(type){

    const modal =
        document.getElementById("modal");

    const content =
        document.getElementById("modalContent");

    modal.classList.add("show");


    if(type === "wheel"){

        content.innerHTML = `

            <div class="mini-content">

                <div class="mini-title">
                    🎡 VÒNG QUAY
                </div>

                <div
                    id="wheelEmoji"
                    class="mini-big"
                >
                    🎡
                </div>

                <button
                    class="mini-btn"
                    onclick="spinWheel()"
                >
                    QUAY NGAY
                </button>

                <p id="miniResult"></p>

            </div>

        `;

    }


    if(type === "lucky"){

        content.innerHTML = `

            <div class="mini-content">

                <div class="mini-title">
                    🍀 LUCKY NUMBER
                </div>

                <p>
                    Chọn một số
                </p>

                <div
                    style="
                    display:grid;
                    grid-template-columns:
                    repeat(3,1fr);
                    gap:10px;
                    margin:25px 0;
                    "
                >

                    ${[1,2,3,4,5,6,7,8,9]
                        .map(n => `
                            <button
                                class="mini-btn"
                                onclick="lucky(${n})"
                            >
                                ${n}
                            </button>
                        `).join("")
                    }

                </div>

                <p id="miniResult"></p>

            </div>

        `;

    }


    if(type === "chest"){

        content.innerHTML = `

            <div class="mini-content">

                <div class="mini-title">
                    💎 KHO BÁU
                </div>

                <div class="mini-big">
                    📦
                </div>

                <button
                    class="mini-btn"
                    onclick="openChest()"
                >
                    MỞ RƯƠNG
                </button>

                <p id="miniResult"></p>

            </div>

        `;

    }


    if(type === "dice"){

        content.innerHTML = `

            <div class="mini-content">

                <div class="mini-title">
                    🎲 DICE MASTER
                </div>

                <div
                    id="miniDice"
                    class="mini-big"
                >
                    🎲
                </div>

                <button
                    class="mini-btn"
                    onclick="miniDiceRoll()"
                >
                    TUNG XÚC XẮC
                </button>

                <p id="miniResult"></p>

            </div>

        `;

    }

}


function closeModal(){

    document
        .getElementById("modal")
        .classList.remove("show");

}


function spinWheel(){

    const rewards =
        [100,200,500,1000,2000];

    const reward =
        rewards[
            Math.floor(
                Math.random() *
                rewards.length
            )
        ];


    const wheel =
        document.getElementById(
            "wheelEmoji"
        );

    wheel.style.transition =
        "transform 2s";

    wheel.style.transform =
        "rotate(1080deg)";


    setTimeout(() => {

        balance += reward;

        updateBalance();

        document.getElementById(
            "miniResult"
        ).textContent =
            `🎉 +${reward.toLocaleString("vi-VN")} điểm`;

    },2000);

}


function lucky(number){

    const result =
        Math.floor(
            Math.random() * 9
        ) + 1;


    if(number === result){

        balance += 1000;

        updateBalance();

        document.getElementById(
            "miniResult"
        ).textContent =
            `🍀 Chính xác! +1,000 điểm`;

    }else{

        document.getElementById(
            "miniResult"
        ).textContent =
            `Số may mắn là ${result}`;

    }

}


function openChest(){

    const rewards =
        [100,300,500,1000,2000];

    const reward =
        rewards[
            Math.floor(
                Math.random() *
                rewards.length
            )
        ];


    balance += reward;

    updateBalance();


    document.getElementById(
        "miniResult"
    ).textContent =
        `💎 Bạn tìm thấy ${reward.toLocaleString("vi-VN")} điểm!`;

}


function miniDiceRoll(){

    const result =
        Math.floor(
            Math.random() * 6
        ) + 1;


    document.getElementById(
        "miniDice"
    ).textContent =
        ["⚀","⚁","⚂","⚃","⚄","⚅"]
        [result - 1];


    if(result >= 5){

        balance += 500;

        updateBalance();

        document.getElementById(
            "miniResult"
        ).textContent =
            "+500 điểm!";

    }else{

        document.getElementById(
            "miniResult"
        ).textContent =
            `Ra số ${result}`;

    }

}


document
    .getElementById("modal")
    .addEventListener(
        "click",
        e => {

            if(
                e.target.id === "modal"
            ){

                closeModal();

            }

        }
    );


document.addEventListener(
    "keydown",
    e => {

        if(e.key === "Escape"){

            closeModal();

        }

    }
);
