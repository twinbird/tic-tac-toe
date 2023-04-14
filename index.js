"use strict"

// 先攻
const forward = "〇"
// 後攻
const backward = "×"

// 現在のターンのプレイヤー
let currentPlayer = forward

// 盤面
let board = [
  null, null, null,
  null, null, null,
  null, null, null,
]

// 勝者
let winner = null

// boardのインデックスの内容がすべてplayerだったらtrue
function complete(ary, player) {
  return ary.every((e) => board[e] === player)
}

// 勝利判定
// ゲーム終了でtrue
function judge() {
  console.log(board)
  console.log(complete([0, 4, 8], currentPlayer))
  // 1行目そろった
  if (complete([0, 1, 2], currentPlayer)) return true
  // 2行目そろった
  if (complete([3, 4, 5], currentPlayer)) return true
  // 3行目そろった
  if (complete([6, 7, 8], currentPlayer)) return true
  // 1列目そろった
  if (complete([0, 3, 6], currentPlayer)) return true
  // 2列目そろった
  if (complete([1, 4, 7], currentPlayer)) return true
  // 3列目そろった
  if (complete([2, 5, 8], currentPlayer)) return true
  // 左上から右下のななめがそろった
  if (complete([0, 4, 8], currentPlayer)) return true
  // 右上から左下のななめがそろった
  if (complete([2, 4, 6], currentPlayer)) return true

  return false
}

// ターンを変更する
function changePlayer() {
  currentPlayer = currentPlayer === forward ? backward : forward
}

// 状態をDOMへ反映する
function render() {
  for (let i = 0; i < board.length; i++) {
    document.getElementById(`cell${i}`).innerHTML = board[i]
  }

  if (winner) {
    document.getElementById('title').innerHTML = currentPlayer + "の勝ち"
  } else {
    document.getElementById('turn-title').innerHTML = currentPlayer
  }
}

// 盤面の1セルクリック時のイベント
function cellClicked(e) {
  if (winner) return

  const id = e.target.id
  const cellNo = id.replace('cell', '')
  board[Number(cellNo)] = currentPlayer

  if (judge()) {
    winner = currentPlayer
  }
  changePlayer()

  render()
}

window.onload = function() {
  // セルへクリックイベントを割り当て
  const cells = document.querySelectorAll('.game-board td')
  for (let c of cells) {
    c.addEventListener('click', cellClicked)
  }

  // 最初の描画
  render()
}
