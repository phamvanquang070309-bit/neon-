/* =====================================================
   NEON PLAY
   GAME SYSTEM
===================================================== */


let balance = Number(
    localStorage.getItem("neon_balance")
) || 10000;


const balanceElement =
    document.getElementById("balance");


function updateBalance() {

    balanceElement.textContent =
        balance.toLocaleString("vi-VN");

    localStorage.setItem(
        "neon_balance",
        balance
    );
}


updateBalance();


/* =====================================================
   TOAST
===================================================== */

function toast(message) {

    const box =
        document.getElementById("toast");

    box.textContent = message;

    box.classList.add("show");

    setTimeout(() => {

        box.classList.remove("show");

    }, 2500);
}


/* =====================================================
   MODAL
===================================================== */

function openGame(game) {

    const modal =
        document.getElementById("gameModal");

    const content =
        document.getElementById("gameContent");

    modal.classList.add("active");

    if (game === "taixiu") {

        showTaiXiu();

    }

    if (game === "wheel") {

        showWheel();

    }

    if (game === "cards") {

        showCards();

    }

    if (game === "dice") {

        showDice();

    }

    if (game === "treasure") {

        showTreasure();

    }

    if (game === "lucky") {

        showLucky();

    }
}


function closeGame() {

    document
        .getElementById("gameModal")
        .classList.remove("active");

}


document
    .getElementById("gameModal")
    .addEventListener(
        "click",
        function(e) {

            if (e.target === this) {

                closeGame();

            }

        }
    );


/* =====================================================
   SCROLL
===================================================== */

function scrollToGames() {

    document
        .getElementById("games")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =====================================================
   TÀI XỈU
===================================================== */

let selectedTaiXiu = null;


function showTaiXiu() {

    document.getElementById(
        "gameContent"
    ).innerHTML = `

        <div class="game-screen">

            <h2>🎲 TÀI XỈU</h2>

            <p class="subtitle">
                Chọn Tài hoặc Xỉu rồi tung 3 xúc xắc.
            </p>

            <div class="dices">

                <div class="die" id="d1">?</div>

                <div class="die" id="d2">?</div>

                <div class="die" id="d3">?</div>

            </div>

            <p>
                Điểm chơi
            </p>

            <div class="bet-controls">

                <input
                    id="txAmount"
                    class="amount"
                    type="number"
                    value="100"
                    min="10"
                >

            </div>

            <div class="choice-row">

                <button
                    class="choice"
                    onclick="selectTaiXiu('tai')"
                >
                    🔥 TÀI
                </button>

                <button
                    class="choice"
                    onclick="selectTaiXiu('xiu')"
                >
                    ❄️ XỈU
                </button>

            </div>

            <button
                class="play-btn"
                onclick="playTaiXiu()"
            >
                🎲 TUNG XÚC XẮC
            </button>

            <p
                id="txResult"
                style="
                    margin-top:20px;
                    color:#00f7ff;
                    min-height:25px;
                "
            ></p>

        </div>
    `;
}


function selectTaiXiu(choice) {

    selectedTaiXiu = choice;

    toast(
        choice === "tai"
            ? "Bạn đã chọn TÀI"
            : "Bạn đã chọn XỈU"
    );
}


function playTaiXiu() {

    if (!selectedTaiXiu) {

        toast("Hãy chọn Tài hoặc Xỉu!");

        return;
    }


    const amount =
        Number(
            document.getElementById(
                "txAmount"
            ).value
        );


    if (
        !Number.isFinite(amount) ||
        amount < 10
    ) {

        toast("Điểm chơi tối thiểu là 10.");

        return;
    }


    if (amount > balance) {

        toast("Bạn không đủ điểm.");

        return;
    }


    balance -= amount;

    updateBalance();


    const d1 =
        Math.floor(Math.random() * 6) + 1;

    const d2 =
        Math.floor(Math.random() * 6) + 1;

    const d3 =
        Math.floor(Math.random() * 6) + 1;


    document.getElementById("d1").textContent = d1;
    document.getElementById("d2").textContent = d2;
    document.getElementById("d3").textContent = d3;


    const total =
        d1 + d2 + d3;


    const result =
        total >= 11
            ? "tai"
            : "xiu";


    const resultText =
        result === "tai"
            ? "TÀI"
            : "XỈU";


    const resultElement =
        document.getElementById(
            "txResult"
        );


    if (result === selectedTaiXiu) {

        const reward =
            amount * 2;

        balance += reward;

        updateBalance();

        resultElement.textContent =
            `🎉 ${resultText} — Bạn nhận ${reward.toLocaleString("vi-VN")} điểm!`;

    } else {

        resultElement.textContent =
            `😅 ${resultText} — Bạn chưa đoán đúng.`;

    }

}


/* =====================================================
   VÒNG QUAY
===================================================== */

function showWheel() {

    document.getElementById(
        "gameContent"
    ).innerHTML = `

        <div class="game-screen">

            <h2>🎡 VÒNG QUAY MAY MẮN</h2>

            <p class="subtitle">
                Quay miễn phí để nhận điểm ảo.
            </p>

            <div
                id="wheel"
                style="
                    margin:30px auto;
                    width:220px;
                    height:220px;
                    border-radius:50%;
                    background:
                    conic-gradient(
                        #ff4d6d 0 45deg,
                        #4d8cff 45deg 90deg,
                        #a64dff 90deg 135deg,
                        #00d9a5 135deg 180deg,
                        #ffc400 180deg 225deg,
                        #ff704d 225deg 270deg,
                        #4dffea 270deg 315deg,
                        #ff4dc4 315deg
                    );
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:50px;
                    transition:4s;
                "
            >
                🎁
            </div>

            <button
                class="play-btn"
                onclick="spinWheel()"
            >
                QUAY NGAY
            </button>

            <p
                id="wheelResult"
                style="
                    margin-top:20px;
                    color:#00f7ff;
                "
            ></p>

        </div>

    `;

}


function spinWheel() {

    const wheel =
        document.getElementById(
            "wheel"
        );

    const random =
        Math.floor(
            Math.random() * 360
        ) + 1440;


    wheel.style.transform =
        `rotate(${random}deg)`;


    setTimeout(() => {

        const rewards =
            [50,100,150,200,300,500,800,1000];

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
            "wheelResult"
        ).textContent =
            `🎉 Bạn nhận ${reward.toLocaleString("vi-VN")} điểm!`;

    }, 4000);

}


