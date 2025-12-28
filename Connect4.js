const ROWS = 6;
const COLS = 7;
let board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
let currentPlayer = 1;
let gameOver = false;
let isDropping = false;

// Multiplayer variables
let gameMode = null; // 'local' or 'online'
let roomCode = null;
let myTeam = null;
let selectedTeam = 1;
let peer = null;
let connection = null;
let opponentConnected = false;

const boardElement = document.getElementById('board');
const columnClicksElement = document.getElementById('columnClicks');
const discContainerElement = document.getElementById('discContainer');
const turnIndicator = document.getElementById('turnIndicator');
const boardWrapper = document.querySelector('.board-wrapper');

const modeSelection = document.getElementById('modeSelection');
const hostSetup = document.getElementById('hostSetup');
const joinSetup = document.getElementById('joinSetup');
const gameContainer = document.getElementById('gameContainer');
const onlineStatus = document.getElementById('onlineStatus');

const ghostDisc = document.createElement('div');
ghostDisc.className = 'ghost-disc disc player1';
ghostDisc.style.display = 'none';
discContainerElement.appendChild(ghostDisc);

// Mode selection functions
function startLocalGame() {
    gameMode = 'local';
    myTeam = null;
    showGameScreen();
    initial();
}

function showHostSetup() {
    modeSelection.classList.add('hide');
    hostSetup.classList.remove('hide');
    
    // Generate room code
    roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById('hostRoomCode').textContent = roomCode;
    
    // Reset team selection
    selectedTeam = 1;
    updateTeamSelection();
}

function showJoinSetup() {
    modeSelection.classList.add('hide');
    joinSetup.classList.remove('hide');
    document.getElementById('joinRoomCode').value = '';
}

function backToModeSelection() {
    hostSetup.classList.add('hide');
    joinSetup.classList.add('hide');
    gameContainer.classList.add('hide');
    modeSelection.classList.remove('hide');
    
    // Remove winner message if it exists
    const existingMessage = document.querySelector('.winner-message');
    if (existingMessage) existingMessage.remove();
    
    // Close peer connection
    if (connection) {
        connection.close();
        connection = null;
    }
    if (peer) {
        peer.destroy();
        peer = null;
    }
    
    gameMode = null;
    roomCode = null;
    myTeam = null;
    opponentConnected = false;
}

function selectTeam(team) {
    selectedTeam = team;
    updateTeamSelection();
}

function updateTeamSelection() {
    const chip1 = document.getElementById('chip1');
    const chip2 = document.getElementById('chip2');
    
    if (selectedTeam === 1) {
        chip1.classList.add('selected');
        chip2.classList.remove('selected');
    } else {
        chip1.classList.remove('selected');
        chip2.classList.add('selected');
    }
}

async function hostGame() {
    // Check if PeerJS is loaded
    if (typeof Peer === 'undefined') {
        alert('Multiplayer library is still loading. Please wait a moment and try again.');
        return;
    }
    
    gameMode = 'online';
    myTeam = selectedTeam;
    opponentConnected = false;
    
    try {
        // Create peer with the room code as ID
        peer = new Peer(roomCode, {
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            }
        });
        
        peer.on('open', (id) => {
            console.log('Hosting with ID:', id);
            showGameScreen();
            // Reset the board when hosting
            board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
            currentPlayer = 1;
            gameOver = false;
            isDropping = false;
            
            discContainerElement.innerHTML = '';
            discContainerElement.appendChild(ghostDisc);
            ghostDisc.style.display = 'none';
            ghostDisc.className = 'ghost-disc disc player1';
            
            createBoard();
            updateTurnIndicator();
            
            document.getElementById('connectionStatus').textContent = 'Waiting for opponent';
            document.getElementById('connectionStatus').style.color = 'rgba(255, 223, 100, 0.95)';
        });
        
        peer.on('connection', (conn) => {
            // Reject connection if game is already full (connection already established)
            if (connection && connection.open) {
                conn.on('open', () => {
                    conn.send({
                        type: 'error',
                        message: 'Game is full'
                    });
                    conn.close();
                });
                return;
            }
            
            connection = conn;
            setupConnection();
            
            // Send initial game state and team info
            conn.on('open', () => {
                opponentConnected = true;
                connection.send({
                    type: 'init',
                    hostTeam: myTeam,
                    board: board,
                    currentPlayer: currentPlayer
                });
                
                document.getElementById('connectionStatus').textContent = 'Connected';
                document.getElementById('connectionStatus').style.color = 'rgba(100, 255, 150, 0.95)';
            });
        });
        
        peer.on('error', (err) => {
            console.error('Peer error:', err);
            alert('Connection error: ' + err.type);
            backToModeSelection();
        });
        
    } catch (error) {
        console.error('Host game error:', error);
        alert('Failed to create game. Error: ' + error.message);
        backToModeSelection();
    }
}

