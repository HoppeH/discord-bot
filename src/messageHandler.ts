import { warn, setGame, setStatus, pingResponse, apexResponse, userHandler } from './commands';

export const messageHandler = (client, message, command, args) => {

    const messageHandler: {} = {
        'ping': (): any => {
            pingResponse(message, command);
            return console.log('ping case')
        },
        'apex': (): any => {
            return apexResponse(message);
        },
        'cleanup': (): any => {
            return userHandler(client, message, command, args);
        },
        'give': (): any => {
            return userHandler(client, message, command, args);
        },
        'leaderboard': (): any => {
            return userHandler(client, message, command, args);
        },
        'multi': (): any => {
            return userHandler(client, message, command, args);
        },
        'points': (): any => {
            return userHandler(client, message, command, args);
        },
        'setgame': (): any => {
            return setGame(client, message, command, args);
        },
        'setstatus': (): any => {
            return setStatus(client, message, command, args);
        },
        'default': (): any => {
            console.error('No matching command type');
            return console.log(args);
        }
    };

    return (messageHandler[command] || messageHandler['default'])();
}