/* =====================================================
   CAO THẤP
===================================================== */

let currentCard;


function showCards() {

    currentCard =
        Math.floor(
            Math.random() * 13
        ) + 1;


    document.getElementById(
        "gameContent"
    ).innerHTML = `

        <div class="game-screen">

            <h2>🃏 CAO THẤP</h2>

            <p class="subtitle">
                Đoán lá bài tiếp theo cao hay thấp.
            </p>

            <div class="die"
                style="
                    width:120px;
                    height:160px;
                    margin:30px auto;
                    font-size:45px;
                "
                id="cardDisplay"
            >
                ${cardName(currentCard)}
            </div>

            <div class="choice-row">

                <button
                    class="choice"
                    onclick="guessCard('high')"
                >
                    ⬆️ CAO
                </button>

                <button
                    class="choice"
                    onclick="guessCard('low')"
                >
                    ⬇️ THẤP
                </button>

            </div>

            <p
                id="cardResult"
                style="
                    margin-top:20px;
                    color:#00f7ff;
                "
            ></p>

        </div>

    `;

}


function cardName(n) {

    const names = [
        "",
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K"
    ];

    return names[n];

}


function guessCard(choice) {

    const next =
        Math.floor(
            Math.random() * 13
        ) + 1;


    const correct =
        choice === "high"
            ? next > currentCard
            : next < currentCard;


    const result =
        document.getElementById(
            "cardResult"
        );


    if (correct) {

        const reward = 200;

        balance += reward;

        updateBalance();

        result.textContent =
            `🎉 Lá bài mới: ${cardName(next)} — +${reward} điểm`;

    } else {

        result.textContent =
            `😅 Lá bài mới: ${cardName(next)} — Chưa đúng.`;

    }


    currentCard = next;

    document.getElementById(
        "cardDisplay"
    ).textContent =
        cardName(next);

}


