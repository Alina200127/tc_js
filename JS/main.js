// как записать алфавит в переменную ВЗЯТО ИЗ ИНТЕРНЕТА
const alphabet = [...Array(26).keys()].map((i) => String.fromCharCode(i + 65));

const tbodyOriginalTable = document.querySelector(".table-one tbody");
const selectList = document.querySelectorAll(".drop-list select"); // все select`s
const btnGrouping = document.querySelector("#grouping");

const info = [
    [100, 43, 123, 1, 5],
    [100, 43, 432, 2, 5],
    [100, 44, 223, 3, 4],
    [200, 43, 44, 4, 4],
    [200, 22, 11234, 5, 3],
    [200, 22, 24, 6, 3],
    [200, 11, 1123, 7, 2],
    [100, 43, 123, 1, 5],
    [100, 43, 432, 2, 5],
    // ["", "", "", "", ""],
    // ["", "", "", "", ""],
];
fillTable(tbodyOriginalTable, info); // вывод заполненой таблицы

/* ==========   РЕАЛИЗАЦИЯ РЕДАКТИРОВАНИЯ ЯЧЕЕК ТАБЛИЦЫ   ========== */
tbodyOriginalTable.querySelectorAll("td").forEach((item) => {
    item.addEventListener("click", function func() {
        //создаём input, который будет появляться при клике на ячейку
        const input = document.createElement("input");
        input.value = item.innerHTML;
        item.innerHTML = ""; // очищаем текущее значение td, чтоб вписать новое
        item.appendChild(input);

        // событие при потере фокуса
        input.addEventListener("blur", function () {
            // считываем введённое значение в input и записываем в td
            item.innerHTML = this.value;
            // возвращаем фокус назад, чтоб было возможно повторное редактирование ячейки
            item.addEventListener("click", func);
        });
        // отвязываем функцию клика, чтоб при втором клике не вставлялся тег input
        item.removeEventListener("click", func);
    });
});

/* ==========   CLASS ДЛЯ КАЖДОГО СТОЛБЦА   ========== */
tbodyOriginalTable.querySelectorAll("tr").forEach((item) => {
    const td = item.querySelectorAll("td");
    for (let i = 0; i < td.length; i++) {
        td[i].className = alphabet[i];
    }
});

/* ==========   РЕАЛИЗАЦИЯ ФУНКЦИОНАЛА КНОПКИ СГРУППИРОВАТЬ   ========== */
const clickSelectId = []; // будет хранить id select, по которым кликали
selectList.forEach((item) => {
    item.addEventListener("click", function fnc() {
        clickSelectId.push(item.id);

        // отвязываем функцию клика, чтоб она не срабатывала повторно, при выборе option
        item.removeEventListener("click", fnc);
    });
});

const infoTableTwo = {};
let flagClickGrouping = true;
btnGrouping.addEventListener("click", function () {
    if (flagClickGrouping) {
        clickButtonGroup();
        flagClickGrouping = false;
    } else {
        document.querySelector(".table-result thead").remove();
        document.querySelector(".table-result tbody").remove();
        document.querySelectorAll(".btn-sort .button").forEach((item) => {
            item.remove();
        });
        if (!flagClickGrouping) {
            thName = [];
        }
        clickButtonGroup();
    }
});

