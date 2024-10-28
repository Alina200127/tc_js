// как записать алфавит в переменную ВЗЯТО ИЗ ИНТЕРНЕТА
const alphabet = [...Array(26).keys()].map((i) => String.fromCharCode(i + 65));
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
];
const valueSelect = ["----", "Критерий", "Сумма", "Макс.", "Мин.", "Конкат", "Среднее"];

const $originalTable = document.querySelector(".table-one .container"),
    $resultTable = document.querySelector(".table-two .container"),
    $dropList = document.querySelector(".drop-list__inner"),
    $sortingBlock = document.querySelector(".sort-block .container");

createTable(5, 10); // СОЗДАНИЕ ИЗНАЧАЛЬНОЙ ТАБЛИЦЫ
fillTable(info); // ЗАПОЛНЕНИЕ ИЗНАЧАЛЬНОЙ ТАБЛИЦЫ
createSelect(valueSelect); // СОЗДАНИЕ ВЫПАДАЮЩИХ СПИСКОВ
classColumns($originalTable); // CLASS ДЛЯ КАЖДОГО СТОЛБЦА

/* ==========   РЕАЛИЗАЦИЯ РЕДАКТИРОВАНИЯ ЯЧЕЕК ТАБЛИЦЫ   ========== */
$originalTable.querySelectorAll("td").forEach((item) => {
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
const $selectList = document.querySelectorAll(".drop-list__inner select"),
    $btnGrouping = document.querySelector("#grouping");

/* ==========   РЕАЛИЗАЦИЯ ФУНКЦИОНАЛА КНОПКИ СГРУППИРОВАТЬ   ========== */
const clickSelectId = []; // будет хранить id select, по которым кликали
$selectList.forEach((item) => {
    item.addEventListener("click", function fnc() {
        clickSelectId.push(item.id);
        // отвязываем функцию клика, чтоб она не срабатывала повторно, при выборе option
        item.removeEventListener("click", fnc);
    });
});

function startFunctions() {
    fillTableResult(clickButtonGroup()); // ВЫВОД РЕЗУЛЬТИРУЮЩЕЙ ТАБЛИЦЫ
    classColumns($resultTable); // CLASS ДЛЯ КАЖДОГО СТОЛБЦА
    createSelectSort(); //СОЗДАНИЕ ВЫПАДАЮЩИХ СПИСКОВ СОРТИРОВКИ
    clickBtnSort(); // ФУНКЦИЯ КНОПКИ СОРТИРОВАТЬ
}
function deleteElements() {
    // удаление таблицы
    while (document.querySelector(".table-two .container").firstChild) {
        document
            .querySelector(".table-two .container")
            .removeChild(document.querySelector(".table-two .container").firstChild);
    }
    // удаление выбора сортировки
    while (document.querySelector(".sort-block .container").firstChild) {
        document
            .querySelector(".sort-block .container")
            .removeChild(document.querySelector(".sort-block .container").firstChild);
    }
    // удаление классов группировки (ФУНКЦИЯ removeAttribute("class") ВЗЯТА ИЗ ИНТЕРНЕТА)
    const row = $originalTable.querySelector("tbody").rows;
    for (let i = 0; i < row.length; i++) row[i].removeAttribute("class");
}

let flagClickGroup = true;
let click = 1;
// КНОПКА СГРУППИРОВАТЬ
$btnGrouping.addEventListener("click", function () {
    if (flagClickGroup) {
        // чтоб при третьем и тд нажатии снова формировалась новая таблица
        if (click === 1) {
            startFunctions();
            click++;
            flagClickGroup = false;
        } else {
            deleteElements();
            startFunctions();
            flagClickGroup = false;
        }
    } else {
        deleteElements();
        startFunctions();
        flagClickGroup = true;
    }
});

/* ==========   ФУНКЦИЯ КНОПКИ СОРТИРОВАТЬ   ========== */
function clickBtnSort() {
    const $btnSorting = document.querySelectorAll(".btn-sort button"),
        $selectSort = document.querySelector(".selects-sort");

    $btnSorting.forEach((item) => {
        // item = <button class="button" id="A" type="submit">Сортировать</button>
        item.addEventListener("click", function () {
            for (let i = 0; i < $selectSort.options.length; i++) {
                // у выбранного option true
                if ($selectSort.options[i].selected) {
                    if ($selectSort.options[i].value === "bubble") {
                        bubbleSortTable(item.id);
                    } else {
                        movingSortTable(item.id);
                    }
                }
            }
        });
    });
}
/* ________________________________________ ФУНКЦИИ ________________________________________ */
/*   СОЗДАНИЕ ИЗНАЧАЛЬНОЙ ТАБЛИЦЫ   */
function createTable(column, row) {
    const $table = document.createElement("table"),
        $thead = document.createElement("thead"),
        $tbody = document.createElement("tbody");

    $table.classList.add("table");

    for (let i = 0; i < column; i++) {
        const $th = document.createElement("th");
        $th.textContent = alphabet[i];
        $thead.appendChild($th);
    }
    // row - 1 так как, одна строка уходит под заголовок
    for (let i = 0; i < row - 1; i++) {
        const $tr = document.createElement("tr");
        for (let j = 0; j < column; j++) {
            const $td = document.createElement("td");
            $tr.appendChild($td);
        }
        $tbody.appendChild($tr);
    }

    $table.append($thead, $tbody);
    $originalTable.appendChild($table);
}
/*   ЗАПОЛНЕНИЕ ИЗНАЧАЛЬНОЙ ТАБЛИЦЫ   */
function fillTable(arr) {
    const $tr = $originalTable.querySelectorAll("tr");
    for (let i = 0; i < $tr.length; i++) {
        const $td = $tr[i].querySelectorAll("td");
        for (let j = 0; j < $td.length; j++) {
            if (arr?.[i] === undefined) {
                $td[j].textContent = "";
            } else {
                $td[j].textContent = arr[i][j];
            }
        }
    }
}
/* ==========   CLASS ДЛЯ КАЖДОГО СТОЛБЦА   ========== */
function classColumns(table) {
    table.querySelectorAll("tr").forEach((item) => {
        const $th = table.querySelectorAll("thead th"),
            $td = item.querySelectorAll("td");
        for (let i = 0; i < $th.length; i++) {
            $td[i].classList.add(`${$th[i].innerHTML}`);
        }
    });
}
/*   СОЗДАНИЕ ВЫПАДАЮЩИХ СПИСКОВ   */
function createSelect(arr) {
    const $th = $originalTable.querySelectorAll("thead th"),
        $divBtn = document.createElement("div"),
        $button = document.createElement("button");
    $divBtn.classList.add("btn");
    $button.classList.add("button");
    $button.id = "grouping";
    $button.textContent = "Сгруппировать";
    $button.type = "submit";

    $divBtn.appendChild($button);

    for (let i = 0; i < $th.length; i++) {
        const $div = document.createElement("div"),
            $span = document.createElement("span"),
            $select = document.createElement("select");

        $span.textContent = `${$th[i].innerHTML}: `;
        $select.id = $th[i].innerHTML;

        for (let j = 0; j < arr.length; j++) {
            const $option = document.createElement("option");
            $option.textContent = arr[j];
            $option.value = j;
            $select.appendChild($option);
        }

        $div.append($span, $select);
        $dropList.appendChild($div);
    }
    document.querySelector(".drop-list .container").appendChild($divBtn);
}
/*   ФУНКЦИЯ КНОПКИ СГРУППИРОВАТЬ   */
function clickButtonGroup() {
    const infoTableTwo = {};
    // проходимся по массиву кликнутых select
    for (let i = 0; i < clickSelectId.length; i++) {
        for (let j = 0; j < $selectList.length; j++) {
            if (clickSelectId[i] === $selectList[j].id) {
                const choose = $selectList[j]; // кликнутый select
                const chooseOptionValue = choose[choose.selectedIndex].value; // value выбранного option
                const listClass = clickSelectId[i];
                switch (chooseOptionValue) {
                    case "0": // ----
                        break;
                    case "1": // Критерий
                        infoTableTwo[listClass] = criteria(choose.id);
                        break;
                    case "2": // Сумма
                        infoTableTwo[listClass] = sumElements(choose.id);
                        break;
                    case "3": // Макс.
                        infoTableTwo[listClass] = maxElement(choose.id);
                        break;
                    case "4": // Мин.
                        infoTableTwo[listClass] = minElement(choose.id);
                        break;
                    case "5": // Конкат
                        infoTableTwo[listClass] = concatenationElements(choose.id);
                        break;
                    case "6": // Среднее
                        infoTableTwo[listClass] = averageElement(choose.id);
                        break;
                }
            }
        }
    }
    return infoTableTwo;
}
/*   ФУНКЦИЯ ГРУППИРОВКИ СТРОК   */
/* Строки группируются по тому столбцу, где критерий выбан первым, если выбрали сначала А, а 
после B, то группировка будет происходить по столбцу А, если же сначала выбрали критерий у В, а после
у А, то сгруппируется по столбцу В  */
function groupingRows(id) {
    const $td = $originalTable.querySelectorAll(`td.${id}`),
        rowsArray = Array.from($originalTable.querySelector("tbody").rows);

    let i = 0;
    let j = 0;
    let count = 1;
    while (i !== $td.length) {
        if (j + 1 > $td.length - 1) return;

        if ($td[j].textContent !== $td[j + 1].textContent) {
            rowsArray[j].classList.add(`group_${count}`);
            count++;
            rowsArray[j + 1].classList.add(`group_${count}`);
            j++;
        }

        if (j + 1 >= $td.length - 1) {
            rowsArray[j].classList.add(`group_${count}`);
            rowsArray[j + 1].classList.add(`group_${count}`);
            j++;
        } else {
            while ($td[j].textContent === $td[j + 1].textContent) {
                rowsArray[j].classList.add(`group_${count}`);
                rowsArray[j + 1].classList.add(`group_${count}`);
                j++;
            }
        }
        j++;
        i += j;
        count++;
    }
}
/*   ФУНКЦИЯ КРИТЕРИЯ   */
function criteria(id) {
    groupingRows(id); // группируем строки

    const arr = []; // будет хранить результаты

    const $td = $originalTable.querySelectorAll(`td.${id}`),
        rowsArray = Array.from($originalTable.querySelector("tbody").rows);

    let i = 0;
    let j = 0;
    while (i < rowsArray.length) {
        if (rowsArray[j].classList[0] !== rowsArray[j + 1].classList[0]) {
            arr.push($td[j].textContent);
            j++;
        }

        if (rowsArray[j].classList[0] === rowsArray[j + 1].classList[0]) {
            if (j + 1 >= rowsArray.length - 1) {
                arr.push($td[j].textContent);
                break;
            } else {
                while (rowsArray[j].classList[0] === rowsArray[j + 1].classList[0]) {
                    j++;
                }
            }
        }
        i++;
    }
    return arr;
}
/*   ФУНКЦИЯ СУММИРОВАНИЯ   */
function sumElements(id) {
    // создаём объект, который будет хранить результаты
    const result = {};
    const arr = [];
    const $td = $originalTable.querySelectorAll(`td.${id}`),
        rowsArray = Array.from($originalTable.querySelector("tbody").rows);

    for (let i = 0; i < rowsArray.length; i++) {
        const listClass = rowsArray[i].classList;
        // перебираем классы
        for (let j = 0; j < listClass.length; j++) {
            if (listClass[j] in result) {
                result[listClass[j]] += Number($td[i].textContent);
            } else {
                result[listClass[j]] = Number($td[i].textContent);
            }
        }
    }

    for (key in result) {
        arr.push(result[key]);
    }
    return arr;
}
/*   ФУНКЦИЯ МАКСИМУМА   */
function maxElement(id) {
    const $td = $originalTable.querySelectorAll(`td.${id}`),
        rowsArray = Array.from($originalTable.querySelector("tbody").rows);
    // создаём объект, который будет хранить результаты
    const result = {};
    const arr = [];
    for (let i = 0; i < rowsArray.length; i++) {
        let listClass = rowsArray[i].classList;
        // перебираем классы
        for (let j = 0; j < listClass.length; j++) {
            if (listClass[j] in result) {
                result[listClass[j]].push($td[i].textContent);
            } else {
                result[listClass[j]] = new Array($td[i].textContent);
            }
        }
    }
    for (key in result) {
        for (let i = 0; i < result[key].length; i++) {
            result[key][i] = Number(result[key][i]);
        }
    }

    for (key in result) {
        let max = result[key][0];
        for (let i = 1; i < result[key].length; i++) {
            if (max < result[key][i]) {
                max = result[key][i];
            }
        }
        arr.push(max);
    }
    return arr;
}
/*   ФУНКЦИЯ МИНИМУМА   */
function minElement(id) {
    const $td = $originalTable.querySelectorAll(`td.${id}`),
        rowsArray = Array.from($originalTable.querySelector("tbody").rows);
    // создаём объект, который будет хранить результаты
    const result = {};
    const arr = [];

    for (let i = 0; i < rowsArray.length; i++) {
        let listClass = rowsArray[i].classList;
        // перебираем классы
        for (let j = 0; j < listClass.length; j++) {
            if (listClass[j] in result) {
                result[listClass[j]].push($td[i].textContent);
            } else {
                result[listClass[j]] = new Array($td[i].textContent);
            }
        }
    }
    for (key in result) {
        for (let i = 0; i < result[key].length; i++) {
            result[key][i] = Number(result[key][i]);
        }
    }

    for (key in result) {
        let min = result[key][0];
        for (let i = 1; i < result[key].length; i++) {
            if (min > result[key][i]) {
                min = result[key][i];
            }
        }
        arr.push(min);
    }
    return arr;
}
/*   ФУНКЦИЯ КОНКАТЕНАЦИИ   */
function concatenationElements(id) {
    // создаём объект, который будет хранить результаты
    const result = {};
    const arr = [];

    const $td = $originalTable.querySelectorAll(`td.${id}`),
        rowsArray = Array.from($originalTable.querySelector("tbody").rows);

    for (let i = 0; i < rowsArray.length; i++) {
        const listClass = rowsArray[i].classList;
        // перебираем классы
        for (let j = 0; j < listClass.length; j++) {
            if (listClass[j] in result) {
                result[listClass[j]] += $td[i].textContent;
            } else {
                result[listClass[j]] = $td[i].textContent;
            }
        }
    }
    for (key in result) {
        arr.push(result[key]);
    }
    return arr;
}
/*   ФУНКЦИЯ СРЕДНЕГО АРЕФМЕТИЧЕСКОГО   */
function averageElement(id) {
    const $td = $originalTable.querySelectorAll(`td.${id}`),
        rowsArray = Array.from($originalTable.querySelector("tbody").rows);
    // создаём объект, который будет хранить результаты
    const result = {};
    const arr = [];
    for (let i = 0; i < rowsArray.length; i++) {
        let listClass = rowsArray[i].classList;
        // перебираем классы
        for (let j = 0; j < listClass.length; j++) {
            if (listClass[j] in result) {
                result[listClass[j]].push($td[i].textContent);
            } else {
                result[listClass[j]] = new Array($td[i].textContent);
            }
        }
    }
    for (key in result) {
        for (let i = 0; i < result[key].length; i++) {
            result[key][i] = Number(result[key][i]);
        }
    }
    for (key in result) {
        let average = 0;
        for (let i = 0; i < result[key].length; i++) {
            average += result[key][i] / result[key].length;
        }
        arr.push(average);
    }
    return arr;
}
/*   ФУНКЦИЯ ВЫВОДА РЕЗУЛЬТИРУЮЩЕЙ ТАБЛИЦЫ   */
function fillTableResult(obj) {
    const $table = document.createElement("table"),
        $thead = document.createElement("thead"),
        $tbody = document.createElement("tbody"),
        $divBtn = document.createElement("div");

    $table.classList.add("table", "table-result");
    $divBtn.classList.add("btn", "btn-sort");

    // вывод заголовков
    for (key in obj) {
        const $th = document.createElement("th");
        $th.textContent = key;
        $thead.appendChild($th);

        const $btnSorting = document.createElement("button");
        $btnSorting.innerHTML = "Сортировать";
        $btnSorting.className = "button";
        $btnSorting.id = key;
        $btnSorting.type = "submit";
        $divBtn.appendChild($btnSorting);
    }

    for (let i = 0; i < Object.values(obj)[0].length; i++) {
        const $tr = document.createElement("tr");
        for (let j = 0; j < $thead.querySelectorAll("th").length; j++) {
            const $td = document.createElement("td");
            $td.textContent = Object.values(obj)[j][i];
            $tr.appendChild($td);
        }
        $tbody.appendChild($tr);
    }

    $table.append($thead, $tbody);
    $resultTable.append($table, $divBtn);
}
/*   СОЗДАНИЕ ВЫПАДАЮЩИХ СПИСКОВ СОРТИРОВКИ   */
function createSelectSort() {
    const $div = document.createElement("div"),
        $span = document.createElement("span"),
        $select = document.createElement("select"),
        $opionBubble = document.createElement("option"),
        $opionMoving = document.createElement("option");

    $div.classList.add("sorting");
    $select.classList.add("selects", "selects-sort");
    $span.textContent = "Алгоритм сортировки: ";
    $opionBubble.value = "bubble";
    $opionBubble.textContent = "Пузырьковая";
    $opionMoving.value = "moving";
    $opionMoving.textContent = "Перемещением";

    $select.append($opionBubble, $opionMoving);
    $div.append($span, $select);
    $sortingBlock.appendChild($div);
}
/*   ФУНКЦИЯ СОРТИРОВКИ ПУЗЫРЬКОМ   */
function bubbleSortTable(id) {
    const $td = $resultTable.querySelectorAll(`td.${id}`);
    const tdArr = Array.from($td),
        rowsArray = Array.from($resultTable.querySelector("tbody").rows);
    // алгоритм сортировки
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
    $resultTable.querySelector("tbody").append(...rowsArray);
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
    const $td = $resultTable.querySelectorAll(`td.${id}`);
    const tdArr = Array.from($td),
        rowsArray = Array.from($resultTable.querySelector("tbody").rows);
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
    $resultTable.querySelector("tbody").append(...rowsArray);
}
