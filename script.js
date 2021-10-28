function readData(files){	
    let file =  inputfile.files[0];	
    let reader = new FileReader();	
    reader.readAsText(file);	
    reader.onload = async function(){	
        filecontent.innerHTML = await reader.result;
        getCheck(reader.result);	
    }
}

let spell;
async function getCheck(data){
    let url = "https://api.textgears.com/grammar?key=wF4nKAm0SzmgBeEd&text="+data;
    let response = await fetch(url);
    if(response.ok){
        spell = await response.json();
        for(let item of spell.response.errors){
            highlight(item.bad);
        }
    }
}

function highlight(text) {

  	var inputText = document.getElementById("filecontent").innerHTML
  	var index = inputText.indexOf(text);

  	//If we found an index i.e != -1, then we will apend span for that typo
  	if (index >= 0) { 
   		inputText = inputText.substring(0,index) +"<span class ='highlight'>"+ inputText.substring(index,index+text.length) + "</span>" + inputText.substring(index + text.length);
   		document.getElementById("filecontent").innerHTML = inputText;
  	}
}


document.oncontextmenu = rightClick;
document.onclick = hideMenu;

//For Hiding the contextMenu
function hideMenu() { 
    document.getElementById("contextMenu").style.display = "none";
}


//Whenever user right click
function rightClick(e) { 
    e.preventDefault(); 

    if(e.path.length == 7) return; // If user click on correct word we will simply return

    var wrongWord = e.path[0].innerHTML		// This is our current wrong word, where user right clicked

    var errorWords = spell.response.errors;	// This is the complete array of wrong words in the paragraph


    var list = document.createElement("div"); // Created an 
    list.style.backgroundColor = '#c0cccf';
    list.style.width = '100px';

    for(let i = 0; i<errorWords.length; i++){
    	if(errorWords[i].bad == wrongWord) {
    		// Remove any previous child if it exist, from the context MEnu
    		const parent = document.getElementById('contextMenu')
			while (parent.firstChild) {
			    parent.firstChild.remove()
			}

			// Generate a list of all the suggestions 
    		for(let j = 0; j < errorWords[i].better.length; j++ ){

    			// Create a li and append suggestion
    			var li = document.createElement("li");
    			li.innerText = errorWords[i].better[j];

    			//If user click on suggestion , remove highlight class
    			li.addEventListener('click', (ev) => {
    				e.path[0].innerHTML = ev.path[0].innerHTML;
    				e.path[0].classList.remove('highlight')
    			})

    			// Append it to our list 
    			list.appendChild(li);
    			list.style.listStyleType = "none";
    		}
    		document.getElementById('contextMenu').appendChild(list);
    		console.log(document.getElementById('contextMenu'))
    	}
    }

    if (document.getElementById("contextMenu").style.display == "block") hideMenu(); 

    else { 
        var menu = document.getElementById("contextMenu") 
              
        menu.style.display = 'block'; 
        menu.position = "absolute";
        menu.style.left = e.clientX + "px"; 
        menu.style.top = e.clientY + "px"; 
    } 
}
