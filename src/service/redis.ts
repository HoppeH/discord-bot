import { EventEmitter } from 'events';
import { createClient, ClientOpts, RedisClient, add_command } from 'redis';
const { promisify } = require('util');


export class RedisService extends EventEmitter {

    private clientOpts: ClientOpts = { host: 'discord-redis', port: 6380 };
    private client: RedisClient = null;

    // public xread = null;
    // public xadd = null;
    public _getKey = null;
    public _setKey = null;
    public _hmset = null;
    public _hmget = null;
    public _hincrby = null;
    public hgetall = null;
    public hscan = null;
    public zrevrangebyscore = null;
    public zadd = null;
    public zrem = null;
    public zrange = null;
    public zrangebyscore = null;
    public zcount = null;
    public zrank = null;
    public zscore = null;
    public zincrby = null;
    public zrevrange = null;
    public hdel = null;
    public del = null;
    public multi = null;
    public exec = null;
    public watch = null;




    constructor() {
        super();
        this.client = createClient(this.clientOpts);

        // Stream Commands
        /* tslint:disable-next-line */

        /* tslint:disable-next-line */
        // this.xadd = promisify(this.client.xadd).bind(this.client);
        this._getKey = promisify(this.client.get).bind(this.client);
        this._setKey = promisify(this.client.set).bind(this.client);

        // Hash Commands
        this._hmset = promisify(this.client.hset).bind(this.client);
        this._hmget = promisify(this.client.hget).bind(this.client);
        this._hincrby = promisify(this.client.hincrby).bind(this.client);
        this.hgetall = promisify(this.client.hgetall).bind(this.client);
        this.hscan = promisify(this.client.hscan).bind(this.client);
        this.hdel = promisify(this.client.hdel).bind(this.client);

        // Sorted Set commands
        this.zrevrangebyscore = promisify(this.client.zrevrangebyscore).bind(this.client);
        this.zrangebyscore = promisify(this.client.zrangebyscore).bind(this.client);
        this.zadd = promisify(this.client.zadd).bind(this.client);
        this.zrem = promisify(this.client.zrem).bind(this.client);
        this.zrange = promisify(this.client.zrange).bind(this.client);
        this.zcount = promisify(this.client.zcount).bind(this.client);
        this.zrank = promisify(this.client.zrank).bind(this.client);
        this.zscore = promisify(this.client.zscore).bind(this.client);
        this.zincrby = promisify(this.client.zincrby).bind(this.client);
        this.zrevrange = promisify(this.client.zrevrange).bind(this.client);

        this.multi = promisify(this.client.multi).bind(this.client);
        // this.exec = promisify(this.client.exec).bind(this.client);
        this.watch = promisify(this.client.watch).bind(this.client);



        this.client
            .on('error', function (err) {
                console.log('Error ' + err);
            })
            .on('connect', () => {
                this.emit('connected');

                console.log('Redis server Connected');
            })
    }


    public xread = function (returnCount: string = '10', blockingTime: string = '5000', streamKey: [string], id: [string] = ['$']) {
        return new Promise((resolve, reject) => {
            this.client.xread(
                'COUNT',
                returnCount,
                'BLOCK',
                blockingTime,
                'STREAMS',
                streamKey,
                id,
                (err, res) => {
                    if (err) {
                        console.log('Error: ', err);
                        return reject(err)
                    }
                    console.log(res);
                    return resolve(res)
                }
            );
        })
    };
    public xadd = function (stream: string, key: string, value: string) {
        return new Promise((resolve, reject) => {
            this.client.xadd(stream, '*', key, value, function (
                err,
                res
            ) {
                if (err) {
                    reject(err);
                    console.log('Error: ', err);
                }
                return resolve(res);
                // console.log('Stream Publisher: ', res);
                // console.log('publish value: ' + value);
            });
        })
    };

    // const xread1 = function (block, stream, id) {
    //     // if (streams.length === 0) {
    //     //   throw 'streams required';
    //     // }
    //     let args = ['BLOCK', block, 'STREAMS', stream, '$'];

    //     id = stream.id ? stream.id : '$';
    //     // console.log(args);
    //     return getXread('BLOCK', block, 'STREAMS', stream, id);
    //     // return getXread('BLOCK', block, 'STREAMS', stream, '$');
    // };

    public jsonSet(userID, data) {
        this.client.send_command(
            'JSON.SET',
            [userID, `.`, JSON.stringify(data)],
            (err, value) => {
                if (err) {
                    console.log(`TS ERR: ${err}`);
                }
                // console.log(`TS value: ${value}`);
            }
        );
    }


    public hmset(userID: string, data) {
        this.client.hmset(userID, data,
            (err, value) => {
                if (err) {
                    console.log(`TS ERR: ${err}`);
                }
                // console.log(`TS value: ${value}`);
            }
        );
    }


    public hincrby(userID: string, field: string, incrBy: number) {
        this.client.hincrby(userID, field, incrBy,
            (err, value) => {
                if (err) {
                    console.log(`TS ERR: ${err}`);
                }
                // console.log(`TS value: ${value}`);
            }
        );

    }
    // public redisGetKey() { return this.client.getKey }


    public getRedisClient() {
        if (this.client !== null) {
            return this.client;
        } else {
            createClient()
            return (this.client = createClient(this.clientOpts));
        }
    }
}

export const redisDB = new RedisService();



