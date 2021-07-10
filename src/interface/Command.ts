// import { client } from '../index'
import { Client, Message } from "discord.js";

interface Run {
    (Client: Client, message: Message, args: string[])
}

export interface Command {
    name: string;
    description?: string;
    aliases?: string[];
    run: Run;
}