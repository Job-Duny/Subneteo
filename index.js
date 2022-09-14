

function ipToBinary (ip){
    
    let arr = ip.split('.');
    bin = ""
    for (let i = 0; i < arr.length; i++) {
        z = parseInt(arr[i]) 
        y = (z).toString(2);

        bin = bin + y + "."
        
    }
    console.log(bin);

}

