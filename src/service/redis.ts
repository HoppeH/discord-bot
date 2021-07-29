import { EventEmitter } from 'events';
import redis from 'redis';
const { promisify } = require('util');


export class RedisService extends EventEmitter {

    private client = null;

    public _getXread = null;
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


    constructor() {
        super();
        this.client = redis.createClient({ host: 'discord-redis', port: 6380 });
        this._getXread = promisify(this.client.xread).bind(this.client);
        this._getKey = promisify(this.client.get).bind(this.client);
        this._setKey = promisify(this.client.set).bind(this.client);
        this._hmset = promisify(this.client.hset).bind(this.client);
        this._hmget = promisify(this.client.hget).bind(this.client);
        this._hincrby = promisify(this.client.hincrby).bind(this.client);
        this.hgetall = promisify(this.client.hgetall).bind(this.client);
        this.hscan = promisify(this.client.hscan).bind(this.client);
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



        this.client
            .on('error', function (err) {
                console.log('Error ' + err);
            })
            .on('connect', () => {
                this.emit('connected');

                console.log('Redis server Connected');
            })
    }



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
    public redisGetKey() { return this.client.getKey }


    public getRedisClient() {
        if (this.client !== null) {
            return this.client;
        } else {
            return (this.client = redis.createClient({ host: 'redis', port: 6380 }));
        }
    }
}

export const redisDB = new RedisService();



