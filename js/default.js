let currentYear=2000;
const $=id=>document.getElementById(id);
const yearList=$("yearList"), monthTimeline=$("monthTimeline"), eventList=$("eventList");
const detailSection=$("detailSection");

function formatDate(s){const d=new Date(s+"T00:00:00");return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`}

function renderYears(){
  yearList.innerHTML="";
  const start=Math.max(2000,currentYear-2), end=Math.min(2026,currentYear+2);
  for(let y=start;y<=end;y++){
    const el=document.createElement("span");el.className="year"+(y===currentYear?" active":"");el.textContent=y;
    el.onclick=()=>{currentYear=y;render()};yearList.appendChild(el);
  }
}

function renderMonths(){
  monthTimeline.innerHTML="";
  for(let m=1;m<=12;m++){
    const box=document.createElement("div");
    box.className="month";
    box.innerHTML=`<span class="month-name">${m}월</span><div class="month-events"></div>`;
    const eventsInMonth=events.filter(e=>{const d=new Date(e.date+"T00:00:00");
                                          return d.getFullYear()===currentYear&&d.getMonth()+1===m});
    
    eventsInMonth.forEach((e,i)=>{
      const dot=document.createElement("span");
      dot.className="event-dot";
      dot.title=e.title;

      dot.onclick=ev=>{ev.stopPropagation();openDetail(e)};
      box.querySelector(".month-events").appendChild(dot);
    });
    monthTimeline.appendChild(box);
  }
}

function renderEvents(list=null){
  const data=(list||events.filter(e=>new Date(e.date+"T00:00:00").getFullYear()===currentYear)).sort((a,b)=>new Date(a.date)-new Date(b.date));
  $("eventCount").textContent=data.length;eventList.innerHTML="";
  if(!data.length){eventList.innerHTML='<div class="empty">해당 조건에 맞는 사건이 없습니다.</div>';return}
  data.forEach(e=>{
    const item=document.createElement("div");item.className="event-item";
    item.innerHTML=`<div class="event-date">${formatDate(e.date)}</div><div><div class="event-title">${e.title}</div><div class="event-summary">${e.summary}</div></div><div class="event-category">${e.category}</div>`;
    item.onclick=()=>openDetail(e);eventList.appendChild(item);
  });
}

function openDetail(e){
  $("detailDate").textContent=formatDate(e.date);
  $("detailTitle").textContent=e.title;
  $("detailCountry").textContent=e.country;
  $("detailCategory").textContent=e.category;
  $("detailDescription").innerHTML=e.description;
  $("detailKeywords").innerHTML=e.keywords.map(k=>`<span class="keyword">#${k}</span>`).join("");
  detailSection.classList.add("show");
  document.body.style.overflow="hidden";
}
function closeDetail(){detailSection.classList.remove("show");document.body.style.overflow=""}
$("closeDetail").onclick=closeDetail;
detailSection.onclick=e=>{if(e.target===detailSection)closeDetail()};

function search(value){
  const q=value.trim().toLowerCase();
  if(!q){renderEvents();return}
  const result=events.filter(e=>[e.title,e.summary,e.category,e.country,...e.keywords].some(v=>v.toLowerCase().includes(q)));
  $("eventYear").textContent="검색 결과";renderEvents(result);
  document.querySelector(".events-area").scrollIntoView({behavior:"smooth"});
}

$("searchButton").onclick=()=>search($("searchInput").value);
$("mainSearchButton").onclick=()=>search($("mainSearchInput").value);
$("searchInput").onkeydown=e=>{if(e.key==="Enter")search(e.target.value)};
$("mainSearchInput").onkeydown=e=>{if(e.key==="Enter")search(e.target.value)};

$("prevYear").onclick=()=>{if(currentYear>2000){currentYear--;render()}};
$("nextYear").onclick=()=>{if(currentYear<2026){currentYear++;render()}};

function render(){$("selectedYear").textContent=currentYear;$("eventYear").textContent=currentYear;renderYears();renderMonths();renderEvents()}
render();
