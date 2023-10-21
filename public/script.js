// Toggles Sidebar menu
const openMenuIcon = document.getElementById('open-menu-icon');
const navMenu = document.getElementById('nav-menu');

const openMenuList = () => {
    const menuStyle = window.getComputedStyle(navMenu).getPropertyValue("max-height");
    if (menuStyle === "0px") {
      navMenu.style.maxHeight = "initial";
      navMenu.style.opacity = "1";
      navMenu.classList.add("drpdown-padding");
    } else {
      navMenu.style.maxHeight = "0";
      navMenu.style.opacity = "0";
      navMenu.classList.remove("drpdown-padding");
    };
};

openMenuIcon.addEventListener('click', openMenuList);


// Removes anchor tag default event
const links = document.querySelectorAll('a');

links.forEach(link => {
  link.addEventListener('click', (e) => {
      e.preventDefault();
    });
});


// Copies shortLink to clipboard
const copyToClipboard = () => {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach((copyBtn) => {
    copyBtn.addEventListener('click', () => {
      const shortUrl = copyBtn.previousElementSibling.textContent;
      navigator.clipboard.writeText(shortUrl);

      // Change the button text and background color
      copyBtn.textContent = 'Copied!';
      copyBtn.style.backgroundColor = 'hsl(257, 27%, 26%)';

      // Revert to the original state after 2 seconds
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.style.backgroundColor = '';
      }, 2000);
    });
  });
};

const resultElement = document.getElementById('result');

const shortenUrl = async (inputUrl) => {
  try {
    const urlEndpoint = 'https://api.tinyurl.com/create?api_token=HLTFffVpNFFYozZvw4wV9prrfct5njk00CN8zzEisLmcCqfCLTtmFR6sYqHG';
  
    const options = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      }, 
      body: JSON.stringify({
        "url": `${inputUrl}`,
        "domain": "tinyurl.com"
      }), 
    };

    const response = await fetch(urlEndpoint, options);

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();
    const shrtUrl = data.data.tiny_url;
    const longUrl =  data.data.url; 
  
    const newResult = document.createElement('div');
  
    let html = "";
    html += `
      <div class="flex flex-col px-[5%] py-[1rem] bg-white rounded-md justify-between lg:flex-row lg:items-center lg:px-[3%] xl:gap-8">
            
        <!-- Long Link -->
        <div class="min-[475px]:text-center lg:text-left">
          <span class="text-base text-neutral-veryDarkViolet md:text-lg lg:text-[1.2rem] xl:text-xl">${longUrl}</span>   
        </div>
        
        <div class="my-3 border-t border-gray-300 lg:hidden"></div> <!--Divider -->
        
        <!-- Short Link -->
        <div class="flex flex-col gap-3 min-[475px]:items-center lg:gap-6 lg:flex-row">
          <span class="text-base text-primary-cyan md:text-lg lg:text-[1.2rem] xl:text-xl">${shrtUrl}</span>
          <button class="copy-btn btn-hover text-base relative w-full py-[0.5rem] max-w-[400px] font-bold text-white rounded-md bg-primary-cyan before:rounded-md lg:px-6 xl:px-8">Copy</button>
        </div>
      </div>
    `;
    
    newResult.innerHTML = html;

    // Check if there are existing results
    if (resultElement.children.length === 0) {
      // If no existing results, it appends the new result
      resultElement.appendChild(newResult);
    } else {
      // If there are existing results, it appends the new result below the old ones
      resultElement.insertBefore(newResult, resultElement.firstChild);
    }
    
    copyToClipboard();

    // Saves data to local storage
    let arrayOfLinks = [];

    // Check if the array exists in local storage, and retrieve it if it does
    if (localStorage.getItem('arrayOfLinks')) {
      arrayOfLinks = JSON.parse(localStorage.getItem('arrayOfLinks')); 
    };

    const resultLinks = {
      longUrl,
      shrtUrl
    };

    // Push the resultLinks object into the array
    arrayOfLinks.push(resultLinks);

    // Save the updated array to local storage
    localStorage.setItem('arrayOfLinks', JSON.stringify(arrayOfLinks));
   
  } catch (err) {
    console.error(`${err}`);
  };
};


const form = document.forms["form"];
const formWrapper = document.querySelector(".form-wrapper");
const inputBox = document.getElementById("url-input");

// Removes error once user start typing
inputBox.addEventListener('keyup', () => {
  inputBox.classList.remove('input-error');
  form.classList.remove('input-error');
  formWrapper.classList.remove('input-error');
});

// Checks input validation & throws error if invalid
form.addEventListener('submit',  (e) => {
  e.preventDefault();
  
  if (!inputBox.value) {
    inputBox.classList.add('input-error');
    form.classList.add('input-error');
    formWrapper.classList.add('input-error');
  } else {
    const input = inputBox.value;
    const inputWithNoSpace = input.replace(/\s/g, ""); // removes whitespace
    const inputUrl = inputWithNoSpace;
    shortenUrl(inputUrl);
  };
  
  form.reset();
});

// Retrieves data from the Local storage and Populates the result element
window.addEventListener('load', () => {
  const arrayOfLinks = localStorage.getItem('arrayOfLinks');

  if (arrayOfLinks) {
    const parsedLinks = JSON.parse(arrayOfLinks);
    parsedLinks.forEach(link => {
      const newResult = document.createElement('div');
  
      let html = "";
      html += `
        <div class="flex flex-col px-[5%] py-[1rem] bg-white rounded-md justify-between lg:flex-row lg:items-center lg:px-[3%] xl:gap-8">
              
          <!-- Long Link -->
          <div class="min-[475px]:text-center lg:text-left">
            <span class="text-base text-neutral-veryDarkViolet md:text-lg lg:text-[1.2rem] xl:text-xl">${link.longUrl}</span>   
          </div>
          
          <div class="my-3 border-t border-gray-300 lg:hidden"></div> <!--Divider -->
          
          <!-- Short Link -->
          <div class="flex flex-col gap-3 min-[475px]:items-center lg:gap-6 lg:flex-row">
            <span class="text-base text-primary-cyan md:text-lg lg:text-[1.2rem] xl:text-xl">${link.shrtUrl}</span>
            <button class="copy-btn btn-hover text-base relative w-full py-[0.5rem] max-w-[400px] font-bold text-white rounded-md bg-primary-cyan before:rounded-md lg:px-6 xl:px-8">Copy</button>
          </div>
        </div>
      `;
      
      newResult.innerHTML = html;

      // Check if there are existing results
      if (resultElement.children.length === 0) {
        // If no existing results, it appends the new result
        resultElement.appendChild(newResult);
      } else {
        // If there are existing results, it appends the new result below the old ones
        resultElement.insertBefore(newResult, resultElement.firstChild);
      }
      
      copyToClipboard();
    });
  };
});