async function joinGame() {
    // Check if PeerJS is loaded
    if (typeof Peer === 'undefined') {
        alert('Multiplayer library is still loading. Please wait a moment and try again.');
        return;
    }
    
    const inputCode = document.getElementById('joinRoomCode').value.toUpperCase();
    
    if (!inputCode || inputCode.length !== 6) {
        alert('Please enter a valid 6-character room code');
        return;
    }
    
    gameMode = 'online';
    roomCode = inputCode;
    opponentConnected = false;
    
    try {
        // Create peer
        peer = new Peer({
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            }
        });
        
        peer.on('open', () => {
            // Connect to host
            connection = peer.connect(roomCode);
            
            connection.on('open', () => {
                opponentConnected = true;
                showGameScreen();
                setupConnection();
                
                document.getElementById('connectionStatus').textContent = 'Connected';
                document.getElementById('connectionStatus').style.color = 'rgba(100, 255, 150, 0.95)';
            });
            
            connection.on('error', (err) => {
                console.error('Connection error:', err);
                alert('Failed to connect. Make sure the room code is correct.');
                backToModeSelection();
            });
        });
        
        peer.on('error', (err) => {
            console.error('Peer error:', err);
            if (err.type === 'peer-unavailable') {
                alert('Room not found. Please check the code.');
            } else {
                alert('Connection error: ' + err.type);
            }
            backToModeSelection();
        });
        
    } catch (error) {
        console.error('Join game error:', error);
        alert('Failed to join game. Error: ' + error.message);
    }
}

function showGameScreen() {
    modeSelection.classList.add('hide');
    hostSetup.classList.add('hide');
    joinSetup.classList.add('hide');
    gameContainer.classList.remove('hide');
    
    if (gameMode === 'online') {
        onlineStatus.classList.remove('hide');
        document.getElementById('currentRoomCode').textContent = roomCode;
        document.getElementById('yourTeam').textContent = myTeam === 1 ? 'Julie' : 'Lenny';
    } else {
        onlineStatus.classList.add('hide');
    }
}

function setupConnection() {
    connection.on('data', (data) => {
        if (data.type === 'error') {
            // Handle error messages (e.g., game is full)
            alert(data.message || 'An error occurred');
            backToModeSelection();
            return;
        } else if (data.type === 'init') {
            // Joiner receives initial state
            myTeam = data.hostTeam === 1 ? 2 : 1;
            board = data.board;
            currentPlayer = data.currentPlayer;
            opponentConnected = true;
            
            // Initialize board
            discContainerElement.innerHTML = '';
            discContainerElement.appendChild(ghostDisc);
            ghostDisc.style.display = 'none';
            ghostDisc.className = 'ghost-disc disc player1';
            
            createBoard();
            
            document.getElementById('yourTeam').textContent = myTeam === 1 ? 'Julie' : 'Lenny';
            
            // Update ghost disc to correct player
            ghostDisc.className = `ghost-disc disc player${currentPlayer}`;
            
            updateTurnIndicator();
        } else if (data.type === 'move') {
            // Receive opponent's move
            board = data.board;
            currentPlayer = data.currentPlayer;
            gameOver = data.gameOver;
            
            // Update ghost disc class
            ghostDisc.className = `ghost-disc disc player${currentPlayer}`;
            
            loadGameState(data);
        } else if (data.type === 'reset') {
            // Receive reset
            board = data.board;
            currentPlayer = data.currentPlayer;
            gameOver = false;
            
            discContainerElement.innerHTML = '';
            discContainerElement.appendChild(ghostDisc);
            ghostDisc.style.display = 'none';
            ghostDisc.className = `ghost-disc disc player${currentPlayer}`;
            
            createBoard();
            updateTurnIndicator();
            
            const existingMessage = document.querySelector('.winner-message');
            if (existingMessage) existingMessage.remove();
        }
    });
    
    connection.on('close', () => {
        alert('Opponent disconnected');
        backToModeSelection();
    });
}

function sendGameState() {
    if (connection && connection.open) {
        connection.send({
            type: 'move',
            board: board,
            currentPlayer: currentPlayer,
            gameOver: gameOver,
            winner: gameOver ? currentPlayer : null
        });
    }
}