/* ==========   ФУНКЦИЯ КНОПКИ СГРУППИРОВАТЬ   ========== */
function clickButtonGroup() {
    for (let i = 0; i < clickSelectId.length; i++) {
        for (let j = 0; j < selectList.length; j++) {
            if (clickSelectId[i] === selectList[j].id) {
                const choose = selectList[j]; //selectList[j] - кликнутый select
                const chooseOptionValue = choose[choose.selectedIndex].value; // value выбранного option
                const listClass = clickSelectId[i];
                switch (chooseOptionValue) {
                    case "one": // ----
                        break;
                    case "two": // Критерий
                        infoTableTwo[listClass] = criteria(choose.id);
                        break;
                    case "three": // Сумма
                        infoTableTwo[listClass] = sumElements(choose.id);
                        break;
                    case "four": // Макс.
                        infoTableTwo[listClass] = maxElement(choose.id);
                        break;
                    case "five": // Мин.
                        infoTableTwo[listClass] = minElement(choose.id);
                        break;
                    case "six": // Конкат
                        infoTableTwo[listClass] = concatenationElements(choose.id);
                        break;
                    case "seven": // Среднее
                        infoTableTwo[listClass] = averageElement(choose.id);
                        break;
                }
            }
        }
    }
    fillTableResult(infoTableTwo);
    document.querySelector(".table-two .sorting").classList.remove("none");
    const btnSorting = document.querySelectorAll(".btn-sort button");
    clickBtnSort(btnSorting);
}

