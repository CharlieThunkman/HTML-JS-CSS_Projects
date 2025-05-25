function pow(a,b){
	let c=0,n=1;
	while(b>c){
		n = n*a;
		b--;
	}
	return n;
}