function loadGameState(data) {
    board = data.board;
    currentPlayer = data.currentPlayer;
    gameOver = data.gameOver;
    
    // Update ghost disc class
    ghostDisc.className = `ghost-disc disc player${currentPlayer}`;
    
    // Redraw board
    discContainerElement.innerHTML = '';
    discContainerElement.appendChild(ghostDisc);
    
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] !== null) {
                const cell = boardElement.querySelector(
                    `.cell[data-row="${row}"][data-col="${col}"]`
                );
                
                const boardRect = boardElement.getBoundingClientRect();
                const cellRect = cell.getBoundingClientRect();
                
                const disc = document.createElement('div');
                disc.className = `disc player${board[row][col]}`;
                
                const left = cellRect.left - boardRect.left;
                const top = cellRect.top - boardRect.top;
                
                disc.style.left = left + 'px';
                disc.style.top = top + 'px';
                disc.style.transition = 'none';
                
                discContainerElement.appendChild(disc);
            }
        }
    }
    
    updateTurnIndicator();
    
    if (gameOver) {
        disableColumns();
        if (data.winner) {
            showWinner();
        } else {
            showDraw();
        }
    }
}

async function updateOnlineGame(newState) {
    // Send game state to opponent via P2P
    sendGameState();
}

function createBoard() {
    boardElement.innerHTML = '';
    columnClicksElement.innerHTML = '';

    // Create board cells
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            boardElement.appendChild(cell);
        }
    }

    // Wait for board to render before calculating positions
    requestAnimationFrame(() => {
        const boardRect = boardElement.getBoundingClientRect();
        const cellSize = 70;
        const gap = 10;
        const padding = 25; // Board padding from CSS

        for (let col = 0; col < COLS; col++) {
            const columnClick = document.createElement('div');
            columnClick.className = 'column-click';
            columnClick.dataset.col = col;

            const left = padding + col * (cellSize + gap);
            columnClick.style.left = left + 'px';

            columnClick.addEventListener('mouseenter', function() {
                if (gameOver || isDropping) return;
                if (gameMode === 'online' && currentPlayer !== myTeam) return;
                if (gameMode === 'online' && !opponentConnected) return;
                
                ghostDisc.className = `ghost-disc disc player${currentPlayer}`;
                ghostDisc.style.left = left + 'px';
                ghostDisc.style.display = 'block';
            });

            columnClick.addEventListener('mouseleave', function() {
                ghostDisc.style.display = 'none';
            });

            columnClick.addEventListener('click', function() {
                dropDisc(col);
            });
            
            columnClicksElement.appendChild(columnClick);
        }
    });
}

function dropDisc(col) {
    if (gameOver || isDropping) return;
    
    // Check if it's our turn in online mode
    if (gameMode === 'online' && currentPlayer !== myTeam) return;
    
    // Check if opponent is connected in online mode
    if (gameMode === 'online' && !opponentConnected) return;

    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === null) {
            isDropping = true;
            board[row][col] = currentPlayer;

            const cell = boardElement.querySelector(
                `.cell[data-row="${row}"][data-col="${col}"]`
            );

            const boardRect = boardElement.getBoundingClientRect();
            const cellRect = cell.getBoundingClientRect();

            const disc = document.createElement('div');
            disc.className = `disc player${currentPlayer}`;

            const left = cellRect.left - boardRect.left;
            const finalTop = cellRect.top - boardRect.top;

            disc.style.left = left + 'px';
            disc.style.top = '-100px';

            discContainerElement.appendChild(disc);

            requestAnimationFrame(() => {
                disc.style.transition =
                    'top 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                disc.style.top = finalTop + 'px';
            });

            setTimeout(async () => {
                if (checkWin(row, col)) {
                    gameOver = true;
                    disableColumns();
                    showWinner();
                    
                    if (gameMode === 'online') {
                        await updateOnlineGame();
                    }
                } else if (checkDraw()) {
                    gameOver = true;
                    disableColumns();
                    showDraw();
                    
                    if (gameMode === 'online') {
                        await updateOnlineGame();
                    }
                } else {
                    currentPlayer = currentPlayer === 1 ? 2 : 1;
                    ghostDisc.className = `ghost-disc disc player${currentPlayer}`;
                    updateTurnIndicator();
                    
                    if (gameMode === 'online') {
                        await updateOnlineGame();
                    }
                }
                isDropping = false;
            }, 650);

            if (row === 0) {
                columnClicksElement.children[col].classList.add('disabled');
            }

            return;
        }
    }
}