let thName = [];
/* ==========   ФУНКЦИЯ РЕАЛИЗАЦИИ ФУНКЦИОНАЛА КНОПКИ СОРТИРОВАТЬ   ========== */
function clickBtnSort(arr) {
    const selectSort = document.querySelector(".selects-sort");
    // item = <button class="button" id="A" type="submit">Сортировать</button>
    arr.forEach((item) => {
        for (let i = 0; i < selectSort.options.length; i++) {
            for (let j = 0; j < thName.length; j++) {
                item.addEventListener("click", function () {
                    if (item.id === thName[j] && selectSort.options[i].selected) {
                        if (selectSort.options[i].value === "bubble") {
                            bubbleSortTable(item.id);
                        } else {
                            movingSortTable(item.id);
                        }
                    }
                });
            }
        }
    });
}
/*                                                    ФУНКЦИИ                                */
/*   ФУНКЦИЯ ВЫВОДА ЗАПОЛНЕННОЙ ИЗНАЧАЛЬНОЙ ТАБЛИЦЫ   */
function fillTable(table, arr) {
    for (let i = 0; i < arr.length; i++) {
        const tr = document.createElement("tr");

        for (let j = 0; j < arr[i].length; j++) {
            const td = document.createElement("td");
            td.innerHTML = arr[i][j];
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }
}
//
/*   ФУНКЦИЯ КРИТЕРИЯ   */
function criteria(id) {
    const td = document.querySelectorAll(`.table-one .${id}`);
    const tbody = document.querySelector(".table-one tbody");
    const rowsArray = Array.from(tbody.rows);

    let count = 1;
    for (let i = 0; i < td.length; i += 2) {
        if (i === td.length - 1) {
            rowsArray[i].className = `group_${count}`;
        } else {
            if (td[i].textContent === td[i + 1].textContent) {
                rowsArray[i].className = `group_${count}`;
                rowsArray[i + 1].className = `group_${count}`;
                count++;
            } else {
                rowsArray[i].className = `group_${count}`;
                rowsArray[i + 1].className = `group_${count + 1}`;
                count += 2;
            }
        }
    }

    const arr = []; // будет хранить результаты
    for (let i = 0; i < tbodyOriginalTable.querySelectorAll("tr").length; i += 2) {
        const tdElements = tbodyOriginalTable.querySelectorAll("tr")[i].querySelectorAll("td");
        // ПОСЛЕДНЯЯ СТРОКА ТАБЛИЦЫ
        if (i === tbodyOriginalTable.querySelectorAll("tr").length - 1) {
            for (let j = 0; j < tdElements.length; j++) {
                if (tdElements[j].classList[0] === id) {
                    arr.push(tdElements[j].textContent);
                }
            }
        } else {
            // ПОВТОРЯЮЩИЕСЯ ГРУППЫ
            if (
                tbodyOriginalTable.querySelectorAll("tr")[i].classList[0] ===
                tbodyOriginalTable.querySelectorAll("tr")[i + 1].classList[0]
            ) {
                const tdElementsNext = tbodyOriginalTable
                    .querySelectorAll("tr")
                    [i + 1].querySelectorAll("td");
                for (let j = 0; j < tdElements.length; j++) {
                    for (let t = 0; t < tdElementsNext.length; t++) {
                        if (
                            tdElements[j].classList[0] === id &&
                            tdElementsNext[t].classList[0] === id
                        ) {
                            arr.push(tdElements[j].textContent);
                        }
                    }
                }
            } // ОДИНОЧНЫЕ ГРУППЫ
            else {
                const tdElementsNext = tbodyOriginalTable
                    .querySelectorAll("tr")
                    [i + 1].querySelectorAll("td");
                for (let j = 0; j < tdElements.length; j++) {
                    for (let t = 0; t < tdElementsNext.length; t++) {
                        if (
                            tdElements[j].classList[0] === id &&
                            tdElementsNext[t].classList[0] === id
                        ) {
                            arr.push(tdElements[j].textContent);
                            arr.push(tdElementsNext[t].textContent);
                        }
                    }
                }
            }
        }
    }
    return arr;
}
/*   ФУНКЦИЯ СУММИРОВАНИЯ   */
function sumElements(id) {
    const arr = []; // будет хранить результаты
    for (let i = 0; i < tbodyOriginalTable.querySelectorAll("tr").length; i += 2) {
        const tdElements = tbodyOriginalTable.querySelectorAll("tr")[i].querySelectorAll("td");
        // ПОСЛЕДНЯЯ СТРОКА ТАБЛИЦЫ
        if (i === tbodyOriginalTable.querySelectorAll("tr").length - 1) {
            for (let j = 0; j < tdElements.length; j++) {
                if (tdElements[j].classList[0] === id) {
                    arr.push(Number(tdElements[j].textContent));
                }
            }
        } else {
            // ПОВТОРЯЮЩИЕСЯ ГРУППЫ
            if (
                tbodyOriginalTable.querySelectorAll("tr")[i].classList[0] ===
                tbodyOriginalTable.querySelectorAll("tr")[i + 1].classList[0]
            ) {
                const tdElementsNext = tbodyOriginalTable
                    .querySelectorAll("tr")
                    [i + 1].querySelectorAll("td");
                let sum = 0;
                for (let j = 0; j < tdElements.length; j++) {
                    for (let t = 0; t < tdElementsNext.length; t++) {
                        if (
                            tdElements[j].classList[0] === id &&
                            tdElementsNext[t].classList[0] === id
                        ) {
                            sum =
                                Number(tdElements[j].textContent) +
                                Number(tdElementsNext[t].textContent);
                            arr.push(sum);
                        }
                    }
                }
            } // ОДИНОЧНЫЕ ГРУППЫ
            else {
                const tdElementsNext = tbodyOriginalTable
                    .querySelectorAll("tr")
                    [i + 1].querySelectorAll("td");
                for (let j = 0; j < tdElements.length; j++) {
                    for (let t = 0; t < tdElementsNext.length; t++) {
                        if (
                            tdElements[j].classList[0] === id &&
                            tdElementsNext[t].classList[0] === id
                        ) {
                            arr.push(Number(tdElements[j].textContent));
                            arr.push(Number(tdElementsNext[t].textContent));
                        }
                    }
                }
            }
        }
    }
    return arr;
}
/*   ФУНКЦИЯ МАКСИМУМА   */
function maxElement(id) {
    const arr = []; // будет хранить результаты
    for (let i = 0; i < tbodyOriginalTable.querySelectorAll("tr").length; i += 2) {
        const tdElements = tbodyOriginalTable.querySelectorAll("tr")[i].querySelectorAll("td");
        // ПОСЛЕДНЯЯ СТРОКА ТАБЛИЦЫ
        if (i === tbodyOriginalTable.querySelectorAll("tr").length - 1) {
            for (let j = 0; j < tdElements.length; j++) {
                if (tdElements[j].classList[0] === id) {
                    arr.push(Number(tdElements[j].textContent));
                }
            }
        } else {
            // ПОВТОРЯЮЩИЕСЯ ГРУППЫ
            if (
                tbodyOriginalTable.querySelectorAll("tr")[i].classList[0] ===
                tbodyOriginalTable.querySelectorAll("tr")[i + 1].classList[0]
            ) {
                const tdElementsNext = tbodyOriginalTable
                    .querySelectorAll("tr")
                    [i + 1].querySelectorAll("td");
                for (let j = 0; j < tdElements.length; j++) {
                    for (let t = 0; t < tdElementsNext.length; t++) {
                        if (
                            tdElements[j].classList[0] === id &&
                            tdElementsNext[t].classList[0] === id
                        ) {
                            const max = Math.max(
                                Number(tdElements[j].textContent),
                                Number(tdElementsNext[t].textContent)
                            );
                            arr.push(max);
                        }
                    }
                }
            }
            // ОДИНОЧНЫЕ ГРУППЫ
            else {
                const tdElementsNext = tbodyOriginalTable
                    .querySelectorAll("tr")
                    [i + 1].querySelectorAll("td");
                for (let j = 0; j < tdElements.length; j++) {
                    for (let t = 0; t < tdElementsNext.length; t++) {
                        if (
                            tdElements[j].classList[0] === id &&
                            tdElementsNext[t].classList[0] === id
                        ) {
                            arr.push(Number(tdElements[j].textContent));
                            arr.push(Number(tdElementsNext[t].textContent));
                        }
                    }
                }
            }
        }
    }
    return arr;
}
/*   ФУНКЦИЯ МИНИМУМА   */
function minElement(id) {
    const arr = []; // будет хранить результаты
    for (let i = 0; i < tbodyOriginalTable.querySelectorAll("tr").length; i += 2) {
        const tdElements = tbodyOriginalTable.querySelectorAll("tr")[i].querySelectorAll("td");
        // ПОСЛЕДНЯЯ СТРОКА ТАБЛИЦЫ
        if (i === tbodyOriginalTable.querySelectorAll("tr").length - 1) {
            for (let j = 0; j < tdElements.length; j++) {
                if (tdElements[j].classList[0] === id) {
                    arr.push(Number(tdElements[j].textContent));
                }
            }
        } else {
            // ПОВТОРЯЮЩИЕСЯ ГРУППЫ
            if (
                tbodyOriginalTable.querySelectorAll("tr")[i].classList[0] ===
                tbodyOriginalTable.querySelectorAll("tr")[i + 1].classList[0]
            ) {
                const tdElementsNext = tbodyOriginalTable
                    .querySelectorAll("tr")
                    [i + 1].querySelectorAll("td");
                for (let j = 0; j < tdElements.length; j++) {
                    for (let t = 0; t < tdElementsNext.length; t++) {
                        if (
                            tdElements[j].classList[0] === id &&
                            tdElementsNext[t].classList[0] === id
                        ) {
                            const min = Math.min(
                                Number(tdElements[j].textContent),
                                Number(tdElementsNext[t].textContent)
                            );
                            arr.push(min);
                        }
                    }
                }
            }
            // ОДИНОЧНЫЕ ГРУППЫ
            else {
                const tdElementsNext = tbodyOriginalTable
                    .querySelectorAll("tr")
                    [i + 1].querySelectorAll("td");
                for (let j = 0; j < tdElements.length; j++) {
                    for (let t = 0; t < tdElementsNext.length; t++) {
                        if (
                            tdElements[j].classList[0] === id &&
                            tdElementsNext[t].classList[0] === id
                        ) {
                            arr.push(Number(tdElements[j].textContent));
                            arr.push(Number(tdElementsNext[t].textContent));
                        }
                    }
                }
            }
        }
    }
    return arr;
}
/*   ФУНКЦИЯ КОНКАТЕНАЦИИ   */
function concatenationElements(id) {
    const arr = []; // будет хранить результаты
    for (let i = 0; i < tbodyOriginalTable.querySelectorAll("tr").length; i += 2) {
        const tdElements = tbodyOriginalTable.querySelectorAll("tr")[i].querySelectorAll("td");
        // ПОСЛЕДНЯЯ СТРОКА ТАБЛИЦЫ
        if (i === tbodyOriginalTable.querySelectorAll("tr").length - 1) {
            for (let j = 0; j < tdElements.length; j++) {
                if (tdElements[j].classList[0] === id) {
                    arr.push(tdElements[j].textContent);
                }
            }
        } else {
            // ПОВТОРЯЮЩИЕСЯ ГРУППЫ
            if (
                tbodyOriginalTable.querySelectorAll("tr")[i].classList[0] ===
                tbodyOriginalTable.querySelectorAll("tr")[i + 1].classList[0]
            ) {
                const tdElementsNext = tbodyOriginalTable
                    .querySelectorAll("tr")
                    [i + 1].querySelectorAll("td");
                for (let j = 0; j < tdElements.length; j++) {
                    for (let t = 0; t < tdElementsNext.length; t++) {
                        if (
                            tdElements[j].classList[0] === id &&
                            tdElementsNext[t].classList[0] === id
                        ) {
                            const conc = tdElements[j].textContent + tdElementsNext[t].textContent;
                            arr.push(conc);
                        }
                    }
                }
            }
            // ОДИНОЧНЫЕ ГРУППЫ
            else {
                const tdElementsNext = tbodyOriginalTable
                    .querySelectorAll("tr")
                    [i + 1].querySelectorAll("td");
                for (let j = 0; j < tdElements.length; j++) {
                    for (let t = 0; t < tdElementsNext.length; t++) {
                        if (
                            tdElements[j].classList[0] === id &&
                            tdElementsNext[t].classList[0] === id
                        ) {
                            arr.push(tdElements[j].textContent);
                            arr.push(tdElementsNext[t].textContent);
                        }
                    }
                }
            }
        }
    }
    return arr;
}
/*   ФУНКЦИЯ СРЕДНЕГО АРЕФМЕТИЧЕСКОГО   */
function averageElement(id) {
    const arr = []; // будет хранить результаты
    for (let i = 0; i < tbodyOriginalTable.querySelectorAll("tr").length; i += 2) {
        const tdElements = tbodyOriginalTable.querySelectorAll("tr")[i].querySelectorAll("td");
        // ПОСЛЕДНЯЯ СТРОКА ТАБЛИЦЫ
        if (i === tbodyOriginalTable.querySelectorAll("tr").length - 1) {
            for (let j = 0; j < tdElements.length; j++) {
                if (tdElements[j].classList[0] === id) {
                    arr.push(Number(tdElements[j].textContent));
                }
            }
        } else {
            // ПОВТОРЯЮЩИЕСЯ ГРУППЫ
            if (
                tbodyOriginalTable.querySelectorAll("tr")[i].classList[0] ===
                tbodyOriginalTable.querySelectorAll("tr")[i + 1].classList[0]
            ) {
                const tdElementsNext = tbodyOriginalTable
                    .querySelectorAll("tr")
                    [i + 1].querySelectorAll("td");
                for (let j = 0; j < tdElements.length; j++) {
                    for (let t = 0; t < tdElementsNext.length; t++) {
                        if (
                            tdElements[j].classList[0] === id &&
                            tdElementsNext[t].classList[0] === id
                        ) {
                            const one = Number(tdElements[j].textContent);
                            const two = Number(tdElementsNext[t].textContent);
                            average = (one + two) / 2;
                            arr.push(average);
                        }
                    }
                }
            }
            // ОДИНОЧНЫЕ ГРУППЫ
            else {
                const tdElementsNext = tbodyOriginalTable
                    .querySelectorAll("tr")
                    [i + 1].querySelectorAll("td");
                for (let j = 0; j < tdElements.length; j++) {
                    for (let t = 0; t < tdElementsNext.length; t++) {
                        if (
                            tdElements[j].classList[0] === id &&
                            tdElementsNext[t].classList[0] === id
                        ) {
                            arr.push(Number(tdElements[j].textContent));
                            arr.push(Number(tdElementsNext[t].textContent));
                        }
                    }
                }
            }
        }
    }
    return arr;
}
/*   ФУНКЦИЯ ВЫВОДА РЕЗУЛЬТИРУЮЩЕЙ ТАБЛИЦЫ   */
function fillTableResult(obj) {
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    // вывод заголовков
    for (key in obj) {
        const th = document.createElement("th");
        th.textContent = key;
        thead.appendChild(th);
        // записываем заоловок столбцов, чтоб потом определять на сортировку какого столбца кликнули
        thName.push(key);

        const btnSorting = document.createElement("button");
        btnSorting.innerHTML = "Сортировать";
        btnSorting.className = "button";
        btnSorting.id = key;
        btnSorting.type = "submit";
        document.querySelector(".table-two .btn-sort").appendChild(btnSorting);
    }
    for (let i = 0; i < Object.values(obj)[0].length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < thead.querySelectorAll("th").length; j++) {
            const td = document.createElement("td");
            td.textContent = Object.values(obj)[j][i];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    document.querySelector(".table-result").appendChild(thead);
    document.querySelector(".table-result").appendChild(tbody);

    // класс для каждого столбца таблицы
    document
        .querySelector(".table-result")
        .querySelectorAll("tr")
        .forEach((item) => {
            const td = item.querySelectorAll("td");
            for (let i = 0; i < td.length; i++) {
                td[i].className = thName[i];
            }
        });
}
/*   ФУНКЦИЯ СОРТИРОВКИ ПУЗЫРЬКОМ   */
function bubbleSortTable(id) {
    const tbody = document.querySelector(".table-result tbody");
    const td = document.querySelectorAll(`.table-result .${id}`);
    const tdArr = Array.from(td);
    const rowsArray = Array.from(tbody.rows);

    for (let i = 0; i < tdArr.length; i++) {
        for (let j = 0; j < tdArr.length - 1 - i; j++) {
            if (Number(tdArr[j].textContent) > Number(tdArr[j + 1].textContent)) {
                const tmp = tdArr[j];
                tdArr[j] = tdArr[j + 1];
                tdArr[j + 1] = tmp;
                const tmpRow = rowsArray[j];
                rowsArray[j] = rowsArray[j + 1];
                rowsArray[j + 1] = tmpRow;
            }
        }
    }
    tbody.append(...rowsArray);
}
/*Я точно не уверенна, что это именно та сортировка, которую вы имели в виду, так как 
сортировки именно с названием(СОРТИРОВКИ ПЕРЕМЕЩЕНИЕМ) я не нашла, а по определению эта 
сортировка больше всего похожа на сортировку перемещение*/
// ОПРЕДЕЛЕНИЕ ИЗ ИНТЕРНЕТА:
/* Сортировка выбором — это метод сортировки массива перемещением, который работает по принципу 
многократного выбора наименьшего (или наибольшего) элемента из неотсортированной части массива 
и его перемещения в начало (или конец) массива.  */
/*   ФУНКЦИЯ СОРТИРОВКИ ПЕРЕМЕЩЕНИЕМ   */
function movingSortTable(id) {
    const tbody = document.querySelector(".table-result tbody");
    const td = document.querySelectorAll(`.table-result .${id}`);
    const tdArr = Array.from(td);
    const rowsArray = Array.from(tbody.rows);
    // алгоритм сортировки
    for (let i = 0; i < tdArr.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < tdArr.length; j++) {
            if (Number(tdArr[minIndex].textContent) > Number(tdArr[j].textContent)) minIndex = j;
        }
        if (minIndex !== i) {
            let temp = tdArr[minIndex];
            tdArr[minIndex] = tdArr[i];
            tdArr[i] = temp;

            let tempRow = rowsArray[minIndex];
            rowsArray[minIndex] = rowsArray[i];
            rowsArray[i] = tempRow;
        }
    }
    tbody.append(...rowsArray);
}
