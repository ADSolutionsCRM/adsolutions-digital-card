const defaults={
  name:"Andreas Demetriou",
  role:"Founder",
  company:"ADSolutions",
  email:"info@adsolutionsglobal.com",
  phone:"",
  whatsapp:"",
  website:"https://adsolutionsglobal.com",
  linkedin:"",
  instagram:"https://instagram.com/adsolutions.hq",
  tagline:"Strategy · Innovation · Growth",
  description:"Business automation, operational solutions, websites, CRM and strategic support."
};

const ids=Object.keys(defaults);
const $=id=>document.getElementById(id);

function initials(value){
  return value.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase()||"AD";
}

function normalizeUrl(value){
  if(!value)return "";
  return /^https?:\/\//i.test(value)?value:`https://${value}`;
}

function update(){
  const data={};
  ids.forEach(id=>data[id]=$(id)?.value.trim()||"");

  $("preview-name").textContent=data.name||"Your Name";
  $("preview-role").textContent=data.role||"Your Role";
  $("preview-company").textContent=data.company||"Your Company";
  $("preview-tagline").textContent=(data.tagline||"Your Tagline").toUpperCase();
  $("preview-description").textContent=data.description||"Tell people what you do.";
  if(!$("preview-photo").style.backgroundImage) $("preview-photo").textContent=initials(data.name);
  if(!$("preview-logo").style.backgroundImage) $("preview-logo").textContent=initials(data.company);

  setLink("preview-email",data.email?`mailto:${data.email}`:"",!!data.email);
  setLink("preview-website",normalizeUrl(data.website),!!data.website);
  setLink("preview-instagram",normalizeUrl(data.instagram),!!data.instagram);
  setLink("preview-linkedin",normalizeUrl(data.linkedin),!!data.linkedin);
  setLink("preview-phone",data.phone?`tel:${data.phone.replace(/\s+/g,"")}`:"",!!data.phone);

  const wa=data.whatsapp.replace(/[^0-9]/g,"");
  setLink("preview-whatsapp",wa?`https://wa.me/${wa}`:"",!!wa);
}

function setLink(id,href,visible){
  const el=$(id);
  if(!el)return;
  if(visible){el.href=href;el.classList.remove("hidden");}
  else{el.href="#";el.classList.add("hidden");}
}

ids.forEach(id=>$(id)?.addEventListener("input",update));

function bindImage(inputId,previewId){
  $(inputId)?.addEventListener("change",event=>{
    const file=event.target.files?.[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>{
      const el=$(previewId);
      el.style.backgroundImage=`url("${reader.result}")`;
      el.textContent="";
    };
    reader.readAsDataURL(file);
  });
}
bindImage("photo","preview-photo");
bindImage("logo","preview-logo");

$("export-profile")?.addEventListener("click",()=>{
  const profile={};
  ids.forEach(id=>profile[id]=$(id)?.value.trim()||"");
  profile.slug=(profile.name||"digital-card").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  profile.wallet={apple:"pending",google:"pending"};
  const blob=new Blob([JSON.stringify(profile,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=`${profile.slug||"digital-card"}.json`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
});

$("reset-profile")?.addEventListener("click",()=>{
  ids.forEach(id=>{if($(id))$(id).value=defaults[id]||"";});
  $("photo").value="";
  $("logo").value="";
  $("preview-photo").style.backgroundImage="";
  $("preview-logo").style.backgroundImage="";
  update();
});

update();