function checkWin(row, col) {
	const player = board[row][col];

	// Check horizontal
	let count = 1;
	for (let c = col - 1; c >= 0 && board[row][c] === player; c--) count++;
	for (let c = col + 1; c < COLS && board[row][c] === player; c++) count++;
	if (count >= 4) return true;

	// Check vertical
	count = 1;
	for (let r = row - 1; r >= 0 && board[r][col] === player; r--) count++;
	for (let r = row + 1; r < ROWS && board[r][col] === player; r++) count++;
	if (count >= 4) return true;

	// Check diagonal (top-left to bottom-right)
	count = 1;
	for (let r = row - 1, c = col - 1; r >= 0 && c >= 0 && board[r][c] === player; r--, c--) count++;
	for (let r = row + 1, c = col + 1; r < ROWS && c < COLS && board[r][c] === player; r++, c++) count++;
	if (count >= 4) return true;

	// Check diagonal (top-right to bottom-left)
	count = 1;
	for (let r = row - 1, c = col + 1; r >= 0 && c < COLS && board[r][c] === player; r--, c++) count++;
	for (let r = row + 1, c = col - 1; r < ROWS && c >= 0 && board[r][c] === player; r++, c--) count++;
	if (count >= 4) return true;

	return false;
}

function checkDraw() {
	return board[0].every(cell => cell !== null);
}

function disableColumns() {
	const columns = columnClicksElement.querySelectorAll('.column-click');
	columns.forEach(col => col.classList.add('disabled'));
}

function updateTurnIndicator() {
	if (currentPlayer === 1) {
		turnIndicator.textContent = "Julie's Turn";
	} else {
		turnIndicator.textContent = "Lenny's Turn";
	}
	
	if (gameMode === 'online' && !gameOver) {
		if (currentPlayer === myTeam) {
			turnIndicator.textContent += " (Your turn!)";
		} else {
			turnIndicator.textContent += " (Waiting...)";
		}
	}
}

function showWinner() {
	const message = document.createElement('div');
	message.className = 'winner-message';

	const winnerText = currentPlayer === 1 ? "Team Julie wins!" : "Team Lenny wins!";
	message.innerHTML = `<h2>${winnerText}</h2>`;

	document.body.appendChild(message);
	playShootingStars();
}

function showDraw() {
	const message = document.createElement('div');
	message.className = 'winner-message';
	message.innerHTML = `<h2>It's a draw!</h2>`;
	document.body.appendChild(message);
}

async function resetGame() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
    currentPlayer = 1;
    gameOver = false;
    isDropping = false;

    discContainerElement.innerHTML = '';
    discContainerElement.appendChild(ghostDisc);
    ghostDisc.style.display = 'none';

    createBoard();
    updateTurnIndicator();

    const existingMessage = document.querySelector('.winner-message');
    if (existingMessage) existingMessage.remove();
    
    if (gameMode === 'online' && connection && connection.open) {
        connection.send({
            type: 'reset',
            board: board,
            currentPlayer: currentPlayer
        });
    }
}

function playShootingStars() {
	for (let i = 0; i < 30; i++) {
		setTimeout(() => {
			const star = document.createElement('div');
			star.style.position = 'fixed';
			star.style.height = '2px';
			star.style.width = Math.random() * 100 + 60 + 'px';
			star.style.background = 'linear-gradient(90deg, rgba(255, 182, 255, 1), rgba(182, 182, 255, 0.8), transparent)';
			
			star.style.left = Math.random() * 120 + 20 + '%';
			star.style.top = Math.random() * 60 - 20 + '%';
			
			star.style.pointerEvents = 'none';
			star.style.zIndex = '9999';
			star.style.transformOrigin = 'left center';
			star.style.boxShadow = '0 0 8px rgba(255, 182, 255, 0.9)';
			
			const angle = Math.random() * -15 - 40;
			star.style.transform = `rotate(${angle}deg)`;
			
			document.body.appendChild(star);

			const fall = star.animate([
				{ 
					transform: `translate(0, 0) rotate(${angle}deg)`, 
					opacity: 1 
				},
				{ 
					transform: `translate(-1500px, 1500px) rotate(${angle}deg)`,
					opacity: 0 
				}
			], {
				duration: 3500 + Math.random() * 1500,
				easing: 'cubic-bezier(0.4, 0, 1, 1)'
			});

			fall.onfinish = () => star.remove();
		}, i * 100);
	}
}

function initial() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
    currentPlayer = 1;
    gameOver = false;
    isDropping = false;
    
    discContainerElement.innerHTML = '';
    discContainerElement.appendChild(ghostDisc);
    ghostDisc.style.display = 'none';
    
    createBoard();
    updateTurnIndicator();
}

// Initialize on load
createBoard();