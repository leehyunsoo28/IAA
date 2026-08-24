const events=[
{id:1,date:"2014-04-16",title:"세월호 참사",category:"사회 · 재난",country:"대한민국",summary:"대한민국에서 발생한 여객선 세월호 침몰 사고.",description:"2014년 4월 16일 인천에서 제주로 향하던 여객선 세월호가 전라남도 진도 인근 해상에서 침몰한 사고입니다.",keywords:["세월호","사고","재난","대한민국"]},
{id:2,date:"2014-06-04",title:"제6회 전국동시지방선거",category:"정치",country:"대한민국",summary:"대한민국에서 전국동시지방선거가 실시되었습니다.",description:"대한민국에서 지방자치단체장과 지방의회의원 등을 선출하기 위한 전국동시지방선거가 실시되었습니다.",keywords:["선거","지방선거","정치"]},
{id:3,date:"2014-08-14",title:"프란치스코 교황 방한",category:"국제 · 문화",country:"대한민국",summary:"프란치스코 교황이 대한민국을 방문했습니다.",description:"프란치스코 교황이 대한민국을 방문하여 다양한 공식 일정을 진행했습니다.",keywords:["교황","방한","프란치스코"]},
{id:4,date:"2013-04-20",title:"보스턴 마라톤 테러 관련 수사",category:"국제",country:"미국",summary:"보스턴 마라톤 폭탄 테러 사건과 관련된 수사가 진행되었습니다.",description:"2013년 보스턴 마라톤에서 발생한 폭탄 테러 사건과 관련하여 수사가 진행되었습니다.",keywords:["보스턴","테러","미국"]},
{id:5,date:"2015-12-31",title:"2015년 주요 국제 이슈",category:"국제",country:"국제",summary:"2015년 한 해 동안 다양한 국제적 사건이 발생했습니다.",description:"2015년 한 해 동안 세계 각지에서 다양한 사건과 변화가 발생했습니다.",keywords:["2015","국제"]},
{id:6,date:"2012-07-27",title:"런던 올림픽 개막",category:"스포츠",country:"영국",summary:"2012 런던 하계 올림픽이 개막했습니다.",description:"제30회 하계 올림픽인 런던 올림픽이 영국 런던에서 개최되었습니다.",keywords:["올림픽","런던","스포츠"]}
];

let currentYear=2014;
const $=id=>document.getElementById(id);
const yearList=$("yearList"), monthTimeline=$("monthTimeline"), eventList=$("eventList");
const detailSection=$("detailSection");

function formatDate(s){const d=new Date(s+"T00:00:00");return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`}

function renderYears(){
  yearList.innerHTML="";
  const start=Math.max(2000,currentYear-2), end=Math.min(2025,currentYear+2);
  for(let y=start;y<=end;y++){
    const el=document.createElement("span");el.className="year"+(y===currentYear?" active":"");el.textContent=y;
    el.onclick=()=>{currentYear=y;render()};yearList.appendChild(el);
  }
}

function renderMonths(){
  monthTimeline.innerHTML="";
  for(let m=1;m<=12;m++){
    const box=document.createElement("div");box.className="month";
    box.innerHTML=`<span class="month-name">${m}월</span><div class="month-events"></div>`;
    const eventsInMonth=events.filter(e=>{const d=new Date(e.date+"T00:00:00");return d.getFullYear()===currentYear&&d.getMonth()+1===m});
    eventsInMonth.forEach((e,i)=>{
      const dot=document.createElement("span");dot.className="event-dot";dot.title=e.title;
      dot.style.left=`${25+i*25}%`;dot.style.top=`${15+i*20}px`;dot.onclick=ev=>{ev.stopPropagation();openDetail(e)};
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
  $("detailDate").textContent=formatDate(e.date);$("detailTitle").textContent=e.title;
  $("detailCountry").textContent=e.country;$("detailCategory").textContent=e.category;$("detailDescription").textContent=e.description;
  $("detailKeywords").innerHTML=e.keywords.map(k=>`<span class="keyword">#${k}</span>`).join("");
  detailSection.classList.add("show");document.body.style.overflow="hidden";
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
$("nextYear").onclick=()=>{if(currentYear<2025){currentYear++;render()}};

function render(){$("selectedYear").textContent=currentYear;$("eventYear").textContent=currentYear;renderYears();renderMonths();renderEvents()}
render();
