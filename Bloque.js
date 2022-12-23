class Bloque{
	constructor(timestamp,data,nonce,prev_hash,merkle_r,hash){
		this.timestamp = timestamp;
		this.data = data;
		this.nonce = nonce;
		this.prev_hash = prev_hash;
		this.merkle_r = merkle_r;
		this.hash = hash;
	}
}