/* =====================================================
   XÚC XẮC
===================================================== */

function showDice() {

    document.getElementById(
        "gameContent"
    ).innerHTML = `

        <div class="game-screen">

            <h2>🎲 ĐUA XÚC XẮC</h2>

            <p class="subtitle">
                Chọn một số từ 1 đến 6.
            </p>

            <div class="choice-row">

                ${[1,2,3,4,5,6]
                    .map(
                        n =>
                        `<button
                            class="choice"
                            onclick="rollDice(${n})"
                        >
                            ${n}
                        </button>`
                    )
                    .join("")
                }

            </div>

            <p
                id="diceResult"
                style="
                    margin-top:25px;
                    color:#00f7ff;
                "
            ></p>

        </div>

    `;

}


function rollDice(choice) {

    const result =
        Math.floor(
            Math.random() * 6
        ) + 1;


    if (result === choice) {

        const reward = 500;

        balance += reward;

        updateBalance();

        document.getElementById(
            "diceResult"
        ).textContent =
            `🎉 Xúc xắc ra ${result}! +${reward} điểm`;

    } else {

        document.getElementById(
            "diceResult"
        ).textContent =
            `Xúc xắc ra ${result}. Bạn chọn ${choice}.`;

    }

}


/* =====================================================
   KHO BÁU
===================================================== */

function showTreasure() {

    document.getElementById(
        "gameContent"
    ).innerHTML = `

        <div class="game-screen">

            <h2>💎 KHO BÁU</h2>

            <p class="subtitle">
                Chọn một chiếc rương.
            </p>

            <div class="choice-row">

                <button
                    class="choice"
                    onclick="openChest(1)"
                >
                    📦<br>
                    Rương 1
                </button>

                <button
                    class="choice"
                    onclick="openChest(2)"
                >
                    📦<br>
                    Rương 2
                </button>

                <button
                    class="choice"
                    onclick="openChest(3)"
                >
                    📦<br>
                    Rương 3
                </button>

                <button
                    class="choice"
                    onclick="openChest(4)"
                >
                    📦<br>
                    Rương 4
                </button>

            </div>

            <p
                id="chestResult"
                style="
                    margin-top:25px;
                    color:#00f7ff;
                "
            ></p>

        </div>

    `;

}


function openChest(chest) {

    const rewards =
        [100,200,300,500,1000];

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
        "chestResult"
    ).textContent =
        `💎 Rương ${chest} chứa ${reward.toLocaleString("vi-VN")} điểm!`;

}


/* =====================================================
   LUCKY NUMBER
===================================================== */

function showLucky() {

    document.getElementById(
        "gameContent"
    ).innerHTML = `

        <div class="game-screen">

            <h2>🍀 LUCKY NUMBER</h2>

            <p class="subtitle">
                Chọn một con số từ 1 đến 9.
            </p>

            <div class="choice-row">

                ${[1,2,3,4,5,6,7,8,9]
                    .map(
                        n =>
                        `<button
                            class="choice"
                            onclick="luckyNumber(${n})"
                        >
                            ${n}
                        </button>`
                    )
                    .join("")
                }

            </div>

            <p
                id="luckyResult"
                style="
                    margin-top:25px;
                    color:#00f7ff;
                "
            ></p>

        </div>

    `;

}


function luckyNumber(choice) {

    const result =
        Math.floor(
            Math.random() * 9
        ) + 1;


    if (choice === result) {

        const reward = 1000;

        balance += reward;

        updateBalance();

        document.getElementById(
            "luckyResult"
        ).textContent =
            `🍀 Chính xác! Số may mắn là ${result}. +${reward} điểm`;

    } else {

        document.getElementById(
            "luckyResult"
        ).textContent =
            `Số may mắn là ${result}. Bạn chọn ${choice}.`;

    }

}


/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener(
    "keydown",
    function(e) {

        if (e.key === "Escape") {

            closeGame();

        }

    }
);
