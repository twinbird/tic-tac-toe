"use strict"

// 先攻
const forward = "〇"
// 後攻
const backward = "×"
// 引き分けのマーク
const draw = "-"

// コンピューターの利用するマーク
const botMark = backward
// プレイヤーの利用するマーク
const playerMark = forward

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
  // そろったので勝ちが決まり
  if (complete([0, 1, 2], currentPlayer) || // 1行目そろった
      complete([3, 4, 5], currentPlayer) || // 2行目そろった
      complete([6, 7, 8], currentPlayer) || // 3行目そろった
      complete([0, 3, 6], currentPlayer) || // 1列目そろった
      complete([1, 4, 7], currentPlayer) || // 2列目そろった
      complete([2, 5, 8], currentPlayer) || // 3列目そろった
      complete([0, 4, 8], currentPlayer) || // 左上から右下のななめがそろった
      complete([2, 4, 6], currentPlayer)    // 右上から左下のななめがそろった
  ) {
    winner = currentPlayer
    return true
  }
  
  // すでに打てる箇所がなければ引き分け
  if (board.every((e) => e !== null)) {
    winner = draw
    return true
  }

  // まだ終わってない
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

  if (winner === draw) {
    document.getElementById('winner-label').innerHTML = "引き分け"
    document.getElementById('title').style.display = 'hidden'
    document.getElementById('retry-btn').style.display = 'block'
  }  else if (winner) {
    document.getElementById('winner-label').innerHTML = currentPlayer + "の勝ち"
    document.getElementById('title').style.display = 'hidden'
    document.getElementById('retry-btn').style.display = 'block'
  } else {
    document.getElementById('turn-title').innerHTML = currentPlayer
  }
}

// 盤面の1セルを選択する
function cellSelect(cellIdx) {
  if (winner) return
  board[Number(cellIdx)] = currentPlayer

  if (!judge()) {
    changePlayer()
  }

  render()
}

// minからmaxの範囲で乱数を返す
function getRandomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// コンピューターの打ち手処理
function botPlay() {
  // 打てる手がない
  if (board.every((e) => e !== null)) return

  // boardの空きをランダムに探す
  let r = getRandomIntInRange(0, 8)
  while (board[r] != null) {
    r = getRandomIntInRange(0, 8)
  }

  // 打つ
  cellSelect(r)
}

// 盤面の1セルクリック時のイベント
function cellClicked(e) {
  if (currentPlayer === botMark) return

  const id = e.target.id
  const cellNo = id.replace('cell', '')
  cellSelect(cellNo)

  botPlay()
}

// ゲームを初期状態に戻す
function initGame() {
  currentPlayer = forward
  board = new Array(9).fill(null)
  winner = null
  document.getElementById('title').style.display = 'block'
  document.getElementById('retry-btn').style.display = 'none'
  document.getElementById('winner-label').innerHTML = ''

  render()
}

window.onload = function() {
  // データと表示を初期化
  initGame()

  // セルへクリックイベントを割り当て
  const cells = document.querySelectorAll('.game-board td')
  for (let c of cells) {
    c.addEventListener('click', cellClicked)
  }

  // もう一度ボタンへのイベント割り当て
  document.getElementById('retry-btn').addEventListener('click', initGame)

  // 最初の描画
  render()
}
