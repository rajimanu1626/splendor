// Event names (for type-safe emit/on)
export const CLIENT_EVENTS = {
    createRoom: 'createRoom',
    joinRoom: 'joinRoom',
    leaveRoom: 'leaveRoom',
    addAI: 'addAI',
    startGame: 'startGame',
    action: 'action',
    rejoinRoom: 'rejoinRoom',
};
export const SERVER_EVENTS = {
    roomCreated: 'roomCreated',
    roomJoined: 'roomJoined',
    roomUpdate: 'roomUpdate',
    roomClosed: 'roomClosed',
    gameState: 'gameState',
    actionError: 'actionError',
    playerDisconnected: 'playerDisconnected',
    playerReconnected: 'playerReconnected',
};
